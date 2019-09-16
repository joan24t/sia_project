/*** En el momento en el que todo ha sido cargado ***/
$(document).ready(function(){
    /* Variables que indica la id del video seleccionado */
    var idVideoSeleccionado;
    /* Oculatmos la img del cromo */
    ocultarElemento($('.div-cromo'));

    /* FUNCIONES PARA LOS DATOS BÁSICOS DEL PERFIL*/
    envioDatosBasicos();

    /* FUNCIONES PARA LOS DATOS ESPECÍFICOS DEL PERFIL*/
    envioDatosEspecificos();

    /* FUNCIONES PARA LAS REDES SOCIALES DEL PERFIL*/
    envioRedesSociales();

    /* Funcion que oculta el botón de añadir video si ya hay 4 */
    ocultaAddVideo();
    /* Funcion que muestra la confirmacion de eliminacion de los videos */
    mostrarConfirmacion();
    enviarFormularioEliminacion();

    /* Petición datos mensaje para la ventana de detalle*/
    peticionDatosMensaje();
    /* Petición datos mensaje para la ventana de detalle*/
    responderMensaje();
    /*Autocomplete de correos existentes*/
    autocompleteCorreos();
    /*Respuesta de correo*/
    responderCorreo();
    /*Nuevo correo desde el detalle de un usuario*/
    nuevoCorreoDesdeDetalle();
    /*Nuevo correo*/
    nuevoCorreo();
    /*Cambia de sección en el apartado de mensajes*/
    cambiaSeccion();
    /*Abrir correo desde las notificaciones*/
    abrirDesdeNotificaciones();
    /*Cargar y descargar cromo*/
    cargarCromo('todo');
    /* Comprueba el tamaño del vídeo */
    triggerSubidaVideo();
    /* Dispara el la búsqueda de los cromos */
    consultaCromos(true);
    /*Disparar input de tipo file para la subida de la img del cromo*/
    triggerImgCromo();
    /*Dispara el form del login*/
    triggerLogin();
    /*Cambia la contraseña*/
    cambiarContraseña();
    /* Funcion que pone ivisible los toats cuando se ocultan*/
    $('.toast').on('hidden.bs.toast', function () {
        $(this).attr('hidden', '');
    });
    /*Función que pone visible los toats cuando se muestran*/
    $('.toast').on('show.bs.toast', function () {
        $(this).removeAttr('hidden');
    });
    /*Disparador modal nuevo mensaje*/
    $('#nuevoEmailModalCenter').on('show.bs.modal', function() {
        $(".modal-email .destinatarios-nuevo").val("");
        $(".modal-email .asunto-nuevo").val("");
        $(".modal-email .cuerpo-nuevo").val('');
    });
});

/* Limpiar filtros de la búsqueda */
var limpiarFiltros = function(){
    $(".busqueda .busqueda-tipo").val("");
    $(".busqueda .busqueda-nombre").val("");
    $(".busqueda .busqueda-deporte").val("");
    $(".busqueda .busqueda-genero").val("");
    $(".busqueda .busqueda-pais .filter-option-inner-inner").text("Seleccione un país");
    $(".busqueda .busqueda-posicion .filter-option-inner-inner").text("Selecciona posiciones");
    $(".busqueda .busqueda-edad-ini").val("16");
    $(".busqueda .busqueda-edad-fin").val("90");
    $(".busqueda .busqueda-eactual").val("");
}

var mostrarNotificacionExito = function(cuerpo) {
    $('.toast-success .content').text(cuerpo);
    $('.toast-success').toast('show');
}

var mostrarNotificacionAviso = function(cuerpo) {
    $('.toast-notificacion .content').text(cuerpo);
    $('.toast-notificacion').toast('show');
}

var mostrarNotificacionError = function(cuerpo) {
    $('.toast-error .content').text(cuerpo);
    $('.toast-error').toast('show');
}

