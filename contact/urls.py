from django.urls import path

from . import views

app_name = "contact"

urlpatterns = [
    path('faqs/', views.faq_index, name='faq_index'),
    path('form/<int:category_id>/', views.form_index, name='form_index'),
    path('form/', views.form_create, name='form_save'),
    path('', views.index, name='index'),
]
