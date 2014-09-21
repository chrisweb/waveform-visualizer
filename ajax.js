/**
 * 
 * ajax
 * 
 * @param {type} $
 * @returns {ajax_L7.ajaxAnonym$1}
 */
define([
    'jquery'
    
], function (
    $
) {

    'use strict';
    
    /**
     * 
     * getAudioBuffer
     * 
     * @param {type} trackId
     * @param {type} trackFormat
     * @param {type} callback
     * @returns {undefined}
     */
    var getAudioBuffer = function (trackId, trackFormat, audioContext, callback) {
        
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
     * public functions
     */
    return {
        getAudioBuffer: getAudioBuffer,
        getWaveDataFromServer: getWaveDataFromServer
    };

});