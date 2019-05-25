$(document).ready(function(){
    $('#aQueJuegasDropdown').change(function () {
      var pk = $(this).val();
      $.ajax({
         type: "GET",
         url: "/get_posiciones/"+ pk,
         success: function (data) {
             $("#posicionDropdown").html(data);
         }
      });
    });
});
