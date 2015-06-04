// AUDIO SETUP
// Set audio context
var context = new AudioContext();
var preout = context.createGain();
var padEvent = new Event('padPress');
preout.connect(context.destination);

// configure recorder.js
var rec = new Recorder(preout);
var looper = new Looper(rec);

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
        //if it's one of our keypad keys
        if (keys.indexOf(event.keyCode) >= 0){
            if (looper.looperState === 'listening') {
                looper.respond(true);
            }
            //select the pad, play, and change color
            var $pad = $('#pad-' + keys.indexOf(event.keyCode));
            $pad[0].play();
            $pad.css("background-color","blue");
        };
        //if it's the space bar
        if (event.keyCode === 32) {
            //looper object responds to spacebar press
            looper.respond();
        };
    });
    addEventListener("keyup", function(event) {

        if (keys.indexOf(event.keyCode) >= 0){
            //select the pad, play, and change color
            var $pad = $('#pad-' + keys.indexOf(event.keyCode));
            $pad.css("background","rgba(0,0,0,0)");
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
    $('#change-pad').click(changePadHandler);

});


