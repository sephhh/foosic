// Animations for looper
function Animator() {
    this.looping = false;
    this.blinker;
    this.looping;
}

Animator.prototype.startLoop = function(duration) {
    looping = true;
    function wipe_right(elem, width) {
        elem.css('width', '0px');
        elem.css("right", width);
        elem.animate({
            width: width,
            right: '0px'
        }, duration, 'linear', function(){
            if (looping) {
                wipe_right(elem, width);
            }
        });
    }
    $('#player-layer').addClass('show');
    wipe_right($('#player-layer'), $('#player-layer').css('width'));
}

Animator.prototype.endLoop = function() {
    looping = false;
    $('#player-layer').removeClass('show');
}

Animator.prototype.startBlinking = function() {
    blinker = window.setInterval(function () {
        $('#recording-layer').toggleClass("show");
    }, 100);
}

Animator.prototype.stopBlinking = function() {
    clearInterval(blinker);
}

Animator.prototype.showRecordingIndicator = function() {
    $('#recording-layer').addClass("show");
}

Animator.prototype.hideRecordingIndicator = function() {
    $('#recording-layer').removeClass("show");
}

// Looper
function Looper (recorder){
    this.rec = recorder;
    this.looperState = 'off'; // other states are 'listening','recording', and 'looping'
    this.loopSource;
    this.loopBuffer;
    this.eventId = null;
    this.animator = new Animator();
}

Looper.prototype.respond = function(first_argument) {
    if (this.looperState === 'off') {
        // animate
        this.animator.startBlinking();
        // start listening
        var thisRec = this.rec;
        var that = this;
        function loop(){
            // animate
            that.animator.stopBlinking();
            that.animator.showRecordingIndicator();
            thisRec.clear();
            thisRec.record();
            that.looperState = 'recording';
            document.removeEventListener('padPress', loop);
        }
        document.addEventListener('padPress', loop);
        this.looperState = 'listening';
    } else if (this.looperState === 'listening') {
        // animate
        this.animator.stopBlinking();
        this.animator.hideRecordingIndicator();
        // cancel listening
        document.removeEventListener('padPress', loop);
        this.looperState = 'off';
    } else if (this.looperState === 'recording') {
        // animate
        this.animator.hideRecordingIndicator();
        this.animator.startLoop(2000);
        // stop recording and start playback
        this.rec.stop();
        this.playLoop();
        this.looperState = 'playback';
    } else if (this.looperState === 'playback'){
        // animate
        this.animator.endLoop();
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
