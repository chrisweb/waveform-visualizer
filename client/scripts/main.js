
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
        'waveform': 'library/waveform'
    }
    
});

/**
 * 
 *  main require
 * 
 * @param {type} $
 * @param {type} waveform
 * @returns {undefined}
 */
require([
    'jquery',
    'waveform'
    
], function ($, waveform) {
    
    // on dom load
    $(function() {

        var trackId = 1100511;
        var peaksAmount = 400;
        var trackFormat = 'ogg';
        
        // paint a waveform using server data
        waveform.getDataFromServer(trackId, trackFormat, peaksAmount, function(error, data) {
            
            // if there was no error on the server
            if (!error) {
            
                // get the canvas element
                var $element = $('#serverWaveForm');

                // set the optioms
                var options = {};

                options.waveHeight = 100;
                options.peakWidth = 2;
                options.spaceWidth = 1;
                options.peakColorHex = '#6600FF';

                // draw the waveform using the waveform module
                waveform.draw(data, $element, options);
                
                // analyze track again but this time using the client
                // web audio api
                waveform.analyze(trackId, trackFormat);
                
            } else {
                
                // log the server error
                console.log(error);
                
            }
            
        });
        
    });
    
});