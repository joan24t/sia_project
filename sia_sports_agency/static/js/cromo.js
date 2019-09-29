/* Conseguimos la primera posición del campo de posiciones para insertarlo en el cromo */
var nombreMultipleDeporte = function(){
    var codigos = $('.divMultiplePositions .filter-option-inner-inner').text();
    var nombre = '';
    if (codigos != ''){
        var nombre = codigos.slice(0, codigos.indexOf(","));
    }
    return nombre;
}

/* Comprobamos si el deporte seleccionado requiere de multiples posiciones */
var getRequiereMultiple = function(deporte){
    if (deporte == 'FBA' || deporte == 'BB'){
        return true;
    }
    return false;
}

/* BUSQUEDA DE CROMOS */
var actual = 1;
var primeraPagina = 1;
var total_cromos;
var ultimaPagina;
var rangoIni = 1;
var limiteBotones = 5;
var rangoFin;

var construyeBotones = function(btn){
    $('.page-item-' + String(actual) + '>a').removeClass('active');
    if (btn == 'ant'){
        actual -= 1;
    }else{
        actual += 1;
    }
    $('.page-item-' + String(actual)+ '>a').addClass('active');
    if (actual == rangoFin + 1 && rangoFin < ultimaPagina){
        rangoIni = rangoFin + 1;
        rangoFin = Math.min(ultimaPagina, actual + limiteBotones - 1);
        dibujaBotones();
    }else if (actual == rangoIni - 1 && rangoIni > primeraPagina){
        rangoFin = actual;
        rangoIni = Math.max(primeraPagina, rangoFin - limiteBotones + 1);
        dibujaBotones();
    }
    descativarBotonsExt();
    $('.form-busqueda .busquedaPagina').val(actual.toString());
    consultaCromos(false);
}

var descativarBotonsExt = function(){
    $('.botones-busqueda .boton-siguiente').removeClass('disabled');
    $('.botones-busqueda .boton-anterior').removeClass('disabled');
    if (actual == 1){
        $('.botones-busqueda .boton-anterior').addClass('disabled');
    }else if (actual == ultimaPagina){
        $('.botones-busqueda .boton-siguiente').addClass('disabled');
    }
}

var cambiarActivo = function(valor){
    $('.page-item-' + String(actual) + '>a').removeClass('active');
    actual = valor;
    descativarBotonsExt();
    $('.page-item-' + String(actual) + '>a').addClass('active');
    $('.form-busqueda .busquedaPagina').val(actual.toString());
    consultaCromos(false);
}

var dibujaBotones = function(){
    var elemento = $('.botones-busqueda .pagination');
    var contenido = "";
    if (actual == 1){
        contenido += "<li class='page-item boton-anterior disabled'><a class='page-link' href='#' onclick='construyeBotones(\"ant\");'>Anterior</a></li>";
    }else{
        contenido += "<li class='page-item boton-anterior'><a class='page-link' href='#' onclick='construyeBotones(\"ant\");'>Anterior</a></li>";
    }
    for(let i = rangoIni; i<=rangoFin; i++){
        if (i == actual){
            contenido += "<li class='page-item page-item-" + String(i) + "'><a class='page-link active' href='#' onclick='cambiarActivo(" + String(i) + ")'>" + String(i) + "</a></li>";
        }else{
            contenido += "<li class='page-item page-item-" + String(i) + "'><a class='page-link' href='#' onclick='cambiarActivo(" + String(i) + ")'>" + String(i) + "</a></li>";
        }
    }
    if (rangoFin == ultimaPagina){
        contenido += "<li class='page-item boton-siguiente disabled'><a class='page-link' href='#' onclick='construyeBotones(\"sig\");'>Siguiente</a></li>";
    }else{
        contenido += "<li class='page-item boton-siguiente'><a class='page-link' href='#' onclick='construyeBotones(\"sig\");'>Siguiente</a></li>";
    }
    elemento.html(contenido);
}
/* Lleva a cabo la consulta de los cromos a partir de los filtros */
var consultaCromos = function(busqueda){
    //Envio de de datos del formulario
    $('#form-busqueda').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/busqueda_cromo/",
            async: false,
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data) {
                if (data.exito){
                    var content = "";
                    for (var i in data.lista_usuarios) {
                        var id = data.lista_usuarios[i][0];
                        var url = data.lista_usuarios[i][1];
                        content += "<div class='col-12 col-xl-3'" + " onclick='verDetalle(" + id.toString() + ");' data-aos='zoom-in' data-aos-duration='500' style='text-align: center; margin-top: 50px;'><img width='300px' src='" + url + "' /></div>";
                    }
                    $('.resultados .row').html(content);
                    if(busqueda){
                        total_cromos = parseInt(data.total_registros);
                        ultimaPagina = Math.ceil(total_cromos / 9);
                        rangoFin = Math.min(ultimaPagina, limiteBotones);
                        dibujaBotones();
                    }
                }else{
                    $('.toast-error .content').text('Error en la búsqueda de los cromos.');
                    $('.toast-error').toast('show');
                }
            },error: function(data){
                $('.toast-error .content').text('Error en la búsqueda de los cromos.');
                $('.toast-error').toast('show');
            }
        });
    });
}

