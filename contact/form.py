from django import forms
from .models import Contact

class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'subject', 'body', 'category_name']
        labels = {'category_name':'', }
        widgets = {'category_name': forms.HiddenInput()}
