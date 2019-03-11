from django.contrib import admin

from .models import Employee, Member


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name',
                    'message',
                    'display',)


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('name',
                    'message',
                    'display',)
