# Generated by Django 2.2 on 2019-06-03 17:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sia_sports_agency', '0006_auto_20190520_2123'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pais',
            name='path_icono',
        ),
    ]
