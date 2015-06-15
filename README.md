# tyutyu.be

## Description

[tyutyu.be](http://www.tyutyu.be) is an interactive, collaborative, customizable musical experience. On the home page, users see the default 'board', which has nine different 'pads' - each with a different letter. By pressing the corresponding letter on their keyboards, users can play audio samples that have been assigned to those pads.

#### Customization

The site includes a menu bar at left that allows users to customize their experience. There, users can change the samples that are played by the different pads or change the entire board at once. Once signing up with email, users can also name and save new board configurations.

For an even more customizable experience, users can link their accounts with Dropbox and record or upload new audio samples.

#### Looping

Users can record and play back loops by toggling the spacebar.

#### Collaboration

Using the 'connect' feature, also accessible through the menu bar, users can browse a list of other users who are online and request to connect with them. Once connected, users hear and see each other's activity in real time, including looping and updates to pad assignments, even for newly uploaded or recorded samples.

## Usage

[picture of basic home page]

The default board contains nine playable pads

[GIF of loop]

The loop feature contains animations to indicate which state is active:

- Listening: The screen flashes red when the user has initiated the loop. It doesn't actually start recording until a key is pressed.
- Recording: The screen is red when recording
- Playback: The screen displays a scrolling animation when the loop is being played back
- Normal: Spacebar can be toggled again to stop playback of the loop and prepare for a new loop to be recorded

[GIF of sidebar toggle]

The menu bar can be toggled by clicking the arrow at top left

[GIF of change pad]

Using the sidebar, users can change samples assigned to different users,...

[GIF of change board]

...change the entire board at once,...

[GIF of save board]

...save a new board,...

[GIF of board record]

...or record or upload a new sound.

Users can also connect with other users...

[side-by-side GIF of connection process]

## Technologies Used

This application's primary server was built using Ruby on Rails, though a number of other libraries and tools were required for certain features:

- **Web Audio API**: Enables the site's core audio functionality. Sounds are loaded into audio buffers from static URLs. These can then be played back using the '' function. Here's some sample code:

...

- **Recorderjs**: This JavaScript library used to record loops and new

- **Ruby Dropbox SDK**:

- **WebSocket Rails**: Ruby gem used to enable the user management functionality of the connection process. Below is a bit of the relevant code:

- **PeerJS WebRTC framework**:

## Authors // Background

This app was developed at [The Flatiron School]() by [Seph Kramer]() and [Parker Lawrence](). We both really enjoy playing with other fun online instruments ([], [], [] to list a few) and thought it would be exciting to try to create a simple instrument ourselves, with some added features that we hadn't seen elsewhere.

You can find us...

## License

Tyutyu.be is MIT Licensed. See LICENSE for details.