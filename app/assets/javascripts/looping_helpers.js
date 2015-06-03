function Looper (recorder){
  this.rec = recorder;
  this.recordingState = false;
  this.loopSource;
  this.loopBuffer;
  this.eventId = null;
}

Looper.prototype.respond = function(first_argument) {
  if (this.recordingState === true) {
    this.rec.stop();
    this.playLoop();

  } else {
      // Start listening for button press
      if (this.loopSource) {
          this.loopSource.stop();
      };

      var thisRec = this.rec;
      function loop(){
        thisRec.clear();
        thisRec.record();
        document.removeEventListener('padPress', loop);
      }
      document.addEventListener('padPress', loop);
      this.recordingState = true;
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


