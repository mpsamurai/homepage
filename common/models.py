from django.db import models

class BaseMainVisual(models.Model):
    title = models.CharField(max_length=32)
    update_at = models.DateField(auto_now=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        abstract = True
        ordering = ('-update_at', )

    def __str__(self):
        return self.title
