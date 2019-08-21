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
                var content = "";
                for (var i in data.lista_usuarios) {
                    var id = data.lista_usuarios[i][0];
                    var url = data.lista_usuarios[i][1];
                    var src = "/static/" + url;
                    content += "<div class='col-3'" + " onclick='verDetalle(" + id.toString() + ");' data-aos='zoom-in' data-aos-duration='500' style='text-align: center; margin-top: 50px;'><img width='400px' src='" + src + "' /></div>";
                }
                $('.resultados .row').html(content);
                if(busqueda){
                    total_cromos = parseInt(data.total_registros);
                    ultimaPagina = Math.ceil(total_cromos / 9);
                    rangoFin = Math.min(ultimaPagina, limiteBotones);
                    dibujaBotones();
                }
            },error: function(data){
                $('.toast-error .content').text('Error en la carga del cromo.');
                $('.toast-error').toast('show');
            }
        });
    });
}
