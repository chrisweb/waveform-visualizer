(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['waveform-visualizer'] = {}));
}(this, (function (exports) { 'use strict';

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
        function Waveform(waveformOptions) {
            this._firstDrawing = true;
            this._plugins = [];
            this._waveformClickCallback = null;
            if (waveformOptions !== undefined) {
                if (waveformOptions.canvasContext !== undefined) {
                    this.setCanvasContext(waveformOptions.canvasContext);
                }
                if (waveformOptions.canvasElement !== undefined) {
                    this.setCanvasElement(waveformOptions.canvasElement);
                }
                if (waveformOptions.data !== undefined) {
                    this.setWaveData(waveformOptions.data);
                }
                if (waveformOptions.layout !== undefined) {
                    this.setLayoutOptions(waveformOptions.layout);
                }
                if (waveformOptions.waveformClickCallback !== undefined) {
                    this.setWaveformClickCallback(waveformOptions.waveformClickCallback);
                }
            }
        }
        Waveform.prototype.setCanvasContext = function (canvasContext) {
            this._canvasContext = canvasContext;
            this._canvasElement = this._canvasContext.canvas;
            //this._activateClickListener();
        };
        Waveform.prototype.getCanvasContext = function () {
            return this._canvasContext;
        };
        Waveform.prototype.setCanvasElement = function (canvasElement) {
            this._canvasElement = canvasElement;
            var canvas = new Canvas();
            try {
                this._canvasContext = canvas.getContext(canvasElement);
            }
            catch (error) {
                // TODO: handle error properly
                console.log(error);
            }
            //this._activateClickListener();
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
            var waveLayoutOptions = Object.assign(Waveform.layoutOptions, layout);
            this._waveLayoutOptions = waveLayoutOptions;
        };
        Waveform.prototype.getLayoutOptions = function () {
            return this._waveLayoutOptions;
        };
        Waveform.prototype.setWaveformClickCallback = function (waveformClickCallback) {
            this._waveformClickCallback = waveformClickCallback;
        };
        Waveform.prototype.getWaveformClickCallback = function () {
            return this._waveformClickCallback;
        };
        /*protected _activateClickListener() {

            this._canvasElement.addEventListener('click', this.canvasElementClick);

        }*/
        Waveform.prototype._canvasElementClick = function (event) {
            event.preventDefault();
            var canvasHorizontalPositionInPixel = this._getMouseHorizontalPosition(event);
            var pixelsPerPercent = this._canvasElement.width / 100;
            var clickHorizontalPositionInPercent = canvasHorizontalPositionInPixel / pixelsPerPercent;
            if (this._waveformClickCallback !== null) {
                this._waveformClickCallback(clickHorizontalPositionInPercent);
            }
        };
        Waveform.prototype._getMouseHorizontalPosition = function (event) {
            var boundingClientRectangle = this._canvasElement.getBoundingClientRect();
            var position = event.clientX - boundingClientRectangle.left;
            return position;
        };
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
            // canvas background color
            this._canvasContext.fillStyle = '#' + this._waveLayoutOptions.waveBackgroundColorHex;
            this._canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
            var i;
            for (i = 0; i < peaksLength; i++) {
                var topStrokeColor = void 0;
                var bottomStrokeColor = void 0;
                if (i < peaksRange) {
                    topStrokeColor = '#' + this._waveLayoutOptions.peakTopProgressColorHex;
                    bottomStrokeColor = '#' + this._waveLayoutOptions.peakBottomProgressColorHex;
                }
                else {
                    topStrokeColor = '#' + this._waveLayoutOptions.peakTopColorHex;
                    bottomStrokeColor = '#' + this._waveLayoutOptions.peakBottomColorHex;
                }
                var peakHeightInPercent = this._waveData[i];
                // the horizontal position of a peak
                var peakHorizontalPosition = ((i + 1) * this._waveLayoutOptions.peakWidthInPixel) + (i * this._waveLayoutOptions.spaceWidthInPixel);
                // waveform top
                this._canvasContext.beginPath();
                this._canvasContext.moveTo(peakHorizontalPosition, topPeakMaxHeightInPixel);
                this._canvasContext.lineTo(peakHorizontalPosition, topPeakMaxHeightInPixel - (topPeakMaxHeightInPixel * (peakHeightInPercent / 100)));
                this._canvasContext.strokeStyle = topStrokeColor;
                this._canvasContext.stroke();
                // waveform bottom
                this._canvasContext.beginPath();
                this._canvasContext.moveTo(peakHorizontalPosition, topPeakMaxHeightInPixel);
                this._canvasContext.lineTo(peakHorizontalPosition, topPeakMaxHeightInPixel + (bottomPeakMaxHeightInPixel * (peakHeightInPercent / 100)));
                this._canvasContext.strokeStyle = bottomStrokeColor;
                this._canvasContext.stroke();
            }
        };
        Waveform.layoutOptions = {
            waveHeightInPixel: 200,
            waveBackgroundColorHex: '000000',
            peakWidthInPixel: 2,
            spaceWidthInPixel: 1,
            waveTopPercentage: 70,
            peakTopColorHex: 'f222ff',
            peakBottomColorHex: 'ff2975',
            peakTopProgressColorHex: 'ffd319',
            peakBottomProgressColorHex: 'ff901f'
        };
        return Waveform;
    }());

    exports.Waveform = Waveform;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
