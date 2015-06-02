$(document).ready(function() {
  //todo--move first blocks since it's being reused from other page

  // Set audio context
  var context = new AudioContext();

  // Define function to load audio associated with a pad html object
  function loadAudio(object, url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        object.buffer = buffer;
      });
    }
    request.send();
  }

  // Define function to add audio properties to a pad
  function addAudioProperties(object) {
    object.name = object.id;
    object.source = $(object).data('url');
    loadAudio(object, object.source);
    object.play = function() {
      var s = context.createBufferSource();
      s.buffer = object.buffer;
      s.connect(context.destination);
      s.start(0);
      object.s = s;
    }
  }

  // Add audio properties for each pad
  $('.sample').each(function() {
    addAudioProperties(this);
    $(this).click(function(){
      this.play();
    });
  });
});