from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from .models import Tipo_jugador, Deporte, Posicion, Pais, Video
from .models import Usuario, Extremidad_dominante, Red_social, Mensaje
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.utils.translation import gettext as _
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.mail import send_mail
from django.template.loader import render_to_string
from datetime import date, datetime
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .tokens import account_activation_token
from django.utils.encoding import force_bytes, force_text
import json
import os
import base64
import shutil
import logging


"""""""""""""""""""""""""""""""""""""""""""""
PARTE PUBLICA
"""""""""""""""""""""""""""""""""""""""""""""
logger = logging.getLogger(__name__)

def handler404(request, exception):
    return render(
        request,
        '404_error/template_error_404.html',
        contexto
    )

""" OPCIONES DE SEXO """
GENDER_CHOICES = {
    'a': 'Ambos',
    'm': 'Masculino',
    'f': 'Femenino',
}

""" OPCIONES DE GÉNERO DEL DEPORTE """
SPORT_TYPE_CHOICES = {
    'a': 'Ambos',
    'm': 'Masculino',
    'f': 'Femenino',
}

""" LENGUAJE POR DEFECTO """
LANGUAGE_DEFAULT = 'es-es'

""" DICCIONARIO DE POSICIONES CON SU TRADUCCIÓN """
DICT_POSITIONS = {
	'PORTERO':'GOALKEEPER',
	'DEFENSA':'DEFENDER',
	'CENTROCAMPISTA':'MIDFIELDER',
	'DELANTERO':'FORWARD',
	'CIERRE':'CLOSURE',
	'ALA':'WING',
	'UNIVERSAL':'UNIVERSAL',
	'PIVOT':'PIVOT',
	'DEFENSIVE BACK':'DEFENSIVE BACK',
	'DEFENSIVE LINE':'DEFENSIVE LINE',
	'LINEBACKER':'LINEBACKER',
	'OFFENSIVE LINE':'OFFENSIVE LINE',
	'QUARTERBACK':'QUARTERBACK',
	'RUNNING BACK':'RUNNING BACK',
	'TIGHT END':'TIGHT END',
	'WIDE RECEIVER':'WIDE RECEIVER',
	'SPECIAL TEAMS':'SPECIAL TEAMS',
	'FLAG FOOTBALL':'FLAG FOOTBALL',
	'BASE':'POINT GUARD',
	'ESCOLTA':'SHOOTING GUARD',
	'ALERO':'SMALL FORWARD',
	'ALA-PIVOT':'POWER FORWARD',
	'LATERAL':'BACK',
	'CENTRAL':'CENTER',
	'EXTREMO':'WING',
    'KICKER':'KICKER',
    'LONG SNAPPER':'LONG SNAPPER',
    'LANZADOR':'PITCHER',
    'RECEPTOR':'CATCHER',
    'PRIMERA BASE':'FIRST BASE',
    'SEGUNDA BASE':'SECOND BASE',
    'TERCERA BASE':'THIRD BASE',
    'CAMPOCORTO':'SHORT STOP',
    'EXTERIOR IZQUIERDO':'LEFT FIELDER',
    'EXTERIOR CENTRAL':'CENTRAL FIELDER',
    'EXTERIOR DERECHO':'RIGHT FIELDER',
    'BATEADOR DESIGNADO':'DESIGNATED HITTER',
    'VARIAS POSICIONES':'VARIOUS POSITIONS',
}

""" DICCIONARIO DE ROLES CON SU TRADUCCIÓN """
DICT_ROLES = {
	'Jugador':'Player',
	'Club':'Club',
	'Entrenador':'Trainer',
	'Preparador físico':'Physical trainer',
	'Representante':'Representative',
	'Árbitro':'Referee',
	'Directivo':'Directive',
	'Fisioterapeuta':'Physiotherapist',
	'Ojeador':'Scout',
	'Periodista deportivo':'Sports journalist',
	'Empresa deportiva':'Sports company',
	'Marca deportiva':'Sports brand',
	'Otros':'Others'
}

""" DICCIONARIO DE DEPORTES CON SU TRADUCCIÓN """
DICT_DEPORTES = {
	'Fútbol':'Football',
	'Fútbol Americano':'American football',
	'Fútbol Sala':'Indoor football',
	'Baloncesto':'Basketball',
	'Balonmano':'Handball',
	'Béisbol':'Baseball',
	'Otros':'Others'
}

""" DICCIONARIO DE EXTREMIDADES CON SU TRADUCCIÓN """
DICT_EXTREMIDADES = {
	'No especificado':'Not specified',
	'Mano izquierda':'Left hand',
	'Mano derecha':'Right hand',
	'Mano ambidiestra':'Ambidextrous hand',
	'Pie izquierdo':'Left foot',
	'Pie derecho':'Right foot',
	'Pie ambidiestro':'Ambidextrous foot'
}

""" DICCIONARIO DE GENERO CON SU TRADUCCIÓN """
DICT_GENERO = {
	'Masculino':'Male',
	'Femenino':'Female',
	'Ambos':'Both'
}

""" DICCIONARIO DE NO ESPECIFICADO CON SU TRADUCCIÓN """
DICT_NO_ESPECIFICADO = {
	'No especificado':'Not specified'
}

""" LISTADO DE ROLES QUE NO REQUIEREN SEXO """
LIST_NO_GENDER = ['CL', 'ED', 'MD']

""" COMBOS DE ROLES """
LIST_COMBO1 = ['JG']
LIST_COMBO2 = ['CL']
LIST_COMBO3 = ['EN', 'PF', 'DI']
LIST_COMBO4 = ['FI', 'PD']
LIST_COMBO5 = ['ED', 'MD']
LIST_COMBO7 = ['RE', 'AR', 'OJ']
LIST_COMBO6 = ['OT']

def global_contexto():
    lista_tipo_jugadores = Tipo_jugador.objects.all()
    lista_deportes = Deporte.objects.all()
    deporte = Deporte.objects.get(codigo='FBA')
    lista_posiciones = Posicion.objects.filter(deporte=deporte.id)
    lista_paises = Pais.objects.all()
    return {
        'tipo_jugadores': lista_tipo_jugadores,
        'deportes': lista_deportes,
        'posiciones': lista_posiciones,
        'paises': lista_paises
    }


""" Página inicial """
def index(request):
    contexto = global_contexto()
    contexto.update(get_usuario(request))
    contexto.update({
        'dyn_language': request.session.get('language') or LANGUAGE_DEFAULT
    })
    return render(
        request,
        'sia_sports_agency/index.html',
        contexto
    )

