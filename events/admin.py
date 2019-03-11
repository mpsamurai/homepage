from django.contrib import admin
from django.conf.urls import url
from django.http import HttpResponse
from django.template.response import TemplateResponse

from .models import Top, Event, Tag


@admin.register(Top)
class TopAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'update_at', 'is_used')
    ordering = ['update_at']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'get_tags', 'starts_at', 'ends_at', 'published_at',
                    'updated_at', 'public_url', 'image_url', 'address')
    ordering = ['starts_at']

    def get_tags(self, obj):
        return "\n".join([tag.name for tag in obj.tags.all()])

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            url('update', self.admin_site.admin_view(
                self.regist_events_from_doorkeeper_view)),
        ]
        return my_urls + urls

    def regist_events_from_doorkeeper_view(self, request):
        d = {
            'update_func': Event.save_events_from_doorkeeper(),
        }
        return TemplateResponse(request, "admin/events/regist_events_from_doorkeeper.html", d)
