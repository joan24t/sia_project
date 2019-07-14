from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from .models import Tipo_jugador, Deporte, Posicion, Pais, Video
from .models import Usuario, Extremidad_dominante, Red_social, Mensaje
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import json
import os

"""""""""""""""""""""""""""""""""""""""""""""
PARTE PUBLICA
"""""""""""""""""""""""""""""""""""""""""""""
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
    return render(
        request,
        'sia_sports_agency/index.html',
        contexto
    )

""" Comprueba si el email existe en base de datos """
def comprobar_email(email, password):
    try:
        usuario = Usuario.objects.get(
            email=email,
            activo=1
        )
    except Usuario.DoesNotExist:
        usuario = None
    return usuario

""" Comprueba existe el usuario en la sesión """
def get_usuario(request):
    email = request.session.get('email')
    if email:
        usuario = Usuario.objects.get(
            email=email,
            activo=1
        )
        return {'usuario': usuario} if usuario is not None else {}
    return {}

""" Inicio de sesión """
def login(request):
    email = request.POST.get("email", "")
    password = request.POST.get("password", "")
    usuario = comprobar_email(email, password)
    if usuario is not None:
        request.session['email'] = usuario.email
    else:
        context = {'errorLogin': True}
    return HttpResponseRedirect('/perfil/')

""" Cerrar sesión """
def logout(request):
    del request.session['email']
    return HttpResponseRedirect('/')


""" Consigue las posiciones según el códgo del deporte """
def get_posiciones(request, cod):
    deporte = Deporte.objects.get(codigo=cod)
    lista_posiciones = []
    if request.GET.get('edit', '') == '0':
        lista_posiciones = [
            "<option value=\"" + str(posicion.codigo) + "\">"  + \
            posicion.nombre + '</option>'
            for posicion
            in Posicion.objects.filter(deporte=deporte.id)
        ]
    else:
        usuario = get_usuario(request).get('usuario')
        for posicion in Posicion.objects.filter(deporte=deporte.id):
            if posicion in usuario.posiciones.all():
                lista_posiciones.append(
                    "<option value=\"" + str(posicion.codigo) + "\" selected>"\
                    + posicion.nombre + "</option>"
                )
            else:
                lista_posiciones.append(
                    "<option value=\"" + str(posicion.codigo) + "\">" + \
                    posicion.nombre + "</option>"
                )
    dict = {
        'lista_posiciones': "".join(lista_posiciones),
        'multiple': deporte.requiere_multiple
    }
    return HttpResponse(json.dumps(dict), content_type='application/json')

""" Cambia el formato de la fecha a YYYY-MM-DD """
def change_format(fecha):
    return fecha[6:] + "-" + fecha[3:5] + "-" + fecha[:2]

""" Consigue el diccionario a partir del request """
def get_diccionario(request, seccion):
    diccionario = {}
    if seccion == 'r' or seccion == 'db':
        deporte = Deporte.objects.get(
            codigo=str(request.POST.get('inputDeporte', ''))
        )
        tipo_jugador = Tipo_jugador.objects.get(
            codigo=str(request.POST.get('inputTipoUsuario', ''))
        )
        pais = Pais.objects.get(
            codigo=str(request.POST.get('inputPais', ''))
        )
        posiciones = (
            Posicion.objects.get(codigo=str(
                request.POST.get('inputPosicion', ''))
            )
            if not deporte.requiere_multiple
            else Posicion.objects.filter(
                codigo__in=request.POST.getlist('inputPosicionMulti', '')
            )
        )
        diccionario =  {
            'nombre': request.POST.get('inputNombre', ''),
            'fnacimiento': change_format(
                request.POST.get('inputNacimiento', '')
            ),
            'email': request.POST.get('inputEmail', ''),
            'genero': request.POST.get('inputSexo', ''),
            'tipo_deporte': request.POST.get('inputTipoDeporte', ''),
            'deporte': deporte,
            'tipo': tipo_jugador,
            'pais': pais,
            'posiciones': posiciones
        }
        if seccion == 'r':
            diccionario.update({
                'contrasena_1': make_password(
                    request.POST.get('inputPassword1', '')
                ),
                'contrasena_2': make_password(
                    request.POST.get('inputPassword2', '')
                )
            })
    elif seccion == 'de':
        extremidad_dominante = Extremidad_dominante.objects.get(
            codigo=str(request.POST.get('inputEdominante', ''))
        )
        diccionario = {
            'telefono': request.POST.get('inputTelefono', ''),
            'ubicacion': request.POST.get('inputUbicacion', ''),
            'peso': request.POST.get('inputPeso', ''),
            'altura': request.POST.get('inputAltura', ''),
            'nacionalidad': request.POST.get('inputNacionalidad', ''),
            'eactual': request.POST.get('inputEactual', ''),
            'interesadoen': request.POST.get('inputInteresadoen', ''),
            'extremidad': extremidad_dominante
        }
    return diccionario