""" Cambio de contraseña """
def reset_password(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        usuario = Usuario.objects.get(id=uid)
    except(TypeError, ValueError, OverflowError, Usuario.DoesNotExist) as e:
        usuario = None
        logger.error(
            "Error al resetear password: {}".format(
                e
            )
        )
    if usuario is not None and account_activation_token.check_token(
        usuario,
        token
    ):
        context = {
            'email_usuario': usuario.email,
            'dyn_language': request.session.get('language')
        }
        return render(
            request,
            'sia_sports_agency/cambiar_password.html',
            context
        )
    else:
        return HttpResponse('¡El link de activación es inválido!')

""" Cambio de contraseña formulario"""
def reset_password_ext(request):
    email = request.POST.get('inputEmail', '')
    password = request.POST.get('inputPassword', '')
    usuario =  Usuario.objects.filter(
        email=email
    ).first()
    lan = request.session.get('language')
    if usuario:
        usuario.contrasena_1 = make_password(password)
        usuario.save()
        asunto = (
            'Password changed' if lan == 'en-en' else 'Contraseña cambiada'
        )
        enviar_email(
            'template_mail_contrasena_cambiada.html',
            'template_mail_contrasena_cambiada.txt',
            asunto,
            [email],
            {
                'lan': lan
            }
        )
        return index(request)
    else:
        return HttpResponse('¡El link de activación es inválido!')

""" Aviso legal """
def aviso_legal(request):
    contexto = get_usuario(request)
    contexto.update({
        'dyn_language': request.session.get('language') or LANGUAGE_DEFAULT
    })
    return render(
        request,
        'sia_sports_agency/aviso_legal.html',
        contexto
    )

""" Politica de privacidad """
def politica_privacidad(request):
    contexto = get_usuario(request)
    contexto.update({
        'dyn_language': request.session.get('language') or LANGUAGE_DEFAULT
    })
    return render(
        request,
        'sia_sports_agency/politica_privacidad.html',
        contexto
    )

""" Condiciones de servicio """
def condiciones_servicio(request):
    contexto = get_usuario(request)
    contexto.update({
        'dyn_language': request.session.get('language') or LANGUAGE_DEFAULT
    })
    return render(
        request,
        'sia_sports_agency/condiciones_servicio.html',
        contexto
    )

""" Ley de cookies """
def ley_cookies(request):
    contexto = get_usuario(request)
    contexto.update({
        'dyn_language': request.session.get('language') or LANGUAGE_DEFAULT
    })
    return render(
        request,
        'sia_sports_agency/ley_cookies.html',
        contexto
    )

""" Comprueba si el email existe en base de datos """
def comprobar_email(email, password):
    try:
        usuario = Usuario.objects.filter(
            email=email
        ).first()
        if not usuario or not check_password(password, usuario.contrasena_1):
            return None
    except Exception as e:
        logger.error("Error al comprobar el email: {}".format(e))
        return None
    return usuario

""" Comprueba existe el usuario en la sesión """
def get_usuario(request):
    email = request.session.get('email')
    if email:
        usuario = Usuario.objects.filter(
            email=email,
            activo=1
        ).first()
        dict = {'usuario': usuario}
        return dict if usuario is not None else {}
    return {}

""" Inicio de sesión """
def login(request):
    email = request.POST.get("email", "")
    password = request.POST.get("password", "")
    usuario = comprobar_email(email, password)
    dict = {
        'errorActivacion': False,
        'errorLogin': False,
        'errorEsActivo': False
    }
    if usuario:
        if usuario.es_activo == 1:
            if usuario.activo == 1:
                request.session['email'] = usuario.email
            else:
                dict['errorActivacion'] = True
        else:
            dict['errorEsActivo'] = True
    else:
        dict['errorLogin'] = True
    return HttpResponse(json.dumps(dict), content_type='application/json')

""" Cerrar sesión """
def logout(request):
    del request.session['email']
    return HttpResponseRedirect('/')

""" Traduce la palabra """
def get_translate(word, lan, dict):
    if lan == 'en-en' and dict.get(word):
        return dict.get(word)
    return word

""" Consigue las posiciones según el códgo del deporte """
def get_posiciones(request, cod):
    deporte = Deporte.objects.get(codigo=cod)
    lista_posiciones = []
    if request.GET.get('edit', '') == '0':
        lista_posiciones = [
            "<option value=\"" + str(posicion.codigo) + "\">"  + \
            get_translate(
                posicion.nombre, request.session.get('language'), DICT_POSITIONS
            ) + "</option>"
            for posicion
            in Posicion.objects.filter(deporte=deporte.id)
        ]
    else:
        usuario = get_usuario(request).get('usuario')
        for posicion in Posicion.objects.filter(deporte=deporte.id):
            nombre_posicion = get_translate(
                posicion.nombre,
                request.session.get('language'),
                DICT_POSITIONS
            )
            if posicion in usuario.posiciones.all():
                lista_posiciones.append(
                    "<option value=\"" + str(posicion.codigo) + "\" selected>"\
                    + nombre_posicion + "</option>"
                )
            else:
                lista_posiciones.append(
                    "<option value=\"" + str(posicion.codigo) + "\">" + \
                    nombre_posicion + "</option>"
                )
    dict = {
        'lista_posiciones': "".join(lista_posiciones),
        'multiple': deporte.requiere_multiple
    }
    return HttpResponse(json.dumps(dict), content_type='application/json')

""" Cambia el formato de la fecha a YYYY-MM-DD """
def change_format(fecha):
    if fecha:
        return fecha[6:] + "-" + fecha[3:5] + "-" + fecha[:2]
    else:
        return ""


def set_posiciones(usuario, deporte_id, diccionario):
    deporte = Deporte.objects.get(id=deporte_id)
    return usuario.posiciones.add(
        *diccionario.get('posiciones')
    ) if deporte.requiere_multiple else usuario.posiciones.add(
        diccionario.get('posiciones')
    )

def eliminar_posiciones(usuario):
    usuario.posiciones.through.objects.all().delete()

""" Enviar email desde el formulario de contacto """
def email_contacto(request):
    nombre = request.POST.get('nombre')
    email = request.POST.get('email')
    asunto = 'Consulta: ' + request.POST.get('subject')
    cuerpo = request.POST.get('message')
    checkboxes = request.POST.getlist('checks[]')
    context = {
        'nombre': nombre,
        'correo': email,
        'cuerpo': cuerpo,
        'suscripcion': False
    }
    if 'suscripcion' in checkboxes:
        context['suscripcion'] = True
    enviar_email(
        'template_contacto.html',
        'template_contacto.txt',
        asunto,
        ['siasportsagency@gmail.com'],
        context
    )
    return HttpResponseRedirect('/')

"""""""""""""""""""""""""""""""""""""""""""""
PARTE PRIVADA
"""""""""""""""""""""""""""""""""""""""""""""
""" Registro de un usuario """
def registrar_usuario(request):
    try:
        crear_usuario(request)
        dict={'exito':True}
    except Exception as e:
        dict={'exito':False}
        logger.error("Error al modificar usuario: {}".format(e))
        return HttpResponse("Error al registrar: {}".format(e))
    return HttpResponseRedirect('/')

""" Modificación de los datos de un usuario """
@csrf_exempt
def modificar_usuario(request, tipo):
    try:
        usuario = get_usuario(request).get('usuario')
        if usuario:
            actualizar_usuario(request, tipo)
            dict = {'exito': True}
        else:
            dict = {'exito': False}
    except Exception as e:
        logger.error("Error al modificar usuario: {}".format(e))
        dict = {'exito': False}
    return HttpResponse(json.dumps(dict), content_type='application/json')

""" Creación/Modificación de un usuario """
def actualizar_usuario(request, seccion):
    email = request.session.get('email')
    usuario = Usuario.objects.get(email=email)
    diccionario = get_diccionario(request, seccion)
    if seccion == 'db':
        actualizar_db(usuario, diccionario)
    elif seccion == 'de':
        actualizar_de(usuario, diccionario)

""" Creación usuario """
def crear_usuario(request):
    diccionario = get_diccionario(request, 'r')
    usuario = Usuario.objects.create(
        nombre=diccionario.get('nombre'),
        alias=diccionario.get('alias'),
        fnacimiento=diccionario.get('fnacimiento'),
        email=diccionario.get('email'),
        genero=diccionario.get('genero'),
        tipo_deporte=diccionario.get('tipo_deporte'),
        deporte_id=diccionario.get('deporte'),
        tipo_id=diccionario.get('tipo'),
        pais_id=diccionario.get('pais'),
        deporte_especifico=diccionario.get('deporte_especifico'),
        contrasena_1=diccionario.get('contrasena_1')
    )
    usuario.ruta_cromo = os.path.join(
        'users',
        'cromos',
        str(usuario.id),
        'cromo-' + str(usuario.id) + '.png'
    )
    usuario.save()
    if diccionario.get('posiciones'):
        set_posiciones(usuario, diccionario.get('deporte'), diccionario)
    enviar_registro_mail(diccionario.get('email'), usuario, request)

""" Consigue el diccionario a partir del request """
def get_diccionario(request, seccion):
    if seccion == 'r' or seccion == 'db':
        pais = Pais.objects.get(
            codigo=str(request.POST.get('inputPais', ''))
        )
        codigo_tipo_jugador = request.POST.get('inputTipoUsuario', '')
        tipo_jugador = Tipo_jugador.objects.get(
            codigo=codigo_tipo_jugador
        )
        diccionario =  {
            'nombre': request.POST.get('inputNombre', '').strip(),
            'alias': request.POST.get('inputAlias', '').strip(),
            'tipo': tipo_jugador.id,
            'pais': pais.id,
        }
        insertar_campos_basicos_din(request, diccionario)
        if seccion == 'r':
            estableceInfoCorreo(request, diccionario)
    elif seccion == 'de':
        diccionario = {
            'empty_curriculum': request.POST.get('emptyCurriculum', ''),
            'empty_cpresentacion': request.POST.get('emptyFileCarta', ''),
        }
        insertar_campos_especificos_din(request, diccionario)
    return diccionario

""" Inserta en el diccionaro los campos básicos según el rol"""
def insertar_campos_basicos_din(request, diccionario):
    rol = request.POST.get('inputTipoUsuario', '')
    estableceDeporte(rol, request, diccionario)
    estableceFNacimiento(rol, request, diccionario)
    estableceGenDeporte(rol, request, diccionario)
    estableceSexo(rol, request, diccionario)
    estableceDeporteEspecifico(rol, request, diccionario)
    establecePosiciones(rol, request, diccionario)

""" Inserta en el diccionaro los campos específicos según el rol"""
def insertar_campos_especificos_din(request, diccionario):
    email = request.session.get('email')
    usuario = Usuario.objects.get(email=email)
    rol = usuario.tipo.codigo
    estableceUbicacion(rol, request, diccionario)
    estableceNacionalidad(rol, request, diccionario)
    estableceInteresadoEn(rol, request, diccionario)
    estableceAlturaPeso(rol, request, diccionario)
    estableceEActual(rol, request, diccionario)
    estableceEDominante(rol, request, diccionario)
    establecePaginaWeb(rol, request, diccionario)
    estableceTelefono(rol, request, diccionario)
    estableceCurriculum(rol, request, diccionario)
    estableceCPresentacion(rol, request, diccionario)

""" Establece información de autentiación del registro"""
def estableceInfoCorreo(request, diccionario):
    diccionario.update({
        'email': request.POST.get('inputEmail', ''),
        'contrasena_1': make_password(
            request.POST.get('inputPassword1', '')
        ),
        'contrasena_2': make_password(
            request.POST.get('inputPassword2', '')
        )
    })

""" Establece ubicación si el rol lo requiere """
def estableceUbicacion(rol, request, diccionario):
    ubicacion = ''
    total_list = LIST_COMBO2 + LIST_COMBO5 + LIST_COMBO6
    if rol in total_list:
        ubicacion = request.POST.get('inputUbicacion', '').strip()
    diccionario.update({
        'ubicacion': ubicacion
    })

""" Establece interesado en si el rol lo requiere """
def estableceInteresadoEn(rol, request, diccionario):
    interesado_en = ''
    total_list = LIST_COMBO2 + LIST_COMBO5
    if rol in total_list:
        interesado_en = request.POST.get('inputInteresadoen', '').strip()
    diccionario.update({
        'interesadoen': interesado_en
    })

""" Establece altura y peso si el rol lo requiere """
def estableceAlturaPeso(rol, request, diccionario):
    peso = 0.00
    altura = 0.00
    tipo_peso = 'kg'
    tipo_altura = 'cm'
    if rol in LIST_COMBO1:
        decimal_peso = request.POST.get('inputPeso', '').replace(",", ".")
        decimal_altura = request.POST.get('inputAltura', '').replace(",", ".")
        peso =  float(decimal_peso) if decimal_peso else 0.00
        altura =  float(decimal_altura) if decimal_altura else 0.00
        tipo_peso = request.POST.get('inputTipoPeso', '')
        tipo_altura = request.POST.get('inputTipoAltura', '')
    diccionario.update({
        'peso': peso,
        'altura': altura,
        'tipo_altura': tipo_altura,
        'tipo_peso': tipo_peso
    })

""" Establece equipo actual si el rol lo requiere """
def estableceEActual(rol, request, diccionario):
    eactual = ''
    total_list = LIST_COMBO1 + LIST_COMBO3
    if rol in total_list:
        eactual = request.POST.get('inputEactual', '').strip()
    diccionario.update({
        'eactual': eactual
    })

""" Establece extremidad dominante si el rol lo requiere """
def estableceEDominante(rol, request, diccionario):
    extremidad = None
    if rol in LIST_COMBO1:
        extremidad = Extremidad_dominante.objects.get(
            codigo=str(request.POST.get('inputEdominante', ''))
        ).id
    diccionario.update({
        'extremidad': extremidad
    })

""" Establece nacionalidad si el rol lo requiere """
def estableceNacionalidad(rol, request, diccionario):
    nacionalidad = ''
    total_list = LIST_COMBO2 + LIST_COMBO5
    if rol not in total_list:
        nacionalidad = request.POST.get('inputNacionalidad', '').strip()
    diccionario.update({
        'nacionalidad': nacionalidad
    })

""" Establece curriculum si el rol lo requiere """
def estableceCurriculum(rol, request, diccionario):
    curriculum = None
    if rol in LIST_COMBO1:
        curriculum = request.FILES.get('inputCurriculum', '')
    diccionario.update({
        'curriculum': curriculum
    })

""" Establece carta de presentación si el rol lo requiere """
def estableceCPresentacion(rol, request, diccionario):
    cpresentacion = None
    cpresentacion = request.FILES.get('inputCpresentacion', '')
    diccionario.update({
        'carta_presentacion': cpresentacion
    })

""" Establece pagina web si el rol lo requiere """
def establecePaginaWeb(rol, request, diccionario):
    pagina_web = ''
    if rol in LIST_COMBO5:
        pagina_web = request.POST.get('inputPaginaWeb', '').strip()
    diccionario.update({
        'pagina_web': pagina_web
    })

""" Establece teléfono si el rol lo requiere """
def estableceTelefono(rol, request, diccionario):
    telefono = None
    telefono = request.POST.get(
        'inputTelefono', ''
    ) if request.POST.get('inputTelefono', '').strip() else None
    diccionario.update({
        'telefono': telefono
    })


""" Inserta en el diccionaro el campo deporte especifico según el deporte"""
def estableceDeporteEspecifico(rol, request, diccionario):
    deporte_especifico = ''
    deporte = Deporte.objects.get(
        codigo=request.POST.get('inputDeporte', '')
    )
    total_list = LIST_COMBO5 + LIST_COMBO6
    if deporte and deporte.codigo == 'MD' and rol not in total_list:
        deporte_especifico = request.POST.get(
            'inputDeporteEspecifico', ''
        ).strip()
    diccionario.update({
        'deporte_especifico': deporte_especifico
    })

""" Establece deporte si el rol lo requiere"""
def estableceDeporte(rol, request, diccionario):
    deporte = None
    total_list = LIST_COMBO5 + LIST_COMBO6
    if rol not in total_list:
        deporte = Deporte.objects.get(
            codigo=str(request.POST.get('inputDeporte', ''))
        ).id
    else:
        deporte = Deporte.objects.get(
            codigo="MD"
        ).id
    diccionario.update({
        'deporte': deporte
    })

""" Establece fecha de nacimiento si el rol lo requiere"""
def estableceFNacimiento(rol, request, diccionario):
    fecha = None
    total_list = LIST_COMBO2 + LIST_COMBO5
    if rol not in total_list and request.POST.get('inputNacimiento', ''):
        fecha_sf = request.POST.get('inputNacimiento', '').strip()
        fecha = datetime.strptime(fecha_sf, "%d/%m/%Y").strftime('%Y-%m-%d')
    diccionario.update({
        'fnacimiento': fecha
    })

""" Establece género de deporte si el rol lo requiere"""
def estableceGenDeporte(rol, request, diccionario):
    genero_deporte = 'n'
    total_list = LIST_COMBO4 + LIST_COMBO5 + LIST_COMBO6
    if rol not in total_list:
        genero_deporte = request.POST.get('inputTipoDeporte', '')
    diccionario.update({
        'tipo_deporte': genero_deporte
    })

""" Establece sexo si el rol lo requiere"""
def estableceSexo(rol, request, diccionario):
    sexo = 'n'
    total_list = LIST_COMBO2 + LIST_COMBO5
    if rol not in total_list:
        sexo = request.POST.get('inputSexo', '')
    diccionario.update({
        'genero': sexo
    })

""" Establece posiciones si el rol lo requiere"""
def establecePosiciones(rol, request, diccionario):
    posiciones = []
    deporte = Deporte.objects.get(
        codigo=str(request.POST.get('inputDeporte', ''))
    )
    if rol in LIST_COMBO1 and deporte and deporte.codigo != 'MD':
        if not deporte.requiere_multiple:
            if request.POST.get('inputPosicion', ''):
                posiciones = Posicion.objects.get(
                    codigo=str(request.POST.get('inputPosicion'))
                )
        else:
            if request.POST.getlist('inputPosicionMulti', ''):
                posiciones = Posicion.objects.filter(
                    codigo__in=request.POST.getlist('inputPosicionMulti', '')
                )
    diccionario.update({
        'posiciones': posiciones
    })

""" Limpia los campos comunes """
def limpiar_comunes(usuario):
    usuario.altura = 0.00
    usuario.peso = 0.00
    usuario.tipo_altura = 'cm'
    usuario.tipo_peso = 'kg'
    usuario.extremidad_id = None
    usuario.curriculum = None

""" Limpia datos específicos desde los básicos """
def limpiar_datos_especificos(usuario):
    if usuario.tipo.codigo in LIST_COMBO1:
        usuario.ubicacion = ''
        usuario.interesadoen = ''
        usuario.pagina_web = ''
    elif usuario.tipo.codigo in LIST_COMBO2:
        usuario.nacionalidad = ''
        usuario.pagina_web = ''
        limpiar_comunes(usuario)
        usuario.eactual = ''
    elif usuario.tipo.codigo in LIST_COMBO3:
        usuario.ubicacion = ''
        usuario.interesadoen = ''
        usuario.pagina_web = ''
        limpiar_comunes(usuario)
    elif usuario.tipo.codigo in LIST_COMBO4 + LIST_COMBO7:
        usuario.ubicacion = ''
        usuario.interesadoen = ''
        usuario.pagina_web = ''
        limpiar_comunes(usuario)
        usuario.eactual = ''
    elif usuario.tipo.codigo in LIST_COMBO5:
        usuario.nacionalidad = ''
        limpiar_comunes(usuario)
        usuario.eactual = ''
    elif usuario.tipo.codigo in LIST_COMBO6:
        usuario.pagina_web = ''
        usuario.interesadoen = ''
        limpiar_comunes(usuario)
        usuario.eactual = ''

""" Actualizar datos basicos del usuario """
def actualizar_db(usuario, diccionario):
    usuario.nombre = diccionario.get('nombre')
    usuario.alias = diccionario.get('alias')
    usuario.fnacimiento = diccionario.get('fnacimiento')
    usuario.genero = diccionario.get('genero')
    usuario.tipo_deporte = diccionario.get('tipo_deporte')
    usuario.deporte_id = diccionario.get('deporte')
    usuario.tipo_id = diccionario.get('tipo')
    usuario.pais_id = diccionario.get('pais')
    usuario.deporte_especifico = diccionario.get('deporte_especifico')
    usuario.posiciones.clear()
    limpiar_datos_especificos(usuario)
    if diccionario.get('posiciones'):
        set_posiciones(
            usuario, diccionario.get('deporte'), diccionario
        )
    else:
        eliminar_posiciones(usuario)
    eliminar_cromo(usuario)
    usuario.save()

""" Actualizar datos especificos del usuario """
def actualizar_de(usuario, diccionario):
    usuario.telefono = diccionario.get('telefono')
    usuario.ubicacion = diccionario.get('ubicacion')
    usuario.peso = diccionario.get('peso')
    usuario.altura = diccionario.get('altura')
    usuario.nacionalidad = diccionario.get('nacionalidad')
    usuario.eactual = diccionario.get('eactual')
    usuario.extremidad_id = diccionario.get('extremidad')
    usuario.interesadoen = diccionario.get('interesadoen')
    usuario.tipo_altura = diccionario.get('tipo_altura')
    usuario.tipo_peso = diccionario.get('tipo_peso')
    usuario.pagina_web = diccionario.get('pagina_web')
    guardar_curriculum(
        diccionario.get('curriculum'),
        diccionario.get('empty_curriculum'),
        usuario
    )
    guardar_cpresentacion(
        diccionario.get('carta_presentacion'),
        diccionario.get('empty_cpresentacion'),
        usuario
    )
    usuario.save()

""" Guarda el curriculum """
def guardar_curriculum(curriculum, vacio, usuario):
    filename = "curriculum-" + str(usuario.id) + ".pdf"
    path = os.path.join(
        settings.BASE_DIR,
        settings.BASE_DIR_CURRICULUM,
        str(usuario.id)
    )
    eliminar_fichero(path, filename)
    if curriculum:
        guardar_fichero(curriculum, path, filename)
        usuario.curriculum = os.path.join(
            'users',
            'curriculums',
            str(usuario.id),
            filename
        )
    if vacio == '1':
        usuario.curriculum = None

""" Guarda la carta de presentacion """
def guardar_cpresentacion(cpresentacion, vacio, usuario):
    filename = "carta-" + str(usuario.id) + ".pdf"
    path = os.path.join(
        settings.BASE_DIR,
        settings.BASE_DIR_CPRESENTACION,
        str(usuario.id)
    )
    eliminar_fichero(path, filename)
    if cpresentacion:
        guardar_fichero(cpresentacion, path, filename)
        usuario.cpresentacion = os.path.join(
            'users',
            'cartas-presentacion',
            str(usuario.id),
            filename
        )
    if vacio == '1':
        usuario.cpresentacion = None

""" Eliminamos el cromo para volverlo a reestablecer """
def eliminar_cromo(usuario):
    path = os.path.join(
        settings.BASE_DIR, settings.BASE_DIR_CROMO, str(usuario.id)
    )
    eliminar_fichero(
        path,
        "cromo-" + str(usuario.id) + ".png"
    )

""" Cambia la contrasena """
@csrf_exempt
def cambiar_contrasena(request):
    dict = {'exito': False}
    try:
        usuario = get_usuario(request).get('usuario')
        if usuario:
            contrasena = request.POST.get('inputPassword', '')
            if contrasena:
                usuario.contrasena_1 = make_password(contrasena)
                usuario.save()
                dict['exito'] = True
    except Excpetion as e:
        logger.error("Error al cambiar contrasena: {}".format(e))
    return HttpResponse(json.dumps(dict), content_type='application/json')


""" Acceder a la pantalla de busqueda """
def busqueda(request):
    if not get_usuario(request):
        return HttpResponseRedirect('/')
    context = global_contexto()
    context.update({
        'rango_edad': range(16, 100),
        'dyn_language': request.session.get('language') or LANGUAGE_DEFAULT
    })
    context.update(get_usuario(request))
    return render(
        request,
        'sia_sports_agency/busqueda.html',
        context
    )

""" Acceder al perfil del usuario """
def perfil(request):
    if not get_usuario(request):
        return HttpResponseRedirect('/')
    lista_extremidades = Extremidad_dominante.objects.all()
    contexto = global_contexto()
    contexto.update({
        'extremidades': lista_extremidades,
        'n_visitas': get_usuario(request).get('usuario').n_visitas,
        'img_perfil': get_usuario(request).get('usuario').img_perfil,
        'ruta_cromo': get_usuario(request).get('usuario').ruta_cromo,
        'dyn_language': request.session.get('language') or LANGUAGE_DEFAULT
    })
    contexto.update(get_usuario(request))
    insertar_redes_contexto(contexto)
    insertar_videos_contexto(contexto)
    insertar_correos_contexto(contexto)
    insertar_posicion_prin_contexto(contexto)
    return render(
        request,
        'sia_sports_agency/perfil.html',
        contexto
    )

def insertar_posicion_prin_contexto(contexto):
    usuario = contexto.get('usuario')
    posicion_principal = usuario.posiciones.first()
    contexto.update({
        'posicion_principal': posicion_principal
    })

""" Inserta en el contexto del perfil los videos """
def insertar_videos_contexto(contexto):
    usuario = contexto.get('usuario')
    lista_videos = Video.objects.filter(
        usuario_id = usuario.id
    )
    contexto.update({'videos': lista_videos})

""" Inserta en el contexto del perfil las redes sociales """
def insertar_redes_contexto(contexto):
    usuario = contexto.get('usuario')
    lista_redes = redes_por_usuario(usuario)
    for r in lista_redes:
        nombre = 'red_' + r.codigo
        contexto.update({nombre: r.enlace})

""" Busca las redes de un usuario """
def redes_por_usuario(usuario):
    lista_redes = Red_social.objects.filter(
        usuario_id = usuario.id
    )
    return lista_redes

""" Inserta en el contexto del perfil los correos """
def insertar_correos_contexto(contexto):
    usuario = contexto.get('usuario')
    lista_bandeja = Mensaje.objects.filter(
        destinatario_id = usuario.id
    )
    lista_correos_env = Mensaje.objects.filter(
        remitente_id = usuario.id
    )
    correos_nuevos = Mensaje.objects.filter(
        destinatario_id = usuario.id,
        leido=0
    ).order_by('-fecha')
    contexto.update({
        'bandeja': lista_bandeja,
        'correos_enviados': lista_correos_env,
        'correos_nuevos': correos_nuevos
    })

""" Actulización de las redes sociales de un usuario """
@csrf_exempt
def actualizar_redes(request):
    usuario = get_usuario(request).get('usuario')
    if usuario:
        try:
            if usuario is not None:
                #Enlace facebook
                url_facebook = request.POST.get('inputFacebook', '').strip()
                if url_facebook:
                    crear_red('Facebook', 'FB', url_facebook, usuario)
                else:
                    eliminar_red('FB', usuario)
                #Enlace twitter
                url_twitter = request.POST.get('inputTwitter', '').strip()
                if url_twitter:
                    crear_red('Twitter', 'TT', url_twitter, usuario)
                else:
                    eliminar_red('TT', usuario)
                #Enlace instagram
                url_instragram = request.POST.get('inputInstagram', '').strip()
                if url_instragram:
                    crear_red('Instagram', 'IG', url_instragram, usuario)
                else:
                    eliminar_red('IG', usuario)
                #Enlace youtube
                url_youtube = request.POST.get('inputYoutube', '').strip()
                if url_youtube:
                    crear_red('Youtube', 'YT', url_youtube, usuario)
                else:
                    eliminar_red('YT', usuario)

                #Eliminar cromo
                eliminar_cromo(usuario)
                dict = {'exito': True}
        except Exception as error:
            logger.error("Error al actualizar las redes: {}".format(error))
            dict = {'exito': False}
        return HttpResponse(json.dumps(dict), content_type='application/json')
    else:
        return HttpResponseRedirect('/')

""" Crear o modifica la red social que se le pasa por parámetro """
def crear_red(nombre, codigo, enlace, usuario):
    try:
        url = Red_social.objects.get(
            codigo=codigo,
            usuario_id=usuario.id
        )
    except:
        url = None
    if url:
        url.enlace = enlace
        url.save()
    else:
        Red_social.objects.create(
            nombre=nombre,
            codigo=codigo,
            enlace=enlace,
            usuario_id=usuario.id,
        )

""" Elimina la red social que se le pasa por parámetro """
def eliminar_red(codigo, usuario):
    try:
        url = Red_social.objects.get(
            codigo=codigo,
            usuario_id=usuario.id
        )
    except:
        url = None
    if url:
        url.delete()


""" Insertar video en el perfil """
@csrf_exempt
def insertar_video(request):
    usuario = get_usuario(request).get('usuario')
    dict = {'exito':True}
    try:
        if usuario:
            nombre = request.POST.get('inputNombre')
            video = request.FILES.get('inputFile')
            path = os.path.join(
                settings.BASE_DIR,
                settings.BASE_DIR_VIDEO,
                str(usuario.id)
            )
            filename =  video.name
            guardar_fichero(video, path, filename)
            url_video = os.path.join(
                'users',
                'videos-perfil',
                str(usuario.id),
                filename
            )
            crear_video(nombre, url_video, usuario)
        else:
            dict['exito'] = False
    except Exception as e:
        logger.error("Error al insertar el video: {}".format(e))
        dict['exito'] = False
    return HttpResponse(json.dumps(dict), content_type='application/json')

""" Crea el video """
def crear_video(nombre, path, usuario):
    Video.objects.create(
        nombre=nombre,
        path=path,
        usuario_id=usuario.id
    )
""" Eliminar video en el perfil """
def eliminar_video(request):
    usuario = get_usuario(request).get('usuario')
    if usuario:
        id = request.POST.get("idVideo")
        video = Video.objects.get(id=id)
        path = os.path.join(
            settings.BASE_DIR,
            'sia_sports_agency',
            'static',
            video.path
        )
        eliminar_fichero(path, '')
        video.delete()
        return HttpResponseRedirect('/perfil/')
    else:
        return HttpResponseRedirect('/')

""" Elimina mensaje en el perfil """
def eliminar_mensaje(request, id):
    usuario = get_usuario(request).get('usuario')
    dict = {'exito': False}
    try:
        mensaje = Mensaje.objects.get(id=id)
        if usuario and mensaje:
            mensaje.delete()
            dict['exito'] = True
    except Exception as e:
        logger.error("Error al eliminar el mensaje: {}".format(e))
    return HttpResponse(
        json.dumps(dict), content_type='application/json'
    )


""" Conseguir datos del mensaje """
def get_mensaje(request, id):
    usuario = get_usuario(request).get('usuario')
    dict = {}
    if usuario:
        mensaje = Mensaje.objects.get(id=id)
        mensaje.leido = 1
        mensaje.save()
        dict = {
            'remitente': mensaje.remitente.email,
            'remitente_nombre': mensaje.remitente.nombre,
            'asunto': mensaje.asunto,
            'mensaje': mensaje.cuerpo,
            'fecha': str(mensaje.fecha),
            'destinatario': mensaje.destinatario.email,
            'destinatario_nombre': mensaje.destinatario.nombre
        }
    return HttpResponse(json.dumps(dict), content_type='application/json')

""" Conseguir todos los correos de los usuario """
def get_correos(request):
    usuario = get_usuario(request).get('usuario')
    dict = {}
    if usuario:
        correos = Usuario.objects.filter(activo=1)
        dict = {
            'correos': [c.nombre + " <" + c.email + ">" for c in correos],
        }
    return HttpResponse(json.dumps(dict), content_type='application/json')

""" A partir de un listado de emails, se envia un correo por cada email """
@csrf_exempt
def enviar_correo(request):
    usuario = get_usuario(request).get('usuario')
    if usuario:
        dict = {}
        try:
            correos = request.POST.get("lista_correos", "")
            asunto = request.POST.get("asunto", "")
            cuerpo = request.POST.get("cuerpo", "")
            lista_correos = [
                c.strip() for c in correos.split(';') if c.strip() != ''
            ]
            for l in lista_correos:
                email_dest = l[l.find("<")+1:l.find(">")] or None
                destinatario = Usuario.objects.filter(email=email_dest).first()
                if destinatario and email_dest:
                    Mensaje.objects.create(
                        asunto=asunto,
                        cuerpo=cuerpo,
                        remitente_id=usuario.id,
                        destinatario_id = destinatario.id,
                        leido=0,
                    )
            dict = {'exito': True}
        except Exception as e:
            dict = {'exito': False}
            logger.error("Error al enviar el correo: {}".format(e))
        return HttpResponse(json.dumps(dict), content_type='application/json')
    else:
        return HttpResponseRedirect('/')

""" Elimina el archivo indicado en el path"""
def eliminar_fichero(path, subpath):
    nombre_fic = os.path.join(path)
    if subpath:
        nombre_fic = os.path.join(path, subpath)
    if os.path.isfile(nombre_fic):
        os.remove(nombre_fic)

""" Guardar el archivo indicado en el path"""
def guardar_fichero(data, path, nombre_fic):
    fs = FileSystemStorage(
        location=path
    )
    fs.save(nombre_fic, data)

""" Guarda el cromo como imagen png """
@csrf_exempt
def guardar_cromo(request):
    dict={'exito':False}
    try:
        email = request.session.get('email')
        usuario = Usuario.objects.filter(
            email=email,
            activo=1
        ).first()
        if usuario:
            eliminar_cromo(usuario)
            path = os.path.join(
                settings.BASE_DIR, settings.BASE_DIR_CROMO, str(usuario.id)
            )
            data_img = request.POST.get("imgBase64")
            formato, imgstr = data_img.split(';base64,')
            ext = formato.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr))
            nombre_fic = "cromo-" + str(usuario.id) + "." + ext
            guardar_fichero(data, path, nombre_fic)
            usuario.ruta_cromo = os.path.join(
                'users',
                'cromos',
                str(usuario.id),
                nombre_fic
            )
            url_completa = os.path.join(
                path, "cromo-" + str(usuario.id) + ".png"
            )
            usuario.save()
            dict={'exito':True}
            return HttpResponse(
                json.dumps(dict), content_type='application/json'
            )
        else:
            return HttpResponse(
                json.dumps(dict), content_type='application/json'
            )
    except Exception as e:
        logger.error(
            "Error al guardar el cromo: {}".format(
                e
            )
        )
        return HttpResponse(
            json.dumps(dict), content_type='application/json'
        )

