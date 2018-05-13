(function() {
  var MidiNotes = (function() {
    var MidiNotes = function(options = {},callback = function(){}) {
      var self = this;
    console.log('MIdinotes init');


      $.getJSON("MidiMap.json",function(data){
        self.MidiMap = data;
      }).fail(function() {
        console.log( "JSON MidiMap error" );
      });
    };
    MidiNotes.prototype.getNoteName = function getNoteName(number) {
      return this.MidiMap[number];
    };

    return MidiNotes;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = MidiNotes;
  else
    window.MidiNotes = MidiNotes;
  })();
