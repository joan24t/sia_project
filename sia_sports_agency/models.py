from django.db import models

GENDER_CHOICES = (
    ('Select one', 'Select one'),
    ('Male', 'Male'),
    ('Female', 'Female'),
)

class User(models.Model):

    # Attributes
    name = models.CharField(max_length=100)
    surnames = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    gender = models.CharField(
        max_length=2,
        choices=GENDER_CHOICES,
        default='Select one',
    )
    contact_phone = models.IntegerField()
    description = models.TextField(max_length=254)
