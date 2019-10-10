/*** En el momento en el que todo ha sido cargado ***/
$(document).ready(function(){

    /*Datos que cambien en función del tipo de jugador*/
    cargarDatosDinamicos();

    /*Cargamos el nombre del fichero en el input de tipo upload file*/
    cargarNombreUpload();

    /*En el momento en el que el valor de tipo de jugador cambie, mostramos u ocultamos*/
    cambioTipoJugador();
    /* Form de registro. Trigger para validar los datos insertados. */
    submitRegistro();

});

var cambioTipoJugador = function(){
    $('#queEresDropdown').change(function () {
        var cod = $(this).val();
        $("#labelNombre h4").attr('hidden', '');
        $("#labelNombre span").attr('hidden', '');
        ocultarMostrarCampos(cod);
    });
}

var cargarDeporteEspecifico = function(cod){
    $('.grupoEspecifique').attr('hidden', '');
    var listaObligatorios = [
        $('.grupoEspecifique > input')
    ];
    if(cod == 'MD'){
        $('.grupoEspecifique').removeAttr('hidden');
        camposObligatorios(listaObligatorios);
    }else{
        camposNoObligatorios(listaObligatorios);
    }
}

var cargarDatosDinamicos = function(){
    var tipoJugador = $('#queEresDropdown').val();

    /* Oculta o muestra el dropdown singular o múltiple en función del deporte seleccionado.
    Si se trata de fútbol americano, se muestra el dropdown múltiple.*/
    $('#aQueJuegasDropdown, #deporteInput').change(function () {
        var cod = $(this).val();
        cargarDeporteEspecifico(cod);
        establecerPosiciones(cod, 0, false);
    });
    $('.busqueda .busqueda-deporte').change(function () {
        var cod = $(this).val();
        establecerPosiciones(cod, 0, true);
    });
    /*Si accedemos al perfil, establecemos en el input del deporte las posiciones (llamado deporteInput).
    Si se trata de la página principal, realizamos lo mismo pero en el input aQueJuegasDropdown*/
    if(window.location.pathname === "/perfil/"){
        var cod_deporte = $('#deporteInput').val();
        establecerPosiciones(cod_deporte, 1, false);
        cargarDeporteEspecifico(cod_deporte);
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
        element.addClass('campoObligatorio');
    });
}

var camposNoObligatorios = function(listaOcultar){
    listaOcultar.forEach(function(element) {
        element.removeClass('campoObligatorio');
    });
}

var mostrarOcultarComb1 = function(){
    $("#labelNombre #labelNombreApellidos").removeAttr('hidden');
    var listaMostrar = [
        $('.grupoGeneroDeporte'),
        $('.grupoAQueJuegas'),
        $('.grupoFechaNacimiento'),
        $('.grupoSexo'),
        $('.grupoPosiciones'),
        $('.grupoNacionalidad'),
        $('.grupoPesoAltura'),
        $('.grupoEDominante'),
        $('.grupoCPresentacion'),
        $('.grupoCurriculum'),
        $('.grupoEActual')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoUbicacion'),
        $('.grupoInteresadoEn')
    ];
    ocultarCampos(listaOcultar);
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
};

var mostrarOcultarComb2 = function(){
    $("#labelNombre #labelNombreClub").removeAttr('hidden');
    var listaMostrar = [
        $('.grupoGeneroDeporte'),
        $('.grupoAQueJuegas'),
        $('.grupoUbicacion'),
        $('.grupoInteresadoEn'),
        $('.grupoCPresentacion')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoFechaNacimiento'),
        $('.grupoPosiciones'),
        $('.grupoSexo'),
        $('.grupoNacionalidad'),
        $('.grupoPesoAltura'),
        $('.grupoEDominante'),
        $('.grupoEActual'),
        $('.grupoCurriculum')
    ];
    ocultarCampos(listaOcultar);
    var listaNoObligatorios = [
        $('.grupoFechaNacimiento > input'),
        $('.divPositionsSimple #posicionDropdown'),
        $('.divMultiplePositions #posicionDropdownMultiple')
    ];
    camposNoObligatorios(listaNoObligatorios);
};

var mostrarOcultarComb3 = function(){
    $("#labelNombre #labelNombreApellidos").removeAttr('hidden');
    var listaMostrar = [
        $('.grupoGeneroDeporte'),
        $('.grupoAQueJuegas'),
        $('.grupoFechaNacimiento'),
        $('.grupoSexo'),
        $('.grupoNacionalidad'),
        $('.grupoCPresentacion'),
        $('.grupoEActual'),
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoPosiciones'),
        $('.grupoUbicacion'),
        $('.grupoInteresadoEn'),
        $('.grupoPesoAltura'),
        $('.grupoEDominante'),
        $('.grupoCurriculum')
    ];
    ocultarCampos(listaOcultar);
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
    var listaNoObligatorios = [
        $('.divPositionsSimple #posicionDropdown'),
        $('.divMultiplePositions #posicionDropdownMultiple')
    ];
    camposNoObligatorios(listaNoObligatorios);
};