""" Comprueba si es el primer acceso del usuario """
def primer_acceso(request):
    dict={'exito':False}
    try:
        usuario = get_usuario(request).get('usuario')
        path_cromo = os.path.join(
            settings.BASE_DIR,
            settings.BASE_DIR_CROMO,
            str(usuario.id),
            "cromo-" + str(usuario.id) + ".png"
        )
        if usuario:
            dict.update({
                'primer_acceso': usuario.primer_acceso,
                'exito':True,
                'vacio':False
            })
            if not os.path.isfile(path_cromo):
                dict.update({'vacio':True})
            return HttpResponse(
                json.dumps(dict), content_type='application/json'
            )
        else:
            return HttpResponse(
                json.dumps(dict), content_type='application/json'
            )
    except:
        return HttpResponse(json.dumps(dict), content_type='application/json')

""" Setea el acceso a 0. Ya no será primer acceso """
@csrf_exempt
def set_acceso(request):
    dict={'exito':False}
    try:
        usuario = get_usuario(request).get('usuario')
        dict = {}
        if usuario:
            usuario.primer_acceso = 0
            usuario.save()
            dict={'exito':True}
            return HttpResponse(
                json.dumps(dict), content_type='application/json'
            )
        else:
            return HttpResponse(
                json.dumps(dict), content_type='application/json'
            )
    except:
        return HttpResponse(json.dumps(dict), content_type='application/json')

