"""Admin URL Configuration"""
from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('perfil/', views.perfil, name='perfil'),
    path('get_posiciones/<slug:cod>/', views.get_posiciones, name='get_posiciones'),
    url(r'^usuario_crear/$', views.usuario_crear)
]