/*Cambia la contraseña*/
var cambiarContraseña = function(){
    //Envio de de datos del formulario
    $('#form-cambio-contrasena').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/cambiar_contrasena/',
            async: false,
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data) {
                if(data.exito){
                    mostrarNotificacionExito('La contraseña se ha modificado correctamente.');
                    $('#cambioContraModalCenter').modal('toggle');
                }else{
                    mostrarNotificacionError('Error al intentar cambiar la contraseña. Intente de nuevo.');
                }
            },
            error: function(data){
                mostrarNotificacionError('Error al intentar cambiar la contraseña. Intente de nuevo.');
            }
        });
    });
}

/* Submit del de la subida del video */
var triggerLogin = function(){
    //Envio de de datos del formulario
    $('#form-login').submit(function(e) {
        mostrarElemento($('.loader-inicio'));
        e.preventDefault();
        $.ajax({
            url: '/login/',
            async: false,
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data) {
                ocultarElemento($('.loader-inicio'));
                if(data.errorLogin){
                    $('#form-login .correo-invalido').removeAttr('hidden');
                }else if (data.errorActivacion){
                    $('#activacionModalCenter #reactivar-email').val(
                        $('#form-login .emailInput').val()
                    );
                    $('#activacionModalCenter #reactivar-password').val(
                        $('#form-login .passwordInput').val()
                    );
                    $('#activacionModalCenter').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                }else{
                    window.location.href = '/perfil';
                }
            }
        });
    });
}

/* Submit del de la subida del video */
var triggerSubidaVideo = function(){
    $('#form-subida-video').submit(function(e) {
        var isOk = true;
        var maxSize = 50;
        var size = $('#form-subida-video #customFileVideo')[0].files[0].size / 1024 /1024;
        isOk = maxSize > size;
        if (!isOk){
            mostrarNotificacionError('El archivo no puede superar los 50 MB.');
        }
        return isOk;
    });
}

/* Abrir modal subida img cromo */
var triggerImgCromo = function(){
    $(".cambiar-img-cromo").on("click", function() {
        $("#customFileImgCromo").click();
    });
}
var enviarImgCromo = function(){
    $('.cromo-img').attr('hidden', '');
    var form = $('#form-subida-img')[0];
    var data = new FormData(form);
    $.ajax({
        url: "/subir_img_cromo/",
        enctype: 'multipart/form-data',
        async: false,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        type: 'POST',
        success: function(data) {
            $(".img-foto").attr("src", data.ruta_cromo);
            cargarCromo('todo');
            $('#settingsModalCenter').modal('toggle');
            if(data.error){
                mostrarNotificacionError('Error en la subida de la imagen. Intente de nuevo');
                mostrarElemento($('.div-cromo'));
            }
        },
        error: function(data){
            mostrarNotificacionError('Error en la subida de la imagen. Intente de nuevo');
            mostrarElemento($('.div-cromo'));
        }
    });
}
var refrescarCromo = function(){
    ruta = $(".cromo-img").attr("src");
    $(".cromo-img").attr("src", ruta);
}
var guardarCromo = function(imageData){
    $.ajax({
        url: "/guardar_cromo/",
        async:false,
        type: 'POST',
        data: {
            'imgBase64': imageData,
        },success: function(data) {
            if(!data.exito){
                mostrarNotificacionError('Error en la carga del cromo.');
            }
            setTimeout(function(){
                 refrescarCromo();
                 $('.cromo-img').removeAttr('hidden');
            }, 3000);
        },error: function(data){
            mostrarNotificacionError('Error en la carga del cromo.');
        }
    });
}
var setAcceso = function(){
    $.ajax({
        url: "/set_acceso/",
        type: 'POST',
        async:false,
        success: function(data) {
            if(!data.exito){
                mostrarNotificacionError('Error en la carga del cromo.');
            }
        },error: function(data){
            mostrarNotificacionError('Error en la carga del cromo.');
        }
    });
}
/* Se comprueba si no hay cromo o si se accede por primera vez para cargar
el cromo */
var primerAcceso = function(canvas){
    $.ajax({
        url: "/primer_acceso/",
        async:false,
        success: function(data) {
            if(data.exito && (data.primer_acceso == 1 || data.vacio)){
                $('.cromo-img').attr('hidden', '');
                var imageData = canvas.toDataURL("image/png");
                guardarCromo(imageData);
                setAcceso();
            }
            else if(!data.exito){
                mostrarNotificacionError('Error en la carga del cromo.');
            }
            mostrarElemento($('.div-cromo'));
        },error: function(data){
            mostrarNotificacionError('Error en la carga del cromo.');
        }
    });
}
var cargarCromo = function(datos) {
    if(window.location.pathname === "/perfil/"){
        var element = $(".cromo");
        if (datos == 'rs'){
            establecerRedesCromo();
        }
        else if (datos == 'db'){
            establecerDatosCromo();
        }
        var getCanvas;
        html2canvas(element, {
            width: 385,
            height: 575,
            onrendered: function (canvas) {
                getCanvas = canvas;
                primerAcceso(getCanvas);
            }
        });
    }
}
var mostrarElemento = function(elemento){
    elemento.removeAttr("hidden");
}
var ocultarElemento = function(elemento) {
    elemento.attr("hidden", "");
}

