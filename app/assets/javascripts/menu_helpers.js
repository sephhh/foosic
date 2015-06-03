function changePadHandler(){
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
};