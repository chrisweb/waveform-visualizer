/**
 * 
 * waveform
 * 
 * @param {type} $
 * @param {type} EventsManager
 * @returns {waveform_L8.waveform}
 */
define([
    'jquery',
    'event'
    
], function (
    $, EventsManager
) {

    'use strict';

    /**
     * 
     * waveform constructor
     * 
     * @param {type} options
     * @returns {undefined}
     */
    var waveform = function waveformConstructor(options) {
        
        this.canvasContext;
        this.$canvasElement;
        this.waveData;
        this.waveLayoutOptions;
        
        if (options !== undefined) {
            
            if (options.canvasContext !== undefined) {
                
                this.setCanvasContext(options.canvasContext);
                
            }
            
            if (options.data !== undefined) {
                
                this.setWaveData(options.data);
                
            }
            
            if (options.layout !== undefined) {
                
                this.setLayoutOptions(options.layout);
                
            }            
            
        }
        
        this.events = new EventsManager();
        
    };
    
    /**
     * 
     * draw the canvas wave form
     * 
     * @param {type} range
     * @returns {undefined}
     */
    waveform.prototype.draw = function drawWaveFunction(range) {

        var peaksLength = this.waveData.length;
        var canvasHeight = this.waveLayoutOptions.waveHeight * 2;
        var canvasWidth = (peaksLength * this.waveLayoutOptions.peakWidth) + ((peaksLength - 1) * this.waveLayoutOptions.spaceWidth);
        var peakColor = this.waveLayoutOptions.peakColorHex;
        
        this.$canvasElement.attr('height', canvasHeight);
        this.$canvasElement.attr('width', canvasWidth);
        
        this.canvasContext.fillStyle = '#f8f8f8';
        this.canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        
        var i;
        
        this.canvasContext.lineWidth = this.waveLayoutOptions.peakWidth;
        
        var heightPercentage = this.waveLayoutOptions.waveHeight / 100;
        
        var peaksRange = 0;
        
        if (range !== undefined) {
        
            var peaksPercentage = peaksLength / 100;
        
            peaksRange = Math.round(range * peaksPercentage);
        
        }
        
        for (i = 0; i < peaksLength; i++) {
            
            var topStrokeColor;
            var bottomStrokeColor;
            
            if (i < peaksRange) {
                
                topStrokeColor = '#de00ff';
                bottomStrokeColor = '#a97db3';
                
            } else {
                
                topStrokeColor = '#b57ec1';
                bottomStrokeColor = '#c0a5c6';
                
            }
            
            var peakHeightInPercent = this.waveData[i];
            
            var peakHorizontalPosition = ((i + 1) * this.waveLayoutOptions.peakWidth) + (i * this.waveLayoutOptions.spaceWidth);
            var peakHeight = this.waveLayoutOptions.waveHeight - (heightPercentage * peakHeightInPercent);
            
            // waveform top
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(peakHorizontalPosition, this.waveLayoutOptions.waveHeight);
            this.canvasContext.lineTo(peakHorizontalPosition, peakHeight);
            this.canvasContext.strokeStyle = topStrokeColor;
            this.canvasContext.stroke();
            
            // waveform bottom
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(peakHorizontalPosition, this.waveLayoutOptions.waveHeight);
            this.canvasContext.lineTo(peakHorizontalPosition, canvasHeight-peakHeight);
            this.canvasContext.strokeStyle = bottomStrokeColor;
            this.canvasContext.stroke();
            
        }
        
        addClickListener.call(this);

    };
    
    /**
     * 
     * add a click listener to the canvas waveform
     * 
     * @returns {undefined}
     */
    var addClickListener = function addClickListenerFunction() {
        
        this.$canvasElement.on('click', function(event) {
            
            getMousePosition(this.$canvasElement, event);
            
        });
        
    };
    
    /**
     * 
     * get the mouse position of the click on the canvas
     * 
     * @param {type} $element
     * @param {type} event
     * @returns {undefined}
     */
    var getMousePosition = function getMousePositionFunction($element, event) {
        
        var boundingClientRectangle = $element[0].getBoundingClientRect();
        
        var position = event.clientX - boundingClientRectangle.left;
        
        console.log(position);
        
    };
    
    /**
     * 
     * set the canvas context
     * 
     * @param {type} context
     * @returns {undefined}
     */
    waveform.prototype.setCanvasContext = function setCanvasContextFunction(context) {
        
        this.canvasContext = context;
        
        this.$canvasElement = $(this.canvasContext.canvas);
        
    };
    
    /**
     * 
     * set wave data
     * 
     * @param {type} data
     * @returns {undefined}
     */
    waveform.prototype.setWaveData = function setWaveDataFunction(data) {
        
        this.waveData = data;
        
    };

    /**
     * 
     * set layout options
     * 
     * @param {type} layoutOptions
     * @returns {undefined}
     */
    waveform.prototype.setLayoutOptions = function setLayoutOptionsFunction(layoutOptions) {
        
        this.waveLayoutOptions = layoutOptions;
        
    };

    var drawStop = false;
    var frameHandle;
    
    /**
     * 
     * update the range display in the waveform
     * 
     * @returns {undefined}
     */
    var drawRange = function drawRangeFunction() {
        
        var that = this;

        var frameHandle = requestFrame(function() {

            if (!drawStop) {
                
                that.events.once('player:progress', function(range) {

                    // redraw wave with different color until song progress
                    that.draw(range);

                    drawRange.call(that);
                    
                });
                
            }
            
        });
        
    };
    
    /**
     * 
     * start updating range
     * 
     */
    waveform.prototype.updateRangeStart = function drawRangeFunction() {
        
        drawStop = false;

        drawRange.call(this);
        
    };
    
    /**
     * 
     * stop updating range
     * 
     * @returns {undefined}
     */
    waveform.prototype.updateRangeStop = function updateRangeStopFunction() {
        
        drawStop = true;
        
        if (typeof frameHandle !== 'undefined') {
            
            clearInterval(frameHandle);
            
            
        }
        
        this.events.off('player:progress');
        
    };

    /**
     * 
     * request (animation) frame
     * 
     * @param {type} callback
     * @returns {Window.requestAnimationFrame|window.requestAnimationFrame|Function|window.oRequestAnimationFrame|Window.oRequestAnimationFrame|Window.webkitRequestAnimationFrame|window.webkitRequestAnimationFrame|Window.msRequestAnimationFrame|window.msRequestAnimationFrame|Window.mozRequestAnimationFrame|window.mozRequestAnimationFrame}
     */
    var requestFrame = (function requestFrameFunction(callback) {
        
        // requestAnimationFrame() shim by Paul Irish
        // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function(callback){
                    frameHandle = window.setTimeout(callback, 1000 / 60);
                };
        
    })();
    
    /**
     * public functions
     */
    return waveform;

});