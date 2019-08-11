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
