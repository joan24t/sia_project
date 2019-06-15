"""Admin URL Configuration"""
from django.urls import path
from django.conf.urls import url
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('', views.index, name='index'),
    path('perfil/', views.perfil, name='perfil'),
    path('get_posiciones/<slug:cod>/', views.get_posiciones, name='get_posiciones'),
    url('registrar_usuario/$', views.registrar_usuario, name='registrar_usuario'),
    url('usuario_modificar_db/$', views.usuario_modificar_db, name='usuario_modificar_db'),
    path('logout/', views.logout, name='logout'),
    url(r'login/$', views.login, name='login')
]
