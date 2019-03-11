from django.db import models


class Service(models.Model):
    # サービスの情報を保存する
    name = models.CharField(max_length=30)
    image = models.ImageField(upload_to='uploads/services/image')
    thumbnail = models.ImageField(
        upload_to='uploads/services/thumbnail', default='')
    url = models.URLField()

    def __str__(self):
        return str(self.name)


class Top(models.Model):
    image = models.ImageField(
        upload_to="uploads/services/top/image", null=True, blank=True)
    title = models.CharField(max_length=32)
    update_at = models.DateField(auto_now=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ('-update_at', )

    def __str__(self):
        return str(self.title)
