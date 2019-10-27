from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import six
from .models import Usuario

class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, usuario, timestamp):
        return (
            six.text_type(usuario.id) + six.text_type(timestamp) +
            six.text_type(usuario.es_activo)
        )
account_activation_token = TokenGenerator()
