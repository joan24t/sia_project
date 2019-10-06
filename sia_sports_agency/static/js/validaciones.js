$(document).ready(function(){
    var strength = {
            0: "Worst ☹",
            1: "Bad ☹",
            2: "Weak ☹",
            3: "Good ☺",
            4: "Strong ☻"
    }

    var password = $('#form-registro #password1');
    var meter = $('#password-strength-meter');
    var text = $('#password-strength-text');

    password.keyup(function() {
        var val = password.val().length;
        var result = 0;
        var nivel = "";
        if (val > 8 && val < 10){
            result = 1;
        } else if (val >= 10 && val < 13){
            result = 2;
        } else if (val >= 13 && val < 15){
            result = 3;
        } else if (val >= 15){
            result = 4;
        }

        // Actualiza el valor del meter
        meter.val(result);
        // Actualiza el indicador
        if(val !== "") {
            text.html("Strength: " +
                "<strong>" +
                strength[result] +
                "</strong>");
        }
        else {
            text.html("");
        }
    });
})

/* Valida que las dos contraseñas en el formulario del registro coincidan */
var validarConcidenciaPasswords = function(){
    var pass1 = $('#form-registro #password1').val();
    var pass2 = $('#form-registro #password2').val();
    if (pass1 === pass2){
        $('#form-registro div.campoConMatchNotif').attr('hidden', '');
        return true;
    }else{
        $('#form-registro div.campoConMatchNotif').removeAttr('hidden');
        return false;
    }

}

/* Valida que la contraseña insertada cumpla unos mínimos de seguridad */
var validarMinimosPassword = function(){
    var pass1 = $('#form-registro #password1').val();
    var valido = true;
    if (pass1 != undefined || pass != null){
        if (pass1.length < 8) {
            $('#form-registro div.campoLongitudNotif').removeAttr('hidden');
            valido = false;
        }
        if (pass1.search(/\d/) == -1) {
            $('#form-registro div.campoMinimoCarNotif').removeAttr('hidden');
            valido = false;
        }
        if (pass1.search(/[a-zA-Z]/) == -1) {
            $('#form-registro div.campoMinimoCarNotif').removeAttr('hidden');
            valido = false;
        }
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (format.test(pass1)) {
            $('#form-registro div.campoCarNoPermNotif').removeAttr('hidden');
            valido = false;
        }
    }else{
        valido = false;
    }
    return valido;
}

/* Valida que los campos obligatorios estén rellenos en el formulario de registro */
var validarCamposVacios = function(){
    var validate = true;
    $( "#form-registro select.campoObligatorio, #form-registro input.campoObligatorio" ).each(function( index ) {
        if($(this).val() === ''){
            if($(this).attr('name') == 'inputPais'){
                $(this).parent().parent().find("div.campoObligatorioNotif").removeAttr('hidden');
            }else{
                $(this).parent().find("div.campoObligatorioNotif").removeAttr('hidden');
            }
            validate = false;
        }
    });
    return validate;
}

var validarFormatoFecha = function(){
    var fecha = $('#form-registro .grupoFechaNacimiento input').val();
    if (fecha.charAt(2) != '/' || fecha.charAt(5) != '/' || fecha.length != 10){
        $("div.campoFormatoNotif").removeAttr('hidden');
        return false;
    }
    return true;
}

var validarCorreo = function(){
    var correo = $('#form-registro #FormControlInputEmail').val();
    var resultado = false;
    $.ajax({
        url: "/comprobar_correo/",
        async: false,
        type: 'POST',
        data: {
            'correo': correo
        },
        success: function(data) {
            if(data.exito){
                if (data.existe){
                    $("div.campoCorreoExisteNotif").removeAttr('hidden');
                }else{
                    resultado = true;
                }
            }
            else{
                $("div.campoCorreoExisteNotif").removeAttr('hidden');
            }
        },error: function(data){
            $("div.campoCorreoExisteNotif").removeAttr('hidden');
        }
    });
    return resultado;
}

/* Se dispara cuando se intenta registrar un nuevo usuario */
var submitRegistro = function(){
    $('#form-registro').submit(function () {
        mostrarElemento($('.loader-reg'));
        $('#form-registro #campoLongitudNotif').attr('hidden', '');
        $("div.campoObligatorioNotif").attr('hidden', '');
        $("div.campoMinimoCarNotif").attr('hidden', '');
        $("div.campoCarNoPermNotif").attr('hidden', '');
        $("div.campoFormatoNotif").attr('hidden', '');

        if (!validarCamposVacios()){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if (!validarFormatoFecha()){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if(!validarConcidenciaPasswords()){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if (!validarMinimosPassword()){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if (!validarCorreo()){
            ocultarElemento($('.loader-reg'));
            return false;
        }
        ocultarElemento($('.loader-reg'));
        return true;
    });
}
