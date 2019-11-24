import json
from collections import OrderedDict
from PIL import Image

from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Top, Article, ArticleTag
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views import generic
from .forms import ArticleForm
from django.views.decorators.csrf import csrf_exempt

def _get_page(list_, page_no, count=9):
    paginator = Paginator(list_, count)
    page_number = page_no
    try:
        page = paginator.page(page_no)
    except (EmptyPage, PageNotAnInteger):
        page_number = 1
        page = paginator.page(page_number)
    return page, int(page_number)


def index(request):
    #import pdb; pdb.set_trace()

    if not request.GET.getlist('tag') or '' in request.GET.getlist('tag'):
        flag = "all"
        tag_names = []
        pages, page_number = _get_page(Article.objects.all().order_by(
                'created_date').reverse(), request.GET.get('page'))
    else:
        flag = "part"
        tag_names = request.GET.getlist('tag')
        tag_id = ArticleTag.objects.filter(name__in=request.GET.getlist('tag'))
        tags_id = [tag_id[i].id for i in range(len(tag_id))]

        if tags_id:
            pages, page_number = _get_page(Article.objects.filter(tags__in=tags_id).order_by(
                'created_date').reverse().distinct(), request.GET.get('page'))
        else:
            pages, page_number = _get_page(Article.objects.all().order_by(
                   'created_date').reverse(), request.GET.get('page'))

    # 前後を合わせて5こ表示する様にする
    display_max = 5
    total = pages.paginator.num_pages
    if page_number < 3:
        # 1, 2の時
        start = 1
        end = display_max if total > display_max else total
    elif page_number + 2 > total:
        # 最後の2つ
        start = total - display_max + 1 if total - display_max >= 1 else 1
        end = total
    else:
        # その他
        start = page_number - 2 if page_number - 2 >= 1 else 1
        end = page_number + 2 if total > page_number + 2 else total

    next_num = None
    pre_num = None
    if pages.has_next():
        next_num = pages.next_page_number()

    if pages.has_previous():
        pre_num = pages.previous_page_number()

    top = Top.objects.filter(is_used=True).first()

    paging = {
        "next": next_num,
        "previous": pre_num,
        "range": range(start, end + 1),
        "current": page_number,
    }

    data = {
        'top': top,
        'page': pages,
        'tags': ArticleTag.objects.all(),
        'paging': paging,
        'flag': flag,
        'tag_names': tag_names,
    }

    return render(request, 'news/index.html', data)


def article(request, article_id):

    tag_names = request.GET.getlist(
        'tag') if request.GET.getlist('tag') else None
    article = get_object_or_404(Article, id=article_id)

    writers = []
    writers.extend(article.employee.all())
    writers.extend(article.member.all())

    pages, page_number = _get_page(
        Article.objects.
        filter(tags__in=article.tags.all()).
        exclude(id=article.id).
        order_by('created_date').
        reverse().
        distinct(), request.GET.get('page'), count=3)

    try:
        article_content = json.dumps(article.article).rstrip("\"").lstrip("\"")
    except (ObjectDoesNotExist):
        article_content = None

    top = Top.objects.filter(is_used=True).first()

    data = {
        'top': top,
        'article': article,
        'writers': writers,
        'pages': pages,
        'article_content': article_content,
        'tag_names': tag_names,
    }

    return render(request, "news/article.html", data)

class IndexView(generic.ListView):
    model = Article
    paginated_by = 5
    template_name = 'news/edit_list.html'

class NewsCreateView(generic.CreateView):
    def get(self, request, *args, **kwargs):
        context = {'form': ArticleForm()}
        return render(request, 'news/create.html', context)

    def post(self, request, *args, **kwargs):
        form = ArticleForm(request.POST, request.FILES)
        if form.is_valid():
            article = form.save()
            article.save()

            json_data_img = self.request.POST.get('hiddenImg', '')
            json_data_thumb = self.request.POST.get('hiddenThumb', '')

            if json_data_img:
                crop_image(article, json_data_img, 'image')
            if json_data_thumb:
                crop_image(article, json_data_thumb, 'thumbnail')
            return redirect('/news/create/')
        return render(request, 'news/create.html', {'form': form})

class UpdateView(generic.edit.UpdateView):
    model =  Article
    form_class = ArticleForm
    template_name = 'news/update.html'

    def form_valid(self, form):
        article = super(ArticleForm, form).save()

        json_data_img = self.request.POST.get('hiddenImg', '')
        json_data_thumb = self.request.POST.get('hiddenThumb', '')

        if json_data_img:
            crop_image(article, json_data_img, 'image')
        if json_data_thumb:
            crop_image(article, json_data_thumb, 'thumbnail')
        return redirect('/news/edit_list/')

def crop_image(obj, json_data, attr):
    cropped_info = json.loads(json_data)
    target = getattr(obj, attr)
    image = Image.open(target)

    cropped_image = image.crop((
        cropped_info['x'],
        cropped_info['y'],
        cropped_info['x'] + cropped_info['w'],
        cropped_info['y'] + cropped_info['h']
    ))

    cropped_image.save(target.path)
