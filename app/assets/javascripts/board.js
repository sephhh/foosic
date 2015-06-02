$(document).ready(function() {
    // AUDIO SETUP
    // Set audio context
    var context = new AudioContext();

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
            s.connect(context.destination);
            s.start(0);
            object.s = s;
        }
    }

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
                var pad_id = '#pad-' + i;
                $(pad_id)[0].play();
                $(pad_id).css("background-color","blue");
            };
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
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $("#menu-arrow").toggleClass("glyphicon-chevron-right glyphicon-chevron-left");
    });

    // fun w/ global variables
    var padId;

    $('#change-pad').click(function(){
        $('.pad').bind({
            mouseenter: function() {
                $(this).css("background-color","#2D2D2D");
                $(this).css("cursor","pointer");
            },
            mouseleave: function() {
                $(this).css("background-color","black");
                $(this).css("cursor","auto");
            },
            click: function() {
                $('#sampleModal').modal('show');
                padId = this.id;
            }
        });
        $('.select-a-pad').modal('toggle');
        window.setTimeout(function(){
            $('.select-a-pad').modal('toggle')
        }, 1000);
    });

    // AJAX REQUEST
    function SampleLiBuilder(sample_json){
        var colors = ["blue","green","red","orange","yellow","purple","white","grey","black"]
        var htmlString = '<li class="sample-list" style="color:'
            +colors[Math.floor(Math.random()*colors.length)]
            +'" data-url="'
            + sample_json.url
            +'"><p>'
            +sample_json.name
            +'</p></li>'
        return htmlString
    }

    $.getJSON( "/samples.json", function( data ) {
        data.forEach(function(sample_json){

            var htmlElement = $(SampleLiBuilder(sample_json))

            $('.modal-body ul').append(htmlElement[0])

            addAudioProperties(htmlElement[0]);

            $(htmlElement[0]).click(function(){
                this.play();
                //remove active class from siblings
                $(this).siblings().removeClass("active");
                //add active class to clicked item
                $(this).addClass('active');
            });
        });

        $("#confirm-sample").click(function(){
            var $sample_element = $('li.active');
            var sample_url = $sample_element.data("url");
            var sample_name = $sample_element.text();
            $('#' + padId).attr("data-url",sample_url);
            addAudioProperties($('#' + padId)[0], sample_url);
        });

        // General cancel
        $("#sampleModal").on('hidden.bs.modal', function(){
            $('.pad').unbind();
            $('.sample-list').removeClass('active');
        });
    });
});
