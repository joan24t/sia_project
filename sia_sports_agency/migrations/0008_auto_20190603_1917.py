# Generated by Django 2.2 on 2019-06-03 17:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sia_sports_agency', '0007_remove_pais_path_icono'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='paises',
        ),
        migrations.AddField(
            model_name='usuario',
            name='pais',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='sia_sports_agency.Pais'),
        ),
    ]
