function initializeSelector(padId) {
    // var context = new AudioContext();

    // // Define function to load audio associated with a pad html object
    // function loadAudio(object, url) {
    //     var request = new XMLHttpRequest();
    //     request.open('GET', url, true);
    //     request.responseType = 'arraybuffer';
    //     request.onload = function() {
    //         context.decodeAudioData(request.response, function(buffer) {
    //             object.buffer = buffer;
    //         });
    //     }
    //     request.send();
    // }

    // // Define function to add audio properties to a pad
    // function addAudioProperties(object) {
    //     object.name = object.id;
    //     object.source = $(object).data('url');
    //     loadAudio(object, object.source);
    //     object.play = function() {
    //         var s = context.createBufferSource();
    //         s.buffer = object.buffer;
    //         s.connect(context.destination);
    //         s.start(0);
    //         object.s = s;
    //     }
    // }


    //make ajax request
    function SampleDivBuilder(sample_json){
        var htmlString = '<div class="list-group-item" data-url="'
            + sample_json.url
            +'">'
            +sample_json.name
            +'</div>'
        return htmlString
    }

    $.getJSON( "/samples.json", function( data ) {
        data.forEach(function(sample_json){

            var htmlElement = $(SampleDivBuilder(sample_json))

            $('.modal-body .list-group').append(htmlElement[0])

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
            var $sample_element = $('.list-group .active');
            var sample_url = $sample_element.data("url");
            var sample_name = $sample_element.text();
            $('#' + padId).attr("data-url",sample_url);
            debugger;
            //close modals
        });
        //add confirm button
        //on click
        //take the selected element's data url
        //assign that to the HTML pad that's been selected previously

        $('#sampleModal').modal('show');
    });
}

//when you get json back

//show a modal
//make div for each sample
//on click each sample plays a sound
//confirm button at bottom will do something special
