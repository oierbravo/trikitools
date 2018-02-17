(function (){
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function note2MIDInumber(note) {
    var noteValue = {
      A:9,
      B:11,
      C:0,
      D:2,
      E:4,
      F:5,
      G:7
    }
    var output;
    if(note.length == 2){
      output = 12 + parseInt(noteValue[note.charAt(0)]) + 12 * parseInt(note.charAt(1));
    } else if(note.length == 3) {
      output = 12 + parseInt(noteValue[note.charAt(0)]) + 1 + 12 * parseInt(note.charAt(2));
    } else {
        output = '@#';
    }
    return output;
  }
  $(document).ready(function(){
    $(document).keydown(function(event){
      var keycode = event.keyCode;
      console.log(keycode);
      var nota = _.find(notakMap['keyboard'],{'KeyCode':keycode});
      if(nota){
        if(typeof nota.Zenbakia == 'string') {
        
          $('.btn-' + nota.Zenbakia).trigger('click');
        } else {
          $('.triki-nota[data-zenbakia=' + nota.Zenbakia + ']').trigger('mousedown').addClass("circle-trigger");
        }

      } else {

      }
      }).keyup(function(event){
        var keycode = event.keyCode;
        var nota = _.find(notakMap['keyboard'],{'KeyCode':keycode});
        if(nota){
          if(typeof nota.Zenbakia == 'string') {

          } else {
            $('.triki-nota[data-zenbakia=' + nota.Zenbakia + ']').trigger('mouseup').removeClass("circle-trigger");;
          }
        } else {
        }
        });
    var sounds = {
      triki: {},
      piano: {}
    }

    var afinazioa = "DoFa";

    var norabidea = "ireki";
    var notakMap;
    var notaMapLoaded = false;

    //Verificamos si es movil.
    var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
  	if(isMobile) { var evtListener = ['touchstart', 'touchend']; } else { var evtListener = ['mousedown', 'mouseup']; }

    var classes = {
      colorItxi:'color-itxi',
      colorIreki:'color-ireki',
      colorAfinazioa:'color-afinazioa',
      pianoActive:'piano-active',
      pianoNone:'piano-none'

    }

    var trikiMouseDownEv = function(e){
      var nota = $(e.target);
      nota.addClass('color-acive');
      var trikiZenbakia = nota.data('zenbakia');
      if(norabidea == "biak"){
        var pianoNotaItxi = e.target.dataset.itxi;
        $(".piano-nota[data-nota='" + pianoNotaItxi + "']").addClass(classes.colorItxi);
          var pianoNotaIreki =  e.target.dataset.ireki;
        $(".piano-nota[data-nota='" + pianoNotaIreki + "']").addClass(classes.colorIreki);
        sounds.triki[afinazioa][trikiZenbakia].itxi.seek(0);
        sounds.triki[afinazioa][trikiZenbakia].itxi.play();
        sounds.triki[afinazioa][trikiZenbakia].ireki.seek(0);
        sounds.triki[afinazioa][trikiZenbakia].ireki.play();
      } else {
        var pianoNota = e.target.dataset[norabidea];
        $(".piano-nota[data-nota='" + pianoNota + "']").addClass(classes.pianoActive);
        sounds.triki[afinazioa][trikiZenbakia][norabidea].seek(0);
        sounds.triki[afinazioa][trikiZenbakia][norabidea].play();
      }
    }
    var trikiMouseUpEv = function(e){
      var nota = $(e.target);
        nota.removeClass('color-acive');
      var trikiZenbakia = nota.data('zenbakia');
      var notaMap = notakMap[afinazioa][trikiZenbakia];

      if(norabidea == "biak"){
        var pianoNotaItxi = e.target.dataset.itxi;
        $(".piano-nota[data-nota='" + pianoNotaItxi + "']").removeClass(classes.colorItxi);
        var pianoNotaIreki =  e.target.dataset.ireki;
        $(".piano-nota[data-nota='" + pianoNotaIreki + "']").removeClass(classes.colorIreki);

        sounds.triki[afinazioa][trikiZenbakia].itxi.stop();
        sounds.triki[afinazioa][trikiZenbakia].ireki.stop();
      } else {
        var pianoNota = e.target.dataset[norabidea];
        $(".piano-nota[data-nota='" + pianoNota + "']").removeClass(classes.pianoActive);
        sounds.triki[afinazioa][trikiZenbakia][norabidea].stop();
      }


    }
    var loadAfinazioa = function(){
      sounds.triki[afinazioa] = {};
      _.forEach(notakMap[afinazioa],function(element,index){
        var soundIreki = new Howl({
          src: ['./samples/triki/'+ afinazioa + '/' + element.Zenbakia + ' - Ireki.ogg']
        });
        var soundItxi = new Howl({
          src: ['./samples/triki/'+ afinazioa + '/' + element.Zenbakia + ' - Itxi.ogg']
        });
        //console.log(element);
        sounds.triki[afinazioa][element.Zenbakia] = {
          ireki:soundIreki,
          itxi:soundItxi,
        }
        var keyItxi = note2MIDInumber(element.Itxi);
        var keyIreki = note2MIDInumber(element.Ireki);
        notakMap[afinazioa][element.Zenbakia].KeyItxi = keyItxi;
        notakMap[afinazioa][element.Zenbakia].keyIreki = keyIreki;
        $('.triki-nota[data-zenbakia=' + element.Zenbakia + ']').attr('data-keyitxi',keyItxi);
        $('.triki-nota[data-zenbakia=' + element.Zenbakia + ']').attr('data-keyireki',keyIreki);
        _.forEach(element,function(value,key){
          //ponemos todos los valores de cada nota como attribute.
          $('.triki-nota[data-zenbakia=' + element.Zenbakia + ']').attr('data-' + key.toLowerCase(),value);
        });

        });
    }
    var pianoMouseDownEv = function(e){
      var nota = $(this);
      var pianoZenbakia = nota.data('key');
      var pianoNota = nota.data('nota');
      if($(".triki-nota[data-itxi='" + pianoNota + "']").length == 0 && $(".triki-nota[data-ireki='" + pianoNota + "']").length == 0){
        nota.addClass(classes.pianoNone);
      }
      $(".triki-nota[data-itxi='" + pianoNota + "']").addClass(classes.colorItxi);
      $(".triki-nota[data-ireki='" + pianoNota + "']").addClass(classes.colorIreki);
      sounds.piano[pianoNota].seek(0);
      sounds.piano[pianoNota].play();
    }
    var pianoMouseUpEv = function(e){
      var nota = $(this);
      var pianoZenbakia = nota.data('key');
      var pianoNota = nota.data('nota');
      if($(".triki-nota[data-itxi='" + pianoNota + "']").length == 0 && $(".triki-nota[data-ireki='" + pianoNota + "']").length == 0){
        nota.removeClass(classes.pianoNone);
      }
      $(".triki-nota[data-itxi='" + pianoNota + "']").removeClass(classes.colorItxi);
      $(".triki-nota[data-ireki='" + pianoNota + "']").removeClass(classes.colorIreki);
      sounds.piano[pianoNota].stop();
    }
   var bindEvents = function(){
     $('.triki-nota').on(evtListener[0],trikiMouseDownEv).on(evtListener[1],trikiMouseUpEv);
     $('.piano-nota').on(evtListener[0],pianoMouseDownEv).on(evtListener[1],pianoMouseUpEv);
     $('.btn-norabidea').click(function(){
       if(!$(this).hasClass('active')){
         $(".btn.active").removeClass("color-" + $(".btn.active").data('action'));
         var action = $(this).data('action');
         norabidea = action;
         $(".btn").removeClass('active');
         $(this).addClass('active').addClass('color-' + action);
       }
     });
     $('.btn-afinazioa').click(function(){
       if(!$(this).hasClass('selected')){
         $(".btn.active").removeClass("color-" + $(".btn.selected").data('action'));
         var action = $(this).data('action');
         afinazioa = action;
         $(".btn").removeClass('selected');
         $(this).addClass('selected').addClass('color-' + action);
         loadAfinazioa();
       }
     });
     $('.piano-nota').each(function(index,el){
       var nota = $(el).data('nota');

       var src  = './samples/piano/' + nota.replace('#','s') + '.wav';
       var sound = new Howl({
         src: [src]
       });
         sounds.piano[nota] = sound;
       });

   }
    //Cargamos el JSON
    $.getJSON("Notak.json",function(data){
      notakMap = data;
      notaMapLoaded = true;

      loadAfinazioa();
      //Bindeamos los eventos.
      bindEvents();


      })
    .fail(function() {
      console.log( "JSON error" );
    });

  });

})()