var mostrarOcultarComb4 = function(){
    $("#labelNombre #labelNombreApellidos").removeAttr('hidden');
    var listaMostrar = [
        $('.grupoAQueJuegas'),
        $('.grupoFechaNacimiento'),
        $('.grupoSexo'),
        $('.grupoNacionalidad'),
        $('.grupoCPresentacion'),
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoGeneroDeporte'),
        $('.grupoPosiciones'),
        $('.grupoUbicacion'),
        $('.grupoInteresadoEn'),
        $('.grupoPesoAltura'),
        $('.grupoEDominante'),
        $('.grupoEActual'),
        $('.grupoCurriculum')
    ];
    ocultarCampos(listaOcultar);
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
    var listaNoObligatorios = [
        $('.divPositionsSimple #posicionDropdown'),
        $('.divMultiplePositions #posicionDropdownMultiple')
    ];
    camposNoObligatorios(listaNoObligatorios);
};

var mostrarOcultarComb5 = function(){
    var cod = $('#queEresDropdown').val();
    if (cod == 'ED'){
        $("#labelNombre #labelNombreEmpresa").removeAttr('hidden');
    }else if (cod == 'MD'){
        $("#labelNombre #labelNombreMarca").removeAttr('hidden');
    }
    var listaMostrar = [
        $('.grupoAQueJuegas'),
        $('.grupoUbicacion'),
        $('.grupoCPresentacion')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoGeneroDeporte'),
        $('.grupoFechaNacimiento'),
        $('.grupoSexo'),
        $('.grupoPosiciones'),
        $('.grupoNacionalidad'),
        $('.grupoInteresadoEn'),
        $('.grupoPesoAltura'),
        $('.grupoEDominante'),
        $('.grupoEActual'),
        $('.grupoCurriculum')
    ];
    ocultarCampos(listaOcultar);
    var listaNoObligatorios = [
        $('.grupoFechaNacimiento > input'),
        $('.divPositionsSimple #posicionDropdown'),
        $('.divMultiplePositions #posicionDropdownMultiple')
    ];
    camposNoObligatorios(listaNoObligatorios);
};

var mostrarOcultarComb6 = function(){
    $("#labelNombre #labelSoloNombre").removeAttr('hidden');
    var listaMostrar = [
        $('.grupoFechaNacimiento'),
        $('.grupoSexo'),
        $('.grupoUbicacion'),
        $('.grupoNacionalidad'),
        $('.grupoCPresentacion')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoGeneroDeporte'),
        $('.grupoAQueJuegas'),
        $('.grupoPosiciones'),
        $('.grupoInteresadoEn'),
        $('.grupoPesoAltura'),
        $('.grupoEDominante'),
        $('.grupoEActual'),
        $('.grupoCurriculum')
    ];
    ocultarCampos(listaOcultar);
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
    var listaNoObligatorios = [
        $('.divPositionsSimple #posicionDropdown'),
        $('.divMultiplePositions #posicionDropdownMultiple')
    ];
    camposNoObligatorios(listaNoObligatorios);
};

var mostrarOcultarComb7 = function(){
    $("#labelNombre #labelNombreApellidos").removeAttr('hidden');
    var listaMostrar = [
        $('.grupoGeneroDeporte'),
        $('.grupoAQueJuegas'),
        $('.grupoFechaNacimiento'),
        $('.grupoSexo'),
        $('.grupoNacionalidad'),
        $('.grupoCPresentacion'),
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoPosiciones'),
        $('.grupoUbicacion'),
        $('.grupoInteresadoEn'),
        $('.grupoPesoAltura'),
        $('.grupoEDominante'),
        $('.grupoEActual'),
        $('.grupoCurriculum')
    ];
    ocultarCampos(listaOcultar);
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
    var listaNoObligatorios = [
        $('.divPositionsSimple #posicionDropdown'),
        $('.divMultiplePositions #posicionDropdownMultiple')
    ];
    camposNoObligatorios(listaNoObligatorios);
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
            mostrarOcultarComb7();
            break;
        case 'AR':
            mostrarOcultarComb7();
            break;
        case 'DI':
            mostrarOcultarComb3();
            break;
        case 'FI':
            mostrarOcultarComb4();
            break;
        case 'OJ':
            mostrarOcultarComb7();
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
                    if (cod == 'MD'){
                        $('.divPositionsSimple').attr('hidden', '');
                        $('.divMultiplePositions').attr('hidden', '');
                        $('#posicionDropdown').removeClass('campoObligatorio');
                        $('#posicionDropdownMultiple').removeClass('campoObligatorio');
                    }else{
                        if (data.multiple){
                            $('.divPositionsSimple').attr('hidden', '');
                            $('.divMultiplePositions').removeAttr('hidden');
                            $("#posicionDropdownMultiple").html(data.lista_posiciones);
                            $('#posicionDropdown').removeClass('campoObligatorio');
                            $('#posicionDropdownMultiple').addClass('campoObligatorio');
                            $('.selectpicker').selectpicker('refresh');
                        }else{
                            $('.divMultiplePositions').attr('hidden', '');
                            $('.divPositionsSimple').removeAttr('hidden', '');
                            $("#posicionDropdown").html(data.lista_posiciones);
                            $('#posicionDropdown').addClass('campoObligatorio');
                            $('#posicionDropdownMultiple').removeClass('campoObligatorio');
                        }
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
