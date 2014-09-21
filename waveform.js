/**
 * 
 * waveform
 * 
 * @param {type} $
 * @returns {waveform_L7.waveformAnonym$2}
 */
define([
    'jquery'
    
], function (
    $
) {

    'use strict';
    
    var canvasContext;
    var $canvasElement;
    
    /**
     * 
     * waveform constructor
     * 
     * @param {type} options
     * @returns {undefined}
     */
    var waveform = function waveformConstructor(options) {
        
        if (options !== undefined) {
            
            if (options.canvasContext !== undefined) {
                
                this.setCanvasContext(options.canvasContext);
                
                //console.log(canvasContext);
                
            }
            
        }
        
    };
    
    /**
     * 
     * draw the canvas wave form
     * 
     * @param {type} data
     * @param {type} options
     * @returns {undefined}
     */
    waveform.prototype.draw = function drawWaveFunction(data, options) {

        var peaksLength = data.length;
        var canvasHeight = options.waveHeight * 2;
        var canvasWidth = (peaksLength * options.peakWidth) + ((peaksLength - 1) * options.spaceWidth);
        var peakColor = options.peakColorHex;
        
        $canvasElement.attr('height', canvasHeight);
        $canvasElement.attr('width', canvasWidth);
        
        canvasContext.fillStyle = '#d9d9d9';
        canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        
        var i;
        
        canvasContext.lineWidth = options.peakWidth;
        
        var heightPercentage = options.waveHeight / 100;
        
        for (i = 0; i < peaksLength; i++) {
            
            var peakHeightInPercent = data[i];
            
            var peakHorizontalPosition = ((i + 1) * options.peakWidth) + (i * options.spaceWidth);
            var peakHeight = options.waveHeight - (heightPercentage * peakHeightInPercent);
            
            // waveform top
            canvasContext.beginPath();
            canvasContext.moveTo(peakHorizontalPosition, options.waveHeight);
            canvasContext.lineTo(peakHorizontalPosition, peakHeight);
            canvasContext.strokeStyle = '#b57ec1';
            canvasContext.stroke();
            
            // waveform bottom
            canvasContext.beginPath();
            canvasContext.moveTo(peakHorizontalPosition, options.waveHeight);
            canvasContext.lineTo(peakHorizontalPosition, canvasHeight-peakHeight);
            canvasContext.strokeStyle = '#c0a5c6';
            canvasContext.stroke();
            
        }
        
        addClickListener();

    };
    
    /**
     * 
     * add a click listener to the canvas waveform
     * 
     * @returns {undefined}
     */
    var addClickListener = function addClickListenerFunction() {
        
        $canvasElement.on('click', function(event) {
            
            getMousePosition($canvasElement, event);
            
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
        
        canvasContext = context;
        
        $canvasElement = $(canvasContext.canvas);
        
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

        var frameHandle = requestFrame(function() {

            if (!drawStop) {
            
                drawRange();
            
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

        drawRange();
        
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