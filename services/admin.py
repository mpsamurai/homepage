from django.contrib import admin

from .models import Service, Top


@admin.register(Service)
class Servicedmin(admin.ModelAdmin):
    list_display = ('name',
                    'url',)


@admin.register(Top)
class ServiceTopAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'update_at', 'is_used')
    ordering = ['update_at']
