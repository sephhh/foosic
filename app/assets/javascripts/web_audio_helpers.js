// Define function to load audio associated with a pad html object
function loadAudio(sample) {
    var request = new XMLHttpRequest();
    request.open('GET', sample.url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        sample.context.decodeAudioData(request.response, function(buffer) {
            sample.buffer = buffer;
        });
    }
    request.send();
}

// Sample constructor
var createSample = function(spec) {
    var newSample = {
        name: spec.name,
        url: spec.url,
        context: spec.context,
        destination: spec.destination
    }

    loadAudio(newSample);

    newSample.play = function() {
        var source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.destination);
        source.start(0);
        this.source = source;
    }

    newSample.loop = function() {
        var source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.destination);
        source.loop = true;
        source.start(this.context.currentTime + 0.7);
    }

    return newSample;
}
