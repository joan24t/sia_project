# Generated by Django 2.2 on 2019-07-17 17:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sia_sports_agency', '0020_usuario_ruta_cromo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='ruta_cromo',
        ),
    ]
