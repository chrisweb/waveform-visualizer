
'use strict';

/**
 * 
 * http://requirejs.org/
 * 
 * require configuration
 * 
 */
require.config({
    baseUrl: 'client/scripts',
    paths: {
        // vendor scripts
        'jquery': 'vendor/jquery/dist/jquery',

        // player
        'player.core': 'vendor/web-audio-api-player/source/player',
        'player.audio': 'vendor/web-audio-api-player/source/audio',
        
        // own small event manager for this example
        'event': 'library/event',
        
        // waveform visualizer scripts
        'canvas': '../../../source/scripts/library/canvas',
        'waveform': '../../../source/scripts/library/waveform',
        'waveform.ajax': 'vendor/web-audio-api-player/source/ajax'
    }
    
});

/**
 * 
 * main require
 * 
 * @param {type} $
 * @param {type} ajax
 * @param {type} audio
 * @param {type} EventsManager
 * 
 * @returns {undefined}
 */
require([
    'jquery',
    'waveform.ajax',
    'player.audio',
    'event'
    
], function ($, ajax, audio, EventsManager) {

    var addPlayer = function addPlayer(options) {
        
        // create an audio context
        var audioContext = audio.getContext();
        
        ajax.getAudioBuffer(options, audioContext, function(error, trackBuffer) {
            
            // if there was no error on the server
            if (!error) {

                // player
                var player = new Player({ audioContext: audioContext });
                
                player.setBuffer(trackBuffer);
                
                var $button = $('<button>');
                
                $button.addClass('play').text('>');
                
                var $body = $('body');
                
                $body.find('.player').append($button);
                
                $button.on('click', function() {
                    
                    if ($(this).hasClass('play')) {
                    
                        player.play();
                        
                        $button.removeClass('play').addClass('pause').text('||');
                        
                        waveform.updateRangeStart();
                        
                    } else {
                        
                        player.pause();
                        
                        $button.removeClass('pause').addClass('play').text('>');
                        
                        waveform.updateRangeStop();
                        
                    }
                    
                });
                
            } else {
                
                // log the server error
                console.log(error);
                
            }
            
        });
        
    };
    
    // on dom load
    $(function() {
        
        // get the canvas element
        var $element = $('#serverWaveForm');

        var canvasContext = canvas.getContext($element);

        var waveform = new Waveform({
            canvasContext: canvasContext
        });

        var data = {"peaks":[7,18,25,16,4,10,7,42,90,38,60,72,69,86,98,70,83,67,81,92,78,85,68,76,85,81,71,19,72,91,88,87,90,84,90,92,88,85,84,90,96,83,92,81,89,96,89,96,82,78,84,85,85,76,77,83,83,83,80,77,84,83,83,80,70,84,89,79,89,78,89,98,85,89,80,91,89,91,91,84,82,90,89,89,87,81,92,89,93,92,71,62,56,55,52,53,61,53,60,53,52,48,58,61,53,56,49,60,60,57,51,89,92,96,89,92,77,94,100,87,82,84,90,100,89,93,85,90,95,90,78,52,74,84,83,85,80,78,85,84,83,79,72,86,87,79,79,71,83,96,81,90,74,82,87,82,86,73,78,83,81,85,80,76,85,83,85,79,71,84,88,84,85,69,84,98,72,82,67,80,90,78,85,73,76,84,82,88,78,73,83,84,89,87,49,9,1,0,0,0]};

        // set waveform data
        waveform.setWaveData(data);

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
        trackOptions.trackFormat = 'ogg';

        addPlayer(waveform, trackOptions);
        
    });
    
    
});