""" Añade la nueva foto del fromo """
@csrf_exempt
def subir_img_cromo(request):
    usuario = get_usuario(request).get('usuario')
    if usuario:
        try:
            imagen = request.FILES.get('inputImgCromo')
            filename = str(usuario.id) + ".png"
            path = os.path.join(
                settings.BASE_DIR,
                settings.BASE_DIR_IMG_PERFIL_DEF,
                str(usuario.id)
            )
            eliminar_fichero(path, filename)
            guardar_fichero(imagen, path, filename)
            eliminar_cromo(usuario)
            url_imagen = os.path.join(
                'users',
                'img-perfil',
                str(usuario.id),
                filename
            )
            url_completa = os.path.join(path, str(usuario.id) + ".png")
            while not os.path.isfile(url_completa):
                pass
            usuario.img_perfil = url_imagen
            usuario.save()
            dict = {
                'ruta_cromo': os.path.join('/static', url_imagen),
                'error': False
            }
        except:
            dict['error'] = True
        return HttpResponse(
            json.dumps(dict), content_type='application/json'
        )
    else:
        return HttpResponseRedirect('/')

""" Busqueda de cromos """
@csrf_exempt
def busqueda_cromo(request):
    usuario = get_usuario(request).get('usuario')
    if usuario:
        try:
            eini = int(request.POST.get('busquedaEdadIni'))
            efin = int(request.POST.get('busquedaEdadFin'))
            lista_usuarios = Usuario.objects.filter(
                primer_acceso=0,
                activo=1,
                id__in=get_usuario_por_edad(eini, efin),
                es_activo=1
            ).exclude(email='admin')
            nombre = request.POST.get('busquedaNombre', '')
            posiciones = Posicion.objects.filter(
                codigo__in=request.POST.getlist('busquedaPosicionMulti', '')
            )
            deporte = Deporte.objects.filter(
                codigo=request.POST.get('busquedaDeporte', '')
            ).first()
            genero_deporte = request.POST.get('busquedaGenero', '')
            pais = Pais.objects.filter(
                codigo=request.POST.get('busquedaPais', '')
            ).first()
            eactual = request.POST.get('busquedaEActual', '')
            tipo_jugador = Tipo_jugador.objects.filter(
                codigo=request.POST.get('busquedaTipoUsuario', '')
            ).first()
            if tipo_jugador:
                lista_usuarios = lista_usuarios.filter(
                    tipo=tipo_jugador
                )
            if nombre:
                lista_usuarios = lista_usuarios.filter(
                    nombre__unaccent__icontains=nombre
                )
            if posiciones:
                lista_usuarios = lista_usuarios.filter(
                    posiciones__in=posiciones
                )
            if deporte:
                lista_usuarios = lista_usuarios.filter(
                    deporte=deporte
                )
            if genero_deporte and genero_deporte != 'a':
                lista_usuarios = lista_usuarios.filter(
                    tipo_deporte=genero_deporte
                )
            if pais:
                lista_usuarios = lista_usuarios.filter(
                    pais=pais
                )
            if eactual:
                lista_usuarios = lista_usuarios.filter(
                    eactual__icontains=eactual
                )
            pagina = request.POST.get('busquedaPagina', '1')
            lista_usuarios = lista_usuarios.order_by('-n_visitas', 'alias')
            total_registros = len(lista_usuarios)
            lista_usuarios = paginar_resultados(lista_usuarios, pagina)
            dict = {
                'exito': True,
                'lista_usuarios': [(
                    u.id, os.path.join('/static', u.ruta_cromo)
                ) for u in lista_usuarios],
                'total_registros': total_registros
            }
        except Exception as e:
            logger.error(
                "Error al hacer una busqueda de cromos: {}".format(
                    e
                )
            )
            dict = {'exito': False}
        return HttpResponse(
            json.dumps(dict),
            content_type='application/json'
        )
    else:
        return HttpResponseRedirect('/')

