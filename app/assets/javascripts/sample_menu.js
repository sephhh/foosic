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


//make ajax request
function SampleDivBuilder(sample_json){
  var htmlString = '<p class="sample" data-url="'
  + sample_json.url
  +'">'
  +sample_json.name
  +'</p>'
  return htmlString
}

$.getJSON( "/samples.json", function( data ) {
  data.forEach(function(sample_json){
    
    var htmlElement = $(SampleDivBuilder(sample_json))
    
    $('.modal-body').append(htmlElement[0])
    
    addAudioProperties(htmlElement[0]);
    
    $(htmlElement[0]).click(function(){
      this.play();
    });
  });
  


  $('#sampleModal').modal('show') 
});


//when you get json back

  //show a modal
  //make div for each sample
  //on click each sample plays a sound
  //confirm button at bottom will do something special