var abrirDesdeNotificaciones = function() {
    $(".lista-msg").on("click", function() {
        hideOrShowTabs('me');
        verCorreo($(this).attr('id'));
    });
}

var cambiaSeccion = function(){
    $(".btn-bandeja-entrada").on("click", function() {
        $(".bandeja-entrada-section").removeAttr('hidden');
        $(".btn-bandeja-entrada").addClass('active');
        $(".elementos-enviados-section").attr('hidden', '');
        $(".btn-elementos-enviados").removeClass('active');
    });
    $(".btn-elementos-enviados").on("click", function() {
      $(".bandeja-entrada-section").attr('hidden', '');
      $(".btn-bandeja-entrada").removeClass('active');
      $(".elementos-enviados-section").removeAttr('hidden');
      $(".btn-elementos-enviados").addClass('active');
    });
}

var responderCorreo = function(){
    $(".btn-responder-correo").on("click", function() {
      var listadoCorreos = $(".destinatarios-res").val();
      var asunto = $(".asunto-res").val();
      var cuerpo = $(".cuerpo-res").val();
      enviarCorreo(listadoCorreos, asunto, cuerpo);
      $('#emailModalCenter').modal('toggle');
    });
}
var nuevoCorreo = function(){
    $("#nuevoEmailModalCenter .btn-nuevo-correo").on("click", function() {
      var listadoCorreos = $(".destinatarios-nuevo").val();
      var asunto = $(".asunto-nuevo").val();
      var cuerpo = $(".cuerpo-nuevo").val();
      enviarCorreo(listadoCorreos, asunto, cuerpo);
      $('#nuevoEmailModalCenter').modal('toggle');
    });
}

var nuevoCorreoDesdeDetalle = function(){
    $("#detalleUsuarioModal .btn-nuevo-correo").on("click", function() {
        var destinatario = $('#detalleUsuarioModal #detalleNombre').text() + " <"+ $('#detalleUsuarioModal #detalleEmail').text() + ">;"
        $(".destinatarios-nuevo").attr('disabled', true);
        $('#nuevoEmailModalCenter').modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#nuevoEmailModalCenter .destinatario").val(destinatario);
    });
}

var enviarCorreo = function(listadoCorreos, asunto, cuerpo){
    $.ajax({
        url: "/enviar_correo/",
        type: 'POST',
        async:false,
        dataType: 'json',
        data: {
            'lista_correos': listadoCorreos,
            'asunto': asunto,
            'cuerpo': cuerpo
    },success: function(data) {
            //Notificación guardado
            if(data.exito){
                mostrarNotificacionAviso('El correo se envió correctamente.');
            }else{
                mostrarNotificacionError('Error el enviar el correo. Por favor, intente de nuevo.');
            }
    },error: function(data){
            mostrarNotificacionError('Error el enviar el correo. Por favor, intente de nuevo.');
    }
    });
}

var eliminarCorreo = function(listOriginal){
    var destinatarios = $("#nuevoEmailModalCenter .destinatario, #emailModalCenter .destinatario").val().split( /;\s*/ )
                         .filter(x => listOriginal.includes(x));
    var difference = listOriginal
                 .filter(x => !destinatarios.includes(x));
    return difference;
};

