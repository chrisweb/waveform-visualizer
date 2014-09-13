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
    
    var drawWave = function drawWaveFunction(data, $element, options) {
        
        console.log(data);
        console.log($element);
        console.log(options);
        
        var canvasContext = getCanvasContext($element);
        
        
        
    };
    
    var audioContext;
    
    var getAudioContext = function getAudioContextFunction() {
        
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        
        audioContext = new AudioContext();
        
    };
    
    var getCanvasContext = function getCanvasContextFunction($element) {
        
        var canvasContext = $element[0].getContext('2d');
        
        return canvasContext;
        
    };

    var initialize = function initializeFunction() {

        getAudioContext();
        
    };
    
    return {
        init: initialize,
        draw: drawWave,
        getDataFromServer: getWaveDataFromServer
    };

});