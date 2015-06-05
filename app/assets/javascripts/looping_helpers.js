// Animator constructor
var createAnimator = function(spec) {
    that = {
        looping: false
    };

    that.startLoop = function(duration) {
        this.looping = true;
        function wipe_right(elem, width) {
            elem.css('width', '0px');
            elem.css("right", width);
            elem.animate({
                width: width,
                right: '0px'
            }, duration, 'linear', function(){
                if (this.looping) {
                    wipe_right(elem, width);
                }
            });
        }
        $('#player-layer').addClass('show');
        wipe_right($('#player-layer'), $('#player-layer').css('width'));
    }

    that.endLoop = function() {
        this.looping = false;
        $('#player-layer').removeClass('show');
    }

    that.startBlinking = function() {
        this.blinker = window.setInterval(function () {
            $('#recording-layer').toggleClass("show");
        }, 100);
    }

    that.stopBlinking = function() {
        clearInterval(this.blinker);
    }

    that.showRecordingIndicator = function() {
        $('#recording-layer').addClass("show");
    }

    that.hideRecordingIndicator = function() {
        $('#recording-layer').removeClass("show");
    }

    return that;
}

// Looper constructor
var createLooper = function(spec) {
    that = {
        rec: spec.rec,
        looperState: 'off',
        animator: createAnimator(),
        context: spec.context
    };

    that.respond = function(notSpaceBar) {
        if (this.looperState === 'off') {
            // animate
            this.animator.startBlinking();
            // start listening
            this.looperState = 'listening';
        } else if (this.looperState === 'listening') {
            if (notSpaceBar) {
                // animate
                this.animator.stopBlinking();
                this.animator.showRecordingIndicator();
                // start recording
                debugger;
                this.rec.clear();
                this.rec.record();
                this.looperState = 'recording';
            } else {
                // animate
                this.animator.stopBlinking();
                this.animator.hideRecordingIndicator();
                // cancel listening
                this.looperState = 'off';
            }
        } else if (this.looperState === 'recording') {
            // animate
            this.animator.hideRecordingIndicator();
            // stop recording and start playback
            this.rec.stop();
            debugger;
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

    that.playLoop = function() {
        this.rec.getBuffer(function(buffers) {
            this.loopSource = this.context.createBufferSource();
            this.loopBuffer = this.context.createBuffer(2, buffers[0].length, this.context.sampleRate);
            this.animator.startLoop(this.loopBuffer.duration * 1000);
            this.loopBuffer.getChannelData(0).set(buffers[0]);
            this.loopBuffer.getChannelData(1).set(buffers[1]);
            this.loopSource.buffer = this.loopBuffer;
            // line below added for looping
            this.loopSource.loop = true;

            this.loopSource.connect(this.context.destination);
            this.loopSource.start(0);
        }.bind(this));
        this.recordingState = false;
    };

    return that;
}
