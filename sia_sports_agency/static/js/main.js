/*** En el momento en el que todo ha sido cargado ***/
$(document).ready(function(){

    /*Datos que cambien en función del tipo de jugador*/
    cargarDatosDinamicos();

    /*Cargamos el nombre del fichero en el input de tipo upload file*/
    cargarNombreUpload();

    /*En el momento en el que el valor de tipo de jugador cambie, mostramos u ocultamos*/
    cambioTipoJugador();

});

var cambioTipoJugador = function(){
    $('#queEresDropdown').change(function () {
        var cod = $(this).val();
        ocultarMostrarCampos(cod);
    });
}

var cargarDatosDinamicos = function(){
    var tipoJugador = $('#queEresDropdown').val();
    /* Oculta o muestra el dropdown singular o múltiple en función del deporte seleccionado.
    Si se trata de fútbol americano, se muestra el dropdown múltiple.*/
    $('#aQueJuegasDropdown, #deporteInput').change(function () {
        var cod = $(this).val();
        establecerPosiciones(cod, 0, false);
    });
    $('.busqueda .busqueda-deporte').change(function () {
        var cod = $(this).val();
        establecerPosiciones(cod, 0, true);
    });
    /*Si accedemos al perfil, establecemos en el input del deporte las posiciones (llamado deporteInput).
    Si se trata de la página principal, realizamos lo mismo pero en el input aQueJuegasDropdown*/
    if(window.location.pathname === "/perfil/"){
        establecerPosiciones($('#deporteInput').val(), 1, false);
        ocultarMostrarCampos(tipoJugador);
    }else if(window.location.pathname === "/busqueda/"){
        establecerPosiciones($('#busqueda-deporte').val(), 0, true);
    }else{
        establecerPosiciones($('#aQueJuegasDropdown').val(), 0, false);
        ocultarMostrarCampos(tipoJugador);
    }
}

var mostrarCampos = function(listaMostrar){
    listaMostrar.forEach(function(element) {
        element.removeAttr('hidden');
    });
}

var ocultarCampos = function(listaOcultar){
    listaOcultar.forEach(function(element) {
        element.attr('hidden', '');
    });
}

var camposObligatorios = function(listaMostrar){
    listaMostrar.forEach(function(element) {
        element.attr('required', '');
    });
}

var camposNoObligatorios = function(listaOcultar){
    listaOcultar.forEach(function(element) {
        element.removeAttr('required');
    });
}

var mostrarOcultarComb1 = function(){
    var listaMostrar = [
        $('.grupoFechaNacimiento'),
        $('.grupoAQueJuegas'),
        $('.grupoSexo'),
        $('.grupoGeneroDeporte'),
        $('.grupoPosiciones')
    ];
    mostrarCampos(listaMostrar);
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
};

var mostrarOcultarComb2 = function(){
    var listaMostrar = [
        $('.grupoGeneroDeporte'),
        $('.grupoAQueJuegas')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoFechaNacimiento'),
        $('.grupoPosiciones'),
        $('.grupoSexo')
    ];
    ocultarCampos(listaOcultar);
    $('.grupoFechaNacimiento #datepicker').val('');
    $('.divPositionsSimple #posicionDropdown').val('');
    $('.divMultiplePositions #posicionDropdownMultiple').val('');
    var listaNoObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposNoObligatorios(listaNoObligatorios);
};

var mostrarOcultarComb3 = function(){
    var listaMostrar = [
        $('.grupoFechaNacimiento'),
        $('.grupoAQueJuegas'),
        $('.grupoSexo'),
        $('.grupoGeneroDeporte')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoPosiciones')
    ];
    ocultarCampos(listaOcultar);
    $('.divPositionsSimple #posicionDropdown').val('');
    $('.divMultiplePositions #posicionDropdownMultiple').val('');
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
};

var mostrarOcultarComb4 = function(){
    var listaMostrar = [
        $('.grupoFechaNacimiento'),
        $('.grupoSexo'),
        $('.grupoAQueJuegas')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoPosiciones'),
        $('.grupoGeneroDeporte')
    ];
    ocultarCampos(listaOcultar);
    $('.divPositionsSimple #posicionDropdown').val('');
    $('.divMultiplePositions #posicionDropdownMultiple').val('');
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
};

