from django.shortcuts import render
from django.http import HttpResponse
from .models import Tipo_jugador, Deporte, Posicion

# Create your views here.

def index(request):
    lista_tipo_jugadores = Tipo_jugador.objects.all()
    lista_deportes = Deporte.objects.all()
    lista_posiciones = Posicion.objects.all()
    contexto = {
        'tipo_jugadores': lista_tipo_jugadores,
        'deportes': lista_deportes,
        'posiciones': lista_posiciones
    }
    return render(
        request,
        'sia_sports_agency/index.html',
        contexto
    )

def perfil(request):
    return render(
        request,
        'sia_sports_agency/perfil.html',
        {}
    )

def get_posiciones(request, pk):
    lista_posiciones = ["<option value=\"" + str(posicion.id) + "\">"  + posicion.nombre + '</option>' for posicion in Posicion.objects.filter(deporte_id=pk)]
    return HttpResponse(lista_posiciones)
