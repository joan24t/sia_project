/* Conseguimos la primera posición del campo de posiciones para insertarlo en el cromo */
var nombreMultipleDeporte = function(){
    var codigos = $('.divMultiplePositions .filter-option-inner-inner').text();
    var nombre = '';
    if (codigos.indexOf(",") != -1){
        nombre = codigos.slice(0, codigos.indexOf(","));
    }else{
        if (codigos == 'Ninguno seleccionado' || codigos == 'Nothing selected'){
            nombre = '';
        }else{
            nombre = codigos;
        }
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
                        content += "<div class='col-12 col-md-6 col-xl-3'" + " onclick='verDetalle(" + id.toString() + ");' data-aos='zoom-in' data-aos-duration='500' style='text-align: center; margin-top: 50px;'><img width='300px' src='" + url + "?timestamp=" + new Date().getTime() + "' /></div>";
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
    var combo1 = ['JG']
    var combo2 = ['CL']
    var combo3 = ['EN', 'PF', 'DI']
    var combo4 = ['FI', 'PD']
    var combo5 = ['ED', 'MD']
    var combo7 = ['RE', 'AR', 'OJ']
    var combo6 = ['OT']
    $.ajax({
        url: '/detalle_usuario/',
        async: false,
        type: 'POST',
        dataType: 'json',
        data: {'usuario_id': usuarioId},
        success: function(data) {
            if(data.exito){
                var url = data.url_img;
                $('#detalleUsuarioModal .seccion-cromo').html("<img width='70%;' src='" + url + "?timestamp=" + new Date().getTime() + "'/>");
                //Insertar en la ficha el nombre
                $('#detalleUsuarioModal #detalleNombre').html(data.nombre);

                //Insertar en la ficha el rol
                $('#detalleUsuarioModal #detalleRol').html("<h4><span style='color: grey;'>Rol:</span> " + data.rol_nombre + "</h4>");

                //Insertar en la ficha el deporte
                if(combo5.indexOf(data.rol) >= 0 || combo6.indexOf(data.rol) >= 0){
                    $('#detalleUsuarioModal #detalleDeporte').parent().attr('hidden', '');
                }else{
                    $('#detalleUsuarioModal #detalleDeporte').parent().removeAttr('hidden', '');
                    $('#detalleUsuarioModal #detalleDeporte').html("<h4><span style='color: grey;'>Deporte:</span> " + data.deporte + "</h4>");
                }

                //Insertar en la ficha el email
                $('#detalleUsuarioModal #detalleEmail').html(data.email);

                //Insertar en la ficha el género del deporte
                if(combo4.indexOf(data.rol) >= 0 || combo5.indexOf(data.rol) >= 0 || combo6.indexOf(data.rol) >= 0){
                    $('#detalleUsuarioModal #detalleGeneroDeporte').parent().attr('hidden', '');
                }else{
                    $('#detalleUsuarioModal #detalleGeneroDeporte').parent().removeAttr('hidden', '');
                    $('#detalleUsuarioModal #detalleGeneroDeporte').html("<h4><span style='color: grey;'>Género deporte:</span> " + data.genero_deporte + "</h4>");
                }

                //Insertar en la ficha el país
                $('#detalleUsuarioModal #detallePais').html("<h4><span style='color: grey;'>País:</span> " + data.pais + "</h4>");

                //Insertar en la ficha el teléfono
                $('#detalleUsuarioModal #detalleTelefono').html("<h4><span style='color: grey;'>Teléfono:</span> " + data.telefono + "</h4>");

                //Insertar en la ficha la ubicación
                if(combo2.indexOf(data.rol) >= 0 || combo5.indexOf(data.rol) >= 0 ||combo6.indexOf(data.rol) >= 0){
                    $('#detalleUsuarioModal #detalleUbicacion').html("<h4><span style='color: grey;'>Ubicación:</span> " + data.ubicacion + "</h4>");
                    $('#detalleUsuarioModal #detalleUbicacion').parent().removeAttr('hidden', '');
                }else{
                    $('#detalleUsuarioModal #detalleUbicacion').parent().attr('hidden', '');
                }

                //Insertar en la ficha el peso, la altura, el curriculum y la extremidad dominante
                if(combo1.indexOf(data.rol) >= 0){
                    $('#detalleUsuarioModal #detallePeso').html("<h4><span style='color: grey;'>Peso:</span> " + data.peso + " " + data.tipo_peso  +"</h4>");
                    $('#detalleUsuarioModal #detalleEdominante').html("<h4><span style='color: grey;'>Extremidad dominante:</span> " + data.extremidad + "</h4>");
                    $('#detalleUsuarioModal #detalleAltura').html("<h4><span style='color: grey;'>Altura:</span> " + data.altura + " " +  data.tipo_altura +"</h4>");
                    $('#detalleUsuarioModal #detalleCurriculum').attr('href', data.url_curriculum);
                    $('#detalleUsuarioModal #detallePeso').parent().removeAttr('hidden', '');
                    $('#detalleUsuarioModal #detalleEdominante').parent().removeAttr('hidden', '');
                    $('#detalleUsuarioModal #detalleAltura').parent().removeAttr('hidden', '');
                    if (data.url_curriculum == ''){
                        $('#detalleUsuarioModal #detalleCurriculum').addClass("disabled");
                    }else{
                        $('#detalleUsuarioModal #detalleCurriculum').removeClass("disabled");
                    }
                    $('#detalleUsuarioModal #detalleCurriculum').parent().removeAttr('hidden', '');
                }else{
                    $('#detalleUsuarioModal #detallePeso').parent().attr('hidden', '');
                    $('#detalleUsuarioModal #detalleEdominante').parent().attr('hidden', '');
                    $('#detalleUsuarioModal #detalleAltura').parent().attr('hidden', '');
                    $('#detalleUsuarioModal #detalleCurriculum').parent().attr('hidden', '');
                }

                //Insertar en la ficha la nacionalidad, la fecha de nacimiento y el género
                if(combo2.indexOf(data.rol) >= 0 || combo5.indexOf(data.rol) >= 0){
                    $('#detalleUsuarioModal #detalleNacionalidad').parent().attr('hidden', '');
                    $('#detalleUsuarioModal #detalleFNacimiento').parent().attr('hidden', '');
                    $('#detalleUsuarioModal #detalleGenero').parent().attr('hidden', '');
                }else{
                    $('#detalleUsuarioModal #detalleNacionalidad').html("<h4><span style='color: grey;'>Nacionalidad:</span> " + data.nacionalidad + "</h4>");
                    $('#detalleUsuarioModal #detalleGenero').html("<h4><span style='color: grey;'>Género:</span> " + data.sexo + "</h4>");
                    $('#detalleUsuarioModal #detalleFNacimiento').html("<h4><span style='color: grey;'>Fecha Nacimiento:</span> " + data.fnacimiento + "</h4>");
                    $('#detalleUsuarioModal #detalleNacionalidad').parent().removeAttr('hidden');
                    $('#detalleUsuarioModal #detalleGenero').parent().removeAttr('hidden');
                    $('#detalleUsuarioModal #detalleFNacimiento').parent().removeAttr('hidden');
                }

                //Insertar en la ficha interesado en
                if(combo2.indexOf(data.rol) >= 0 || combo5.indexOf(data.rol) >= 0){
                    $('#detalleUsuarioModal #detalleInteresadoEn').parent().removeAttr('hidden');
                    $('#detalleUsuarioModal #detalleInteresadoEn').html(data.interesadoen);
                }else{
                    $('#detalleUsuarioModal #detalleInteresadoEn').parent().attr('hidden');
                }

                //Insertar en la ficha la carta de presentación
                if (data.url_cpresentacion == ''){
                    $('#detalleUsuarioModal #detalleCPresentacion').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleCPresentacion').removeClass("disabled");
                }
                $('#detalleUsuarioModal #detalleCPresentacion').attr('href', data.url_cpresentacion);

                //Insertar en la ficha las redes sociales
                $('#detalleUsuarioModal #detalleVideos').html(estableceVideosEnDetalle(data.url_videos));
                $('#detalleUsuarioModal #detalleFacebook').attr('href', data.red_FB);
                $('#detalleUsuarioModal #detalleInstagram').attr('href', data.red_IG);
                $('#detalleUsuarioModal #detalleTwitter').attr('href', data.red_TT);
                $('#detalleUsuarioModal #detalleYouTube').attr('href', data.red_YT);
                if (data.red_FB == ''){
                    $('#detalleUsuarioModal #detalleFacebook').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleFacebook').removeClass("disabled");
                }
                if (data.red_IG == ''){
                    $('#detalleUsuarioModal #detalleInstagram').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleInstagram').removeClass("disabled");
                }
                if (data.red_TT == ''){
                    $('#detalleUsuarioModal #detalleTwitter').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleTwitter').removeClass("disabled");
                }
                if (data.red_YT == ''){
                    $('#detalleUsuarioModal #detalleYouTube').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleYouTube').removeClass("disabled");
                }
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
        content += "<div class='col col-12 col-xl-3' style='background-color: black;'><video controls='' style='width: 100%; max-height: 200px;'><source src='" + lista_videos[i] + "' type='video/mp4'></video></div>";
    }
    return content;
}
