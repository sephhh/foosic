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

    loadAudio(that);

    newSample.play = function() {
        var source = that.context.createBufferSource();
        source.buffer = that.buffer;
        source.connect(that.destination);
        source.start(0);
        that.source = source;
    }

    return newSample;
}

// Board Constructor
var createBoard = function(spec) {
    var samples = [];

    for (var i = 0; i < 9; i++) {
        var sampleSpec = spec.sampleData[i];
        sampleSpec.context = spec.context;
        sampleSpec.destination = spec.destination;
        var sample = createSample(sampleSpec);
        samples.push(sample);
    };

    var newBoard = {
        color: spec.color,
        samples: samples
    };

    newBoard.updateSample = function(padId, newSample) {
        this.samples[padId] = newSample;
        if (conn) {
            var message = {
                messageType: 'boardUpdate',
                board: that,
                update: {
                    padId: padId,
                    newSample: newSample
                }
            };
            conn.send(message);
        }
    }

    return newBoard;
}
