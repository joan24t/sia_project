# Generated by Django 2.2 on 2019-06-16 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sia_sports_agency', '0011_auto_20190615_1812'),
    ]

    operations = [
        migrations.AddField(
            model_name='red_social',
            name='codigo',
            field=models.CharField(default='UK', max_length=5),
        ),
    ]
