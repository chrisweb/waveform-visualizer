/**
 * 
 * player
 * 
 * @param {type} EventsManager
 * @returns {player_L7.player}
 */
define([
    'event'
    
], function (
    EventsManager
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
        
        this.events = new EventsManager();
        
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
        track.startTime = currentTrackSource.context.currentTime;
        
        console.log('startTime: ', track.startTime);

        currentTrackSource.start(0, track.playTimeOffset);
        
        startTimer.call(this);
        
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
        
        track.playTimeOffset += pauseTime - track.startTime;
        
        stopTimer();
        
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
        
        stopTimer();
        
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
    
    var intervalHandler;
    
    /**
     * 
     * start timer
     * 
     * @returns {undefined}
     */
    var startTimer = function startTimerFunction() {
        
        var triggerPositionEventBinded = triggerPositionEvent.bind(this);
        
        intervalHandler = setInterval(triggerPositionEventBinded, 200);
        
    };
    
    /**
     * 
     * stop timer
     * 
     * @returns {undefined}
     */
    var stopTimer = function stopTimerFunction() {
        
        clearInterval(intervalHandler);
        
    };
    
    /**
     * 
     * trigger position event
     * 
     * @returns {undefined}
     */
    var triggerPositionEvent = function triggerPositionEventFunction() {

        var timeNow = currentTrackSource.context.currentTime;
        
        track.playTime = (timeNow - track.startTime) + track.playTimeOffset;
        
        track.playedTimePercentage = (track.playTime / track.buffer.duration) * 100;
        
        this.events.trigger('player:progress', track.playedTimePercentage);
        
    };

    /**
     * public functions
     */
    return player;

});