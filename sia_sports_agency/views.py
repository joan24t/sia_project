from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from .models import Tipo_jugador, Deporte, Posicion, Pais, Usuario, Extremidad_dominante
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
import json

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
        usuario = Usuario.objects.get(email=email)
    except Usuario.DoesNotExist:
        usuario = None
    return usuario

""" Comprueba existe el usuario en la sesión """
def get_usuario(request):
    email = request.session.get('email')
    if email:
        usuario = Usuario.objects.get(email=email)
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
    return render(
        request,
        'sia_sports_agency/perfil.html',
        contexto
    )

""" Consigue las posiciones según el códgo del deporte """
def get_posiciones(request, cod):
    deporte = Deporte.objects.get(codigo=cod)
    lista_posiciones = []
    if request.GET.get('edit') == 0:
        lista_posiciones = [
            "<option value=\"" + str(posicion.codigo) + "\">"  + posicion.nombre + '</option>'
            for posicion
            in Posicion.objects.filter(deporte=deporte.id)
        ]
    else:
        usuario = get_usuario(request).get('usuario')
        for posicion in Posicion.objects.filter(deporte=deporte.id):
            if posicion in usuario.posiciones.all():
                lista_posiciones.append("<option value=\"" + str(posicion.codigo) + "\" selected>"  + posicion.nombre + "</option>")
            else:
                lista_posiciones.append("<option value=\"" + str(posicion.codigo) + "\">"  + posicion.nombre + "</option>")
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
    deporte = Deporte.objects.get(codigo=str(request.POST.get('inputDeporte')))
    tipo_jugador = Tipo_jugador.objects.get(codigo=str(request.POST.get('inputTipoUsuario')))
    pais = Pais.objects.get(codigo=str(request.POST.get('inputPais')))
    posiciones = (
        Posicion.objects.get(codigo=str(request.POST.get('inputPosicion')))
        if not deporte.requiere_multiple
        else Posicion.objects.filter(codigo__in=request.POST.getlist('inputPosicionMulti'))
    )
    if seccion == 'r' or 'db':
        diccionario =  {
            'nombre': request.POST.get('inputNombre'),
            'fnacimiento': change_format(request.POST.get('inputNacimiento')),
            'email': request.POST.get('inputEmail'),
            'genero': request.POST.get('inputSexo'),
            'tipo_deporte': request.POST.get('inputTipoDeporte'),
            'deporte_id': deporte.id,
            'tipo_id': tipo_jugador.id,
            'pais_id': pais.id,
            'posiciones': posiciones
        }
        if seccion == 'r':
            diccionario.update({
                'contrasena_1': make_password(request.GET.get('inputPassword1')),
                'contrasena_2': make_password(request.GET.get('inputPassword2'))
            })
        return diccionario

""" Creación/Modificación de un usuario """
def actualizar_usuario(request, seccion):
    diccionario = get_diccionario(request, seccion)
    if seccion == 'r':
        usuario = Usuario.objects.create(
            nombre=diccionario.get('nombre'),
            fnacimiento=diccionario.get('fnacimiento'),
            email=diccionario.get('email'),
            genero=diccionario.get('genero'),
            tipo_deporte=diccionario.get('tipo_deporte'),
            deporte_id=diccionario.get('deporte_id'),
            tipo_id=diccionario.get('tipo_id'),
            pais_id=diccionario.get('pais_id'),
            contrasena_1=diccionario.get('contrasena_1'),
            contrasena_2=diccionario.get('contrasena_2')
        )
    elif seccion == 'db':
        email = request.session.get('email')
        usuario = Usuario.objects.get(email=email)
        usuario.nombre = diccionario.get('nombre')
        usuario.fnacimiento = diccionario.get('fnacimiento')
        usuario.email = diccionario.get('email')
        usuario.genero = diccionario.get('genero')
        usuario.tipo_deporte = diccionario.get('tipo_deporte')
        usuario.deporte_id = diccionario.get('deporte_id')
        usuario.tipo_id = diccionario.get('tipo_id')
        usuario.pais_id = diccionario.get('pais_id')
        usuario.save()
    usuario.posiciones.clear()
    usuario.posiciones.add(*diccionario.get('posiciones'))

""" Registro de un usuario """
def registrar_usuario(request):
    actualizar_usuario(request, 'r')
    return HttpResponse('Usuario creado')

""" Modificación de los datos básicos de un usuario """
@csrf_exempt
def usuario_modificar_db(request):
    actualizar_usuario(request, 'db')
    dict = {'exito': True}
    return HttpResponse(json.dumps(dict), content_type='application/json')

""" Modificación de los datos especificos de un usuario """
def usuario_modificar_de(request):
    actualizar_usuario(request, 'de')

""" Modificación de las redes sociales de un usuario """
def usuario_modificar_rs(request):
    actualizar_usuario(request, 'rs')
