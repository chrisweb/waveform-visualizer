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

    /**
     * 
     * player constructor
     * 
     * @param {type} options
     * @returns {player_L9.player}
     */
    var analyzer = function analyzerConstructor(options) {
        
        this.audioContext;
        
        if (options !== undefined) {
            
            if (options.audioContext !== undefined) {
                
                this.setAudioContext(options.audioContext);
                
            }
            
        }
        
    };
    
    analyzer.setAudioContext = function setAudioContextFunction() {
        
        
        
    };
    
    /**
     * 
     * analyze the track using the client web audio api
     * 
     * @param {type} trackBuffer
     * @returns {undefined}
     */
    analyzer.analyzeTrack = function analyzeTrackFunction(trackBuffer) {
        
        var audioAnalyzer = this.audioContext.createAnalyzer();
        
        
        
    };
    
    /**
     * public functions
     */
    return {
        analyzer: analyzer
    };

});