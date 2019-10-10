from django.db import models
from datetime import datetime
from decimal import *
import os
from django.conf import settings
ALTURA_TIPO_CHOICES = (
    ('cm', 'cm'),
    ('pulgadas', 'pulgadas'),
)
PESO_TIPO_CHOICES = (
    ('kg', 'kg'),
    ('lb', 'lb'),
)
GENDER_CHOICES = (
    ('m', 'Masculino'),
    ('f', 'Femenino'),
    ('n', 'Ninguno'),
)
SPORT_TYPE_CHOICES = (
    ('a', 'Ambos'),
    ('m', 'Masculino'),
    ('f', 'Femenino'),
    ('n', 'Niguno')
)
SOCIAL_NETWORK_CHOICES = (
    ('f', 'Facebook'),
    ('t', 'Twitter'),
    ('i', 'Instagram'),
    ('y', 'YouTube'),
    ('b', 'Blog')
)

"""
    Model Extremidad dominante
"""
class Extremidad_dominante(models.Model):

    # Attributes
    nombre = models.CharField(
        null=False,
        max_length=150
    )
    codigo = models.CharField(
        null=False,
        max_length=10,
        unique=True
    )

"""
    Model Deporte
"""
class Deporte(models.Model):

    # Attributes
    nombre = models.CharField(
        null=False,
        max_length=150
    )
    path_icono = models.CharField(
        null=False,
        max_length=150,
        unique=True
    )
    codigo = models.CharField(
        null=False,
        max_length=5,
        unique=True
    )
    requiere_multiple = models.BooleanField(default=False)

"""
    Model Extremidad dominante
"""
class Tipo_jugador(models.Model):

    # Attributes
    nombre = models.CharField(
        null=False,
        max_length=150
    )
    codigo = models.CharField(
        null=False,
        max_length=5,
        unique=True
    )

"""
    Model Posicion
"""
class Posicion(models.Model):

    # Attributes
    nombre = models.CharField(
        null=False,
        max_length=150
    )
    codigo = models.CharField(
        null=False,
        max_length=5,
        unique=True
    )
    deporte = models.ForeignKey(
        Deporte,
        on_delete=models.SET_NULL,
        null=True
    )

"""
    Model Pais
"""
class Pais(models.Model):
    nombre = models.CharField(
        null=False,
        max_length=150
    )
    codigo = models.CharField(
        null=False,
        max_length=15,
        unique=True
    )

"""
    Model Usuario
"""
class Usuario(models.Model):

    # Attributes
    nombre = models.CharField(
        max_length=100,
        null=False
    )
    apellidos = models.CharField(
        max_length=150,
        null=True
    )
    ubicacion = models.CharField(
        max_length=100,
        null=True
    )
    fnacimiento = models.DateField(
        null=True
    )
    foto_path = models.CharField(
        null=True,
        max_length=150,
        unique=True
    )
    email = models.EmailField(
        max_length=100,
        null=False,
        unique=True
    )
    genero = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default='n',
    )
    deporte_especifico = models.CharField(
        max_length=40,
        default=''
    )
    tipo_deporte = models.CharField(
        max_length=1,
        choices=SPORT_TYPE_CHOICES,
        null=False,
        default='n'

    )
    telefono = models.IntegerField(
        null=True
    )
    eactual = models.CharField(
        max_length=60,
        null=True
    )
    altura = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal(0.00),
        null=True
    )
    tipo_altura = models.CharField(
        max_length=10,
        choices=ALTURA_TIPO_CHOICES,
        null=False,
        default='cm'
    )
    peso = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal(0.00),
        null=True
    )
    tipo_peso = models.CharField(
        max_length=10,
        choices=PESO_TIPO_CHOICES,
        null=False,
        default='kg'
    )
    interesadoen = models.TextField(
        max_length=500,
        null=True
    )
    nacionalidad = models.CharField(
        max_length=60,
        null=True
    )
    curriculum = models.CharField(
        max_length=150,
        null=True,
        unique=True
    )
    cpresentacion = models.CharField(
        max_length=150,
        null=True,
        unique=True
    )
    extremidad = models.ForeignKey(
        Extremidad_dominante,
        on_delete=models.SET_NULL,
        null=True
    )
    deporte = models.ForeignKey(
        Deporte,
        on_delete=models.SET_NULL,
        null=True
    )
    tipo = models.ForeignKey(
        Tipo_jugador,
        on_delete=models.SET_NULL,
        null=True
    )
    pais = models.ForeignKey(
        Pais,
        on_delete=models.SET_NULL,
        null=True
    )
    posiciones = models.ManyToManyField(Posicion)
    contrasena_1 = models.CharField(
        max_length=200,
        null=True
    )
    activo = models.IntegerField(
        null=False,
        default=1
    )
    n_visitas = models.IntegerField(
        null=False,
        default=0
    )
    img_perfil = models.CharField(
        null=False,
        max_length=150,
        default=os.path.join(
            settings.BASE_DIR_IMG_PERFIL_DEF,
            "silueta_defecto.png"
        )
    )
    primer_acceso = models.IntegerField(
        null=False,
        default=1
    )
    ruta_cromo = models.CharField(
        max_length=150
    )
    alias = models.CharField(
        max_length=13,
        null=True
    )
    pagina_web = models.CharField(
        max_length=100,
        default = ''
    )

"""
    Model Mensaje
"""
class Mensaje(models.Model):

    # Attributes
    asunto = models.CharField(
        null=False,
        max_length=200
    )
    cuerpo = models.CharField(
        null=False,
        max_length=500
    )
    fecha = models.DateTimeField(
        null=False,
        default=datetime.now
    )
    remitente = models.ForeignKey(
        Usuario,
        related_name='%(class)s_remitente_id',
        on_delete=models.CASCADE

    )
    destinatario = models.ForeignKey(
        Usuario,
        related_name='%(class)s_destinatario_id',
        on_delete=models.CASCADE
    )
    leido = models.IntegerField(
        null=False,
        default=0
    )

"""
    Model Red_social
"""
class Red_social(models.Model):

    # Attributes
    nombre = models.CharField(
        choices=SOCIAL_NETWORK_CHOICES,
        null=False,
        max_length=150
    )
    codigo = models.CharField(
        null=False,
        max_length=5,
        default='UK'
    )
    enlace = models.CharField(
        null=False,
        max_length=300
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE
    )

"""
    Model Video
"""
class Video(models.Model):

    # Attributes
    nombre = models.CharField(
        null=False,
        max_length=150
    )
    path = models.CharField(
        null=False,
        max_length=150,
        unique=False
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE
    )
