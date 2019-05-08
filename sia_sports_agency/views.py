from django.shortcuts import render

# Create your views here.

def index(request):
    return render(
        request,
        'sia_sports_agency/index.html',
        {}
    )

def perfil(request):
    return render(
        request,
        'sia_sports_agency/perfil.html',
        {}
    )