def set_posiciones(usuario, deporte, diccionario):
    return usuario.posiciones.add(
        *diccionario.get('posiciones')
    ) if deporte.requiere_multiple else usuario.posiciones.add(
        diccionario.get('posiciones')
    )

""" Creación/Modificación de un usuario """
def actualizar_usuario(request, seccion):
    diccionario = get_diccionario(request, seccion)
    email = request.session.get('email')
    try:
        usuario = Usuario.objects.get(email=email)
    except:
        usuario = None
    if seccion == 'r':
        usuario = Usuario.objects.create(
            nombre=diccionario.get('nombre'),
            fnacimiento=diccionario.get('fnacimiento'),
            email=diccionario.get('email'),
            genero=diccionario.get('genero'),
            tipo_deporte=diccionario.get('tipo_deporte'),
            deporte_id=diccionario.get('deporte').id,
            tipo_id=diccionario.get('tipo').id,
            pais_id=diccionario.get('pais').id,
            contrasena_1=diccionario.get('contrasena_1'),
            contrasena_2=diccionario.get('contrasena_2')
        )
        set_posiciones(usuario, diccionario.get('deporte'), diccionario)
    elif seccion == 'db':
        usuario.nombre = diccionario.get('nombre')
        usuario.fnacimiento = diccionario.get('fnacimiento')
        usuario.email = diccionario.get('email')
        usuario.genero = diccionario.get('genero')
        usuario.tipo_deporte = diccionario.get('tipo_deporte')
        usuario.deporte_id = diccionario.get('deporte').id
        usuario.tipo_id = diccionario.get('tipo').id
        usuario.pais_id = diccionario.get('pais').id
        usuario.posiciones.clear()
        set_posiciones(usuario, diccionario.get('deporte'), diccionario)
        usuario.save()
    elif seccion == 'de':
        usuario.telefono = diccionario.get('telefono')
        usuario.ubicacion = diccionario.get('ubicacion')
        usuario.peso = diccionario.get('peso')
        usuario.altura = diccionario.get('altura')
        usuario.nacionalidad = diccionario.get('nacionalidad')
        usuario.eactual = diccionario.get('eactual')
        usuario.extremidad_id = diccionario.get('extremidad').id
        usuario.interesadoen = diccionario.get('interesadoen')
        usuario.save()
    return True if seccion is not '' else False

""" Registro de un usuario """
def registrar_usuario(request):
    actualizar_usuario(request, 'r')
    return HttpResponse('Usuario creado')

"""""""""""""""""""""""""""""""""""""""""""""
PARTE PRIVADA
"""""""""""""""""""""""""""""""""""""""""""""

""" Acceder al perfil del usuario """
def perfil(request):
    if not get_usuario(request):
        return HttpResponseRedirect('/')
    lista_extremidades = Extremidad_dominante.objects.all()
    contexto = global_contexto()
    contexto.update({
        'extremidades': lista_extremidades
    })

    contexto.update(get_usuario(request))
    insertar_redes_contexto(contexto)
    insertar_videos_contexto(contexto)
    insertar_correos_contexto(contexto)
    return render(
        request,
        'sia_sports_agency/perfil.html',
        contexto
    )

""" Inserta en el contexto del perfil las redes sociales """
def insertar_videos_contexto(contexto):
    usuario = contexto.get('usuario')
    lista_videos = Video.objects.filter(
        usuario_id = usuario.id
    )
    contexto.update({'videos': lista_videos})

