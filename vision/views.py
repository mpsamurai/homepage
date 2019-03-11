from django.shortcuts import render

from .models import Vision, Top

import json


def index(request):

    vision = Vision.objects.first()
    top = Top.objects.filter(is_used=True).first()

    text = ""
    if vision:
        text = json.dumps(vision.vision).rstrip("\"").lstrip("\"")

    context = {
        "text": text,
        "top": top,
    }
    return render(request, "vision/index.html", context)