""" Pagina los resultados """
def paginar_resultados(lista_usuarios, pagina):
    paginator = Paginator(lista_usuarios, 12)
    try:
        return paginator.page(pagina)
    except PageNotAnInteger:
        return paginator.page(1)
    except EmptyPage:
        return paginator.page(paginator.num_pages)

""" Devuleve los usuarios cuya edad esté entre en el rango de valores dado """
def get_usuario_por_edad(inicio, fin):
    usuarios = Usuario.objects.all()
    lista = [
        u.id for u in usuarios if (
            u.fnacimiento and inicio <= get_edad(u.fnacimiento) <= fin
        )
    ]
    lista_sin_fnacimiento = [
        u.id for u in usuarios if not u.fnacimiento
    ]
    return list(set(lista)) + list(set(lista_sin_fnacimiento))

""" Calcula la edad a partir de la fecha de nacmiento """
def get_edad(fnacimiento):
    hoy = date.today()
    return hoy.year - fnacimiento.year - (
        (hoy.month, hoy.day) < (fnacimiento.month, fnacimiento.day)
    )

""" Reactiva una cuenta que estava desactivada """
@csrf_exempt
def reactivar_cuenta(request):
    try:
        usuario = Usuario.objects.filter(
            email=request.POST.get('emailInput', '')
        ).first()
        if usuario and check_password(
            request.POST.get('passwordInput', ''),
            usuario.contrasena_1
        ):
            usuario.activo = 1
            usuario.save()
            request.session['email'] = usuario.email
            lan = request.session.get('language')
            asunto = (
                'Account reactivated' if lan == 'en-en' else 'Cuenta reactivada'
            )
            enviar_email(
                'template_mail_reactivacion.html',
                'template_mail_reactivacion.txt',
                asunto,
                [usuario.email],
                {
                    'lan': lan
                }
            )
            return HttpResponseRedirect('/perfil')
        else:
            return HttpResponseRedirect('/')
    except Exception as e:
        logger.error("Error al reactivar cuenta: {}".format(e))

