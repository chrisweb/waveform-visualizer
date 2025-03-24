class Canvas {
    getContext(element) {
        if (element === null) {
            throw new Error('No element to get context from');
        }
        const canvasContext = element.getContext('2d');
        if (canvasContext === null) {
            throw new Error('No context found');
        }
        return canvasContext;
    }
}

class Waveform {
    constructor(waveCoreOptions) {
        this._waveData = [];
        this._waveLayoutOptions = Waveform.layoutOptions;
        this._firstDrawing = true;
        this._latestRange = null;
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
    setCanvasElement(canvasElement) {
        this._canvasElement = canvasElement;
        const canvas = new Canvas();
        this._canvasContext = canvas.getContext(canvasElement);
        this._addClickWaveListener();
    }
    getCanvasElement() {
        return this._canvasElement;
    }
    setWaveData(data) {
        // reset the _latestRange to allow a new
        // draw even if the range did not change
        this._latestRange = null;
        this._waveData = data;
    }
    getWaveData() {
        return this._waveData;
    }
    setLayoutOptions(layout) {
        Object.assign(this._waveLayoutOptions, layout);
    }
    getLayoutOptions() {
        return this._waveLayoutOptions;
    }
    setWaveformClickCallback(waveformClickCallback) {
        this._waveClickCallback = waveformClickCallback;
    }
    getWaveformClickCallback() {
        return this._waveClickCallback;
    }
    _addClickWaveListener() {
        this._canvasElement.addEventListener('click', this._canvasElementClick.bind(this));
    }
    _removeClickWaveListener() {
        this._canvasElement.removeEventListener('click', this._canvasElementClick.bind(this));
    }
    _canvasElementClick(event) {
        if (this._waveClickCallback !== null) {
            event.preventDefault();
            const canvasHorizontalPositionInPixel = this._getMouseHorizontalPosition(event);
            const pixelsPerPercent = this._canvasElement.width / 100;
            const clickHorizontalPositionInPercent = canvasHorizontalPositionInPixel / pixelsPerPercent;
            this._waveClickCallback(clickHorizontalPositionInPercent);
        }
    }
    _getMouseHorizontalPosition(event) {
        const boundingClientRectangle = this._canvasElement.getBoundingClientRect();
        const position = event.clientX - boundingClientRectangle.left;
        return position;
    }
    /**
     *
     * @param range
     */
    draw(range = 0, force = false) {
        // measure fps
        //this.fps();
        const peaksLength = this._waveData.length;
        if (peaksLength === 0) {
            // nothing to draw
            console.warn('can not draw, peaks array (waveData) is empty');
            return;
        }
        if (range < 0 || range > 100) {
            console.warn('range value must be >= 0 and <= 100');
            return;
        }
        // the canvas width is the width of all the peaks, plus the width of
        // all the spaces, the amount of spaces is equal to the amount of peaks
        // minus one
        const canvasWidth = (peaksLength * this._waveLayoutOptions.peakWidthInPixel) + ((peaksLength - 1) * this._waveLayoutOptions.spaceWidthInPixel);
        let peaksRange = 0;
        const peaksPercentage = peaksLength / 100;
        peaksRange = Math.round(range * peaksPercentage);
        // if the range did not change since last draw don't redraw
        // except if force is true
        if (peaksRange === this._latestRange && !force) {
            return;
        }
        this._latestRange = peaksRange;
        const canvasHeight = this._waveLayoutOptions.waveHeightInPixel;
        // canvas dimensions
        this._canvasElement.height = canvasHeight;
        this._canvasElement.width = canvasWidth;
        // each peak is the line and the line width is the peak width
        this._canvasContext.lineWidth = this._waveLayoutOptions.peakWidthInPixel;
        // the max height of the top peaks
        const topPeakMaxHeightInPixel = this._waveLayoutOptions.waveHeightInPixel * (this._waveLayoutOptions.waveTopPercentage / 100);
        // the max height of the bottom peaks
        const bottomPeakMaxHeightInPixel = this._waveLayoutOptions.waveHeightInPixel * ((100 - this._waveLayoutOptions.waveTopPercentage) / 100);
        // canvas background fill style
        this._canvasContext.fillStyle = this._waveLayoutOptions.waveBackgroundFillStyle || 'transparent';
        this._canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        let i;
        for (i = 0; i < peaksLength; i++) {
            let topStrokeFillStyle;
            let bottomStrokeFillStyle;
            if (i < peaksRange) {
                topStrokeFillStyle = this._waveLayoutOptions.peakTopProgressFillStyle || '#ffd319';
                bottomStrokeFillStyle = this._waveLayoutOptions.peakBottomProgressFillStyle || '#ff901f';
            }
            else {
                topStrokeFillStyle = this._waveLayoutOptions.peakTopFillStyle || '#f222ff';
                bottomStrokeFillStyle = this._waveLayoutOptions.peakBottomFillStyle || '#ff2975';
            }
            const peakHeightInPercent = this._waveData[i];
            // the horizontal position of a peak
            const peakHorizontalPosition = ((i + 1) * this._waveLayoutOptions.peakWidthInPixel) + (i * this._waveLayoutOptions.spaceWidthInPixel);
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
    }
    destroy() {
        this._removeClickWaveListener();
    }
}
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

export { Waveform };
//# sourceMappingURL=index.js.map
