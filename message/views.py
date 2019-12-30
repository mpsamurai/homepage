from django.shortcuts import render

from .models import Message
from .models import Biography
from .models import Top

# Create your views here.


def index(request):
    message = Message.objects.first()

    if message != None:
        educations = message.biographies.all().filter(
            kind='education').order_by('started_at')
        works = message.biographies.all().filter(kind='work').order_by('started_at')
    elif message == None:
        educations = []
        works = []

    tops = Top.objects
    top = None
    if tops.exists():
        top = tops.first()
    context = {
        "message": message,
        "educations": educations,
        "works": works,
        "top": top,
    }

    return render(request, 'message/index.html', context)