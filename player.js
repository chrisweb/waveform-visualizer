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
        this.intervalHandler;
        
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
        
        //console.log('startTime: ', this.track.startTime);

        this.currentTrackSource.start(0, this.track.playTimeOffset);
        
        startTimer.call(this);
        
        startListeningForPositionChange.call(this);
        
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
        
        var timeAtPause = this.currentTrackSource.context.currentTime;
        
        this.track.playTimeOffset += timeAtPause - this.track.startTime;
        
        stopTimer.call(this);
        
        stopListeningForPositionChange.call(this);
        
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
        
        // stop the track playback
        this.currentTrackSource.stop(0);
        
        stopTimer.call(this);
        
        stopListeningForPositionChange.call(this);
        
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
    
    /**
     * 
     * starts the timer that triggers the progress events
     * 
     * @returns {undefined}
     */
    var startTimer = function startTimerFunction() {
        
        var triggerProgressEventBinded = triggerProgressEvent.bind(this);
        
        this.intervalHandler = setInterval(triggerProgressEventBinded, 200);
        
    };
    
    /**
     * 
     * stops the timer that triggers the progress events
     * 
     * @returns {undefined}
     */
    var stopTimer = function stopTimerFunction() {
        
        clearInterval(this.intervalHandler);
        
    };
    
    /**
     * 
     * trigger progress event
     * 
     * @returns {undefined}
     */
    var triggerProgressEvent = function triggerProgressEventFunction() {

        var timeNow = this.currentTrackSource.context.currentTime;
        
        this.track.playTime = (timeNow - this.track.startTime) + this.track.playTimeOffset;
        
        this.track.playedTimePercentage = (this.track.playTime / this.track.buffer.duration) * 100;
        
        this.events.trigger('player:progress', this.track.playedTimePercentage);
        
    };
    
    /**
     * 
     * start listening for a position change request
     * 
     * @returns {undefined}
     */
    var startListeningForPositionChange = function startListeningForPositionChangeFunction() {
        
        var that = this;
        
        this.events.on('waveform:position', function(trackPositionInPercent) {
            
            //console.log(trackPositionInPercent);

            // stop the track playback
            that.stop();

            var trackPositionInSeconds = (that.currentTrackSource.buffer.duration / 100) * trackPositionInPercent;
            
            that.track.playTimeOffset = trackPositionInSeconds;

            // start the playback at the given position
            that.play();
            
        });
        
    };
    
    /**
     * 
     * stop listening for position change requests
     * 
     * @returns {undefined}
     */
    var stopListeningForPositionChange = function stopListeningForPositionChangeFunction() {
        
        this.events.off('waveform:position');
        
    };

    /**
     * public functions
     */
    return player;

});