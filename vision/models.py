from django.db import models

# Create your models here.


class Vision(models.Model):
    update_at = models.DateField(auto_now=True)
    vision = models.TextField()

    class Meta:
        ordering = ('-update_at', )

    def __str__(self):
        return str(self.vision)


class Top(models.Model):
    image = models.ImageField(
        upload_to='uploads/vision/top/image/', null=True, blank=True)
    title = models.CharField(max_length=32)
    update_at = models.DateField(auto_now=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ('-update_at', )

    def __str__(self):
        return str(self.title)
