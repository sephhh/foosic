# tyutyu.be

[tyutyu.be](http://www.tyutyu.be) is an interactive, collaborative, customizable musical experience. On the home page, users see the default 'board', which has nine different 'pads' - each with a different letter. By pressing the corresponding letter on their keyboards, users can play audio samples that have been assigned to those pads.

#### Customization

The site includes a menu bar at left that allows users to customize their experience. There, users can change the samples that are played by the different pads or change the entire board at once. Once signing up with email, users can also name and save new board configurations.

For an even more customizable experience, users can link their accounts with Dropbox and record or upload new audio samples.

#### Looping

Users can record and play back loops by toggling the spacebar.

#### Collaboration

Using the 'connect' feature, also accessible through the menu bar, users can browse a list of other users who are online and request to connect with them. Once connected, users hear and see each other's activity in real time, including looping and updates to pad assignments, even for newly uploaded or recorded samples.

## Usage

The default board contains nine playable pads

![home page picture](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20home%20page.png)

The loop feature contains animations to indicate which state is active:

- Listening: The screen flashes red when the user has initiated the loop. It doesn't actually start recording until a key is pressed.
- Recording: The screen is red when recording
- Playback: The screen displays a scrolling animation when the loop is being played back
- Normal: Spacebar can be toggled again to stop playback of the loop and prepare for a new loop to be recorded

![loop GIF](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20loop.gif)

The menu bar can be toggled by clicking the arrow at top left

![GIF of menu toggle](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20menu%20screen.gif)

Using the menu bar, users can change samples assigned to different users,...

![GIF of change pad](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20change%20pad.gif)

...change the entire board at once,...

![GIF of change board](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20change%20board.gif)

...save a new board,...

![GIF of save board](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20save%20board.gif)

...record a new sound,...

![GIF of record sound](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20record%20sample.gif)

...or upload one.

![GIF of upload sound](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20upload%20sample.gif)

Users can also connect with one another...

![connection GIF](https://raw.githubusercontent.com/sephhh/tyutyu.be/master/readme_images/tyutyube%20connection%20user1.gif)

## Technologies Used

This application's primary server was built using Ruby on Rails, though a number of other libraries and tools were required for certain features:

- **Web Audio API:** Enables the site's core audio functionality. Sounds are loaded into audio buffers from static URLs. These can then be played back. For example, here's the code that loads a new sample and defines the `play` and `loop` functions:

    ```javascript
    // Sample constructor
    var createSample = function(spec) {
        var newSample = {
            name: spec.name,
            url: spec.url,
            id: spec.id,
            user_id: spec.user_id,
            context: spec.context,
            destination: spec.destination
        }

        loadAudio(newSample);

        newSample.play = function() {
            var source = this.context.createBufferSource();
            source.buffer = this.buffer;
            source.connect(this.destination);
            source.start(0);
            this.source = source;
        }

        newSample.loop = function() {
            var source = this.context.createBufferSource();
            source.buffer = this.buffer;
            source.connect(this.destination);
            source.loop = true;
            source.start(this.context.currentTime + 0.7);
        }

        return newSample;
    }
    ```

- **Recorderjs:** JavaScript library used to record loops and new samples. Below is the code used to start and stop recording:

    ```javascript
    newRecorder.start = function(){
      this.recorder.record();
      this.state = "recording";
    };

    newRecorder.stop = function(){
      this.recorder.stop();
      this.state = "full"
      this.fileName = new Date().toISOString() + '.wav'
      //to display audio, need better way
      this.recorder.exportWAV(function(blob){
        var url = URL.createObjectURL(blob);
        var p = document.createElement('p');
        var au = document.createElement('audio');
        var hf = document.createElement('a');
        var recordingslist = $("#recordingslist");

        au.controls = true;
        au.src = url;
        hf.href = url;
        hf.download = newRecorder.fileName;
        hf.innerHTML = "<br />DOWNLOAD FILE";
        p.appendChild(au);
        p.appendChild(hf);
        recordingslist.append(p);
        recordingslist.append('NAME YOUR SAMPLE: <input id="name-sample-input" type="text" value='+ newRecorder.fileName +'>');
      });
    };
    ```

- **Ruby Dropbox SDK:** The Ruby wrapper for the Dropbox API, this was used to handle user authentication with Dropbox and to write files to users' Dropbox accounts. Here's our `upload` method:

    ```ruby
    def upload
      client = get_dropbox_client
      unless client
        redirect_to(:action => 'auth_start') and return
      end

      begin
        access_token = current_user.dropbox_token
        filename = params[:filename] || params["file"].original_filename
        resp = client.put_file(filename, params[:file].read)

        new_session = DropboxOAuth2Session.new(access_token, nil)
        response = new_session.do_get "/shares/auto/#{client.format_path(resp["path"])}", {"short_url"=>false}
        url = Dropbox::parse_response(response)["url"]
        url.gsub!("https://www", "https://dl")
        Sample.create(name: filename, user_id: current_user.id, url: url)

        redirect_to root_path, notice: "Sample saved!"
      rescue DropboxAuthError => e
        session.delete(:access_token)  # An auth error means the access token is probably bad
        logger.info "Dropbox auth error: #{e}"
        render :text => "Dropbox auth error"
      rescue DropboxError => e
        logger.info "Dropbox API error: #{e}"
        render :text => "Dropbox API error"
      end
    end
    ```

- **WebSocket Rails:** Ruby gem used to enable the user management functionality of the connection process. Below is the relevant controller, which handles the connection management process from the Rails side:

    ```ruby
    class WebsocketsController < WebsocketRails::BaseController

      def set_username
        if current_user
          username = current_user.username
          signed_in = true
        else
          username = [["BIG","TURNT","LAZY","SLEEPY","TINY"].sample,["STOMPER","JAMMER","ROCKER","WAILER"].sample,rand(0..100).to_s].join("-")
          signed_in = false
        end
        connection_store[:username] = username
        send_message :set_username, {username: username, signed_in: signed_in}
      end

      def get_online_users
        currently_connected_users = message
        users = connection_store.collect_all(:username)
        users.delete(connection_store[:username])
        currently_connected_users.each do |user|
          users.delete(user)
        end
        if users.size > 0
          trigger_success users
        end
      end

      def request_connection
        WebsocketRails[message[:receiver]].trigger 'connection_requested', message
      end

      def accept_connection
        WebsocketRails[message[:sender]].trigger 'connection_accepted', message
      end

      def reject_connection
        WebsocketRails[message[:sender]].trigger 'connection_rejected', message
      end

    end
    ```

    And here's some of the corresponding JavaScript:

    ```javascript
    var username, channel, requestedConnection;
    var signedIn = false;
    var requestInProgress = false;
    var dispatcher = new WebSocketRails('www.tyutyu.be/websocket');
    dispatcher.bind('set_username',function(data){
        username = data.username;
        signedIn = data.signed_in;
        channel = dispatcher.subscribe(username);
        channel.bind('connection_requested',function(message){
            // Start peer mode if needed
            if (!userBoard.peerToPeer) {
                initializePeerToPeer(userBoard);
            }
            requestInProgress = true;
            requestedConnection = message;
            // handle modal showing request
            $('#connection-requested-modal').modal('toggle');
            $('#requested-connection').text(message.sender + " WANTS TO CONNECT WITH YOU");
        });
        channel.bind('connection_accepted',function(message){
            // $('#request-sent-modal').modal('toggle');
            userBoard.peerToPeer.prepareForConnection();
            userBoard.peerToPeer.connectToPeer(message.receiver);
            $('#connection-message-modal p').text("REQUEST ACCEPTED. CONNECTING...");
        });
        channel.bind('connection_rejected',function(message){
            $('#connection-message-modal p').text("REQUEST REJECTED. BUMMER");
            window.setTimeout(function(){
                $('#connection-message-modal').modal('toggle')
            }, 1000);
        });
    });
    ```

- **PeerJS WebRTC framework:** PeerJS was used to broker the WebRTC connections used to send real-time messages like keypresses. PeerJS makes setting up the connection really easy, and has a `DataChannel` for sending arbitrary data, as was needed in our case (WebRTC is often used for sending streaming audio or video). Here's the code used to "say hello" when a connection is opened. This adds the newly-connected peer to the array of connected peers and transmits things like the current state of a user's board (i.e. which pads have which samples).

    ```javascript
    newPeerToPeer.sayHello = function(connection) {
        var otherConnections = [];
        for (var i = 0; i < this.connections.length; i++) {
            otherConnections.push(this.connections[i].peer);
        }
        var message = {
            messageType: 'connectionOpened',
            messageBody: 'Hello!',
            peerId: this.id,
            userBoardSpecTransmission: this.userBoardSpecTransmission,
            otherConnections: otherConnections
        }
        connection.send(message);
    }
    ```

## Authors // Background

This app was developed at [The Flatiron School](http://flatironschool.com/) by Seph Kramer and Parker Lawrence. We both really enjoy playing with other fun online instruments and thought it would be exciting to try to create a simple instrument ourselves, with some added features that we hadn't seen elsewhere.

You can find us on Twitter [@sephhh](https://twitter.com/seph_k) and [@parkeristyping](https://twitter.com/parkeristyping), or check out our blogs [here](http://sephhh.github.io/) and [here](http://www.hereisahand.com/).

## License

Tyutyu.be is MIT Licensed. See LICENSE for details.