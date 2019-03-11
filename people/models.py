from django.db import models


class Employee(models.Model):
    name = models.CharField(max_length=30)
    message = models.TextField()
    image = models.ImageField(upload_to='uploads/people/employee/image')
    background_image = models.ImageField(
        null=True, blank=True,
        upload_to='uploads/people/employee/background_image')
    display = models.BooleanField(default=True)

    def __str__(self):
        return str(self.name)


class Member(models.Model):
    name = models.CharField(max_length=30)
    message = models.TextField()
    image = models.ImageField(upload_to='uploads/people/member/image')
    display = models.BooleanField(default=True)

    def __str__(self):
        return str(self.name)
