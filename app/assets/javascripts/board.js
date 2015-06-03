// AUDIO SETUP
// Set audio context
var context = new AudioContext();
var preout = context.createGain();
var loopBuffer, loopSource;
var padEvent = new Event('padPress');
var recordingState = false;
preout.connect(context.destination);

// configure recorder.js
var rec = new Recorder(preout);

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


//Once the page loads
$(document).ready(function() {
    // Add audio properties for each pad
    $('.pad').each(function() {
        addAudioProperties(this);
    });

    // Define key index
    var keys = [84,89,85,71,72,74,66,78,77];

    // Add button press
    addEventListener("keydown", function(event) {
        for (var i = 0; i < 9; i++) {
            if (event.keyCode == keys[i]) {
                // fire play event
                document.dispatchEvent(padEvent)
                var pad_id = '#pad-' + i;
                $(pad_id)[0].play();
                $(pad_id).css("background-color","blue");
            };
        };
        if (event.keyCode == 32) {
            if (recordingState) {
                rec.stop();
                rec.getBuffer(function(buffers) {
                    loopSource = context.createBufferSource();
                    loopBuffer = context.createBuffer( 2, buffers[0].length, context.sampleRate );
                    loopBuffer.getChannelData(0).set(buffers[0]);
                    loopBuffer.getChannelData(1).set(buffers[1]);
                    loopSource.buffer = loopBuffer;
                    // line below added for looping
                    loopSource.loop = true;

                    loopSource.connect(context.destination);
                    loopSource.start(0);
                    recordingState = false;
                });
            } else {
                // Start listening for button press
                if (loopSource) {
                    loopSource.stop();
                };
                function loop(){
                    // listen for play event. on play event do...
                    rec.clear();
                    rec.record();
                    document.removeEventListener('padPress', loop);
                };
                document.addEventListener('padPress', loop);
                recordingState = true;
            }
        };
    });
    addEventListener("keyup", function(event) {
        for (var i = 0; i < 9; i++) {
            if (event.keyCode == keys[i]) {
                var pad_id = '#pad-' + i;
                $(pad_id).css("background-color","black");
            };
        };
    });

    // CLICK TRIGGERS

    //toggle menu
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $("#menu-arrow").toggleClass("glyphicon-chevron-right glyphicon-chevron-left");
    });


    //click "change pad" from menu
    $('#change-pad').click(function(){
        $('.pad').bind({
            //pad changes color when mouse enters
            mouseenter: function() {
                $(this).css("background-color","#2D2D2D");
                $(this).css("cursor","pointer");
            },
            mouseleave: function() {
                $(this).css("background-color","black");
                $(this).css("cursor","auto");
            },
            //clicking pad brings up menu to select new sample
            click: function() {
                initializeSelector(this.id);
                // $('#sampleModal').modal('show');
                // var padId = this.id;
            }
        });

        //flash message
        $('.select-a-pad').modal('toggle');
        window.setTimeout(function(){
            $('.select-a-pad').modal('toggle')
        }, 1000);
    });


});
