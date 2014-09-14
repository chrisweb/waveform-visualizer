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
    
    /**
     * 
     * get the peaks data from server
     * 
     * @type type
     */
    var getWaveDataFromServer = function getWaveDataFromServerFunction(trackId, peaksAmount, callback) {
        
        var request = $.ajax({
            url: '/getwavedata?trackId=' + trackId + '&peaksAmount=' + peaksAmount,
            type: 'GET',
            dataType: 'json'
        });

        request.done(function(data) {
            
            if (typeof data !== 'undefined' && data.peaks !== undefined) {
            
                callback(false, data.peaks);
            
            } else {
                
                if (typeof data === 'undefined' || data.error === undefined) {
                    
                    callback('undefined response from server');
                    
                } else {
                    
                    callback(data.error);
                    
                }
        
            }
            
        });

        request.fail(function(jqXHR, textStatus) {
            
            callback(textStatus);
            
        });
        
    };
    
    /**
     * 
     * draw the canvas wave form
     * 
     * @type type
     */
    var drawWave = function drawWaveFunction(data, $element, options) {

        var canvasContext = getCanvasContext($element);
        var peaksLength = data.length;
        var canvasHeight = options.waveHeight * 2;
        var canvasWidth = (peaksLength * options.peakWidth) + ((peaksLength - 1) * options.spaceWidth);
        var peakColor = options.peakColorHex;
        
        $element.attr('height', canvasHeight);
        $element.attr('width', canvasWidth);
        
        canvasContext.fillStyle = '#ffff00';
        canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        
        var i;
        
        canvasContext.lineWidth = options.peakWidth;
        
        var heightPercentage = options.waveHeight / 100;
        
        for (i = 0; i < peaksLength; i++) {
            
            var peakHeightInPercent = data[i];
            
            var peakBottom = ((i + 1) * options.peakWidth) + (i * options.spaceWidth);
            var peakHeight = options.waveHeight - (heightPercentage * peakHeightInPercent);
            
            canvasContext.beginPath();
            canvasContext.moveTo(peakBottom, options.waveHeight);
            canvasContext.lineTo(peakBottom, peakHeight);
            canvasContext.stroke();
            
        }
        
        addClickListener($element);

    };
    
    /**
     * 
     * add a click listener to the canvas waveform
     * 
     * @type type
     */
    var addClickListener = function addClickListenerFunction($element) {
        
        $element.on('click', function(event) {
            
            getMousePosition($element, event);
            
        });
        
    };
    
    /**
     * 
     * get the mouse position of the click on the canvas
     * 
     * @type type
     */
    var getMousePosition = function getMousePositionFunction($element, event) {
        
        var boundingClientRectangle = $element[0].getBoundingClientRect();
        
        var position = event.clientX - boundingClientRectangle.left;
        
        console.log(position);
        
    };
    
    /**
     * 
     * get the canvas context from canvas element
     * 
     * @type type
     */
    var getCanvasContext = function getCanvasContextFunction($element) {
        
        var canvasContext = $element[0].getContext('2d');
        
        return canvasContext;
        
    };
    
    var audioContext;
    
    /**
     * 
     * get the web audio api audiocontext
     * 
     * @type type
     */
    var getAudioContext = function getAudioContextFunction() {
        
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        
        audioContext = new AudioContext();
        
    };

    /**
     * 
     * initialize the waveform module
     * 
     * @type type
     */
    var initialize = function initializeFunction() {

        getAudioContext();
        
    };
    
    /**
     * public functions
     */
    return {
        init: initialize,
        draw: drawWave,
        getDataFromServer: getWaveDataFromServer
    };

});