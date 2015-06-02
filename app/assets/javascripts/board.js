$(document).ready(function() {
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
  $('.pad').each(function() {
    addAudioProperties(this);
  });

  // Define key index
  var keys = [84,89,85,71,72,74,66,78,77];

  // Add button press
  addEventListener("keydown", function(event) {
    for (var i = 0; i < 9; i++) {
      if (event.keyCode == keys[i]) {
        var pad_id = '#pad-' + i;
        $(pad_id)[0].play();
        $(pad_id).css("background-color","blue");
      };
    };
  });
  addEventListener("keyup", function(event) {
    for (var i = 0; i < 9; i++) {
      if (event.keyCode == keys[i]) {
        var pad_id = '#pad-' + i;
        $(pad_id).css("background-color","black");
      };
    };
  });

  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
      $("#menu-arrow").toggleClass("glyphicon-chevron-right glyphicon-chevron-left");
  });

});
