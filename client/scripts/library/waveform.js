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
     * @param {type} trackId
     * @param {type} trackFormat
     * @param {type} peaksAmount
     * @param {type} callback
     * @returns {undefined}
     */
    var getWaveDataFromServer = function getWaveDataFromServerFunction(trackId, trackFormat, peaksAmount, callback) {
        
        var request = $.ajax({
            url: '/getwavedata?trackId=' + trackId + '&trackFormat=' + trackFormat + '&peaksAmount=' + peaksAmount,
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
     * @param {type} data
     * @param {type} $element
     * @param {type} options
     * @returns {undefined}
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
     * @param {type} $element
     * @returns {undefined}
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
     * get the canvas context from canvas element
     * 
     * @param {type} $element
     * @returns {unresolved}
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
     * @returns {undefined}
     */
    var getAudioContext = function getAudioContextFunction() {
        
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        
        audioContext = new AudioContext();
        
    };
    
    /**
     * 
     * get a track stream from server
     * 
     * @param {type} trackId
     * @param {type} trackFormat
     * @param {type} callback
     * @returns {undefined}
     */
    var getAudioStream = function getAudioStreamFunction(trackId, trackFormat, callback) {
        
        var xhr = new XMLHttpRequest();
        
        xhr.open('GET', '/getTrack?trackId=' + trackId + '&trackFormat=' + trackFormat, true);
        xhr.responseType = 'arraybuffer';
        xhr.send();
        
        xhr.onload = function() {
        
            audioContext.decodeAudioData(xhr.response, function onSuccess(decodedBuffer) {
                
                callback(false, decodedBuffer);
                
            }, function onFailure() {
                
                callback('decoding the buffer failed');
                
            });
            
        };
        
        
        
    };
    
    /**
     * 
     * analyze the track using the client web audio api
     * 
     * @param {type} trackId
     * @param {type} trackFormat
     * @returns {undefined}
     */
    var analyzeTrack = function analyzeTrackFunction(trackId, trackFormat) {
        
        var analyser = audioContext.createAnalyser();
        
        // get the audio buffer
        getAudioStream(trackId, trackFormat, function(error, buffer) {
            
            if (!error) {
                
                console.log(buffer);
                
                
                
            } else {
                
                // log the server error
                console.log(error);
                
            }
            
        });
        
    };

    /**
     * 
     * initialize the waveform module
     * 
     * @returns {undefined}
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
        getDataFromServer: getWaveDataFromServer,
        analyze: analyzeTrack
    };

});