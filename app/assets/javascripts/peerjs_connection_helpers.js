var createPeerToPeer = function(spec) {
    newPeerToPeer = {
        role: spec.role,
        id: spec.id,
        peerId: spec.peerId,
        config: {
            host: 'tyutyu-peerjs-server.herokuapp.com',
            port: 80,
            path: '/',
            debug: true
        },
        userBoardSpecTransmission: spec.userBoardSpecTransmission,
        context: spec.context,
        destination: spec.destination,
        looper: spec.looper
    }

    newPeerToPeer.peer = new Peer(newPeerToPeer.id, newPeerToPeer.config);

    newPeerToPeer.handleMessage = function(peerMessage){
        switch(peerMessage.messageType) {
        case 'padPlay':
            this.peerBoard.samples[peerMessage.padId].play();
            $('#pad-' + peerMessage.padId).addClass(this.peerBoard.color);
            // handle looping
            if (this.looper.looperState === 'listening') {
                this.looper.respond(true);
            }
            break;
        case 'padStop':
            $('#pad-' + peerMessage.padId).removeClass(this.peerBoard.color);
            break;
        case 'connectionOpened':
            if (this.role === "receiver") {
                this.sayHello();
            }
            console.log(peerMessage.messageBody);
            var peerBoardSpec = peerMessage.userBoardSpecTransmission;
            peerBoardSpec.context = this.context;
            peerBoardSpec.destination = this.destination;
            this.peerBoard = createBoard(peerBoardSpec);
            break;
        case 'padUpdated':
            var newSampleSpec = peerMessage.newSampleSpecTransmission;
            newSampleSpec.context = this.context;
            newSampleSpec.destination = this.destination;
            var newSample = createSample(newSampleSpec);
            this.peerBoard.samples[peerMessage.padId] = newSample;
            break;
        case 'spacebarToggle':
            this.looper.respond();
            break;
        }
    }

    newPeerToPeer.sayHello = function() {
        var message = {
            messageType: 'connectionOpened',
            messageBody: 'Hello!',
            userBoardSpecTransmission: this.userBoardSpecTransmission
        }
        this.connection.send(message);
    }

    if (newPeerToPeer.role === 'initiator') {
        newPeerToPeer.peer.on('open',function(){
            newPeerToPeer.connection = newPeerToPeer.peer.connect(newPeerToPeer.peerId);
            newPeerToPeer.connection.on('open',function(){
                newPeerToPeer.sayHello();
                newPeerToPeer.connection.on('data', function(peerMessage){
                    newPeerToPeer.handleMessage(peerMessage);
                });
            });
        });
    } else {
        newPeerToPeer.peer.on('connection', function(connection){
            newPeerToPeer.connection = connection;
            newPeerToPeer.connection.on('data', function(peerMessage){
                newPeerToPeer.handleMessage(peerMessage);
            });
        })
    }

    return newPeerToPeer;
}
