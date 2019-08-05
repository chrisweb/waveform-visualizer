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

var Events = /** @class */ (function () {
    function Events() {
        // events constants
        this.constants = {
            // player events
            positionEvent: 'player:position',
            progressEvent: 'player:progress',
            playEvent: 'player:play',
            pauseEvent: 'player:pause',
            stopEvent: 'player:stop',
            volumeEvent: 'player:volume',
            pannerEvent: 'player:panner',
            playbackRateEvent: 'player:playbackRate',
            bufferingEvent: 'player:bufferingEvent',
            // waveform events
            clickEvent: 'waveform:clickEvent'
        };
    }
    Events.prototype.trigger = function (name) {
        var triggerArguments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            triggerArguments[_i - 1] = arguments[_i];
        }
        var triggerArgumentsArray = Array.prototype.slice.call(triggerArguments, 1);
        if (name in this.events) {
            var eventsList = this.events[name];
            var eventsListLength = eventsList.length;
            var i = void 0;
            for (i = 0; i < eventsListLength; i++) {
                var callback = eventsList[i].callback;
                var context = eventsList[i].context;
                callback.apply(context, triggerArgumentsArray);
            }
        }
        return this;
    };
    Events.prototype.on = function (name, callback, context) {
        var eventsContainer;
        if (!(name in this.events)) {
            this.events[name] = [];
        }
        eventsContainer = this.events[name];
        if (context === undefined) {
            context = null;
        }
        eventsContainer.push({
            callback: callback,
            context: context
        });
        return this;
    };
    Events.prototype.off = function (name) {
        if (name in this.events) {
            //this.events[name] = [];
            delete this.events[name];
        }
        return this;
    };
    Events.prototype.once = function (name, callback, context) {
        var onceCallback = function () {
            this.off(name);
            callback.apply(name, arguments);
        };
        return this.on(name, onceCallback, context);
    };
    return Events;
}());

var Waveform = /** @class */ (function () {
    function Waveform(waveformOptions) {
        this.firstDrawing = true;
        this._plugins = [];
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
        }
        this.events = new Events();
    }
    Waveform.prototype.setCanvasContext = function (canvasContext) {
        this.canvasContext = canvasContext;
        this.canvasElement = this.canvasContext.canvas;
        this.activateClickListener();
    };
    Waveform.prototype.setCanvasElement = function (canvasElement) {
        this.canvasElement = canvasElement;
        var canvas = new Canvas();
        try {
            this.canvasContext = canvas.getContext(canvasElement);
        }
        catch (error) {
            // TODO: handle error properly
            console.log(error);
        }
        this.activateClickListener();
    };
    Waveform.prototype.setWaveData = function (data) {
        this.waveData = data;
    };
    Waveform.prototype.setLayoutOptions = function (layout) {
        var waveLayoutOptions = Object.assign(Waveform.layoutOptions, layout);
        this.waveLayoutOptions = waveLayoutOptions;
    };
    Waveform.prototype.activateClickListener = function () {
        this.canvasElement.addEventListener('click', this.canvasElementClick);
    };
    Waveform.prototype.canvasElementClick = function (event) {
        event.preventDefault();
        var canvasPositionInPixel = this.getMousePosition(event);
        var pixelsPerPercent = this.canvasElement.width / 100;
        var clickPositionInPercent = canvasPositionInPixel / pixelsPerPercent;
        console.log(clickPositionInPercent);
        this.events.trigger(this.events.constants.clickEvent, clickPositionInPercent);
    };
    Waveform.prototype.getMousePosition = function (event) {
        var boundingClientRectangle = this.canvasElement.getBoundingClientRect();
        var position = event.clientX - boundingClientRectangle.left;
        //console.log(position);
        return position;
    };
    Waveform.prototype.draw = function (range) {
        // measure fps
        //this.fps();
        var peaksLength = this.waveData.length;
        // the canvas width is the width of all the peaks, plus the width of
        // all the spaces, the amount of spaces is equal to the amount of peaks
        // minus one
        var canvasWidth = (peaksLength * this.waveLayoutOptions.peakWidthInPixel) + ((peaksLength - 1) * this.waveLayoutOptions.spaceWidthInPixel);
        var peaksRange = 0;
        if (range !== undefined) {
            var peaksPercentage = peaksLength / 100;
            peaksRange = Math.round(range * peaksPercentage);
            // if the range did not change since last draw don't redraw
            if (peaksRange === this.latestRange) {
                return;
            }
            this.latestRange = peaksRange;
        }
        var canvasHeight = this.waveLayoutOptions.waveHeightInPixel;
        // canvas dimensions
        this.canvasElement.height = canvasHeight;
        this.canvasElement.width = canvasWidth;
        // each peak is the line and the line width is the peak width
        this.canvasContext.lineWidth = this.waveLayoutOptions.peakWidthInPixel;
        // the max height of the top peaks
        var topPeakMaxHeightInPixel = this.waveLayoutOptions.waveHeightInPixel * (this.waveLayoutOptions.waveTopPercentage / 100);
        // the max height of the bottom peaks
        var bottomPeakMaxHeightInPixel = this.waveLayoutOptions.waveHeightInPixel * ((100 - this.waveLayoutOptions.waveTopPercentage) / 100);
        // canvas background color
        this.canvasContext.fillStyle = '#' + this.waveLayoutOptions.waveBackgroundColorHex;
        this.canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var i;
        for (i = 0; i < peaksLength; i++) {
            var topStrokeColor = void 0;
            var bottomStrokeColor = void 0;
            if (i < peaksRange) {
                topStrokeColor = '#' + this.waveLayoutOptions.peakTopProgressColorHex;
                bottomStrokeColor = '#' + this.waveLayoutOptions.peakBottomProgressColorHex;
            }
            else {
                topStrokeColor = '#' + this.waveLayoutOptions.peakTopColorHex;
                bottomStrokeColor = '#' + this.waveLayoutOptions.peakBottomColorHex;
            }
            var peakHeightInPercent = this.waveData[i];
            // the horizontal position of a peak
            var peakHorizontalPosition = ((i + 1) * this.waveLayoutOptions.peakWidthInPixel) + (i * this.waveLayoutOptions.spaceWidthInPixel);
            // waveform top
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(peakHorizontalPosition, topPeakMaxHeightInPixel);
            this.canvasContext.lineTo(peakHorizontalPosition, topPeakMaxHeightInPixel - (topPeakMaxHeightInPixel * (peakHeightInPercent / 100)));
            this.canvasContext.strokeStyle = topStrokeColor;
            this.canvasContext.stroke();
            // waveform bottom
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(peakHorizontalPosition, topPeakMaxHeightInPixel);
            this.canvasContext.lineTo(peakHorizontalPosition, topPeakMaxHeightInPixel + (bottomPeakMaxHeightInPixel * (peakHeightInPercent / 100)));
            this.canvasContext.strokeStyle = bottomStrokeColor;
            this.canvasContext.stroke();
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

export { Events, Waveform };
//# sourceMappingURL=index.js.map