""" Desactiva una cuenta """
@csrf_exempt
def desactivar_cuenta(request):
    try:
        usuario = get_usuario(request).get('usuario')
        if usuario:
            usuario.activo = 0
            usuario.save()
            lan = request.session.get('language')
            asunto = (
                'Account cancelled' if lan == 'en-en' else 'Cuenta cancelada'
            )
            enviar_email(
                'template_mail_cancelacion.html',
                'template_mail_cancelacion.txt',
                asunto,
                [usuario.email],
                {
                    'lan': lan
                }
            )
            del request.session['email']
        return HttpResponseRedirect('/')
    except Exception as e:
        logger.error("Error al desactivar la cuenta: {}".format(e))


def insertar_redes_detalle(dict, usuario):
    lista_redes = redes_por_usuario(usuario)
    for l in lista_redes:
        nombre = 'red_' + l.codigo
        dict.update({nombre: l.enlace})

""" Incrementa las visitas de un usuario """
def incrementar_visitas(usuario, usu_seleccionado):
    if usuario.id != usu_seleccionado.id:
        usu_seleccionado.n_visitas += 1
        usu_seleccionado.save()

def posicionesPorUsuario(usuario,  request):
    posiciones = usuario.posiciones.all()
    lan = request.session.get('language')
    return ', '.join([
        get_translate(
            p.nombre,
            lan,
            DICT_POSITIONS
        ).capitalize() for p in posiciones
    ])

