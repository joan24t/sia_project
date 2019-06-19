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

    /* Funcion que pone ivisible los toats cuando se ocultan*/
    $('.toast').on('hidden.bs.toast', function () {
        $(this).attr('hidden', '');
    });
    /*Función que pone visible los toats cuando se muestran*/
    $('.toast').on('show.bs.toast', function () {
        $(this).removeAttr('hidden');
    });
});

var mostrarConfirmacion = function(){
    $('.video-gallery .option-delete').on('click', function(e) {
        var $form = $(this).closest('form');
        e.preventDefault();
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
