
'use strict';

/**
 * 
 * http://requirejs.org/
 * 
 * require configuration
 * 
 */
require.config({
    baseUrl: '/scripts',
    paths: {
        'jquery': 'vendor/jquery/dist/jquery',
        'waveform': 'library/waveform',
        'player': 'library/player',
        'ajax': 'library/ajax',
        'audio': 'library/audio',
        'canvas': 'library/canvas',
        'analyzer': 'library/analyzer',
        'event': 'library/event'
    }
    
});

/**
 * 
 * main require
 * 
 * @param {type} $
 * @param {type} ajax
 * @param {type} Waveform
 * @param {type} canvas
 * @param {type} audio
 * @param {type} Player
 * @returns {undefined}
 */
require([
    'jquery',
    'ajax',
    'waveform',
    'canvas',
    'audio',
    'player'
    
], function ($, ajax, Waveform, canvas, audio, Player) {
    
    // on dom load
    $(function() {

        var options = {};

        options.trackId = 1100511;
        options.peaksAmount = 400;
        options.trackFormat = 'ogg';
        options.service = 'jamendo';
        
        // get the canvas element
        var $element = $('#serverWaveForm');
                
        var canvasContext = canvas.getContext($element);
                
        var waveform = new Waveform({
            canvasContext: canvasContext
        });
        
        // paint a waveform using server data
        ajax.getWaveDataFromServer(options, function(error, data) {
            
            // if there was no error on the server
            if (!error) {

                // set waveform data
                waveform.setWaveData(data);

                // set the optioms
                var layoutOptions = {};

                layoutOptions.waveHeight = 100;
                layoutOptions.peakWidth = 2;
                layoutOptions.spaceWidth = 1;
                layoutOptions.peakColorHex = '#6600FF';
                
                waveform.setLayoutOptions(layoutOptions);

                // draw the waveform using the waveform module
                waveform.draw();
                
            } else {
                
                // log the server error
                console.log(error);
                
            }
            
        });
        
        var audioContext = audio.getContext();
        
        ajax.getAudioBuffer(options, audioContext, function(error, trackBuffer) {
            
            // if there was no error on the server
            if (!error) {

                // analyze track again but this time using the client
                // web audio api
                //analyzer.analyzeTrack(trackBuffer);

                // player
                var player = new Player({ audioContext: audioContext });
                
                player.setBuffer(trackBuffer);
                
                var $button = $('<button>');
                
                $button.addClass('play').text('>');
                
                var $body = $('body');
                
                $body.find('.player').append($button);
                
                $body.on('click', 'button', function() {
                    
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
        
    });
    
});