var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.prototype.getContext = function (element) {
        if (element === null) {
            throw new Error('No element to get context from');
        }
        var canvasContext = element.getContext('2d');
        return canvasContext;
    };
    return Canvas;
}());

var Waveform = /** @class */ (function () {
    function Waveform(waveCoreOptions) {
        this._waveLayoutOptions = Waveform.layoutOptions;
        this._firstDrawing = true;
        this._plugins = [];
        this._waveClickCallback = null;
        if (waveCoreOptions !== undefined) {
            if (waveCoreOptions.canvasElement !== undefined) {
                this.setCanvasElement(waveCoreOptions.canvasElement);
            }
            if (waveCoreOptions.data !== undefined) {
                this.setWaveData(waveCoreOptions.data);
            }
            if (waveCoreOptions.layout !== undefined) {
                this.setLayoutOptions(waveCoreOptions.layout);
            }
            if (waveCoreOptions.waveformClickCallback !== undefined) {
                this.setWaveformClickCallback(waveCoreOptions.waveformClickCallback);
            }
        }
    }
    Waveform.prototype.setCanvasElement = function (canvasElement) {
        this._canvasElement = canvasElement;
        var canvas = new Canvas();
        this._canvasContext = canvas.getContext(canvasElement);
        this._addClickWaveListener();
    };
    Waveform.prototype.getCanvasElement = function () {
        return this._canvasElement;
    };
    Waveform.prototype.setWaveData = function (data) {
        this._waveData = data;
    };
    Waveform.prototype.getWaveData = function () {
        return this._waveData;
    };
    Waveform.prototype.setLayoutOptions = function (layout) {
        Object.assign(this._waveLayoutOptions, layout);
    };
    Waveform.prototype.getLayoutOptions = function () {
        return this._waveLayoutOptions;
    };
    Waveform.prototype.setWaveformClickCallback = function (waveformClickCallback) {
        this._waveClickCallback = waveformClickCallback;
    };
    Waveform.prototype.getWaveformClickCallback = function () {
        return this._waveClickCallback;
    };
    Waveform.prototype._addClickWaveListener = function () {
        this._canvasElement.addEventListener('click', this._canvasElementClick);
    };
    Waveform.prototype._removeClickWaveListener = function () {
        this._canvasElement.removeEventListener('click', this._canvasElementClick);
    };
    Waveform.prototype._canvasElementClick = function (event) {
        if (this._waveClickCallback !== null) {
            event.preventDefault();
            var canvasHorizontalPositionInPixel = this._getMouseHorizontalPosition(event);
            var pixelsPerPercent = this._canvasElement.width / 100;
            var clickHorizontalPositionInPercent = canvasHorizontalPositionInPixel / pixelsPerPercent;
            this._waveClickCallback(clickHorizontalPositionInPercent);
        }
    };
    Waveform.prototype._getMouseHorizontalPosition = function (event) {
        var boundingClientRectangle = this._canvasElement.getBoundingClientRect();
        var position = event.clientX - boundingClientRectangle.left;
        return position;
    };
    /**
     *
     * @param range
     */
    Waveform.prototype.draw = function (range) {
        // measure fps
        //this.fps();
        var peaksLength = this._waveData.length;
        // the canvas width is the width of all the peaks, plus the width of
        // all the spaces, the amount of spaces is equal to the amount of peaks
        // minus one
        var canvasWidth = (peaksLength * this._waveLayoutOptions.peakWidthInPixel) + ((peaksLength - 1) * this._waveLayoutOptions.spaceWidthInPixel);
        var peaksRange = 0;
        if (range !== undefined) {
            var peaksPercentage = peaksLength / 100;
            peaksRange = Math.round(range * peaksPercentage);
            // if the range did not change since last draw don't redraw
            if (peaksRange === this._latestRange) {
                return;
            }
            this._latestRange = peaksRange;
        }
        var canvasHeight = this._waveLayoutOptions.waveHeightInPixel;
        // canvas dimensions
        this._canvasElement.height = canvasHeight;
        this._canvasElement.width = canvasWidth;
        // each peak is the line and the line width is the peak width
        this._canvasContext.lineWidth = this._waveLayoutOptions.peakWidthInPixel;
        // the max height of the top peaks
        var topPeakMaxHeightInPixel = this._waveLayoutOptions.waveHeightInPixel * (this._waveLayoutOptions.waveTopPercentage / 100);
        // the max height of the bottom peaks
        var bottomPeakMaxHeightInPixel = this._waveLayoutOptions.waveHeightInPixel * ((100 - this._waveLayoutOptions.waveTopPercentage) / 100);
        // canvas background fill style
        this._canvasContext.fillStyle = this._waveLayoutOptions.waveBackgroundFillStyle;
        this._canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var i;
        for (i = 0; i < peaksLength; i++) {
            var topStrokeFillStyle = void 0;
            var bottomStrokeFillStyle = void 0;
            if (i < peaksRange) {
                topStrokeFillStyle = this._waveLayoutOptions.peakTopProgressFillStyle;
                bottomStrokeFillStyle = this._waveLayoutOptions.peakBottomProgressFillStyle;
            }
            else {
                topStrokeFillStyle = this._waveLayoutOptions.peakTopFillStyle;
                bottomStrokeFillStyle = this._waveLayoutOptions.peakBottomFillStyle;
            }
            var peakHeightInPercent = this._waveData[i];
            // the horizontal position of a peak
            var peakHorizontalPosition = ((i + 1) * this._waveLayoutOptions.peakWidthInPixel) + (i * this._waveLayoutOptions.spaceWidthInPixel);
            // waveform top
            this._canvasContext.beginPath();
            this._canvasContext.moveTo(peakHorizontalPosition, topPeakMaxHeightInPixel);
            this._canvasContext.lineTo(peakHorizontalPosition, topPeakMaxHeightInPixel - (topPeakMaxHeightInPixel * (peakHeightInPercent / 100)));
            this._canvasContext.strokeStyle = topStrokeFillStyle;
            this._canvasContext.stroke();
            // waveform bottom
            this._canvasContext.beginPath();
            this._canvasContext.moveTo(peakHorizontalPosition, topPeakMaxHeightInPixel);
            this._canvasContext.lineTo(peakHorizontalPosition, topPeakMaxHeightInPixel + (bottomPeakMaxHeightInPixel * (peakHeightInPercent / 100)));
            this._canvasContext.strokeStyle = bottomStrokeFillStyle;
            this._canvasContext.stroke();
        }
    };
    Waveform.prototype.destroy = function () {
        this._removeClickWaveListener();
    };
    Waveform.layoutOptions = {
        waveHeightInPixel: 100,
        waveBackgroundFillStyle: 'transparent',
        peakWidthInPixel: 2,
        spaceWidthInPixel: 1,
        waveTopPercentage: 50,
        peakTopFillStyle: '#f222ff',
        peakBottomFillStyle: '#ff2975',
        peakTopProgressFillStyle: '#ffd319',
        peakBottomProgressFillStyle: '#ff901f'
    };
    return Waveform;
}());

export { Waveform };
//# sourceMappingURL=index.js.map
