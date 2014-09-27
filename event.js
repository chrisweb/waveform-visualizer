/**
 * 
 * events manager
 * 
 * @returns {unresolved}
 */
define([

], function (

) {

    'use strict';
    
    /**
     * 
     * events manager constructor
     * 
     * @returns {event_L9.eventsManager}
     */
    var eventsManager = function eventsManagerFunction() {
        
        this.events = {};
        
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
        
        var eventsList;
        
        if (!name in events) {
        
            this.events[name] = [];
            
        }
        
        eventsList = this.events[name];
        
        if (context === undefined) {
            
            context = this;
            
        }
        
        eventsList.push({
            callback: callback,
            context: context
        });
        
        return this;
        
    };
    
    /**
     * 
     * trigger
     * 
     * @param {type} name
     * @returns {undefined}
     */
    eventsManager.prototype.trigger = function triggerFunction(name) {
        
        var args = slice.call(arguments, 1);
        
        var events = this.events[name];
        var eventsLength = events.length;
        var i;
      
        for (i = 0; i < eventsLength; i++) {
        
            var callback = events[i].callback;
            var context = events[i].context;
        
            callback.apply(context, args);
            
        }
        
        return this;
        
    };
    
    /**
     * public functions
     */
    return eventsManager;

});