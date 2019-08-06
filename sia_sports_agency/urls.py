"""Admin URL Configuration"""
from django.urls import path
from django.conf.urls import url
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('', views.index, name='Index'),
    path('perfil/', views.perfil, name='Perfil'),
    path('busqueda/', views.busqueda, name='Busqueda'),
    path(
        'get_posiciones/<slug:cod>/',
        views.get_posiciones,
        name='Get posiciones'
    ),
    url(
        r'registrar_usuario/$',
        views.registrar_usuario,
        name='Registrar usuario'
    ),
    url(
        r'actualizar_redes/$',
        views.actualizar_redes,
        name='Actualizar redes'
    ),
    path(
        'modificar_usuario/<slug:tipo>/',
        views.modificar_usuario,
        name='Modificar usuario'
    ),
    path('logout/', views.logout, name='Logout'),
    url(r'login/$', views.login, name='Login'),
    url(r'insertar_video/$', views.insertar_video, name='Insertar video'),
    url(r'eliminar_video/$', views.eliminar_video, name='Eliminar video'),
    path('get_mensaje/<slug:id>/', views.get_mensaje, name='Datos mensaje'),
    path('get_correos/', views.get_correos, name='Listado correos usuarios'),
    path(
        'enviar_correo/',
        views.enviar_correo,
        name='Enviar correo'
    ),
    path('guardar_cromo/', views.guardar_cromo, name='Guardar cromo'),
    path('primer_acceso/', views.primer_acceso, name='Consulta primer acceso'),
    path('set_acceso/', views.set_acceso, name='Insertar acceso')
]
