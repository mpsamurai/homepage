from django.shortcuts import render
from people.models import Employee, Member
from .models import Top as AboutTop

from vision.models import Top
from message.models import Message

def index(request):
    employees = Employee.objects.all()
    members = Member.objects.all()
    vision = Top.objects.filter(is_used=True).first()
    message = Message.objects.first()
    top = AboutTop.objects.filter(is_used=True).first()
    context = {
        "top": top,
        "employees": employees,
        "members": members,
        "message": message,
        "vision": vision,
    }
    return render(request, "about/index.html", context)