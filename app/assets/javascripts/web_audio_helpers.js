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
function addAudioProperties(object, url) {
    object.name = object.id;
    object.source = url || $(object).data('url');
    loadAudio(object, object.source);
    object.play = function() {
        var s = context.createBufferSource();
        s.buffer = object.buffer;
        s.connect(preout);
        s.start(0);
        object.s = s;
    }
}