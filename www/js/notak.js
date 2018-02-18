(function (){
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  $(document).ready(function(){
    var norabidea = "ireki";
    var keyboardMode = "triki";
    $(document).keydown(function(event){
      var keycode = event.keyCode;
      if(keyboardMode === "triki") {
        if(event.shiftKey){
          norabidea = "ireki";
        } else {
          norabidea = "itxi";
        }
        //console.log(keycode);
        var nota = _.find(keyboardMap[keyboardMode],{'KeyCode':keycode});
        if(!nota){
          nota = _.find(keyboardMap.options,{'KeyCode':keycode});
        }
        if(nota){
          if(typeof nota.Zenbakia == 'string') {

            $('.btn-' + nota.Zenbakia).trigger('click');
          } else {
            $('.triki-nota[data-zenbakia=' + nota.Zenbakia + ']').trigger('mousedown').addClass("circle-trigger");
          }

        } else {

        }
      } else if(keyboardMode === "piano") {
          var pianoNota = _.find(keyboardMap[keyboardMode],{'KeyCode':keycode});
          if(pianoNota){
            var nota;
            if(event.shiftKey){
              nota = pianoNota.NotaShifted;
            } else {
              nota = pianoNota.Nota;
            }
            $('.piano-nota[data-nota=' + nota + ']').trigger('mousedown').addClass("piano-active");;
          }
      }
      }).keyup(function(event){
        var keycode = event.keyCode;
        if(keyboardMode === "triki") {
          var nota = _.find(keyboardMap[keyboardMode],{'KeyCode':keycode});
          if(nota){
            if(typeof nota.Zenbakia == 'string') {

            } else {
              $('.triki-nota[data-zenbakia=' + nota.Zenbakia + ']').trigger('mouseup').removeClass("circle-trigger");;
            }
          } else {

          }
        } else if(keyboardMode === "piano") {
          var pianoNota = _.find(keyboardMap[keyboardMode],{'KeyCode':keycode});

          var nota;
          if(pianoNota){
            if(event.shiftKey){
              nota = pianoNota.NotaShifted;
            } else {
              nota = pianoNota.Nota;
            }
            $('.piano-nota[data-nota=' + nota + ']').trigger('mouseup').removeClass("piano-active");
          }
        }
      });
    var sounds = {
      triki: {},
      piano: {}
    }

    var afinazioa = "DoFa";


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
    var trikiPlayer = new TrikiPlayer();



    var trikiMouseDownEv = function(e){
      var nota = $(e.target);

      //console.log(nota);
      nota.addClass('color-acive');
      var trikiZenbakia = nota.data('zenbakia');
      if(norabidea == "biak"){
        var pianoNotaItxi = trikiPlayer.play(trikiZenbakia,'itxi');
        $(".piano-nota[data-nota='" + pianoNotaItxi + "']").addClass(classes.colorItxi);
          var pianoNotaIreki =  trikiPlayer.play(trikiZenbakia,'ireki');
        $(".piano-nota[data-nota='" + pianoNotaIreki + "']").addClass(classes.colorIreki);


      } else {
        var pianoNota = trikiPlayer.play(trikiZenbakia,norabidea);
        $(".piano-nota[data-nota='" + pianoNota + "']").addClass(classes.pianoActive);
        trikiPlayer.play(trikiZenbakia,norabidea);
      }
    }
    var trikiMouseUpEv = function(e){
      var nota = $(e.target);
        nota.removeClass('color-acive');
      var trikiZenbakia = nota.data('zenbakia');

      var notaMap = trikiPlayer.getMap(afinazioa);
      if(norabidea == "biak"){
        var pianoNotaItxi = trikiPlayer.stop(trikiZenbakia,'itxi');
        $(".piano-nota[data-nota='" + pianoNotaItxi + "']").removeClass(classes.colorItxi);
        var pianoNotaIreki =  trikiPlayer.stop(trikiZenbakia,'ireki');
        $(".piano-nota[data-nota='" + pianoNotaIreki + "']").removeClass(classes.colorIreki);


      } else {
        var pianoNota = trikiPlayer.stop(trikiZenbakia,norabidea);
        $(".piano-nota[data-nota='" + pianoNota + "']").removeClass(classes.pianoActive);

      }


    }
    var pianoMouseDownEv = function(e){
      var nota = $(this);
      var pianoZenbakia = nota.data('key');
      var pianoNota = nota.data('nota');
      var trikiNotak = trikiPlayer.getZenbakia(pianoNota);
      if(trikiNotak.length === 0){
        nota.addClass(classes.pianoNone);
      } else {
        _.forEach(trikiNotak,function(element,index){
          if(element.Itxi === pianoNota){
            $(".triki-nota[data-zenbakia='" + element.Zenbakia + "']").addClass(classes.colorItxi);
          } else if(element.Ireki === pianoNota){
            $(".triki-nota[data-zenbakia='" + element.Zenbakia + "']").addClass(classes.colorIreki);
          }
        });


      }
      sounds.piano[pianoNota].seek(0);
      sounds.piano[pianoNota].play();
    }
    var pianoMouseUpEv = function(e){
      var nota = $(this);
      var pianoZenbakia = nota.data('key');
      var pianoNota = nota.data('nota');
      var trikiNotak = trikiPlayer.getZenbakia(pianoNota);
      if(trikiNotak.length === 0){
        nota.removeClass(classes.pianoNone);
      } else {
        _.forEach(trikiNotak,function(element,index){
          if(element.Itxi === pianoNota){
            $(".triki-nota[data-zenbakia='" + element.Zenbakia + "']").removeClass(classes.colorItxi);
          } else if(element.Ireki === pianoNota){
            $(".triki-nota[data-zenbakia='" + element.Zenbakia + "']").removeClass(classes.colorIreki);
          }
        });

        sounds.piano[pianoNota].stop();
      }
    }

     $('.btn-afinazioa').click(function(){
       if(!$(this).hasClass('selected')){
         $(".btn.active").removeClass("color-" + $(".btn.selected").data('action'));
         var action = $(this).data('action');
         afinazioa = action;
         $(".btn").removeClass('selected');
         $(this).addClass('selected').addClass('color-' + action);
         trikiPlayer.setAfinazioa(afinazioa);
       }
     });
     $('.btn-keyboard-mode').click(function(){
       if(!$(this).hasClass('selected')){
         $(".btn.active").removeClass("color-" + $(".btn.selected-mode").data('action'));
         var action = $(this).data('action');
         keyboardMode = action;
         $(".btn").removeClass('selected-mode');
         $(this).addClass('selected-mode').addClass('color-' + action);
       }
     });
     $('.piano-nota').each(function(index,el){
       var nota = $(el).data('nota');

       var src  = 'samples/piano/' + nota.replace('#','s') + '.wav';
       var sound = new Howl({
         src: [src]
       });
         sounds.piano[nota] = sound;
       });


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
   }
bindEvents();
    //Cargamos el JSON
    $.getJSON("KeyboardMap.json",function(data){
      keyboardMap = data;
      keyboardMapLoaded = true;

      //loadAfinazioa();
      //Bindeamos los eventos.
      //bindEvents();


      })
    .fail(function() {
      console.log( "KeyboardMap JSON error" );
    });

  });

})()
