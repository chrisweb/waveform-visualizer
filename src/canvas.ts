
    
    /**
     * 
     * get the canvas context from canvas element
     * 
     * @param {type} $element
     * @returns {unresolved}
     */
    var getContext = function getContextFunction($element) {
        
        var canvasContext = $element[0].getContext('2d');
        
        return canvasContext;
        
    };
    
    /**
     * public functions
     */
    return {
        getContext: getContext
    };
