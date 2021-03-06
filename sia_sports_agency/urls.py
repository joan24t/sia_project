"""Admin URL Configuration"""
from django.urls import path
from django.conf.urls import url
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls import handler404

handler404 = views.handler404
urlpatterns = [
    path('', views.index, name='Index'),
    path('perfil/', views.perfil, name='Perfil'),
    path('aviso_legal/', views.aviso_legal, name='Aviso legal'),
    path(
        'politica_privacidad/',
        views.politica_privacidad,
        name='Politica de cookies'
    ),
    path(
        'condiciones_servicio/',
        views.condiciones_servicio,
        name='Condiciones de servicio'
    ),
    path(
        'ley_cookies/',
        views.ley_cookies,
        name='Ley de cookies'
    ),
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
    path('eliminar_mensaje/<slug:id>/', views.eliminar_mensaje, name='Eliminar mensaje'),
    path('get_mensaje/<slug:id>/', views.get_mensaje, name='Datos mensaje'),
    path('get_correos/', views.get_correos, name='Listado correos usuarios'),
    path(
        'enviar_correo/',
        views.enviar_correo,
        name='Enviar correo'
    ),
    path('guardar_cromo/', views.guardar_cromo, name='Guardar cromo'),
    path('primer_acceso/', views.primer_acceso, name='Consulta primer acceso'),
    path('set_acceso/', views.set_acceso, name='Insertar acceso'),
    url(r'subir_img_cromo/$', views.subir_img_cromo, name='Subir imagen cromo'),
    url(r'busqueda_cromo/$', views.busqueda_cromo, name='Búsqueda cromo'),
    url(
        r'reactivar_cuenta/',
        views.reactivar_cuenta,
        name='Reactivar cuenta'
    ),
    url(
        r'cambiar_contrasena/',
        views.cambiar_contrasena,
        name='Cambiar contrasena'
    ),
    url(
        r'desactivar_cuenta/',
        views.desactivar_cuenta,
        name='Desactivar cuenta'
    ),
    url(
        r'detalle_usuario/',
        views.detalle_usuario,
        name='Detalle usuario'
    ),
    url(
        r'cambiar_idioma/',
        views.cambiar_idioma,
        name='Cambiar idioma'
    ),
    path('comprobar_correo/', views.comprobar_correo, name='Comprobar correo'),
    path('email_contacto/', views.email_contacto, name='Email contacto'),
    url(
        r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.activate,
        name='activate'
    ),
    path(
        'recordar_contrasena_mail/',
        views.recordar_contrasena_mail,
        name='Recordar contrasena'
    ),
    url(
        r'^reset_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.reset_password,
        name='reset_password'
    ),
    path(
        'reset_password_ext/',
        views.reset_password_ext,
        name='Resetear contrasena desde el exterior'
    ),
]
