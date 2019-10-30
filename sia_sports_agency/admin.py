from django.contrib import admin
from .models import Usuario, Deporte, Posicion, Mensaje
from .models import Red_social, Extremidad_dominante
from .models import Tipo_jugador, Pais
DICT_SEXO = {
    'm': 'Masculino',
    'f': 'Femenino',
    'n': 'Ninguno',
}

SPORT_TYPE_CHOICES = {
    'a': 'Ambos',
    'm': 'Masculino',
    'f': 'Femenino',
    'n': 'Niguno'
}

# Register your models here.
class UsuarioAdmin(admin.ModelAdmin):
    list_display = (
        'nombre',
        'email',
        'get_tipo_jugador',
        'get_pais',
        'get_deporte',
        'get_es_activo',
        'get_primer_acceso',
        'get_fecha_activacion',
        'get_creado'
    )
    fields = (
        'nombre',
        'email',
        'get_tipo_jugador',
        'get_es_activo',
        'get_fecha_activacion',
        'get_primer_acceso',
        'get_pais',
        'get_deporte',
        'get_creado',
        'get_ubicacion',
        'get_fnacimiento',
        'get_genero',
        'get_genero_deporte',
        'get_telefono',
        'get_eactual',
        'get_posiciones'
    )
    list_filter = ['tipo__nombre', 'deporte__nombre', 'genero', 'tipo_deporte']
    search_fields = ['nombre', 'ubicacion', 'email']
    def get_ubicacion(self, obj):
        return obj.ubicacion if obj.ubicacion else 'No especificado'
    get_ubicacion.short_description = 'Ubicacion'

    def get_fnacimiento(self, obj):
        return obj.fnacimiento if obj.fnacimiento else 'No especificado'
    get_fnacimiento.short_description = 'Fecha nacimiento'

    def get_genero(self, obj):
        return DICT_SEXO.get(obj.genero)
    get_genero.short_description = 'Sexo'

    def get_deporte(self, obj):
        return obj.deporte.nombre if obj.deporte else ''
    get_deporte.short_description = 'Deporte'

    def get_tipo_jugador(self, obj):
        return obj.tipo.nombre if obj.tipo else ''
    get_tipo_jugador.short_description = 'Rol'

    def get_genero_deporte(self, obj):
        return SPORT_TYPE_CHOICES.get(obj.tipo_deporte)
    get_genero_deporte.short_description = 'Genero deporte'

    def get_telefono(self, obj):
        return obj.telefono if obj.telefono else 'No especificado'
    get_telefono.short_description = 'Telefono'

    def get_eactual(self, obj):
        return obj.eactual if obj.eactual else 'No especificado'
    get_eactual.short_description = 'Equipo actual'

    def get_pais(self, obj):
        return obj.pais.nombre if obj.pais else 'No especificado'
    get_pais.short_description = 'Pais'

    def get_es_activo(self, obj):
        return 'VERDADERO' if obj.es_activo == 1 else 'FALSO'
    get_es_activo.short_description = 'Acivo'

    def get_primer_acceso(self, obj):
        return 'No ha accedido' if obj.primer_acceso == 1 else 'Ha accedido'
    get_primer_acceso.short_description = 'Primer acceso'

    def get_fecha_activacion(self, obj):
        return obj.fecha_activacion
    get_fecha_activacion.short_description = 'Fecha activación'

    def get_creado(self, obj):
        return obj.creado
    get_creado.short_description = 'Creado el'

    def get_posiciones(self, obj):
        return [
            p.nombre for p in obj.posiciones.all()
        ].split(', ') if obj.posiciones.all() else 'Ninguna posicion'
    get_posiciones.short_description = 'Posiciones'


class DeporteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo')
    fields = ('nombre', 'codigo')
    list_filter = ['nombre']
    search_fields = ['nombre', 'codigo']

class PosicionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'get_deporte')
    fields = ('nombre', 'codigo', 'get_deporte')
    list_filter = ['deporte__nombre']
    search_fields = ['nombre', 'codigo', 'deporte__nombre']
    def get_deporte(self, obj):
        return obj.deporte.nombre if obj.deporte else ''
    get_deporte.short_description = 'Deporte'

class MensajeAdmin(admin.ModelAdmin):
    list_display = (
        'get_fecha',
        'get_remitente',
        'get_destinatario',
        'get_leido'
    )
    fields = (
        'get_fecha',
        'get_remitente',
        'get_destinatario',
        'get_leido',
        'get_cuerpo'
    )
    search_fields = [
        'remitente__email',
        'destinatario__email',
        'asunto',
        'cuerpo'
    ]

    def get_asunto(self, obj):
        return obj.asunto
    get_asunto.short_description = 'Asunto'

    def get_cuerpo(self, obj):
        return obj.cuerpo
    get_cuerpo.short_description = 'Cuerpo'

    def get_fecha(self, obj):
        return obj.fecha
    get_fecha.short_description = 'Fecha'

    def get_remitente(self, obj):
        return obj.remitente.email if obj.remitente else ''
    get_remitente.short_description = 'Remitente'

    def get_destinatario(self, obj):
        return obj.destinatario.email if obj.destinatario else ''
    get_destinatario.short_description = 'Destinatario'

    def get_leido(self, obj):
        return 'Si' if obj.leido == 1 else 'No'
    get_leido.short_description = 'Leido'

class RedSocialAdmin(admin.ModelAdmin):
    list_display = (
        'get_nombre',
        'get_codigo',
        'get_enlace',
        'get_usuario'
    )
    fields = (
        'get_nombre',
        'get_codigo',
        'get_enlace',
        'get_usuario'
    )
    list_filter = ['codigo']
    search_fields = ['nombre', 'codigo']

    def get_nombre(self, obj):
        return obj.nombre
    get_nombre.short_description = 'Nombre'

    def get_codigo(self, obj):
        return obj.codigo
    get_codigo.short_description = 'Codigo'

    def get_enlace(self, obj):
        return obj.enlace
    get_enlace.short_description = 'Enlace'

    def get_usuario(self, obj):
        return obj.usuario.email if obj.usuario else ''
    get_usuario.short_description = 'Usuario'


class ExtremidadDominanteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo')
    fields = ('nombre', 'codigo')
    list_filter = ['nombre']
    search_fields = ['nombre', 'codigo']

class TipoJugadorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo')
    fields = ('nombre', 'codigo')
    list_filter = ['nombre']
    search_fields = ['nombre', 'codigo']

class PaisAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo')
    fields = ('nombre', 'codigo')
    search_fields = ['nombre', 'codigo']


admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Deporte, DeporteAdmin)
admin.site.register(Posicion, PosicionAdmin)
admin.site.register(Mensaje, MensajeAdmin)
admin.site.register(Red_social, RedSocialAdmin)
admin.site.register(Extremidad_dominante, ExtremidadDominanteAdmin)
admin.site.register(Tipo_jugador, TipoJugadorAdmin)
admin.site.register(Pais, PaisAdmin)
