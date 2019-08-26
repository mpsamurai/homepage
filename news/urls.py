from django.contrib.auth.decorators import login_required
from django.urls import path

from . import views

app_name = "news"

urlpatterns = [
    path('', views.index, name='index'),
    path('article/<int:article_id>/', views.article, name="article"),
#    path('edit_list/', views.edit_list, name="edit_list"),
    path('edit_list/', login_required(views.IndexView.as_view()), name='edit_list'),
    path('post/<int:pk>/update/', login_required(views.UpdateView.as_view()), name='update'),
]