""" Inserta en el contexto del perfil las redes sociales """
def insertar_redes_contexto(contexto):
    usuario = contexto.get('usuario')
    lista_redes = Red_social.objects.filter(
        usuario_id = usuario.id
    )
    for r in lista_redes:
        nombre = 'red_' + r.codigo
        contexto.update({nombre: r.enlace})

""" Inserta en el contexto del perfil los correos """
def insertar_correos_contexto(contexto):
    usuario = contexto.get('usuario')
    lista_bandeja = Mensaje.objects.filter(
        destinatario_id = usuario.id
    )
    lista_correos_env = Mensaje.objects.filter(
        remitente_id = usuario.id
    )
    contexto.update({
        'bandeja': lista_bandeja,
        'correos_enviados': lista_correos_env
    })

""" Modificación de los datos de un usuario """
@csrf_exempt
def modificar_usuario(request, tipo):
    usuario = get_usuario(request).get('usuario')
    if usuario:
        exito = actualizar_usuario(request, tipo)
        dict = {'exito': exito}
        return HttpResponse(json.dumps(dict), content_type='application/json')
    else:
        return HttpResponseRedirect('/')

""" Modificación de las redes sociales de un usuario """
@csrf_exempt
def actualizar_redes(request):
    usuario = get_usuario(request).get('usuario')
    if usuario:
        #Enlace facebook
        url_facebook = request.POST.get('inputFacebook', '')
        if url_facebook is not '' and usuario is not None:
            crear_red('Facebook', 'FB', url_facebook, usuario)
        #Enlace twitter
        url_twitter = request.POST.get('inputTwitter', '')
        if url_twitter is not '' and usuario is not None:
            crear_red('Twitter', 'TT', url_twitter, usuario)
        #Enlace instagram
        url_instragram = request.POST.get('inputInstagram', '')
        if url_instragram is not '' and usuario is not None:
            crear_red('Instagram', 'IG', url_instragram, usuario)
        #Enlace youtube
        url_youtube = request.POST.get('inputYoutube', '')
        if url_youtube is not '' and usuario is not None:
            crear_red('Youtube', 'YT', url_youtube, usuario)
        dict = {'exito': True}
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

""" Insertar video en el perfil """
def insertar_video(request):
    usuario = get_usuario(request).get('usuario')
    if usuario:
        nombre = request.POST.get('inputNombre')
        video = request.FILES.get('inputFile')
        path = os.path.join(settings.BASE_DIR, settings.BASE_DIR_VIDEO, str(usuario.id))
        fs = FileSystemStorage(
            location=path
        )
        filename = fs.save(video.name, video)
        url_video = os.path.join(
            'users',
            'videos-perfil',
            str(usuario.id),
            filename
        )
        crear_video(nombre, url_video, usuario)
        return HttpResponseRedirect('/perfil/')
    else:
        return HttpResponseRedirect('/')

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
        Video.objects.get(id=id).delete()
        return HttpResponseRedirect('/perfil/')
    else:
        return HttpResponseRedirect('/')

""" Conseguir datos del mensaje """
def get_mensaje(request, id):
    usuario = get_usuario(request).get('usuario')
    dict = {}
    if usuario:
        mensaje = Mensaje.objects.get(id=id)
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
            print('CORREOS: ' + str(correos))
            asunto = request.POST.get("asunto", "")
            print('ASUNTO: ' + asunto)
            cuerpo = request.POST.get("cuerpo", "")
            print('CUERPO: ' + cuerpo)
            lista_correos = [
                c.strip() for c in correos.split(';') if c.strip() != ''
            ]
            print('lista_correos: ' + str(lista_correos))
            for l in lista_correos:
                email_dest = l[l.find("<")+1:l.find(">")] or None
                print('email_dest: ' + email_dest)
                destinatario = Usuario.objects.get(email=email_dest) or None
                if destinatario and email_dest:
                    Mensaje.objects.create(
                        asunto=asunto,
                        cuerpo=cuerpo,
                        remitente_id=usuario.id,
                        destinatario_id = destinatario.id,
                        leido=0,
                    )
            dict = {'exito': True}
        except:
            dict = {'exito': False}
        return HttpResponse(json.dumps(dict), content_type='application/json')
    else:
        return HttpResponseRedirect('/')
