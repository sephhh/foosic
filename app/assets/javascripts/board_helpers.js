// Board Constructor
var createBoard = function(spec) {

    var newBoard = {
        color: spec.color,
        sampleData: spec.sampleData,
        context: spec.context,
        destination: spec.destination
    };

    newBoard.samples = [];

    for (var i = 0; i < 9; i++) {
        var sampleSpec = newBoard.sampleData[i];
        sampleSpec.context = newBoard.context;
        sampleSpec.destination = newBoard.destination;
        var sample = createSample(sampleSpec);
        newBoard.samples.push(sample);
        // delete context from spec to enable transmission
        sampleSpec.context = null;
        sampleSpec.destination = null;
    };

    newBoard.updateSample = function(padId, newSample) {
        this.samples[padId] = newSample;
        if (this.peerToPeer) {
            var message = {
                messageType: 'padUpdated',
                padId: padId,
                newSampleSpecTransmission: {
                    name: newSample.name,
                    url: newSample.url
                }
            }
            this.peerToPeer.connection.send(message);
        }
    }

    return newBoard;
}
