
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
        'analyzer': 'library/analyzer'
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

        var trackId = 1100511;
        var peaksAmount = 400;
        var trackFormat = 'ogg';
        
        // get the canvas element
        var $element = $('#serverWaveForm');
                
        var canvasContext = canvas.getContext($element);
                
        var waveform = new Waveform({ canvasContext: canvasContext });
        
        // paint a waveform using server data
        ajax.getWaveDataFromServer(trackId, trackFormat, peaksAmount, function(error, data) {
            
            // if there was no error on the server
            if (!error) {

                // set the optioms
                var options = {};

                options.waveHeight = 100;
                options.peakWidth = 2;
                options.spaceWidth = 1;
                options.peakColorHex = '#6600FF';

                // draw the waveform using the waveform module
                waveform.draw(data, options);
                
            } else {
                
                // log the server error
                console.log(error);
                
            }
            
        });
        
        var audioContext = audio.getContext();
        
        ajax.getAudioBuffer(trackId, trackFormat, audioContext, function(error, trackBuffer) {
            
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