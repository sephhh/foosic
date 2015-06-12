function CreateRecorder(context){
  var newRecorder = {
    context: context,
    fileName: null,
    //states are recording, full, cleared
    state: "cleared",
    recButtonHTML: '<svg height="100" width="100" id="record"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>CLICK TO RECORD USING MICROPHONE',
    stopButtonHTML: '<svg height="100" width="100" id="stop"><rect width="100" height="100" stroke="black" fill="blue" stroke-width=3/></svg>CLICK TO STOP'
  };

  newRecorder.initAudio = function(stream){
    var inputPoint = newRecorder.context.createGain();
    var input = newRecorder.context.createMediaStreamSource(stream);
    input.connect(inputPoint);
    newRecorder.recorder =  new Recorder(inputPoint, {workerPath: "/recorderWorker.js"})
  }

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
      hf.innerHTML = "DOWNLOAD FILE";
      p.appendChild(au);
      p.appendChild(hf);
      recordingslist.append(p);
      recordingslist.append('NAME YOUR SAMPLE: <input id="name-sample-input" type="text" value='+ newRecorder.fileName +'>')
    });
  };

  newRecorder.save = function(){
    //if input is not ""
      //if it ends in wav, use that
      //if it doesn't, add .wav and use that
    //if filename is null set it to date string
    var inputName = $("#name-sample-input").val();
    if(inputName !== ""){
      if (inputName.substr(inputName.length - 4)===".wav"){
        this.fileName = inputName;
      }else{
        this.fileName = inputName + ".wav"
      }
    }
    if (this.fileName === null){
      this.fileName = new Date().toISOString() + '.wav'
    }

    this.recorder.exportWAV(this.writeFile.bind(this));
    this.recorder.clear();
    this.state = "cleared";
  };
  newRecorder.writeFile = function(file){
    var data = new FormData();
    data.append('file', file);
    data.append('filename', this.fileName);
    $.ajax({
      url :  "dropbox/upload",
      type: 'POST',
      data: data,
      contentType: false,
      processData: false,
      success: function(data) {
        alert("boa!");
      },
      error: function() {
        alert("not so boa!");
      }
    });
  }
  //pass in a jQuery div and this will add Save, Clear and Cancel buttons to it
  newRecorder.activateButtons = function(){
    $("#rec-buttons").off();
    $("#rec-buttons").show();
    $("#new-sample-save").on("click", function(){
      if (rec.state === "full"){
        rec.save();
      }
    });
    $("#new-sample-clear").on("click", function(){
      rec.recorder.clear();
      rec.state = "cleared";
      $('#recording-interface').empty();
      $('#recording-interface').append(rec.recButtonHTML);
      $("#recordingslist").empty();
      $("#rec-buttons").hide();

    });
    $("#new-sample-cancel").on("click", function(){
      rec.recorder.clear();
      rec.state = "cleared";
    });
  }

  return newRecorder;

}

function initializeRecorder(context){
  rec = CreateRecorder(context);
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
  navigator.getUserMedia({audio:true}, rec.initAudio, function(e) {
    alert("enable microphone in order to record a sample")
    console.log(e);
    return;
  });
  $('#recording-interface').empty();
  $('#recording-interface').append(rec.recButtonHTML);
  $('#recording-interface').off()
  $('#recording-interface').on("click", function(event){
    if (rec.state === "cleared"){
      rec.start();
      $(this).empty();
      $(this).append(rec.stopButtonHTML);
    }else if (rec.state === "recording"){
      rec.stop();
      $(this).empty();
      rec.activateButtons();
    }
  });
}

function dropboxFlow(context, $button) {
  $.getJSON( "/dropbox/has_token.json", function( data ) {
      if(data.has_token){
          initializeRecorder(context)
      } else {
        $button.empty();
        $button.append("<a href='/dropbox/redirect_to_main'>CLICK HERE TO CONNECT TO DROPBOX</a>");
    }
  });
};
function dropboxUploadFlow($div) {
  $.getJSON( "/dropbox/has_token.json", function( data ) {
      if(data.has_token){
          $("#dropbox-upload-connect").empty();
          initializeUploader();
      }
  });
};

function initializeUploader(){
  $("#upload-file").show();
}

