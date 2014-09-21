/**
 * 
 * analyzer
 * 
 * @returns {audio_L6.audioAnonym$1}
 */
define([

], function (

) {

    'use strict';
    
    var audioContext;
    
    /**
     * 
     * player constructor
     * 
     * @param {type} options
     * @returns {player_L9.player}
     */
    var analyser = function analyserConstructor(options) {
        
        if (options !== undefined) {
            
            if (options.audioContext !== undefined) {
                
                this.setAudioContext(options.audioContext);
                
            }
            
        }
        
    };
    
    /**
     * 
     * analyze the track using the client web audio api
     * 
     * @param {type} trackBuffer
     * @returns {undefined}
     */
    analyser.analyzeTrack = function analyzeTrackFunction(trackBuffer) {
        
        var audioAnalyser = audioContext.createAnalyser();
        
        
        
    };
    
    /**
     * public functions
     */
    return {
        analyser: analyser
    };

});