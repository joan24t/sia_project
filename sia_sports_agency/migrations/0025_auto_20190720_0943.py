# Generated by Django 2.2 on 2019-07-20 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sia_sports_agency', '0024_auto_20190720_0943'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='img_perfil',
            field=models.CharField(default='users\\img-perfil\\silueta_defecto.png', max_length=150),
        ),
    ]
