from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from .models import Tipo_jugador, Deporte, Posicion, Pais, Usuario, Extremidad_dominante
from django.contrib.auth.hashers import make_password

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
    return HttpResponseRedirect('/')

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
    lista_posiciones = ["<option value=\"" + str(posicion.codigo) + "\">"  + posicion.nombre + '</option>' for posicion in Posicion.objects.filter(deporte=deporte.id)]
    return HttpResponse(lista_posiciones)

""" Cambia el formato de la fecha a YYYY-MM-DD """
def change_format(fecha):
    return fecha[6:] + "-" + fecha[3:5] + "-" + fecha[:2]

""" Creación de un usuario """
def usuario_crear(request):
    deporte = Deporte.objects.get(codigo=str(request.POST.get('inputDeporte')))
    tipo_jugador = Tipo_jugador.objects.get(codigo=str(request.POST.get('inputTipoUsuario')))
    pais = Pais.objects.get(codigo=str(request.POST.get('inputPais')))

    posicion = Posicion.objects.get(codigo=str(request.POST.get('inputPosicion')))
    print('Password ' + request.POST.get('inputPassword2'))
    usuario = Usuario.objects.create(
        nombre=request.POST.get('inputNombre'),
        fnacimiento=change_format(request.POST.get('inputNacimiento')),
        email=request.POST.get('inputEmail'),
        genero=request.POST.get('inputSexo'),
        tipo_deporte=request.POST.get('inputTipoDeporte'),
        deporte_id=deporte.id,
        tipo_id=tipo_jugador.id,
        pais_id=pais.id,
        posicion_id=posicion.id,
        contrasena_1=make_password(request.POST.get('inputPassword1')),
        contrasena_2=make_password(request.POST.get('inputPassword2'))
    )
    return HttpResponse('Usuario creado')
