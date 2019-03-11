from django.contrib import admin

# Register your models here.
from .models import Top


@admin.register(Top)
class TopAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'update_at', 'is_used')
    ordering = ['update_at']
