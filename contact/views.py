from django.shortcuts import render, redirect

from .models import Faq, Category, ContactTop, FaqTop, CategoryTop
from .form import ContactForm
from django.views.decorators.http import require_POST
from itertools import groupby


def index(request):
    top = ContactTop.objects.filter(is_used=True).first()
    d = {
        'categories': Category.objects.filter(used_status=True),
        'top': top,
    }
    return render(request, "contact/index.html", d)


def faq_index(request):
    faqs_by_category = {}
    for category in Category.objects.filter(used_status=True):
        for key, group in groupby(Faq.objects.filter(display_status=True), (lambda x: x.category.pk is category.pk)):
            if (key):
                for faq in group:
                    if faq.category.pk in faqs_by_category.keys():
                        faqs_by_category[category.pk] = faqs_by_category[faq.category.pk] + [faq]
                    else:
                        faqs_by_category[category.pk] = [faq]
    categories_hash = {}
    top = FaqTop.objects.filter(is_used=True).first()
    d = {}
    for category in Category.objects.filter(used_status=True):
        categories_hash[category.pk] = category
        d = {
            'categories': categories_hash,
            'faqs_by_category': faqs_by_category,
            'top': top,
        }
    return render(request, "contact/faq.html", d)


def form_index(request, **kwargs):
    top = CategoryTop.objects.filter(is_used=True).first()
    input_category_id = kwargs.get('category_id')
    filtered_category = Category.objects.filter(pk=input_category_id)
    category_name = "その他"
    if filtered_category.exists():
        category_name = filtered_category.first().name

    context = {
        'form': ContactForm(initial={'category_name': category_name}),
        'top': top,
    }
    return render(request, "contact/form.html", context)


@require_POST
def form_create(request):
    form = ContactForm(request.POST)

    if form.is_valid():
        form.save()
        return redirect('contact:index')
    context = {
        'form': form
    }
    return render(request, "contact/form.html", context)
