/**
 * 
 * @returns {_L6.Anonym$1}
 */
define([

], function (

) {

    'use strict';
    
    var getWaveDataFromServer = function getWaveDataFromServerFunction() {
        
        
        
    };
    
    var drawWave = function drawWaveFunction() {
        
        
        
    };
    
    var audioContext;
    
    var getAudioContext = function getAudioContextFunction() {
        
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        
        audioContext = new AudioContext();
        
    };

    var initialize = function initializeFunction() {

        getAudioContext();
        
    };
    
    return {
        init: initialize
    };

});