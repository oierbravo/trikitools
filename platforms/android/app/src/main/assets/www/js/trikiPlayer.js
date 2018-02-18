(function() {
  var TrikiPlayer = (function() {
    var TrikiPlayer = function(options = {},callback = function(){}) {
      var self = this;
      self.notakMap = false;
      self.notaMapLoaded = false;
      self.currentAfinazioa = "DoFa";
      self.sounds = [];
      self.afinazioak = [];
      self.capitalizeFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }


      var loadSounds = function(){
        //self.sounds.triki[afinazioa] = {};
        self.sounds.triki = {};
        _.forEach(self.notakMap,function(element,afinazioa){
          self.sounds.triki[afinazioa] = {};
          self.afinazioak.push(afinazioa);
          //console.log(afinazioa);
          _.forEach(self.notakMap[afinazioa],function(element,index){
            var soundIreki = new Howl({
              src: ['./samples/triki/'+ afinazioa + '/' + element.Zenbakia + ' - Ireki.ogg']
            });
            var soundItxi = new Howl({
              src: ['./samples/triki/'+ afinazioa + '/' + element.Zenbakia + ' - Itxi.ogg']
            });
            //console.log(element);
            self.sounds.triki[afinazioa][element.Zenbakia] = {
              ireki:soundIreki,
              itxi:soundItxi,
            }
          });
        });
      }
      $.getJSON("Notak.json",function(data){
        self.notakMap = data;
        self.notaMapLoaded = true;

        loadSounds();
        callback();
        })
      .fail(function() {
        console.log( "JSON error" );
      });

    };
    TrikiPlayer.prototype.setAfinazioa = function setAfinazioa(afinazioa) {
      return this.currentAfinazioa = afinazioa;
    };
    TrikiPlayer.prototype.getMap = function getMap(afinazioa) {
      return this.notakMap[afinazioa];
    };
    TrikiPlayer.prototype.getNota = function getNota(zenbakia,norabidea) {
      return this.notakMap[this.currentAfinazioa][zenbakia][this.capitalizeFirstLetter(norabidea)];
    };
    TrikiPlayer.prototype.play = function play(trikiZenbakia,norabidea) {
      this.sounds.triki[this.currentAfinazioa][trikiZenbakia][norabidea].seek(0);
      this.sounds.triki[this.currentAfinazioa][trikiZenbakia][norabidea].play();
      return this.notakMap[this.currentAfinazioa][trikiZenbakia][this.capitalizeFirstLetter(norabidea)];
    };
    TrikiPlayer.prototype.stop = function play(trikiZenbakia,norabidea) {
      this.sounds.triki[this.currentAfinazioa][trikiZenbakia][norabidea].stop();
      return this.notakMap[this.currentAfinazioa][trikiZenbakia][this.capitalizeFirstLetter(norabidea)];
    };

    return TrikiPlayer;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = TrikiPlayer;
  else
    window.TrikiPlayer = TrikiPlayer;
  })();
