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
        var tipo_jugador = $(this).val();
        $("#labelNombre h4").attr('hidden', '');
        $("#labelNombre span").attr('hidden', '');
        $("#labelTextArea h4").attr('hidden', '');
        ocultarMostrarCampos(tipo_jugador);
        var cod_deporte = $('#deporteInput').val();
        cargarDeporteEspecifico(cod_deporte, tipo_jugador);
        eliminarAQueJuegas(tipo_jugador);
    });
}

var eliminarAQueJuegas = function (tipo_jugador){
    var no_permitidos = ["PF", "RE", "AR", "DI", "FI", "OJ", "PD"];
    if (no_permitidos.includes(tipo_jugador)){
        $('div.grupoAQueJuegas h4').attr('hidden', '');
    }else{
        $('div.grupoAQueJuegas h4').removeAttr('hidden');
    }
}

var cargarDeporteEspecifico = function(cod, tipo_jugador){
    $('.grupoEspecifique').attr('hidden', '');
    var listaObligatorios = [
        $('.grupoEspecifique > input')
    ];
    if(cod == 'MD' && (tipo_jugador != 'OT' && tipo_jugador != 'MD' && tipo_jugador != 'ED')){
        $('.grupoEspecifique').removeAttr('hidden');
        camposObligatorios(listaObligatorios);
    }else{
        camposNoObligatorios(listaObligatorios);
    }
}

var cargarDatosDinamicos = function(){
    /* Oculta o muestra el dropdown singular o múltiple en función del deporte seleccionado.
    Si se trata de fútbol americano, se muestra el dropdown múltiple.*/
    $('#deporteInput').change(function () {
        var cod = $(this).val();
        var tipoJugador = $('#queEresDropdown').val();
        cargarDeporteEspecifico(cod, tipoJugador);
        establecerPosiciones(cod, 0, false);
    });
    $('.busqueda .busqueda-deporte').change(function () {
        var cod = $(this).val();
        establecerPosiciones(cod, 0, true);
    });
    /*Si accedemos al perfil, establecemos en el input del deporte las posiciones (llamado deporteInput).
    Si se trata de la página principal, realizamos lo mismo pero en el input deporteInput*/
    if(window.location.pathname != "/busqueda/"){
        var tipoJugador = $('#queEresDropdown').val();
        var cod_deporte = $('#deporteInput').val();
        ocultarMostrarCampos(tipoJugador);
        cargarDeporteEspecifico(cod_deporte, tipoJugador);
        if (window.location.pathname == "/perfil/"){
            establecerPosiciones(cod_deporte, 1, false);
        } else{
            establecerPosiciones($('#deporteInput').val(), 0, false);
        }
    }else{
        establecerPosiciones($('#busqueda-deporte').val(), 0, true);
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
        $('.grupoEspecifique'),
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
        $('.grupoInteresadoEn'),
        $('.grupoPaginaWeb')
    ];
    ocultarCampos(listaOcultar);
    var listaObligatorios = [
        $('.grupoFechaNacimiento > input')
    ];
    camposObligatorios(listaObligatorios);
};

var mostrarOcultarComb2 = function(){
    $("#labelNombre #labelNombreClub").removeAttr('hidden');
    $("#labelTextArea #labelInteresadoEn").removeAttr('hidden');
    var listaMostrar = [
        $('.grupoGeneroDeporte'),
        $('.grupoAQueJuegas'),
        $('.grupoEspecifique'),
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
        $('.grupoCurriculum'),
        $('.grupoPaginaWeb')
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
        $('.grupoEspecifique'),
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
        $('.grupoCurriculum'),
        $('.grupoPaginaWeb')
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
        $('.grupoEspecifique'),
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
        $('.grupoCurriculum'),
        $('.grupoPaginaWeb')
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
    $("#labelTextArea #labelDescripcion").removeAttr('hidden');
    var listaMostrar = [
        $('.grupoPaginaWeb'),
        $('.grupoUbicacion'),
        $('.grupoCPresentacion'),
        $('.grupoInteresadoEn')
    ];
    mostrarCampos(listaMostrar);
    var listaOcultar = [
        $('.grupoAQueJuegas'),
        $('.grupoEspecifique'),
        $('.grupoGeneroDeporte'),
        $('.grupoFechaNacimiento'),
        $('.grupoSexo'),
        $('.grupoPosiciones'),
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
        $('.grupoEspecifique'),
        $('.grupoPosiciones'),
        $('.grupoInteresadoEn'),
        $('.grupoPesoAltura'),
        $('.grupoEDominante'),
        $('.grupoEActual'),
        $('.grupoCurriculum'),
        $('.grupoPaginaWeb')
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
        $('.grupoEspecifique'),
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
        $('.grupoCurriculum'),
        $('.grupoPaginaWeb')
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
            $("#labelNombre #labelNombreEmpresa").removeAttr('hidden');
            mostrarOcultarComb5();
            break;
        case 'MD':
            $("#labelNombre #labelNombreMarca").removeAttr('hidden');
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