var mostrarOcultarComb5 = function(){
    var listaMostrar = [
        $('.grupoAQueJuegas')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoPosiciones'),
        $('.grupoGeneroDeporte'),
        $('.grupoSexo'),
        $('.grupoFechaNacimiento')
    ];
    ocultarCampos(listaOcultar);
    $('.grupoFechaNacimiento #datepicker').val('');
    $('.divPositionsSimple #posicionDropdown').val('');
    $('.divMultiplePositions #posicionDropdownMultiple').val('');
    var listaNoObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposNoObligatorios(listaNoObligatorios);
};

var mostrarOcultarComb6 = function(){
    var listaMostrar = [
        $('.grupoFechaNacimiento'),
        $('.grupoSexo')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoPosiciones'),
        $('.grupoAQueJuegas')
    ];
    ocultarCampos(listaOcultar);
    $('.divPositionsSimple #posicionDropdown').val('');
    $('.divMultiplePositions #posicionDropdownMultiple').val('');
    $('.grupoAQueJuegas #deporteInput').val('');
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
};

var ocultarMostrarCampos = function(tipoJugador){
    var listaMostrar = [];
    var listaOcultar = [];
    switch(tipoJugador){
        case 'JG':
            mostrarOcultarComb1();
            break;
        case 'CL':
            mostrarOcultarComb2();
            break;
        case 'EN':
            mostrarOcultarComb3();
            break;
        case 'PF':
            mostrarOcultarComb3();
            break;
        case 'RE':
            mostrarOcultarComb3();
            break;
        case 'AR':
            mostrarOcultarComb3();
            break;
        case 'DI':
            mostrarOcultarComb3();
            break;
        case 'FI':
            mostrarOcultarComb4();
            break;
        case 'OJ':
            mostrarOcultarComb3();
            break;
        case 'PD':
            mostrarOcultarComb4();
            break;
        case 'ED':
            mostrarOcultarComb5();
            break;
        case 'MD':
            mostrarOcultarComb5();
            break;
        case 'OT':
            mostrarOcultarComb6();
            break;
        default:
            mostrarOcultarComb1();
            break;
    }
}

var cargarNombreUpload = function(){
    $('#customFileCarta, #customFileCurriculum, #customFileVideo').on('change',function(){
        //Conseguimos el nombre del fichero
        var fileName = $(this).val();
        //Lo establecemos en el input
        $(this).next('.custom-file-label').html(fileName);
    });
}

/***
    Establece los valores en el dropdaown de las posiciones según el deporte seleccionado
    Parámetros: cod: Código del deporte seleccionado, edit: Indica si se trata de la edición del usuario,
    pues entonces marcará como seleccionados los que ya tenía otorgados en el momento de recuperación de los datos,
    esBusqueda: En la pantalla de búsqueda, el campos de posiciones siempre será de tipo múltiple. Por lo tanto,
    no tan solo hay que recuperar las posiciones.
***/
var establecerPosiciones = function(cod, edit, esBusqueda){
    if (cod != null && cod != ''){
        $.ajax({
            type: "GET",
            url: "/get_posiciones/"+ cod + "?edit=" + edit,
            success: function (data) {
                if (esBusqueda){
                    $("#posicionDropdownMultiple").html(data.lista_posiciones);
                    $('.selectpicker').selectpicker('refresh');
                }
                else{
                    if (data.multiple){
                        $('.divPositionsSimple').attr('hidden', '');
                        $('.divMultiplePositions').removeAttr('hidden');
                        $("#posicionDropdownMultiple").html(data.lista_posiciones);
                        $('#posicionDropdown').removeAttr('required');
                        $('#posicionDropdownMultiple').attr('required', '');
                        $('.selectpicker').selectpicker('refresh');
                    }else{
                        $('.divMultiplePositions').attr('hidden', '');
                        $('.divPositionsSimple').removeAttr('hidden', '');
                        $("#posicionDropdown").html(data.lista_posiciones);
                        $('#posicionDropdown').attr('required', '');
                        $('#posicionDropdownMultiple').removeAttr('required');
                    }
                }
            }
        });
    }
}

/* Función que cambia el idioma de la pagina */
var cambiarIdioma = function(idioma){
    $( "#form-idioma-" + idioma ).submit();
}
