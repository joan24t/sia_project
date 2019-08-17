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
    responderCorreo()
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
    $(".busqueda .busqueda-edad").val("14");
    $(".busqueda .busqueda-eactual").val("");
}

/* Submit del de la subida del video */
var triggerSubidaVideo = function(){
    $('#form-subida-video').submit(function(e) {
        var isOk = true;
        var maxSize = 50;
        var size = $('#form-subida-video #customFileVideo')[0].files[0].size / 1024 /1024;
        isOk = maxSize > size;
        if (!isOk){
            $('.toast-error .content').text('El archivo no puede superar los 50 MB.');
            $('.toast-error').toast('show');
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
            location.reload(true);
        },
        error: function(data){
            $('.toast-error .content').text('Error en la subida de la imagen. Intente de nuevo');
            $('.toast-error').toast('show');
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
                $('.toast-error .content').text('Error en la carga del cromo.');
                $('.toast-error').toast('show');
            }
        },error: function(data){
            $('.toast-error .content').text('Error en la carga del cromo.');
            $('.toast-error').toast('show');
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
                $('.toast-error .content').text('Error en la carga del cromo.');
                $('.toast-error').toast('show');
            }
        },error: function(data){
            $('.toast-error .content').text('Error en la carga del cromo.');
            $('.toast-error').toast('show');
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
                var imageData = canvas.toDataURL("image/png");
                guardarCromo(imageData);
                setAcceso();
                //Refrescamos la imagen
                refrescarCromo();
            }
            else if(!data.exito){
                $('.toast-error .content').text('Error en la carga del cromo.');
                $('.toast-error').toast('show');
            }
            mostrarElemento($('.div-cromo'));
        },error: function(data){
            $('.toast-error .content').text('Error en la carga del cromo.');
            $('.toast-error').toast('show');
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
            width: 450,
            height: 700,
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
    });
}
var nuevoCorreo = function(){
    $(".btn-nuevo-correo").on("click", function() {
      var listadoCorreos = $(".destinatarios-nuevo").val();
      var asunto = $(".asunto-nuevo").val();
      var cuerpo = $(".cuerpo-nuevo").val();
      enviarCorreo(listadoCorreos, asunto, cuerpo);
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
                $('.toast-notificacion .content').text('El correo se envió correctamente.');
                $('.toast-notificacion').toast('show');
            }else{
                $('.toast-error .content').text('Error el enviar el correo. Por favor, intente de nuevo.');
                $('.toast-error').toast('show');
            }
    },error: function(data){
            $('.toast-error .content').text('Error el enviar el correo. Por favor, intente de nuevo.');
            $('.toast-error').toast('show');
    }
    });
}

var eliminarCorreo = function(listOriginal){
    var destinatarios = $( ".destinatario" ).val().split( /;\s*/ )
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
            $(".modal-email .destinatario").val(
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
          $(".modal-email .destinatario").val(
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
                    $('.toast-success .content').text('Los datos han sido modificados correctamente.');
                    $('.toast-success').toast('show');
                    cargarCromo('db');
                }else{
                    $('.toast-error .content').text('Ha ocurrido un error en el proceso de guardado de los datos.');
                    $('.toast-error').toast('show');
                }
            },
            error: function(data){
                $('.toast-error .content').text('Ha ocurrido un error en el proceso de guardado de los datos.');
                $('.toast-error').toast('show');
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
                    $('.toast-success .content').text('Los datos han sido modificados correctamente.');
                    $('.toast-success').toast('show');
                }else{
                    $('.toast-error .content').text('Ha ocurrido un error en el proceso de guardado de los datos.');
                    $('.toast-error').toast('show');
                }
            },
            error: function(data){
                $('.toast-error .content').text('Ha ocurrido un error en el proceso de guardado de los datos.');
                $('.toast-error').toast('show');
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
        $('.datosEspecificosForm .enlace-cpresentacion').attr('hidden', '');
        $('.datosEspecificosForm .enlace-curriculum').attr('hidden', '');
        $('.datosEspecificosForm .custom-file').removeAttr('hidden');
        $('.datosEspecificosForm .btn-guardar, .datosEspecificosForm .btn-cancelar').removeAttr('hidden');
    });

    /* Habilitamos el formulario de los datos específicos */
    $(document).on("click", ".datosEspecificosForm .btn-guardar", function (e) {
        e.preventDefault();
        //Disparamos la función de submit
        $('#form-datos-especificos').trigger('submit');
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
        $('.datosEspecificosForm .enlace-cpresentacion').removeAttr('hidden');
        $('.datosEspecificosForm .enlace-curriculum').removeAttr('hidden');
        $('.datosEspecificosForm .custom-file').attr('hidden', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(".datosEspecificosForm .btn-cancelar, .datosEspecificosForm .btn-guardar").attr('hidden', '');
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
                    $('.toast-success .content').text('Los datos han sido modificados correctamente.');
                    $('.toast-success').toast('show');
                    refrescarRedes();
                    cargarCromo('rs');
                }else{
                    $('.toast-error .content').text('Ha ocurrido un error en el proceso de guardado de los datos.');
                    $('.toast-error').toast('show');
                }
            },
            error: function(data){
                $('.toast-error .content').text('Ha ocurrido un error en el proceso de guardado de los datos.');
                $('.toast-error').toast('show');
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
