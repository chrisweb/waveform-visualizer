
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

        

    });
    
});