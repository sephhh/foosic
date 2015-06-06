//Once the page loads
$(document).ready(function() {
    // AUDIO SETUP
    // Set audio context
    var context = new AudioContext();
    // Set preout to route all pads to for recording
    var preout = context.createGain();
    // Connect preout to destination
    preout.connect(context.destination);
    // Configure recorder.js
    var rec = new Recorder(preout);
    // Create looper - rec knows what to record, context allows loop to be played
    var looper = createLooper({rec: rec, context: context});

    // CREATE USER BOARD
    var userBoard, sampleData;
    // specify board color
    var boardSpec = {color: 'blue', destination: preout, context: context};
    // specify default board settings
    var defaultBoard = [
        "Boom Kick",
        "Multi Clap",
        "Cereal",
        "Don't wanna",
        "Bella Synthdrum",
        "Contact Mic",
        "SD_militaire_synth",
        "booga_hit_double",
        "ghana_bell_high"
    ];
    if (window.location.href.match(/kanye/)) {
        defaultBoard = [
            "Kanye Piano 1",
            "Kanye Piano 2",
            "Kanye Piano 3",
            "Kanye Piano 4",
            "Kanye Piano 5",
            "Kanye Piano 6",
            "Kanye Piano 7",
            "Kanye Piano 8",
            "Look at ya"
        ]
    }
    // get all sample data - NOTE: can probably push some of this logic to the server
    $.getJSON("/samples.json", function(data) {
        sampleData = data;
        // filter for defaults
        var defaultSampleData = [];
        data.forEach(function(sampleData){
            for (var i = 0; i < 9; i++) {
                if (sampleData.name === defaultBoard[i]) {
                    defaultSampleData.push(sampleData);
                }
            }
        });
        boardSpec.sampleData = defaultSampleData;
        // Initialize board
        userBoard = createBoard(boardSpec);
    });

    // BUTTON PRESS LISTENERS
    // Define key index
    var keys = [84,89,85,71,72,74,66,78,77];

    addEventListener("keydown", function(event) {
        event.preventDefault();
        event.stopPropagation();
        var padId = keys.indexOf(event.keyCode);
        //if it's one of our keypad keys
        if (padId >= 0){
            // change state of looper if it's listening
            if (looper.looperState === 'listening') {
                looper.respond(true);
            }
            // play the sample on the userBoard
            userBoard.samples[padId].play();
            // change color of pad
            $('#pad-' + padId).addClass(userBoard.color);
            // send pad play to connected users
            if (conn) {
                var message = {
                    messageType: 'padPlay',
                    padId: padId
                }
                conn.send(message);
            }
        };
        //if it's the space bar
        if (event.keyCode === 32) {
            //looper object responds to spacebar press
            looper.respond();
        };
    });

    addEventListener("keyup", function(event) {
        var padId = keys.indexOf(event.keyCode);
        if (padId >= 0){
            // change color back
            $('#pad-' + padId).removeClass(userBoard.color);
            // change peer's color back
            if (conn) {
                var message = {
                    messageType: 'padStop',
                    padId: padId
                }
                conn.send(message);
            }
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
    var changePadHandler;
    $('#change-pad').click(function() {
        if (!changePadHandler) {
            var changePadHandlerSpec = {
                board: userBoard,
                sampleData: sampleData,
                context: context,
                destination: preout
            }
            changePadHandler = createChangePadHandler(changePadHandlerSpec);
        }
        changePadHandler.selectAPadOn();
        $('.modal-ul').append(changePadHandler.sampleList);
        $('#confirm-sample').click(function(){
            changePadHandler.changePadConfirm();
        });
        $("#sampleModal").on('hidden.bs.modal', function(){
            $('.pad').unbind();
            $('#confirm-sample').off();
            $('.sample-list').removeClass('active');
            changePadHandler.mode = 'inactive';
        });
    });

    // KANYE MODE
    if (window.location.href.match(/kanye/)) {
        var key_array=[]
        var runaway = [84, 84, 84, 89, 85, 85, 85, 71, 72, 72, 72, 74, 66, 66, 78, 84].join("yeezy");
        var kanyeSpec = {
            name: "kanye loop",
            url: "https://dl.dropboxusercontent.com/s/kk2n3c4fi2zmhbe/kanye-west-runaway-beat-loop.wav?dl=0",
            context: context,
            destination: context.destination
        }
        kanyeLoop = createSample(kanyeSpec);

        addEventListener("keydown", function(event) {
            key_array.push(event.keyCode);
            if (key_array.length >= 16){
                key_array = key_array.slice(-16);
                if (key_array.join("yeezy") === runaway){
                    kanyeLoop.loop();
                }
            }
        });
    }

    // PEER MODE
    if (window.location.href.match(/peer1/)) {
        // set up as peer
        var myId = "peer1";
        var peerId = "peer2";
        var conn;

        var peer = new Peer(myId, {host: 'tyutyu-peerjs-server.herokuapp.com', port: 80, path: '/'});
        peer.on('connection', function(connection) {
            conn = connection;
            conn.on('data', function(data){
                // handle data
                if (data.messageType === 'padPlay') {
                    userBoard.samples[data.padId].play();
                    $('#pad-' + data.padId).addClass("yellow");
                }
                if (data.messageType === 'padStop') {
                    $('#pad-' + data.padId).removeClass("yellow");
                }
            });
        });
    }

    if (window.location.href.match(/peer2/)) {
        var myId = "peer2";
        var peerId = "peer1";
        var conn;

        var peer = new Peer(myId, {host: 'tyutyu-peerjs-server.herokuapp.com', port: 80, path: '/', debug: true});
        peer.on('open',function(){
            conn = peer.connect(peerId);
            conn.on('data',function(data){
                // handle data
                if (data.messageType === 'padPlay') {
                    userBoard.samples[data.padId].play();
                    $('#pad-' + data.padId).addClass("yellow");
                }
                if (data.messageType === 'padStop') {
                    $('#pad-' + data.padId).removeClass("yellow");
                }
            });
        });
    }
});
