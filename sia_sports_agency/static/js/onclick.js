/*** En el momento en el que todo ha sido cargado ***/
$(document).ready(function(){
    /* Deshabilitamos el formulario de los datos básicos */
    $(document).on ("click", ".btn-editar", function (e) {
        e.preventDefault();
        $('.datosBasicosForm').removeAttr('disabled');
        $(this).attr('hidden', '');
        $('.btn-guardar').removeAttr('hidden');
    });

    $(document).on ("click", ".btn-guardar", function (e) {
        e.preventDefault();
        $('.datosBasicosForm').attr('disabled', '');
        $(this).attr('hidden', '');
        $('.btn-editar').removeAttr('hidden');
    });
});
