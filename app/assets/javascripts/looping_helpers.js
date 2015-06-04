function Looper (recorder){
    this.rec = recorder;
    this.looperState = 'off'; // other states are 'listening','recording', and 'looping'
    this.loopSource;
    this.loopBuffer;
    this.eventId = null;
}

Looper.prototype.respond = function(first_argument) {
    if (this.looperState === 'off') {
        // start listening
        var thisRec = this.rec;
        var that = this;
        function loop(){
            thisRec.clear();
            thisRec.record();
            that.looperState = 'recording';
            document.removeEventListener('padPress', loop);
        }
        document.addEventListener('padPress', loop);
        this.looperState = 'listening';
    } else if (this.looperState === 'listening') {
        // cancel listening
        document.removeEventListener('padPress', loop);
        this.looperState = 'off';
    } else if (this.looperState === 'recording') {
        // stop recording and start playback
        this.rec.stop();
        this.playLoop();
        this.looperState = 'playback';
    } else if (this.looperState === 'playback'){
        // stop recording
        if (this.loopSource) {
            this.loopSource.stop();
        };
        this.looperState = 'off';
    }
};

Looper.prototype.playLoop = function() {
    this.rec.getBuffer(function(buffers) {
        this.loopSource = context.createBufferSource();
        this.loopBuffer = context.createBuffer( 2, buffers[0].length, context.sampleRate );
        this.loopBuffer.getChannelData(0).set(buffers[0]);
        this.loopBuffer.getChannelData(1).set(buffers[1]);
        this.loopSource.buffer = this.loopBuffer;
        // line below added for looping
        this.loopSource.loop = true;

        this.loopSource.connect(context.destination);
        this.loopSource.start(0);
    }.bind(this));
    this.recordingState = false;
};

Looper.prototype.animate = function(animation) {
    switch(animation) {
    case '':
        code block
        break;
    case '':
        code block
        break;
    default:
        default code block
}
}
