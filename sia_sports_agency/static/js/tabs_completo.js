var hideOrShowTabs = function(tab){
    var to_show;
    var to_hide;
    switch(tab){
        case 'db':
            to_show = 'datosBasicos';
            to_hide = ['datosEspecificos', 'mensajes'];
            break;
        case 'da':
            to_show = 'datosEspecificos';
            to_hide = ['datosBasicos', 'mensajes'];
            break;
        case 'me':
            to_show = 'mensajes';
            to_hide = ['datosEspecificos', 'datosBasicos'];
            break;
        default:
            to_show = 'datosBasicos';
            to_hide = ['datosEspecificos', 'mensajes'];
            break;
    };
    setTab(to_show, to_hide);
};

var setTab = function(to_show, to_hide){
    $("#" + to_show).show();
    $("." + to_show + "Tab").addClass( "active" );
    hideMultiple(to_hide);
};

var hideMultiple = function(list_to_hide){
    var i;
    for (i = 0; i < list_to_hide.length; i++) {
        $("#" + list_to_hide[i]).hide();
        $("." + list_to_hide[i] + "Tab").removeClass( "active" );
    }
};