""" Inserta en un diccionario todos los datos de la ficha del usuario """
def detalle_usuario_dict(dict, usu_seleccionado, request):
    lan = request.session.get('language')
    dict.update({
        'url_img': os.path.join('/static', usu_seleccionado.ruta_cromo),
        'nombre': usu_seleccionado.nombre if usu_seleccionado.nombre
            else get_translate('No especificado', lan, DICT_NO_ESPECIFICADO),
        'rol_nombre': get_translate(
            usu_seleccionado.tipo.nombre,
            lan,
            DICT_ROLES
        ),
        'rol': usu_seleccionado.tipo.codigo,
        'deporte': (
            get_translate(
                usu_seleccionado.deporte.nombre,
                lan,
                DICT_DEPORTES
            ) if
            usu_seleccionado.deporte else get_translate(
                'No especificado',
                lan,
                DICT_NO_ESPECIFICADO
            )
        ),
        'deporte_codigo': (
            usu_seleccionado.deporte.codigo if
            usu_seleccionado.deporte else ''
        ),
        'deporte_especifico': (
            usu_seleccionado.deporte_especifico if
            usu_seleccionado.deporte_especifico else get_translate(
                'No especificado',
                lan,
                DICT_NO_ESPECIFICADO
            )
        ),
        'posiciones': posicionesPorUsuario(usu_seleccionado, request)
            if posicionesPorUsuario(
                usu_seleccionado, request
            ) else get_translate(
                'No especificado',
                lan,
                DICT_NO_ESPECIFICADO
            ),
        'email': usu_seleccionado.email,
        'genero_deporte': get_translate(
                SPORT_TYPE_CHOICES.get(
                usu_seleccionado.tipo_deporte
            ),
            lan,
            DICT_GENERO
        ),
        'sexo': get_translate(
            GENDER_CHOICES.get(
                usu_seleccionado.genero
            ),
            lan,
            DICT_GENERO
        ),
        'fnacimiento': usu_seleccionado.fnacimiento.strftime(
            "%d/%m/%Y"
        ) if usu_seleccionado.fnacimiento else get_translate(
            'No especificado',
            lan,
            DICT_NO_ESPECIFICADO
        ),
        'pais': usu_seleccionado.pais.nombre,
        'telefono': usu_seleccionado.telefono
            if usu_seleccionado.telefono
                else get_translate(
                    'No especificado',
                    lan,
                    DICT_NO_ESPECIFICADO
                ),
        'ubicacion': usu_seleccionado.ubicacion
            if usu_seleccionado.ubicacion
                else get_translate(
                    'No especificado',
                    lan,
                    DICT_NO_ESPECIFICADO
                ),
        'peso': str(usu_seleccionado.peso),
        'tipo_peso': usu_seleccionado.tipo_peso,
        'extremidad': get_translate(
                usu_seleccionado.extremidad.nombre,
                lan,
                DICT_EXTREMIDADES
            )
            if usu_seleccionado.extremidad else get_translate(
                'No especificado',
                lan,
                DICT_NO_ESPECIFICADO
            ),
        'equipo_actual': usu_seleccionado.eactual
            if usu_seleccionado.eactual else get_translate(
                'No especificado',
                lan,
                DICT_NO_ESPECIFICADO
            ),
        'pagina_web': usu_seleccionado.pagina_web
            if usu_seleccionado.pagina_web else get_translate(
                'No especificado',
                lan,
                DICT_NO_ESPECIFICADO
            ),
        'nacionalidad': usu_seleccionado.nacionalidad
            if usu_seleccionado.nacionalidad
                else get_translate(
                    'No especificado',
                    lan,
                    DICT_NO_ESPECIFICADO
                ),
        'altura': str(usu_seleccionado.altura),
        'tipo_altura': usu_seleccionado.tipo_altura,
        'interesadoen': usu_seleccionado.interesadoen,
        'url_curriculum': os.path.join(
            '/static', usu_seleccionado.curriculum
        ) if usu_seleccionado.curriculum else '',
        'url_cpresentacion': os.path.join(
            '/static', usu_seleccionado.cpresentacion
        ) if usu_seleccionado.cpresentacion else '',
        'url_videos': [
            os.path.join(
                '/static', v.path
            ) for v in Video.objects.filter(
                usuario=usu_seleccionado
            )
        ],
    })

