from django.db import models
from common.models import BaseMainVisual


class MainVisual(BaseMainVisual):
    image = models.ImageField(
        upload_to='uploads/message/image', null=True, blank=True)


class Message(models.Model):
    photo = models.ImageField(
        upload_to='uploads/message/top/image', null=True, blank=True)
    name = models.CharField(max_length=70)
    name_english = models.CharField(max_length=70)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return str(self.name)


class Biography(models.Model):
    TYPE_CHOICES = (('education', '学歴'), ('work', '職歴'),)
    kind = models.CharField(max_length=255, choices=TYPE_CHOICES,)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    message = models.ForeignKey(
        'Message', on_delete=models.CASCADE, related_name='biographies')

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return str(self.title)


class Top(models.Model):
    image = models.ImageField(
        upload_to='uploads/vision/image', null=True, blank=True)
    title = models.CharField(max_length=32)
    update_at = models.DateField(auto_now=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ('-update_at', )

    def __str__(self):
        return str(self.title)
