from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage

class StaticFilesStorage(S3Boto3Storage):
    location = settings.AWS_S3_STATIC_ROOT

class MediaStorage(S3Boto3Storage):
    location = settings.AWS_S3_MEDIA_ROOT
    file_overwrite = False