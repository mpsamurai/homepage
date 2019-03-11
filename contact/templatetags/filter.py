from django import template

from contact.models import Category

register = template.Library()

@register.filter
def categories_name_hash(h, key):
    return h[key].name

@register.filter
def categories_identifier_hash(h, key):
    return h[key].identifier
