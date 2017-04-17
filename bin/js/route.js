$(document).ready(function(){
  navigator.sayswho= (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    return M;
  })();

  var browser_version = navigator.sayswho;
  var firefox = browser_version.indexOf("Firefox") > -1;
  if(!firefox){
    alert("Porfavor abra este libro en Firefox, de lo contrario no funcionara correctamente");
  }

  //$("li[data-tema] > a").attr("href","/#/"+$(this).parent().parent().data("tema")+"");
  $("li[data-tema] ").on('click',function(){

    var min_route = $(this).data("tema");
    minRoute = min_route;
    var route = "contenido/"+min_route+".json";
    var dataObject;

    $(this).find("a").attr("href","#/"+min_route);

    console.log("\nRoute: /"+route);

    var dataJson = $.getJSON( route, function() {
      console.log( "La carga del JSON se completo satisfactoriamente." );
    })
    .fail(function(){
      console.log("No se logro encontrar ningun archivo con la ruta /"+route);
      $("article > #title").html("<h2>Error 404 <small>Pagina no encontrada</small></h2><p class='description'>Lo sentimos la pagina no ha sido encontrada, intente una nueva ruta.<br>Ruta ingresada: "+route+"</p>");
      $("article > #content").html("");
    })
    .done(function() {

      dataObject = JSON.parse(dataJson.responseText);
      console.log( "La asignacion del JSON se completo satisfactoriamente." );

      //Titulo y descripcion
      var title = "";
      var content = "";
      var subtemas = "";

      if(min_route[2] == 'p'){
        //alert("Examen!");
        title = "<h2>"+(dataObject.nombre) + "<small>Capitulo "+min_route[0]+" - Evaluación </small></h2><p class='description'>"+(dataObject.descripcion)+"</p>";
      }
      else if( min_route[2] == 'a'){
        //alert("Actividad!");
        title = "<h2>"+(dataObject.nombre) + "<small>Capitulo "+min_route[0]+" - Actividad "+min_route[min_route.length-1]+"</small></h2><p class='description'>"+(dataObject.descripcion)+"</p>";
      }
      else{
        title = "<h2>"+(dataObject.nombre) + "<small>Capitulo "+min_route[0]+" - Tema "+min_route[min_route.length-1]+"</small></h2><p class='description'>"+(dataObject.descripcion)+"</p>";

        var subcont = true;
          for (var i = 0; i < dataObject.contenido.length; i++) {
            //console.log(dataObject.contenido[i]);
            content += "<h3>"+(dataObject.contenido[i].nombre)+"</h3>";
            if(subcont){
              content += "<div id='subtemas'><h5>Contenido</h5><ul></ul></div>"
              subcont = false;
            }
            content += "<p>"+dataObject.contenido[i].contenido+"</p>"
            if(dataObject.contenido[i].tipo == "imagen"){
              content += "<figure><img src='"+dataObject.contenido[i].url+"'/></figure>";
              //content += "<div style='height:100px'><div>";
            }else if(dataObject.contenido[i].tipo == "video"){
              content += "video aqui";
              //content = dataObject.url
            }else if(dataObject.contenido[i].tipo == "audio"){
              content += "aqui audio";
            }
          }
        
        subtemas = "";
          for (var i = 0; i < dataObject.contenido.length; i++) {
            //console.log(dataObject.contenido[i]);
            subtemas += "<li><span class='sub'>"+(dataObject.contenido[i].nombre)+"</span></li>"
          };
      }

      $("article > #title").html(title);  
      $("article > #content").html(content);
      $("#subtemas > ul").html(subtemas);
      $(".sub").on("click",function(){
        var section = $(this).html();
        console.log("Se recorrio la pagina hasta: _"+section+" con exito");
        $('html,body').animate({
          scrollTop: $("h3:contains('"+section+"')").offset().top
        }, 1000);
      });
      //$("article > #content > figure").height($(this).find("img").height()+10);
      //$("article > #content > figure").width($(this).find("img").width()+10);
    });
  });
  //console.log($("li[data-capitulo='1'] > input[name='tem']"));

  var url = ((""+window.location+"").split('#'))[1].substring(1,this.length);
  if(url){
    $("li[data-capitulo='"+url[0]+"'] > input[name='tem']").attr('checked','checked');
    $("input#enter").attr('checked','checked');
    $("li[data-tema='"+url+"']").trigger('click');
  }
});
