from django import forms
from .models import Article
from PIL import Image

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ['updated_date', 'title', 'article', 'employee', 'member', 'tags', 'is_topic', 'image', 'thumbnail']
