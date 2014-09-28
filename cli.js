var waveformData = require('./server/library/waveformData');

var queryObject = {};

process.argv.forEach(function (value, index, array) {
    
    if (index === 2) {
        
        queryObject.serverDirectory = value;
        
    }
    
    if (index === 3) {
        
        queryObject.trackId = value;
        
    }
    
    if (index === 4) {
        
        queryObject.trackFormat = value;
        
    }
    
    if (index === 5) {
        
        queryObject.peaksAmount = value;
        
    }
    
    if (index === 6) {
        
        queryObject.service = value;
        
    }
    
});

var outputResponse = function outputResponseFunction(error, peaks) {

    if (error) {

        process.stderr.write(error);

        process.exit(1);

    } else {

        var peaksString = '';
        var i;
        var peaksLength = peaks.length;
        
        for (i = 0; i < peaksLength; i++) {
            
            peaksString += peaks[i] + ',';
            
        }

        process.stdout.write(peaksString.substring(0, peaksString.length - 1));

        process.exit(0);

    }
    
};

if (queryObject.service === 'local') {
    
    // node cli /downloaded_tracks 1100511 ogg 200 local
    waveformData.getLocalWaveData(queryObject, outputResponse);
    
} else {
    
    // node cli /downloaded_tracks 1100511 ogg 200 jamendo
    waveformData.getRemoteWaveData(queryObject, outputResponse);
    
}