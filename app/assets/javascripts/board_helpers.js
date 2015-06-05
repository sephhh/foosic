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
