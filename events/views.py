from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Top, Event, Tag
from datetime import datetime, timedelta, timezone


def _get_page(list_, page_no, count=3):
    paginator = Paginator(list_, count)
    page_number = page_no
    try:
        page = paginator.page(page_number)
    except (EmptyPage, PageNotAnInteger):
        page_number = 1
        page = paginator.page(page_number)
    return page, int(page_number)

def index(request):
    if not request.GET.getlist('tag') or '' in request.GET.getlist('tag'):
        flag = "all"
        tag_names = []
        events = Event.objects.order_by('-ends_at').all()
    else:
        flag = "part"
        tag_names = request.GET.getlist('tag')
        tags_id = []
        for tag_name in tag_names:
            tag = Tag.objects.values().filter(name=tag_name)
            if tag.exists():
                tags_id.append(tag.first()['id'])
        if (tags_id):
            events = Event.objects.filter(
                tags__in=tags_id).order_by('-ends_at').all()

    top = Top.objects.filter(is_used=True).first()
    events, page_number = _get_page(events, request.GET.get('page'))
    # 前後を合わせて5こ表示する様にする
    display_max = 5
    total = events.paginator.num_pages
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
    if events.has_next():
        next_num = events.next_page_number()
    if events.has_previous():
        pre_num = events.previous_page_number()
    paging = {
        "next": next_num,
        "previous": pre_num,
        "range": range(start, end + 1),
        "current": page_number,
    }
    JST = timezone(timedelta(hours=+9), 'JST')
    is_over = []
    now = datetime.now(JST)
    for event in events:
        is_over.append(event.ends_at < now)
    events = zip(events, is_over)

    d = {
        'tags': Tag.objects.all(),
        'tag_names': tag_names,
        'events': events,
        'top': top,
        'flag': flag,
        'paging': paging,
    }
    return render(request, "events/index.html", d)