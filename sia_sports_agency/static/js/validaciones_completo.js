$(document).ready(function(){
    var password_registro = $('#form-registro #password1');
    var password_cambio = $('#form-cambio-contrasena #password1');
    var password_cambio_ext = $('#form-cambio-contrasena-ext #password1');
    password_registro.keyup(function() {
        establecerMeter(password_registro);
    });
    password_cambio.keyup(function() {
        establecerMeter(password_cambio);
    });
    password_cambio_ext.keyup(function() {
        establecerMeter(password_cambio_ext);
    });
})

/* Establece los valores al meter */
var establecerMeter = function(password){
    var meter = $('meter#password-strength-meter');
    var text = $('div#password-strength-text');
    var val = password.val().length;
    var strength = {
            0: "Worst ☹",
            1: "Bad ☹",
            2: "Weak ☹",
            3: "Good ☺",
            4: "Strong ☻"
    }
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
}

/* Valida que las dos contraseñas en el formulario del registro coincidan */
var validarConcidenciaPasswords = function(pass1, pass2){
    if (pass1 === pass2){
        $('div.campoConMatchNotif').attr('hidden', '');
        return true;
    }else{
        $('div.campoConMatchNotif').removeAttr('hidden');
        return false;
    }

}

//Validamos que los documentos sean solo de tipo pdf
var validarFormatoDocs = function(){
    var curriculum = $('#customFileCurriculum')[0].files;
    var cpresentacion = $('#customFileCarta')[0].files;
    var res = true;
    if(curriculum.length > 0 && /\.(pdf)$/i.test(curriculum[0].name) === false){
        mostrarNotificacionError('El curriculum debe ser en formato pdf');
        res = false;
    }
    if(cpresentacion.length > 0 && /\.(pdf)$/i.test(cpresentacion[0].name) === false){
        mostrarNotificacionError('La carta de presentación debe ser en formato pdf');
        res = false;
    }
    return res;
}

/* Valida que la contraseña insertada cumpla unos mínimos de seguridad */
var validarMinimosPassword = function(pass1){
    var valido = true;
    if (pass1 != undefined){
        if (pass1.length < 8) {
            $('div.campoLongitudNotif').removeAttr('hidden');
            valido = false;
        }
        if (pass1.search(/\d/) == -1) {
            $('div.campoMinimoCarNotif').removeAttr('hidden');
            valido = false;
        }
        if (pass1.search(/[a-zA-Z]/) == -1) {
            $('div.campoMinimoCarNotif').removeAttr('hidden');
            valido = false;
        }
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (format.test(pass1)) {
            $('div.campoCarNoPermNotif').removeAttr('hidden');
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
    var fecha = $('#form-registro .grupoFechaNacimiento input');
    var fecha_formateada = fecha.val();
    if (!fecha.is(":hidden") && (fecha_formateada.charAt(2) != '/' || fecha_formateada.charAt(5) != '/' || fecha_formateada.length != 10)){
        $("div.campoFormatoNotif").removeAttr('hidden');
        return false;
    }
    return true;
}
var validarEdad = function(){
    var fecha = $('#form-registro .grupoFechaNacimiento input');
    var hoy = new Date();
    var fnacimiento = fecha.val();
    var edad = hoy.getFullYear() - parseInt(fnacimiento.substring(6,10));
    var dia_fnacimiento = fnacimiento.substring(0,2);
    var mes_fnacimiento = fnacimiento.substring(3,5);
    var m = (hoy.getMonth() + 1) - parseInt(mes_fnacimiento);
    if (m < 0 || (m === 0 && hoy.getDate() < parseInt(dia_fnacimiento))) {
        edad--;
    }
    if (edad < 16){
        $("div.campoMayor16Notif").removeAttr('hidden');
        return false;
    }
    return true;
}

var validarPolitica = function(){
    var aceptada = $('#aceptacionPolitica').is(":checked");
    var res = true;
    if (!aceptada){
        $("div.campoPoliticaObl").removeAttr('hidden');
        res = false;
    }
    return res;
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

//Oculta las notificaciones de validación de campos
var ocultarValidaciones = function(){
    $('div.campoLongitudNotif').attr('hidden', '');
    $("div.campoObligatorioNotif").attr('hidden', '');
    $("div.campoMinimoCarNotif").attr('hidden', '');
    $("div.campoCarNoPermNotif").attr('hidden', '');
    $("div.campoFormatoNotif").attr('hidden', '');
    $("div.campoConMatchNotif").attr('hidden', '');
    $("div.campoPoliticaObl").attr('hidden', '');
    $("div.campoMayor16Notif").attr('hidden', '');
}

/* Se dispara cuando se intenta registrar un nuevo usuario */
var submitRegistro = function(){
    $('#form-registro').submit(function () {
        mostrarElemento($('.loader-reg'));
        ocultarValidaciones();
        var pass1 = $('#form-registro #password1').val();
        var pass2 = $('#form-registro #password2').val();
        if (!validarCamposVacios()){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if (!validarFormatoFecha()){
            ocultarElemento($('.loader-reg'));
            return false;
        }else if(!validarEdad()){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if(!validarConcidenciaPasswords(pass1, pass2)){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if (!validarMinimosPassword(pass1)){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if (!validarCorreo()){
            ocultarElemento($('.loader-reg'));
            return false;
        }else if (!validarPolitica()){
            ocultarElemento($('.loader-reg'));
            return false;
        }
        ocultarElemento($('.loader-reg'));
        return true;
    });
}

/* Se dispara cuando se intenta registrar un nuevo usuario */
var submitCambioContrasena = function(){
    $('#form-cambio-contrasena-ext').submit(function () {
        mostrarElemento($('.loader-reg'));
        ocultarValidaciones();
        var pass1 = $('#form-cambio-contrasena-ext #password1').val();
        var pass2 = $('#form-cambio-contrasena-ext #password2').val();
        if(!validarConcidenciaPasswords(pass1, pass2)){
            ocultarElemento($('.loader-reg'));
            return false;
        } else if (!validarMinimosPassword(pass1)){
            ocultarElemento($('.loader-reg'));
            return false;
        }
        ocultarElemento($('.loader-reg'));
        return true;
    });
}

var validarCamposVideo = function(){
    var res = true;
    var nombre_video = $('#form-subida-video #inputNombre').val();
    var video = $('#customFileVideo')[0].files;
    if(video.length <= 0 || nombre_video === ''){
        $('#form-subida-video div.campoObligarorioNotif').removeAttr('hidden');
        res = false;
    }
    return res;
}
var validarFormatoVideo = function(){
    var res = true;
    var video = $('#customFileVideo')[0].files;
    if(video.length > 0 && /\.(mp4|mov|m4v|3gp)$/i.test(video[0].name) === false){
        $('#form-subida-video div.campoFormatoVideoNotif').removeAttr('hidden');
        res = false;
    }
    return res;
}
