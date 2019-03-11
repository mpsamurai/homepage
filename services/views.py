import json
from django.http.response import JsonResponse
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist
from .models import Top, Service
from django.urls import reverse
from urllib.parse import urljoin


def _get_page(list_, page_no, count=3):
    paginator = Paginator(list_, count)
    page_number = page_no
    try:
        page = paginator.page(page_no)
    except (EmptyPage, PageNotAnInteger):
        page_number = 1
        page = paginator.page(page_number)
    return page, int(page_number)


def index(request):
    top = Top.objects.filter(is_used=True).first()

    pages, page_number = _get_page(
        Service.objects.all(), request.GET.get('page'))

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

    paging = {
        "next": next_num,
        "previous": pre_num,
        "range": range(start, end + 1),
        "current": page_number,
    }

    contents = {
        "top": top,
        "page": pages,
        "paging": paging,
    }
    return render(request, "services/index.html", contents)
