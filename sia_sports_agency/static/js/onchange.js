/*** En el momento en el que todo ha sido cargado ***/
$(document).ready(function(){
    /* Oculta o muestra el dropdown singular o múltiple en función del deporte seleccionado.
    Si se trata de fútbol americano, se muestra el dropdown múltiple.*/
    $('#aQueJuegasDropdown, #deporteInput').change(function () {
        var cod = $(this).val();
        if (cod === 'FBA'){
            $('.divPositions').attr('hidden', '');
            $('.divMultiplePositions').removeAttr('hidden');
        }
        else{
            $('.divMultiplePositions').attr('hidden', '');
            $('.divPositions').removeAttr('hidden', '');
        }
        establecerPosiciones(cod);
    });
    /*Si accedemos al perfil, establecemos en el input del deporte las posiciones (llamado deporteInput).
    Si se trata de la página principal, realizamos lo mismo pero en el input aQueJuegasDropdown*/
    if(window.location.pathname === "/perfil/"){
        establecerPosiciones($('#deporteInput').val());
    }else{
        establecerPosiciones($('#aQueJuegasDropdown').val());
    }
    $('#customFileCarta, #customFileCurriculum').on('change',function(){
        //Conseguimos el nombre del fichero
        var fileName = $(this).val();
        //Lo establecemos en el input
        $(this).next('.custom-file-label').html(fileName);
    });
});

/*** Establece los valores en el dropdaown de las posiciones según el deporte seleccionado ***/
var establecerPosiciones = function(cod){
    $.ajax({
        type: "GET",
        url: "/get_posiciones/"+ cod,
        success: function (data) {
            if (cod !== 'FBA'){
                $("#posicionDropdown").html(data);
            }
        }
    });
}
