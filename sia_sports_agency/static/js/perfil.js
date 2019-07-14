/*** En el momento en el que todo ha sido cargado ***/
$(document).ready(function(){
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
        $(".modal-email .destinatario").val("");
        $(".modal-email .asunto").val("");
        $(".modal-email .mensaje").val('');
    });
});

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
        dataType: 'json',
        data: {
            'lista_correos': listadoCorreos,
            'asunto': asunto,
            'cuerpo': cuerpo
    },
        success: function(data) {
            //Notificación guardado
            if(data.exito){
                $('.toast-correo-enviado').toast('show');
            }else{
                $('.toast-correo-error').toast('show');
            }
    },
        error: function(data){
            $('.toast-correo-error').toast('show');
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

var peticionDatosMensaje = function(){
    $(".mail-ver").on("click", function() {
      var id = $(this).attr('id');
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
        }
      });
    });
};

var mostrarConfirmacion = function(){
    $('.video-gallery .option-delete').on('click', function(e) {
        $('#confirmModalCenter').modal({
            backdrop: 'static',
            keyboard: false
        });
    });
};

var enviarFormularioEliminacion = function(){
    $('#confirmModalCenter .btn-primary').on('click', function(e) {
        var form = $('.form-eliminar-video');
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
        e.preventDefault();
        $.ajax({
            url: '/modificar_usuario/db/',
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data) {
                //Notificación guardado
                if(data.exito){
                    $('.toast-success').toast('show');
                }else{
                    $('.toast-error').toast('show');
                }
            },
            error: function(data){
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
        $('.datosBasicosForm .btn-guardar').removeAttr('hidden');
    });

    /* Habilitamos el formulario de los datos básicos */
    $(document).on("click", ".datosBasicosForm .btn-guardar", function (e) {
        e.preventDefault();
        //Disparamos la función de submit
        $('#form-datos-basicos').trigger('submit');
        //Deshabilitamos todos los inputs y los select picker
        $('.datosBasicosForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(this).attr('hidden', '');
        $('.datosBasicosForm .btn-editar').removeAttr('hidden');
    });

}

var envioDatosEspecificos = function(){
    //Envio de de datos del formulario
    $('#form-datos-especificos').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/modificar_usuario/de/',
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data) {
                //Notificación guardado
                if(data.exito){
                    $('.toast-success').toast('show');
                }else{
                    $('.toast-error').toast('show');
                }
            },
            error: function(data){
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
        $('.datosEspecificosForm .btn-guardar').removeAttr('hidden');
    });

    /* Habilitamos el formulario de los datos específicos */
    $(document).on("click", ".datosEspecificosForm .btn-guardar", function (e) {
        e.preventDefault();
        //Disparamos la función de submit
        $('#form-datos-especificos').trigger('submit');
        //Deshabilitamos todos los inputs y los select picker
        $('.datosEspecificosForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(this).attr('hidden', '');
        $('.datosEspecificosForm .btn-editar').removeAttr('hidden');
    });
}

var envioRedesSociales = function(){
    $('.datosRedesForm :input:not(.btn-editar)').attr('disabled', '');

    //Envio de de datos del formulario
    $('#form-redes-sociales').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/actualizar_redes/',
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data) {
                //Notificación guardado
                if(data.exito){
                    $('.toast-success').toast('show');
                }else{
                    $('.toast-error').toast('show');
                }
            },
            error: function(data){
                $('.toast-error').toast('show');
            }
        });
    });

    /* Deshabilitamos el formulario de las redes de sociales */
    $(document).on("click", ".datosRedesForm .btn-editar", function (e) {
        e.preventDefault();
        //Habilitamos todos los inputs
        $('.datosRedesForm :input').removeAttr('disabled');
        //Ocultamos el botón de editar y mostramos el botón de guardar
        $(this).attr('hidden', '');
        $('.datosRedesForm .btn-guardar').removeAttr('hidden');
    });

    /* Habilitamos el formulario de las redes de sociales */
    $(document).on("click", ".datosRedesForm .btn-guardar", function (e) {
        e.preventDefault();
        //Disparamos la función de submit
        $('#form-redes-sociales').trigger('submit');
        //Deshabilitamos todos los inputs y los select picker
        $('.datosRedesForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(this).attr('hidden', '');
        $('.datosRedesForm .btn-editar').removeAttr('hidden');
    });
}