/* Ver detalle del usuario */
var verDetalle = function(usuarioId){
    $.ajax({
        url: '/detalle_usuario/',
        async: false,
        type: 'POST',
        dataType: 'json',
        data: {'usuario_id': usuarioId},
        success: function(data) {
            if(data.exito){
                var url = data.url_img;
                $('#detalleUsuarioModal .seccion-cromo').html("<img width='70%;' src='" + url + "'/>");
                $('#detalleUsuarioModal #detalleNombre').html(data.nombre);
                $('#detalleUsuarioModal #detalleRol').html("<h4><span style='color: grey;'>Rol:</span> " + data.rol + "</h4>");
                $('#detalleUsuarioModal #detalleDeporte').html("<h4><span style='color: grey;'>Deporte:</span> " + data.deporte + "</h4>");
                $('#detalleUsuarioModal #detalleEmail').html(data.email);
                $('#detalleUsuarioModal #detalleGeneroDeporte').html("<h4><span style='color: grey;'>Género deporte:</span> " + data.genero_deporte + "</h4>");
                $('#detalleUsuarioModal #detalleGenero').html("<h4><span style='color: grey;'>Género:</span> " + data.sexo + "</h4>");
                $('#detalleUsuarioModal #detalleFNacimiento').html("<h4><span style='color: grey;'>Fecha Nacimiento:</span> " + data.fnacimiento + "</h4>");
                $('#detalleUsuarioModal #detallePais').html("<h4><span style='color: grey;'>País:</span> " + data.pais + "</h4>");

                $('#detalleUsuarioModal #detalleTelefono').html("<h4><span style='color: grey;'>Teléfono:</span> " + data.telefono + "</h4>");
                $('#detalleUsuarioModal #detalleUbicacion').html("<h4><span style='color: grey;'>Ubicación:</span> " + data.ubicacion + "</h4>");
                $('#detalleUsuarioModal #detallePeso').html("<h4><span style='color: grey;'>Peso:</span> " + data.peso + " " + data.tipo_peso  +"</h4>");
                $('#detalleUsuarioModal #detalleEdominante').html("<h4><span style='color: grey;'>Extremidad dominante:</span> " + data.extremidad + "</h4>");
                $('#detalleUsuarioModal #detalleNacionalidad').html("<h4><span style='color: grey;'>Nacionalidad:</span> " + data.nacionalidad + "</h4>");
                $('#detalleUsuarioModal #detalleAltura').html("<h4><span style='color: grey;'>Altura:</span> " + data.altura + " " +  data.tipo_altura +"</h4>");
                $('#detalleUsuarioModal #detalleInteresadoEn').html(data.interesadoen);
                $('#detalleUsuarioModal #detalleCPresentacion').attr('href', data.url_cpresentacion);
                $('#detalleUsuarioModal #detalleCurriculum').attr('href', data.url_curriculum);
                $('#detalleUsuarioModal #detalleVideos').html(estableceVideosEnDetalle(data.url_videos));
                $('#detalleUsuarioModal #detalleFacebook').attr('href', data.red_FB);
                $('#detalleUsuarioModal #detalleInstagram').attr('href', data.red_IG);
                $('#detalleUsuarioModal #detalleTwitter').attr('href', data.red_TT);
                $('#detalleUsuarioModal #detalleYouTube').attr('href', data.red_YT);
                $('#detalleUsuarioModal').modal('toggle');
            }else{
                mostrarNotificacionError('Error al ver el detalle del usuario.');
            }
        },
        error: function(data){
            mostrarNotificacionError('Error al ver el detalle del usuario.');
        }
    });
}

var estableceVideosEnDetalle = function(lista_videos){
    var content = '';
    var i;
    for(i = 0; i < lista_videos.length; i++){
        content += "<div class='col col-12 col-xl-3'><video controls='' style='width: 100%;'><source src='" + lista_videos[i] + "' type='video/mp4'></video></div>";
    }
    return content;
}
