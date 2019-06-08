$(document).ready(function(){
    $('#aQueJuegasDropdown').change(function () {
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
  establecerPosiciones($('#aQueJuegasDropdown').val());

  $('#customFileCarta').on('change',function(){
     //get the file name
     var fileName = $(this).val();
     //replace the "Choose a file" label
     $(this).next('.custom-file-label').html(fileName);
 });

 $('#customFileCurriculum').on('change',function(){
    //get the file name
    var fileName = $(this).val();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
});

});

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
