"""Admin URL Configuration"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('perfil/', views.perfil, name='perfil'),
    path('get_posiciones/<int:pk>/', views.get_posiciones, name='get_posiciones')
]
