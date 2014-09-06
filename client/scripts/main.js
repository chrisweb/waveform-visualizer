
'use strict';

/**
 * 
 * http://requirejs.org/
 * 
 * require configuration
 * 
 */
require.config({
    baseUrl: '/client/scripts',
    paths: {
        'waveform': 'library/waveform'
    }
    
});

/**
 * 
 *  main require
 * 
 * @param {type} waveform
 * @returns {undefined}
 */
require([
    'waveform'
    
], function (waveform) {
    
    // on dom load
    $(function() {

        

    });
    
});