""" Devuelve el detalle de un usuario """
@csrf_exempt
def detalle_usuario(request):
    dict={'exito':False}
    try:
        email = request.session.get('email')
        usuario = Usuario.objects.filter(
            email=email,
            activo=1
        ).first()
        if usuario:
            usuario_id = request.POST.get("usuario_id")
            usu_seleccionado = Usuario.objects.filter(
                id=usuario_id,
            ).first()
            dict['exito'] = True
            detalle_usuario_dict(dict, usu_seleccionado, request)
            insertar_redes_detalle(dict, usu_seleccionado)
            incrementar_visitas(usuario, usu_seleccionado)
            return HttpResponse(
                json.dumps(dict), content_type='application/json'
            )
        else:
            return HttpResponse(
                json.dumps(dict), content_type='application/json'
            )
    except Exception as e:
        dict['exito'] = False
        logger.error("Error al ver el detalle del usuario: {}".format(e))
        return HttpResponse(
            json.dumps(dict), content_type='application/json'
        )

""" Cambiamos el idioma en la sesión """
def cambiar_idioma(request):
    request.session['language'] = request.POST.get('idioma')
    return HttpResponseRedirect('/')

""" Envia un mail """
def enviar_email(template_html, template_txt, asunto, lista_correos, dict):
    path_templates = os.path.join(
        settings.TEMPLATES_ROOT,
        'mail'
    )
    msg_plain = render_to_string(
        os.path.join(path_templates, template_txt),
        dict
    )
    msg_html = render_to_string(
        os.path.join(path_templates, template_html),
        dict
    )
    send_mail(
        asunto,
        msg_plain,
        'siasportsagency@gmail.com',
        lista_correos,
        html_message=msg_html,
    )

""" Envia un mail desde el registro"""
def enviar_registro_mail(mail, usuario, request):
    current_site = get_current_site(request)
    lan = request.session.get('language')
    asunto = (
        'Account activation' if lan == 'en-en' else 'Activación de cuenta'
    )
    enviar_email(
        'template_mail_registro.html',
        'template_mail_registro.txt',
        asunto,
        [mail],
        {
            'user': usuario,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(usuario.id)),
            'token': account_activation_token.make_token(usuario),
            'lan': lan
        }
    )

""" Comprueba si ya existe el correo """
@csrf_exempt
def comprobar_correo(request):
    dict={
        'exito': False,
        'existe': False
    }
    try:
        correo = request.POST.get("correo")
        usuario_exi = Usuario.objects.filter(
            email=correo
        ).first()
        dict['exito'] = True
        if usuario_exi:
            dict['existe'] = True
        else:
            dict['existe'] = False
    except Exception as e:
        logger.error(
            "Error al comprobar si existe el email en el registro: {}".format(
                e
            )
        )
        dict['exito'] = False
    return HttpResponse(
        json.dumps(dict), content_type='application/json'
    )

""" Activar cuenta sia """
@csrf_exempt
def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        usuario = Usuario.objects.get(id=uid)
    except(TypeError, ValueError, OverflowError, Usuario.DoesNotExist) as e:
        usuario = None
        logger.error(
            "Error activar la cuenta: {}".format(
                e
            )
        )
    if usuario is not None and account_activation_token.check_token(
        usuario,
        token
    ):
        usuario.es_activo = 1
        usuario.fecha_activacion = datetime.now()
        usuario.save()
        request.session['email'] = usuario.email
        return HttpResponseRedirect('/perfil/')
    else:
        return HttpResponse('¡El link de activación es inválido!')

""" Envia un mail que recuerda la contraseña"""
def recordar_contrasena_mail(request):
    mail = request.POST.get("inputEmail")
    usuario_exi = Usuario.objects.filter(
        email=mail
    ).first()
    lan = request.session.get('language')
    asunto = (
        'Reset password' if lan == 'en-en' else 'Reestablecer contraseña'
    )
    if usuario_exi:
        current_site = get_current_site(request)
        enviar_email(
            'template_mail_recordar_contrasena.html',
            'template_mail_recordar_contrasena.txt',
            asunto,
            [mail],
            {
                'user': usuario_exi,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(usuario_exi.id)),
                'token': account_activation_token.make_token(usuario_exi),
                'lan': lan
            }
        )
    return HttpResponseRedirect('/perfil/')
