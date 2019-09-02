"""Admin URL Configuration"""

from django.contrib import admin
from django.urls import path
from sia_sports_agency import views
from django.conf.urls import url, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('sia_sports_agency.urls')),
    path('i18n/', include('django.conf.urls.i18n')),
]
