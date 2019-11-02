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
    $('#busquedaPagina').val(actual.toString());
    triggerConsultaCromos(false);
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
    $('#busquedaPagina').val(actual.toString());
    triggerConsultaCromos(false);
}

var dibujaBotones = function(){
    var elemento = $('.botones-busqueda .pagination');
    var contenido = "";
    if (actual == 1){
        contenido += "<li class='page-item boton-anterior disabled'><a class='page-link' onclick='construyeBotones(\"ant\");'>\<\<</a></li>";
    }else{
        contenido += "<li class='page-item boton-anterior'><a class='page-link' onclick='construyeBotones(\"ant\");'>\<\<</a></li>";
    }
    for(let i = rangoIni; i<=rangoFin; i++){
        if (i == actual){
            contenido += "<li class='page-item page-item-" + String(i) + "'><a class='page-link active' onclick='cambiarActivo(" + String(i) + ")'>" + String(i) + "</a></li>";
        }else{
            contenido += "<li class='page-item page-item-" + String(i) + "'><a class='page-link' onclick='cambiarActivo(" + String(i) + ")'>" + String(i) + "</a></li>";
        }
    }
    if (rangoFin == ultimaPagina){
        contenido += "<li class='page-item boton-siguiente disabled'><a class='page-link' onclick='construyeBotones(\"sig\");'>\>\></a></li>";
    }else{
        contenido += "<li class='page-item boton-siguiente'><a class='page-link' onclick='construyeBotones(\"sig\");'>\>\></a></li>";
    }
    elemento.html(contenido);
}

var triggerConsultaCromos = function(busqueda){
    $('div.mask').removeAttr('hidden');
    $.ajax({
        url: "/busqueda_cromo/",
        async: false,
        type: 'POST',
        dataType: 'json',
        data: $('#form-busqueda').serialize(),
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
                    ultimaPagina = Math.ceil(total_cromos / 12);
                    rangoFin = Math.min(ultimaPagina, limiteBotones);
                    dibujaBotones();
                }
                $('div.mask').attr('hidden', '');
            }else{
                $('.toast-error .content').text('Error en la búsqueda de los cromos.');
                $('.toast-error').toast('show');
                $('div.mask').attr('hidden', '');
            }
        },error: function(data){
            $('.toast-error .content').text('Error en la búsqueda de los cromos.');
            $('.toast-error').toast('show');
            $('div.mask').attr('hidden', '');
        }
    });
}

