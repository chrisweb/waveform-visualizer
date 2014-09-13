
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

        var trackId = 1135703;
        var peaksAmount = 200;
        
        // paint a waveform using server data
        waveform.getDataFromServer(trackId, peaksAmount, function(error, data) {
            
            if (!error) {
            
                var $element = $('#serverWaveForm');

                var options = {};

                options.waveHeight = 100;
                options.peakWidth = 2;
                options.spaceWidth = 1;
                options.peakColorHex = '#6600FF';

                waveform.draw(data, $element, options);
                
            } else {
                
                console.log(error);
                
            }
            
        });
        
    });
    
});