var autocompleteCorreos = function(){
    $.ajax({
      url: "/get_correos/",
      success: function(data) {
          var listOriginal = data.correos;
          $( ".destinatario" ).autocomplete({
            source: function( request, response ) {
                var listaDinamica = eliminarCorreo(listOriginal);
                 response( $.ui.autocomplete.filter(
                     listaDinamica, request.term.split( /;\s*/ ).pop() ) );
             },
             focus: function() {
                 return false;
             },
            select: function( event, ui ) {
                var terms = this.value.split( /;\s*/ );
                terms.pop();
                terms.push( ui.item.value );
                terms.push( "" );
                this.value = terms.join( "; " );
                return false;
            },
          });
      }
    });
};

var responderMensaje = function(){
    $(".mail-responder").on("click", function() {
      var id = $(this).attr('id');
      $.ajax({
        url: "/get_mensaje/" + id,
        success: function(data) {
            $(".modal-email .btn-responder-correo").removeAttr('hidden');
            $('.modal-email .destinatarios-res').attr('disabled', true);
            $('.modal-email .asunto-res').attr('disabled', true);
            $('.modal-email .cuerpo-res').removeAttr('disabled');
            $('#lista-destinatarios').val(
                data.remitente_nombre + " <"+ data.remitente + ">"
            );
            $(".modal-email .asunto-res").val("Re: " + data.asunto);
            $(".modal-email .cuerpo-res").val(
                '\n' +
                "-----------------------------------------" + '\n' +
                "De: " + data.remitente_nombre + " <"+ data.remitente + ">" + '\n' +
                "Para: " + data.destinatario_nombre + " <"+ data.destinatario + ">" +'\n' +
                "Fecha: " + data.fecha + '\n' +
                data.mensaje
            );
        }
      });
    });
};

var verCorreo = function(id){
    $.ajax({
      url: "/get_mensaje/" + id,
      success: function(data) {
          $(".modal-email .btn-responder-correo").attr('hidden', '');
          $('.modal-email .destinatarios-res').attr('disabled', true);
          $('.modal-email .asunto-res').attr('disabled', true);
          $('.modal-email .cuerpo-res').attr('disabled', true);
          $('#lista-destinatarios').val(
              data.remitente_nombre + " <"+ data.remitente + ">"
          );
          $(".modal-email .asunto-res").val(data.asunto);
          $(".modal-email .cuerpo-res").val(data.mensaje);
          actualizarContadorCorreos(id);
      }
    });
};

/* Actualiza el contador de los mensajes*/
var actualizarContadorCorreos = function(id){
    var selectorCorreo = "#correo-" + id;
    $(selectorCorreo).removeClass("mensaje-no-leido");
    var cadena = $('.btn-bandeja-entrada a').text();
    var ini = cadena.indexOf('(') + 1;
    var fin = cadena.indexOf(')');
    var contador = parseInt(cadena.substring(ini, fin));
    contador--;
    $('.btn-bandeja-entrada a').text('Bandeja de entrada (' + contador + ')');
    $('.badge-messages').text(contador);
    $('#mensajes-info-' + id).remove();
    $('#hr-msg-' + id).remove();
    $('.header-msg-info span').html("Tiene <strong>" + contador + "</strong> mensajes nuevos.");
};

var peticionDatosMensaje = function(){
    $(".mail-ver").on("click", function() {
        var id = $(this).attr('id');
        verCorreo(id);
    });
};
var mostrarConfirmacion = function(){
    $('.video-gallery .option-delete').on('click', function(e) {
        idVideoSeleccionado = $(this).attr('id');
        $('#confirmModalCenter').modal({
            backdrop: 'static',
            keyboard: false
        });
    });
};

var enviarFormularioEliminacion = function(){
    $('#confirmModalCenter .btn-primary').on('click', function(e) {
        var videoAEliminar = '.form-eliminar-video-' + String(idVideoSeleccionado)
        var form = $(videoAEliminar);
        form.trigger('submit');
    });
};

var ocultaAddVideo = function(){
    if($(".video-gallery .video-list").children().length >= 5){
        $(".videos").attr('hidden', '');
    }
}