/* Lleva a cabo la consulta de los cromos a partir de los filtros */
var consultaCromos = function(busqueda){
    //Envio de de datos del formulario
    $('#form-busqueda').submit(function(e) {
        e.preventDefault();
        triggerConsultaCromos(busqueda);
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
                var detalleRol = $('#detalleUsuarioModal #detalleRol');
                detalleRol.html(detalleRol.html() + "<span style='color: white;'>" + data.rol_nombre + "</span>");

                //Insertar en la ficha el deporte
                var detalleDeporte = $('#detalleUsuarioModal #detalleDeporte');
                if(combo5.indexOf(data.rol) >= 0 || combo6.indexOf(data.rol) >= 0){
                    detalleDeporte.parent().attr('hidden', '');
                }else{
                    detalleDeporte.parent().removeAttr('hidden', '');
                    var valor = data.deporte;
                    if(data.deporte_codigo == 'MD'){
                        valor = data.deporte_especifico;
                    }
                    detalleDeporte.html(detalleDeporte.html() + "<span style='color: white;'>" + valor + "</span>");
                }

                //Insertar en la ficha el email
                var detalleEmail = $('#detalleUsuarioModal #detalleEmail');
                detalleEmail.html(detalleEmail.html() + "<span style='color: white;'>" +data.email + "</span>");

                //Insertar en la ficha el género del deporte
                var detalleGeneroDeporte = $('#detalleUsuarioModal #detalleGeneroDeporte');
                if(combo4.indexOf(data.rol) >= 0 || combo5.indexOf(data.rol) >= 0 || combo6.indexOf(data.rol) >= 0){
                    detalleGeneroDeporte.parent().attr('hidden', '');
                }else{
                    detalleGeneroDeporte.parent().removeAttr('hidden', '');
                    detalleGeneroDeporte.html(detalleGeneroDeporte.html() + "<span style='color: white;'>" + data.genero_deporte + "</span>");
                }

                //Insertar en la ficha el país
                var detallePais = $('#detalleUsuarioModal #detallePais');
                detallePais.html(detallePais.html() + "<span style='color: white;'>" + data.pais + "</span>");

                //Insertar en la ficha el teléfono
                var detalleTelefono = $('#detalleUsuarioModal #detalleTelefono');
                detalleTelefono.html(detalleTelefono.html() + "<span style='color: white;'>" + data.telefono + "</span>");

                //Insertar en la ficha la ubicación
                var detalleUbicacion = $('#detalleUsuarioModal #detalleUbicacion');
                if(combo2.indexOf(data.rol) >= 0 || combo5.indexOf(data.rol) >= 0 ||combo6.indexOf(data.rol) >= 0){
                    detalleUbicacion.html(detalleUbicacion.html() + "<span style='color: white;'>" + data.ubicacion + "</span>");
                    detalleUbicacion.parent().removeAttr('hidden', '');
                }else{
                    detalleUbicacion.parent().attr('hidden', '');
                }

                //Insertar en la ficha las posicones, el peso, la altura,
                //el curriculum y la extremidad dominante
                var detallePeso = $('#detalleUsuarioModal #detallePeso');
                var detalleEdominante = $('#detalleUsuarioModal #detalleEdominante');
                var detalleAltura = $('#detalleUsuarioModal #detalleAltura');
                var detalleCurriculum = $('#detalleUsuarioModal #detalleCurriculum');
                var detallePosicion = $('#detalleUsuarioModal #detallePosicion');
                if(combo1.indexOf(data.rol) >= 0){
                    detallePeso.html(detallePeso.html() + "<span style='color: white;'>" + data.peso + " " + data.tipo_peso + "</span>");
                    detalleEdominante.html(detalleEdominante.html() + "<span style='color: white;'>" + data.extremidad + "</span>");
                    detalleAltura.html(detalleAltura.html() + "<span style='color: white;'>" + data.altura + " " +  data.tipo_altura + "</span>");
                    detallePosicion.html(detallePosicion.html() + "<span style='color: white;'>" + data.posiciones + "</span>");
                    detallePeso.parent().removeAttr('hidden');
                    detalleEdominante.parent().removeAttr('hidden');
                    detalleAltura.parent().removeAttr('hidden');
                    detallePosicion.parent().removeAttr('hidden');
                    detalleCurriculum.attr('href', data.url_curriculum);
                    if (data.url_curriculum == ''){
                        detalleCurriculum.addClass("disabled");
                    }else{
                        detalleCurriculum.removeClass("disabled");
                    }
                    detalleCurriculum.parent().removeAttr('hidden');
                }else{
                    detallePeso.parent().attr('hidden', '');
                    detalleEdominante.parent().attr('hidden', '');
                    detalleAltura.parent().attr('hidden', '');
                    detalleCurriculum.parent().attr('hidden', '');
                    detallePosicion.parent().attr('hidden', '');
                }

                //Insertar en la ficha la nacionalidad, la fecha de nacimiento, el género y interesado en
                var detalleNacionalidad = $('#detalleUsuarioModal #detalleNacionalidad');
                var detalleFNacimiento = $('#detalleUsuarioModal #detalleFNacimiento');
                var detalleGenero = $('#detalleUsuarioModal #detalleGenero');
                var detalleInteresadoEn = $('#detalleUsuarioModal #detalleInteresadoEn');
                var tituloInteresado = $('#detalleUsuarioModal #tituloInteresado');
                var tituloDescripcion = $('#detalleUsuarioModal #tituloDescripcion');
                if(combo2.indexOf(data.rol) >= 0 || combo5.indexOf(data.rol) >= 0){
                    detalleNacionalidad.parent().attr('hidden', '');
                    detalleFNacimiento.parent().attr('hidden', '');
                    detalleGenero.parent().attr('hidden', '');
                    detalleInteresadoEn.parent().parent().parent().removeAttr('hidden');
                    detalleInteresadoEn.html(data.interesadoen);
                    if(combo2.indexOf(data.rol) >= 0){
                        tituloInteresado.removeAttr('hidden');
                        tituloDescripcion.attr('hidden', '');
                    }else{
                        tituloDescripcion.removeAttr('hidden');
                        tituloInteresado.attr('hidden', '');
                    }
                }else{
                    detalleNacionalidad.html(detalleNacionalidad.html() + "<span style='color: white;'>" + data.nacionalidad + "</span>");
                    detalleGenero.html(detalleGenero.html() + "<span style='color: white;'>" + data.sexo + "</span>");
                    detalleFNacimiento.html(detalleFNacimiento.html() + "<span style='color: white;'>" + data.fnacimiento + "</span>");
                    detalleNacionalidad.parent().removeAttr('hidden');
                    detalleGenero.parent().removeAttr('hidden');
                    detalleFNacimiento.parent().removeAttr('hidden');
                    detalleInteresadoEn.parent().parent().parent().attr('hidden', '');
                }

                //Insertar en la ficha la carta de presentación
                if (data.url_cpresentacion == ''){
                    $('#detalleUsuarioModal #detalleCPresentacion').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleCPresentacion').removeClass("disabled");
                }
                $('#detalleUsuarioModal #detalleCPresentacion').attr('href', data.url_cpresentacion);

                //Insertar en la ficha el equipo actual
                var detalleEactual = $('#detalleUsuarioModal #detalleEactual');
                if(combo1.indexOf(data.rol) >= 0 || combo3.indexOf(data.rol) >= 0){
                    detalleEactual.html(detalleEactual.html() + "<span style='color: white;'>" + data.equipo_actual + "</span>");
                    detalleEactual.parent().removeAttr('hidden', '');
                }else{
                    detalleEactual.parent().attr('hidden', '');
                }

                //Insertar en la ficha la página web
                var detallePaginaWeb = $('#detalleUsuarioModal #detallePaginaWeb');
                if(combo5.indexOf(data.rol) >= 0){
                    detallePaginaWeb.html(detallePaginaWeb.html() + "<span style='color: white;'>" + data.pagina_web + "</span>");
                    detallePaginaWeb.parent().removeAttr('hidden', '');
                }else{
                    detallePaginaWeb.parent().attr('hidden', '');
                }

                //Insertar en la ficha las redes sociales
                $('#detalleUsuarioModal #detalleVideos').html(estableceVideosEnDetalle(data.url_videos));
                $('#detalleUsuarioModal #detalleFacebook').attr('href', data.red_FB);
                $('#detalleUsuarioModal #detalleInstagram').attr('href', data.red_IG);
                $('#detalleUsuarioModal #detalleTwitter').attr('href', data.red_TT);
                $('#detalleUsuarioModal #detalleYouTube').attr('href', data.red_YT);
                if ($('#detalleUsuarioModal #detalleFacebook').attr('href') == ''){
                    $('#detalleUsuarioModal #detalleFacebook').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleFacebook').removeClass("disabled");
                }
                if ($('#detalleUsuarioModal #detalleInstagram').attr('href') == ''){
                    $('#detalleUsuarioModal #detalleInstagram').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleInstagram').removeClass("disabled");
                }
                if ($('#detalleUsuarioModal #detalleTwitter').attr('href') == ''){
                    $('#detalleUsuarioModal #detalleTwitter').addClass("disabled");
                }else{
                    $('#detalleUsuarioModal #detalleTwitter').removeClass("disabled");
                }
                if ($('#detalleUsuarioModal #detalleYouTube').attr('href') == ''){
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
