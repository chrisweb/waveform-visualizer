/**
 * 
 * player
 * 
 * @returns {player_L6.playerAnonym$1}
 */
define([

], function (

) {

    'use strict';
    
    var audioContext;
    var currentTrackSource;
    var track;
    
    /**
     * 
     * player constructor
     * 
     * @param {type} options
     * @returns {player_L9.player}
     */
    var player = function playerConstructor(options) {
        
        if (options !== undefined) {
            
            if (options.audioContext !== undefined) {
                
                this.setAudioContext(options.audioContext);
                
            }
            
            if (options.trackBuffer !== undefined) {
                
                this.setBuffer(options.trackBuffer);
                
            }
            
        }
        
    };
    
    /**
     * 
     * play
     * 
     * @returns {undefined}
     */
    player.prototype.play = function playFunction() {
        
        currentTrackSource = audioContext.createBufferSource();

        currentTrackSource.buffer = track.buffer;

        currentTrackSource.connect(audioContext.destination);
        
        // the time right now (since the audiocontext got created)
        track.currentTime = currentTrackSource.context.currentTime;
        
        console.log('currentTime: ', track.currentTime);

        currentTrackSource.start(0, track.playTimeOffset);
        
    };
    
    /**
     * 
     * pause
     * 
     * @param {type} trackId
     * @param {type} trackFormat
     * @returns {undefined}
     */
    player.prototype.pause = function pauseFunction(trackId, trackFormat) {
        
        currentTrackSource.stop();
        
        var pauseTime = currentTrackSource.context.currentTime;
        
        console.log('pauseTime: ', pauseTime);
        
        track.playTimeOffset += pauseTime - track.currentTime;
        
        console.log('playTimeOffset: ', track.playTimeOffset);
        
    };
    
    /**
     * 
     * stop
     * 
     * @param {type} trackId
     * @param {type} trackFormat
     * @returns {undefined}
     */
    player.prototype.stop = function stopFunction(trackId, trackFormat) {
        
        currentTrackSource.stop(0);
        
    };
    
    /**
     * 
     * set audio context
     * 
     * @param {type} context
     * @returns {undefined}
     */
    player.prototype.setAudioContext = function setAudioContextFunction(context) {
        
        audioContext = context;
        
    };
    
    /**
     * 
     * set buffer
     * 
     * @param {type} buffer
     * @returns {undefined}
     */
    player.prototype.setBuffer = function setBufferFunction(buffer) {
        
        // create a new track object
        track = {
            playTimeOffset: 0,
            currentTime: 0
        };
        
        track.buffer = buffer;
        
    };

    /**
     * public functions
     */
    return player;

});