var envioDatosBasicos = function(){
    //Envio de de datos del formulario
    $('#form-datos-basicos').submit(function(e) {
        ocultarElemento($('.div-cromo'));
        e.preventDefault();
        $.ajax({
            url: '/modificar_usuario/db/',
            async: false,
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data) {
                //Notificación guardado
                if(data.exito){
                    mostrarNotificacionExito('Los datos han sido modificados correctamente.');
                    cargarCromo('db');
                }else{
                    mostrarNotificacionError('Ha ocurrido un error en el proceso de guardado de los datos.');
                }
            },
            error: function(data){
                mostrarNotificacionError('Ha ocurrido un error en el proceso de guardado de los datos.');
            }
        });
    });
    /* Deshabilitamos todos los inputs de los datos basicos*/
    $('.datosBasicosForm :input:not(.btn-editar, .selectpicker)').attr('disabled', '');
    //Deshabilitamos los selectpicker a parte
    $('.datosBasicosForm .selectpicker').attr('disabled', true);

    /* Deshabilitamos el formulario de los datos básicos */
    $(document).on("click", ".datosBasicosForm .btn-editar", function (e) {
        e.preventDefault();
        //Habilitamos todos los inputs
        $('.datosBasicosForm :input').removeAttr('disabled');
        //Habilitamos los selectpicker
        $('.datosBasicosForm .dropdown-toggle').removeClass('disabled');
        //Ocultamos el botón de editar y mostramos el botón de guardar
        $(this).attr('hidden', '');
        $('.datosBasicosForm .btn-guardar, .datosBasicosForm .btn-cancelar').removeAttr('hidden');
    });

    /* Habilitamos el formulario de los datos básicos */
    $(document).on("click", ".datosBasicosForm .btn-guardar", function (e) {
        e.preventDefault();
        //Disparamos la función de submit
        $('#form-datos-basicos').trigger('submit');
        habilitarFormulario(e);
    });
    $(document).on("click", ".datosBasicosForm .btn-cancelar", function (e) {
        e.preventDefault();
        habilitarFormulario(e);
        location.reload(true);
    });

    var habilitarFormulario = function(e) {
        //Deshabilitamos todos los inputs y los select picker
        $('.datosBasicosForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(".datosBasicosForm .btn-cancelar, .datosBasicosForm .btn-guardar").attr('hidden', '');
        $('.datosBasicosForm .btn-editar').removeAttr('hidden');
    }
}

/* Guarda datos específicos */
var envioDatosEspecificos = function(){
    //Envio de de datos del formulario
    $('#form-datos-especificos').submit(function(e) {
        e.preventDefault();
        var form = $('#form-datos-especificos')[0];
        var data = new FormData(form);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/modificar_usuario/de/",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function(data) {
                //Notificación guardado
                if(data.exito){
                    mostrarNotificacionExito('Los datos han sido modificados correctamente.');
                }else{
                    mostrarNotificacionError('Ha ocurrido un error en el proceso de guardado de los datos.');
                }
            },
            error: function(data){
                mostrarNotificacionError('Ha ocurrido un error en el proceso de guardado de los datos.');
            }
        });
    });

    /* Deshabilitamos el formulario de los datos específicos menos el botón de editar */
    $('.datosEspecificosForm :input:not(.btn-editar)').attr('disabled', '');

    /* Habilitamos el formulario de los datos específicos cuando pulsamos en editar*/
    $(document).on("click", ".datosEspecificosForm .btn-editar", function (e) {
        e.preventDefault();
        //Habilitamos todos los inputs
        $('.datosEspecificosForm :input').removeAttr('disabled');
        //Ocultamos el botón de editar y mostramos el botón de guardar
        $(this).attr('hidden', '');
        $('.datosEspecificosForm .cpresentacion-elimina, .datosEspecificosForm .curriculum-elimina').removeAttr('hidden');
        $('.datosEspecificosForm .btn-guardar, .datosEspecificosForm .btn-cancelar').removeAttr('hidden');
    });

    /* Eliminamos el curriculum y la carta si se pulsa sobre el icono de la papelera*/
    $(document).on("click", ".datosEspecificosForm .cpresentacion-elimina", function (e) {
        e.preventDefault();
        $('#cpresentacion #customFileCarta').val('');
        $('#cpresentacion .custom-file-label').text('Seleccionar Archivo');
        $('#emptyFileCarta').val('1');
    });
    $(document).on("click", ".datosEspecificosForm .curriculum-elimina", function (e) {
        e.preventDefault();
        $('#curriculum #customFileCurriculum').val('');
        $('#curriculum .custom-file-label').text('Seleccionar Archivo');
        $('#emptyCurriculum').val('1');
    });

    /* Habilitamos el formulario de los datos específicos */
    $(document).on("click", ".datosEspecificosForm .btn-guardar", function (e) {
        e.preventDefault();
        //Disparamos la función de submit
        $('#form-datos-especificos').trigger('submit');
        $('#emptyFileCarta').val('0');
        $('#emptyCurriculum').val('0');
        habilitarFormulario(e);
    });
    $(document).on("click", ".datosEspecificosForm .btn-cancelar", function (e) {
        e.preventDefault();
        habilitarFormulario(e);
        location.reload(true);
    });

    var habilitarFormulario = function(e) {
        //Deshabilitamos todos los inputs y los select picker
        $('.datosEspecificosForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(".datosEspecificosForm .btn-cancelar, .datosEspecificosForm .btn-guardar").attr('hidden', '');
        $('.datosEspecificosForm .cpresentacion-elimina, .datosEspecificosForm .curriculum-elimina').attr('hidden', '');
        $('.datosEspecificosForm .btn-editar').removeAttr('hidden');
    }
}

