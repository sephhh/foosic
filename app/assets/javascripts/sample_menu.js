// create change pad handler
var createChangePadHandler = function(spec){
    var sampleLibrary = [];
    for (var i = 0; i < spec.sampleData.length; i++) {
        var sampleSpec = {
            id: spec.sampleData[i].id,
            name: spec.sampleData[i].name,
            url: spec.sampleData[i].url,
            user_id: spec.sampleData[i].user_id,
            context: spec.context,
            destination: spec.destination
        }
        var sample = createSample(sampleSpec);
        sampleLibrary.push(sample);
    };
    var sampleList = "";
    for (var i = 0; i < spec.sampleData.length; i++) {
        sampleList += ('<li class="sample-list" data-id="' + i + '">' + spec.sampleData[i].name + '</li>');
    };

    newChangePadHandler = {
        board: spec.board,
        sampleLibrary: sampleLibrary,
        sampleList: sampleList,
        mode: 'inactive',
        sampleData: spec.sampleData
    };

    // enter select-a-pad mode
    newChangePadHandler.selectAPadOn = function(){
        this.mode = 'selectAPad';
        that = this;
        $('.pad').bind({
            //pad changes color when mouse enters
            mouseenter: function() {
                $(this).addClass('selectable');
            },
            mouseleave: function() {
                $(this).removeClass('selectable');
            },
            //clicking pad brings up menu to select new sample
            click: function() {
                that.activePad = $(this).data("id");
                that.selectASampleOn();
            }
        });
        // toggle select-a-pad message modal
        $('#select-a-pad-modal').modal('toggle');
    }

    // enter select-a-sample mode
    newChangePadHandler.selectASampleOn = function(){
        this.mode = 'select-a-sample';
        that = this;
        $('#sampleModal').modal('show');
        $('.sample-list').click(function(){
            // update view
            $('.activeSample').removeClass('activeSample');
            $(this).addClass('activeSample');
            // update handler
            that.activeSample = that.sampleLibrary[$(this).data("id")];
            // play sound
            that.activeSample.play();
        });
    }

    // handle changes
    newChangePadHandler.changePadConfirm = function() {
        this.mode = 'inactive';
        this.board.updateSample(this.activePad, this.activeSample);
    }

    // handle updates when new samples are added
    newChangePadHandler.update = function(spec) {
        for (var i = 0; i < spec.sampleData.length; i++) {
            var already_included = false;
            for (var j = 0; j < this.sampleData.length; j++) {
                if (spec.sampleData[i].id === this.sampleData[j].id) {
                    already_included = true;
                }
            }
            if (!already_included) {
                var sampleSpec = {
                    id: spec.sampleData[i].id,
                    name: spec.sampleData[i].name,
                    url: spec.sampleData[i].url,
                    user_id: spec.sampleData[i].user_id,
                    context: spec.context,
                    destination: spec.destination
                }
                var sample = createSample(sampleSpec);
                this.sampleLibrary.push(sample);
                this.sampleData.push(spec.sampleData[i]);
                this.sampleList = ('<li class="sample-list" data-id="' + spec.sampleData[i].id + '">' + spec.sampleData[i].name + '</li>') + this.sampleList;
            }
        }
    }

    return newChangePadHandler;
}
