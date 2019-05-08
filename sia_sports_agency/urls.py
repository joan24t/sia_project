"""Admin URL Configuration"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('perfil/', views.perfil, name='perfil')
]
