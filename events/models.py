from django.db import models
from django.utils import timezone
from django.conf import settings
from django.db import transaction
from common.models import BaseMainVisual

import requests
import json


class MainVisual(BaseMainVisual):
    image = models.ImageField(
        upload_to='uploads/events/top/image', null=True, blank=True)


class Top(models.Model):
    image = models.ImageField(
        upload_to='uploads/events/top/image', null=True, blank=True)
    title = models.CharField(max_length=32)
    update_at = models.DateField(auto_now=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ('-update_at', )

    def __str__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    title = models.CharField(max_length=128, default='')
    tags = models.ManyToManyField(Tag, blank=True)
    starts_at = models.DateTimeField(default=timezone.now, blank=True)
    ends_at = models.DateTimeField(default=timezone.now, blank=True)
    published_at = models.DateTimeField(default=timezone.now, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, blank=True)
    address = models.CharField(
        max_length=128, default='', blank=True, null=True)
    public_url = models.CharField(max_length=1024, default='')
    image_url = models.CharField(max_length=1024, default='')
    description = models.TextField(default='')

    def __str__(self):
        return self.title

    # mps-id : 4425

    @classmethod
    def _fetch_events(cls, uri="https://api.doorkeeper.jp/groups/4425/events", token=settings.DOORKEEPER_API_TOKEN):
        return requests.get(uri, headers={'Authorization': token})

    @classmethod
    def save_events_from_doorkeeper(cls):
        data = json.loads(Event._fetch_events().content)

        with transaction.atomic():

            events_to_be_updated = [
                Event.bind_event(d['event'])
                for d in data if not Event.objects.filter(
                    pk=d['event']['id'],
                    updated_at__lte=d['event']['updated_at']).exists()]

            [event.save() for event in events_to_be_updated]
            updated_events_length = len(events_to_be_updated)
        return str(str(updated_events_length))

    @classmethod
    def bind_event(self, d):
        d.setdefault(
            'banner', 'https://dzpp79ucibp5a.cloudfront.net/events_banners/64323_normal_1503392646_IMG_1917.JPG')
        d.setdefault('address', '')
        d.setdefault('description', '')
        return Event.bind_event_exists_banner(**d)

    @classmethod
    def bind_event_exists_banner(cls, title, id, starts_at, ends_at, venue_name, lat, long, ticket_limit, published_at, updated_at,
                                 group, public_url, participants, waitlisted,
                                 banner,
                                 description,
                                 address):

        return Event(
            pk=id,
            title=title,
            starts_at=starts_at,
            ends_at=ends_at,
            published_at=published_at,
            updated_at=updated_at,
            address=address,
            public_url=public_url,
            image_url=banner,
            description=description
        )
