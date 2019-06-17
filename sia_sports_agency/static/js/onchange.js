/*** En el momento en el que todo ha sido cargado ***/
$(document).ready(function(){
    /* Oculta o muestra el dropdown singular o múltiple en función del deporte seleccionado.
    Si se trata de fútbol americano, se muestra el dropdown múltiple.*/
    $('#aQueJuegasDropdown, #deporteInput').change(function () {
        var cod = $(this).val();
        establecerPosiciones(cod, 0);
    });
    /*Si accedemos al perfil, establecemos en el input del deporte las posiciones (llamado deporteInput).
    Si se trata de la página principal, realizamos lo mismo pero en el input aQueJuegasDropdown*/
    if(window.location.pathname === "/perfil/"){
        establecerPosiciones($('#deporteInput').val(), 1);
    }else{
        establecerPosiciones($('#aQueJuegasDropdown').val(), 0);
    }
    $('#customFileCarta, #customFileCurriculum, #customFileVideo').on('change',function(){
        //Conseguimos el nombre del fichero
        var fileName = $(this).val();
        //Lo establecemos en el input
        $(this).next('.custom-file-label').html(fileName);
    });
});

/*** Establece los valores en el dropdaown de las posiciones según el deporte seleccionado ***/
var establecerPosiciones = function(cod, edit){
    $.ajax({
        type: "GET",
        url: "/get_posiciones/"+ cod + "?edit=" + edit,
        success: function (data) {
            if (data.multiple){
                $('.divPositions').attr('hidden', '');
                $('.divMultiplePositions').removeAttr('hidden');
                $("#posicionDropdownMultiple").html(data.lista_posiciones);
                $('.selectpicker').selectpicker('refresh');
            }else{
                $('.divMultiplePositions').attr('hidden', '');
                $('.divPositions').removeAttr('hidden', '');
                $("#posicionDropdown").html(data.lista_posiciones);
            }
        }
    });
}
