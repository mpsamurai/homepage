from django.db import models
from common.models import BaseMainVisual


class MainVisual(BaseMainVisual):
    image = models.ImageField(
        upload_to='uploads/contact/top/image', null=True, blank=True)


class Category(models.Model):
    name = models.CharField(max_length=64)
    identifier = models.CharField(max_length=64)
    used_status = models.BooleanField(default=False)
    color_code = models.CharField(max_length=16)

    def __str__(self):
        return str(self.name)


class Faq(models.Model):
    question = models.CharField(max_length=1024)
    answer = models.TextField(max_length=1024)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    display_status = models.BooleanField(default=False)

    def __str__(self):
        return str(self.question)


class Contact(models.Model):
    name = models.CharField(max_length=64, verbose_name='名前')
    email = models.EmailField(blank=True, verbose_name='メールアドレス')
    subject = models.CharField(max_length=256, verbose_name='タイトル')
    body = models.TextField(max_length=2048, verbose_name='内容')
    category_name = models.CharField(
        max_length=256, default='その他', verbose_name='カテゴリー名')

    def __str__(self):
        return str(self.name)


class CategoryTop(models.Model):
    image = models.ImageField(
        upload_to='uploads/contact/category/top/image', null=True, blank=True)
    title = models.CharField(max_length=32)
    update_at = models.DateField(auto_now=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ('-update_at', )

    def __str__(self):
        return str(self.title)


class FaqTop(models.Model):
    image = models.ImageField(
        upload_to='uploads/contact/faq/top/image', null=True, blank=True)
    title = models.CharField(max_length=32)
    update_at = models.DateField(auto_now=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ('-update_at', )

    def __str__(self):
        return str(self.title)


class ContactTop(models.Model):
    image = models.ImageField(
        upload_to='uploads/contact/top/image', null=True, blank=True)
    title = models.CharField(max_length=32)
    update_at = models.DateField(auto_now=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ('-update_at', )

    def __str__(self):
        return str(self.title)