var envioRedesSociales = function(){
    $('.datosRedesForm :input:not(.btn-editar)').attr('disabled', '');

    //Envio de de datos del formulario
    $('#form-redes-sociales').submit(function(e) {
        ocultarElemento($('.div-cromo'));
        e.preventDefault();
        $.ajax({
            url: '/actualizar_redes/',
            type: 'POST',
            async: false,
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data) {
                //Notificación guardado
                if(data.exito){
                    mostrarNotificacionExito('Los datos han sido modificados correctamente.');
                    refrescarRedes();
                    cargarCromo('rs');
                }else{
                    mostrarNotificacionError('Ha ocurrido un error en el proceso de guardado de los datos.');
                }
            },
            error: function(data){
                mostrarNotificacionError('Ha ocurrido un error en el proceso de guardado de los datos.');
            }
        });
    });

    /* Refresacmos las redes al cambiarse */
    var refrescarRedes = function(){
        ruta_yt = $("#form-redes-sociales .enlace-youtube").val();
        ruta_ig = $("#form-redes-sociales .enlace-insta").val();
        ruta_tt = $("#form-redes-sociales .enlace-twitter").val();
        ruta_fb = $("#form-redes-sociales .enlace-facebook").val();
        $(".fb-ic").attr("href", ruta_fb);
        $(".tw-ic").attr("href", ruta_tt);
        $(".ins-ic").attr("href", ruta_ig);
        $(".yt-ic").attr("href", ruta_yt);
    };

    /* Deshabilitamos el formulario de las redes de sociales */
    $(document).on("click", ".datosRedesForm .btn-editar", function (e) {
        e.preventDefault();
        //Habilitamos todos los inputs
        $('.datosRedesForm :input').removeAttr('disabled');
        //Ocultamos el botón de editar y mostramos el botón de guardar
        $(this).attr('hidden', '');
        $('.datosRedesForm .btn-guardar, .datosRedesForm .btn-cancelar').removeAttr('hidden');
    });

    /* Habilitamos el formulario de los datos específicos */
    $(document).on("click", ".datosRedesForm .btn-guardar", function (e) {
        e.preventDefault();
        //Disparamos la función de submit
        $('#form-redes-sociales').trigger('submit');
        habilitarFormulario(e);
    });
    $(document).on("click", ".datosRedesForm .btn-cancelar", function (e) {
        e.preventDefault();
        habilitarFormulario(e);
        location.reload(true);
    });

    var habilitarFormulario = function(e) {
        //Deshabilitamos todos los inputs y los select picker
        $('.datosRedesForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(".datosRedesForm .btn-cancelar, .datosRedesForm .btn-guardar").attr('hidden', '');
        $('.datosRedesForm .btn-editar').removeAttr('hidden');
    }
}
