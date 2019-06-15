/*** En el momento en el que todo ha sido cargado ***/
$(document).ready(function(){
    /* FUNCIONES PARA LOS DATOS BÁSICOS DEL PERFIL*/
    //Envio de de datos del formulario
    $('#form-datos-basicos').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/usuario_modificar_db/',
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
        $('#form-datos-basicos').trigger('submit');
        //Deshabilitamos todos los inputs y los select picker
        $('.datosBasicosForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(this).attr('hidden', '');
        $('.datosBasicosForm .btn-editar').removeAttr('hidden');
    });

    /* FUNCIONES PARA LOS DATOS ESPECÍFICOS DEL PERFIL*/
    $('.datosEspecificosForm :input:not(.btn-editar)').attr('disabled', '');

    /* Deshabilitamos el formulario de los datos específicos */
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
        //Deshabilitamos todos los inputs y los select picker
        $('.datosEspecificosForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(this).attr('hidden', '');
        $('.datosEspecificosForm .btn-editar').removeAttr('hidden');
    });

    /* FUNCIONES PARA LAS REDES SOCIALES DEL PERFIL*/
    $('.datosRedesForm :input:not(.btn-editar)').attr('disabled', '');

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
        //Deshabilitamos todos los inputs y los select picker
        $('.datosRedesForm :input:not(.btn-editar)').attr('disabled', '');
        //Ocultamos el botón de guardar y mostramos el botón de editar
        $(this).attr('hidden', '');
        $('.datosRedesForm .btn-editar').removeAttr('hidden');
    });

    /* Funcion que pone ivisible los toats cuando se ocultan*/
    $('.toast').on('hidden.bs.toast', function () {
        $(this).attr('hidden', '');
    });
    /*Función que pone visible los toats cuando se muestran*/
    $('.toast').on('show.bs.toast', function () {
        $(this).removeAttr('hidden');
    });
});
