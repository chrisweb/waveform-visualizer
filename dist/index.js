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
    Waveform.prototype.setWaveData = function (data) {
        this.waveData = data;
    };
    Waveform.prototype.setLayoutOptions = function (layout) {
        this.waveLayoutOptions = layout;
    };
    Waveform.prototype.activateClickListener = function () {
        this.canvasElement.addEventListener('click', this.canvasElementClick);
    };
    Waveform.prototype.canvasElementClick = function (event) {
        event.preventDefault();
        var canvasPositionInPixel = this.getMousePosition(event);
        var pixelsPerPercent = this.canvasElement.width / 100;
        var trackPositionInPercent = canvasPositionInPixel / pixelsPerPercent;
        console.log(trackPositionInPercent);
        this.events.trigger(this.events.constants.clickEvent, trackPositionInPercent);
    };
    Waveform.prototype.getMousePosition = function (event) {
        var boundingClientRectangle = this.canvasElement.getBoundingClientRect();
        var position = event.clientX - boundingClientRectangle.left;
        //console.log(position);
        return position;
    };
    Waveform.layoutOptions = {
        waveHeightInPixel: 200,
        waveBackgroundColorHex: 'f8f8f8',
        peakWidthInPixel: 2,
        spaceWidthInPixel: 1,
        waveTopPercentage: 70,
        peakTopColorHex: '6c00ff',
        peakBottomColorHex: 'bd8cff',
        peakTopProgressColorHex: '380085',
        peakBottomProgressColorHex: '8265ab'
    };
    return Waveform;
}());

export { Events, Waveform };
//# sourceMappingURL=index.js.map
