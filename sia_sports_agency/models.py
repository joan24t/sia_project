from django.db import models

GENDER_CHOICES = (
    ('s', 'Selecciona uno'),
    ('m', 'Masculino'),
    ('f', 'Femenino'),
)
SPORT_TYPE_CHOICES = (
    ('a', 'Ambos'),
    ('m', 'Masculino'),
    ('f', 'Femenino'),
)
SOCIAL_NETWORK_CHOICES = (
    ('f', 'Facebook'),
    ('t', 'Twitter'),
    ('i', 'Instagram'),
    ('y', 'YouTube'),
    ('b', 'Blog')
)

"""
    Model Usuario
"""
class Usuario(models.Model):

    # Attributes
    nombre = models.CharField(
        max_length=150,
        null=False
    )
    apellidos = models.CharField(
        max_length=150,
        null=True
    )
    ubicacion = models.CharField(
        max_length=150,
        null=True
    )
    fnacimiento = models.DateField(
        null=True
    )
    foto_path = models.CharField(
        null=False,
        max_length=150,
        unique=True
    )
    email = models.EmailField(
        max_length=150,
        null=False,
        unique=True
    )
    genero = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default='s',
    )
    tipo_deporte = models.CharField(
        max_length=1,
        choices=SPORT_TYPE_CHOICES,
        null=False,
        default='a'

    )
    telefono = models.IntegerField(
        null=True
    )
    eactual = models.CharField(
        max_length=150,
        null=True
    )
    altura = models.IntegerField(
        null=True
    )
    peso = models.IntegerField(
        null=True
    )
    interesadoen = models.TextField(
        max_length=500,
        null=True
    )
    nacionalidad = models.CharField(
        max_length=200,
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

"""
    Model Red_social
"""
class Red_social(models.Model):

    # Attributes
    nombre = models.CharField(
        choices=SOCIAL_NETWORK_CHOICES,
        null=False,
        max_length=2,
    )
    enlace = models.CharField(
        null=False,
        max_length=150
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE
    )
