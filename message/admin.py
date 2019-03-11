from django.contrib import admin

# Register your models here.
from .models import Message
from .models import Biography
from .models import Top


@admin.register(Top)
class TopAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'update_at', 'is_used')
    ordering = ['update_at']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_english', 'body',
                    'photo', 'created_at', 'updated_at')


@admin.register(Biography)
class BiographAdmin(admin.ModelAdmin):
    list_display = ('kind',
                    'started_at',
                    'ended_at',
                    'title',
                    'created_at',
                    'updated_at',
                    'message',)
