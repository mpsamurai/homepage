from django.shortcuts import render

from news.models import Article
from events.models import Event
from services.models import Service
from vision.models import Top
from message.models import Message


def index(request):
    news = Article.objects.filter(is_topic=False).order_by(
        "created_date").reverse().distinct()[:4]
    news_topic = Article.objects.filter(is_topic=True).order_by(
        "created_date").reverse().first()
    events = Event.objects.order_by("starts_at").reverse().all()[:3]
    services = Service.objects.all()

    vision = Top.objects.filter(is_used=True).first()
    message = Message.objects.first()

    context = {
        "news": news,
        "news_topic": news_topic,
        "events": events,
        "services": services,
        "vision": vision,
        "message": message,
    }

    return render(request, "top/index.html", context)
