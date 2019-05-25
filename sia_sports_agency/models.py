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
    path_icono = models.CharField(
        null=False,
        max_length=150,
        unique=True
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
    paises = models.ManyToManyField(
        Pais
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
        unique=True
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE
    )
