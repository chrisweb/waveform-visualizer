/*
    var addPlayer = function addPlayer(options) {

        var $playerElement = $('#player');

        var trackUrl = 'https://storage-new.newjamendo.com/download/track/' + options.trackId + '/' + formatCode;

        var playerCore = new Player({ 'trackUrl': trackUrl });

        playerCore.startListening();

    };

    // on dom load
    $(function() {

        // get the canvas element
        var $element = $('#waveform');

        var canvasContext = waveformCanvas.getContext($element);

        var waveform = new WaveformCore({
            canvasContext: canvasContext
        });

        var data = {"peaks":[7,18,25,16,4,10,7,42,90,38,60,72,69,86,98,70,83,67,81,92,78,85,68,76,85,81,71,19,72,91,88,87,90,84,90,92,88,85,84,90,96,83,92,81,89,96,89,96,82,78,84,85,85,76,77,83,83,83,80,77,84,83,83,80,70,84,89,79,89,78,89,98,85,89,80,91,89,91,91,84,82,90,89,89,87,81,92,89,93,92,71,62,56,55,52,53,61,53,60,53,52,48,58,61,53,56,49,60,60,57,51,89,92,96,89,92,77,94,100,87,82,84,90,100,89,93,85,90,95,90,78,52,74,84,83,85,80,78,85,84,83,79,72,86,87,79,79,71,83,96,81,90,74,82,87,82,86,73,78,83,81,85,80,76,85,83,85,79,71,84,88,84,85,69,84,98,72,82,67,80,90,78,85,73,76,84,82,88,78,73,83,84,89,87,49,9,1,0,0,0]};

        // set waveform data
        waveform.setWaveData(data);

        // start listening for player events
        waveform.startListening();

        // set the optioms
        var layoutOptions = {};

        layoutOptions.waveHeightInPixel = 200;
        layoutOptions.waveBackgroundColorHex = 'f8f8f8';
        layoutOptions.peakWidthInPixel = 2;
        layoutOptions.spaceWidthInPixel = 1;
        layoutOptions.waveTopPercentage = 70;
        layoutOptions.peakTopColorHex = '6c00ff';
        layoutOptions.peakBottomColorHex = 'bd8cff';
        layoutOptions.peakTopProgressColorHex = '380085';
        layoutOptions.peakBottomProgressColorHex = '8265ab';

        waveform.setLayoutOptions(layoutOptions);

        // draw the waveform using the waveform module
        waveform.draw();

        var trackOptions = {};

        trackOptions.trackId = 1100511;
        trackOptions.trackFormat = 'mp3';

        addPlayer(trackOptions);

    });
    */
//# sourceMappingURL=bootstrap.js.map