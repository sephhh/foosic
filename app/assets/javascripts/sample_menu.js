//Builds html for the menu
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

// AJAX REQUEST
function initializeSelector(padId) {

    if ($('.sample-list').length === 0) {
        $.getJSON( "/samples.json", function( data ) {
            //iterate through samples from database
            data.forEach(function(sample_json){
                //create and append html
                var htmlElement = $(SampleLiBuilder(sample_json))
                $('.modal-body ul').append(htmlElement[0])

                //make it so each element plays and highlights on click
                addAudioProperties(htmlElement[0]);
                $(htmlElement[0]).click(function(){
                    this.play();
                    //remove active class from siblings
                    $(this).siblings().removeClass("active");
                    //add active class to clicked item
                    $(this).addClass('active');
                });
            });
        });
    };

    //when confirm is clicked
    $("#confirm-sample").click(function(event){
        //grab data-url from active element
        var $sample_element = $('li.active');
        var sample_url = $sample_element.data("url");
        //replace selected pad's url and reset audio properties
        $('#' + padId).attr("data-url",sample_url);
        addAudioProperties($('#' + padId)[0], sample_url);

        //remove this event handler once it's called
        $( this ).off(event);
    });

    // General cancel when you leave modal
    $("#sampleModal").on('hidden.bs.modal', function(){
        $('.pad').unbind();
        $('.sample-list').removeClass('active');
    });

    $('#sampleModal').modal('show');

}
