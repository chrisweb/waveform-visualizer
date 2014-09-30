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
    
    /**
     * 
     * player constructor
     * 
     * @param {type} options
     * @returns {player_L9.player}
     */
    var player = function playerConstructor(options) {
        
        this.audioContext;
        this.currentTrackSource;
        this.track;
        
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
        
        this.currentTrackSource = this.audioContext.createBufferSource();

        this.currentTrackSource.buffer = this.track.buffer;

        this.currentTrackSource.connect(this.audioContext.destination);
        
        // the time right now (since the this.audiocontext got created)
        this.track.startTime = this.currentTrackSource.context.currentTime;
        
        console.log('startTime: ', this.track.startTime);

        this.currentTrackSource.start(0, this.track.playTimeOffset);
        
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
        
        this.currentTrackSource.stop();
        
        var pauseTime = this.currentTrackSource.context.currentTime;
        
        this.track.playTimeOffset += pauseTime - this.track.startTime;
        
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
        
        this.currentTrackSource.stop(0);
        
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
        
        this.audioContext = context;
        
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
        this.track = {
            playTimeOffset: 0,
            currentTime: 0
        };
        
        this.track.buffer = buffer;
        
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

        var timeNow = this.currentTrackSource.context.currentTime;
        
        this.track.playTime = (timeNow - this.track.startTime) + this.track.playTimeOffset;
        
        this.track.playedTimePercentage = (this.track.playTime / this.track.buffer.duration) * 100;
        
        this.events.trigger('player:progress', this.track.playedTimePercentage);
        
    };

    /**
     * public functions
     */
    return player;

});