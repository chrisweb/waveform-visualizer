/**
 * 
 * events manager
 * 
 * simplified events manager based on backbone.events
 * extends this to add your own events manager
 * 
 * @returns {unresolved}
 */
define([

], function (

) {

    'use strict';
    
    var events = {};
    
    var constants = {};
    
    /**
     * 
     * events manager constructor
     * 
     * @returns {event_L9.eventsManager}
     */
    var eventsManager = function eventsManagerConstructor() {
        
        this.events = events;
        
        this.constants = constants;
        
        // player events
        this.constants.positionEvent = 'player:position';
        this.constants.progressEvent = 'player:progress';
        this.constants.playEvent = 'player:play';
        this.constants.pauseEvent = 'player:pause';
        this.constants.stopEvent = 'player:stop';
        this.constants.volumeEvent = 'player:volume';
        this.constants.pannerEvent = 'player:panner';
        this.constants.playbackRateEvent = 'player:playbackRate';
        this.constants.bufferingEvent = 'player:bufferingEvent';
        
        // waveform events
        this.constants.clickEvent = 'waveform:clickEvent';
        
    };
    
    /**
     * 
     * on
     * 
     * @param {type} name
     * @param {type} callback
     * @param {type} context
     * @returns {undefined}
     */
    eventsManager.prototype.on = function onFunction(name, callback, context) {
        
        if (name === undefined) {
            
            return;
            
        }
        
        var eventsContainer;
        
        if (!(name in this.events)) {
        
            this.events[name] = [];
            
        }
        
        eventsContainer = this.events[name];
        
        if (context === undefined) {
            
            context = null;
            
        }
        
        eventsContainer.push({
            callback: callback,
            context: context
        });
        
        return this;
        
    };
    
    /**
     * 
     * off
     * 
     * @param {type} name
     * @returns {undefined}
     */
    eventsManager.prototype.off = function onFunction(name) {
        
        if (name in this.events) {
            
            //this.events[name] = [];
            
            delete this.events[name];
            
        }

        return this;
        
    };
    
    /**
     * 
     * once
     * 
     * @param {type} name
     * @param {type} callback
     * @param {type} context
     * @returns {undefined}
     */
    eventsManager.prototype.once = function onFunction(name, callback, context) {

        if (name === undefined) {
            
            return;
            
        }
        
        var that = this;

        var onceCallback = function() {
            
            that.off(name);
            
            callback.apply(this, arguments);
            
        };
        
        return this.on(name, onceCallback, context);
        
    };
    
    /**
     * 
     * trigger
     * 
     * @param {type} name
     * @returns {undefined}
     */
    eventsManager.prototype.trigger = function triggerFunction(name) {
        
        var args = Array.prototype.slice.call(arguments, 1);
        
        if (name in this.events) {
        
            var eventsList = this.events[name];

            var eventsListLength = eventsList.length;
            var i;

            for (i = 0; i < eventsListLength; i++) {

                var callback = eventsList[i].callback;
                var context = eventsList[i].context;

                callback.apply(context, args);

            }
        
        }
        
        return this;
        
    };
    
    /**
     * public functions
     */
    return eventsManager;

});