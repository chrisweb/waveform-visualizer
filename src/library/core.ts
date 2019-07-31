import { Canvas } from './canvas';
import { Events } from './events';

export interface ICoreOptions {
    canvasContext: CanvasRenderingContext2D;
    data: [];
    layout: IWaveLayoutOptions;
}

export interface IWaveLayoutOptions {
    readonly waveHeightInPixel: number;
    readonly waveBackgroundColorHex: string;
    readonly peakWidthInPixel: number;
    readonly spaceWidthInPixel: number;
    readonly waveTopPercentage: number;
    readonly peakTopColorHex: string;
    readonly peakBottomColorHex: string;
    readonly peakTopProgressColorHex: string;
    readonly peakBottomProgressColorHex: string;
}

export class Waveform {

    static layoutOptions: IWaveLayoutOptions = {
        waveHeightInPixel: 200,
        waveBackgroundColorHex: 'f8f8f8',
        peakWidthInPixel: 2,
        spaceWidthInPixel: 1,
        waveTopPercentage: 70,
        peakTopColorHex: '6c00ff',
        peakBottomColorHex: 'bd8cff',
        peakTopProgressColorHex : '380085',
        peakBottomProgressColorHex: '8265ab'
    };

    protected canvasContext: CanvasRenderingContext2D;
    protected canvasElement: HTMLCanvasElement;
    protected waveData: [];
    protected waveLayoutOptions: IWaveLayoutOptions;
    protected firstDrawing: boolean = true;
    protected latestRange: number;
    protected _plugins: [] = [];
    protected events: Events;

    constructor(waveformOptions: ICoreOptions) {

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

    public setCanvasContext(canvasContext: CanvasRenderingContext2D): void {

        this.canvasContext = canvasContext;

        this.canvasElement = this.canvasContext.canvas;

        this.activateClickListener();

    }

    public setWaveData(data: []): void {

        this.waveData = data;

    }

    public setLayoutOptions(layout: IWaveLayoutOptions): void {

        this.waveLayoutOptions = layout;

    }

    protected activateClickListener() {

        this.canvasElement.addEventListener('click', this.canvasElementClick);

    }

    protected canvasElementClick(event: MouseEvent) {

        event.preventDefault();

        let canvasPositionInPixel = this.getMousePosition(event);

        let pixelsPerPercent = this.canvasElement.width / 100;

        let trackPositionInPercent = canvasPositionInPixel / pixelsPerPercent;

        console.log(trackPositionInPercent);

        this.events.trigger(this.events.constants.clickEvent, trackPositionInPercent);

    }

    protected getMousePosition(event: MouseEvent): number {

        let boundingClientRectangle = this.canvasElement.getBoundingClientRect();

        let position = event.clientX - boundingClientRectangle.left;

        //console.log(position);

        return position;

    }



/*

    var lastLoop = (new Date()).getMilliseconds();
    var count = 1;
    var fps = 0;

    waveform.prototype.fps = function fpsFunction() {
        
        var currentLoop = (new Date()).getMilliseconds();

        if (lastLoop > currentLoop) {

            fps = count;
            
            count = 1;

        } else {

            count += 1;

        }

        lastLoop = currentLoop;
        
    };
    
    waveform.prototype.draw = function drawWaveFunction(range) {

        // measure fps
        this.fps();

        var waveLayoutOptions = setDefaultLayoutOptionsIfNotSet(this.waveLayoutOptions);

        var peaksLength = this.waveData.length;
        
        // the canvas width is the width of all the peaks, plus the width of
        // all the spaces, the amount of spaces is equal to the amount of peaks
        // minus one
        var canvasWidth = (peaksLength * waveLayoutOptions.peakWidthInPixel) + ((peaksLength - 1) * waveLayoutOptions.spaceWidthInPixel);
        
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
        
        var canvasHeight = waveLayoutOptions.waveHeightInPixel;
        
        // canvas dimensions
        this.$canvasElement.attr('height', canvasHeight);
        this.$canvasElement.attr('width', canvasWidth);

        // each peak is the line and the line width is the peak width
        this.canvasContext.lineWidth = waveLayoutOptions.peakWidthInPixel;
        
        // the max height of the top peaks
        var topPeakMaxHeightInPixel = waveLayoutOptions.waveHeightInPixel * (waveLayoutOptions.waveTopPercentage / 100);
        
        // the max height of the bottom peaks
        var bottomPeakMaxHeightInPixel = waveLayoutOptions.waveHeightInPixel  * ((100 - waveLayoutOptions.waveTopPercentage) / 100);
        
        // canvas background color
        this.canvasContext.fillStyle = '#' + waveLayoutOptions.waveBackgroundColorHex;
        this.canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        
        var i;
        
        for (i = 0; i < peaksLength; i++) {
            
            var topStrokeColor;
            var bottomStrokeColor;
            
            if (i < peaksRange) {
                
                topStrokeColor = '#' + waveLayoutOptions.peakTopProgressColorHex;
                bottomStrokeColor = '#' + waveLayoutOptions.peakBottomProgressColorHex;
                
            } else {
                
                topStrokeColor = '#' + waveLayoutOptions.peakTopColorHex;
                bottomStrokeColor = '#' + waveLayoutOptions.peakBottomColorHex;
                
            }
            
            var peakHeightInPercent = this.waveData[i];
            
            // the horizontal position of a peak
            var peakHorizontalPosition = ((i + 1) * waveLayoutOptions.peakWidthInPixel) + (i * waveLayoutOptions.spaceWidthInPixel);
            
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

    var setDefaultLayoutOptionsIfNotSet = function setDefaultLayoutOptionsIfNotSetFunction(userWaveLayoutOptions) {
        
        if (userWaveLayoutOptions === undefined) {
            
            userWaveLayoutOptions = {};
            
        }
        
        if (userWaveLayoutOptions.waveHeightInPixel === undefined) {
            
            userWaveLayoutOptions.waveHeightInPixel = 100;
            
        }
        
        if (userWaveLayoutOptions.waveBackgroundColorHex === undefined) {
            
            userWaveLayoutOptions.waveBackgroundColorHex = 'fff';
            
        }
        
        if (userWaveLayoutOptions.peakWidthInPixel === undefined) {
            
            userWaveLayoutOptions.peakWidthInPixel = 2;
            
        }
        
        if (userWaveLayoutOptions.spaceWidthInPixel === undefined) {
            
            userWaveLayoutOptions.spaceWidthInPixel = 0;
            
        }
        
        if (userWaveLayoutOptions.waveTopPercentage === undefined) {
            
            userWaveLayoutOptions.waveTopPercentage = 50;
            
        }
        
        if (userWaveLayoutOptions.peakTopColorHex === undefined) {
            
            userWaveLayoutOptions.peakTopColorHex = '4183D7';
            
        }
        
        if (userWaveLayoutOptions.peakBottomColorHex === undefined) {
            
            userWaveLayoutOptions.peakBottomColorHex = '4B77BE';
            
        }
        
        if (userWaveLayoutOptions.peakTopProgressColorHex === undefined) {
            
            userWaveLayoutOptions.peakTopProgressColorHex = '19B5FE';
            
        }
        
        if (userWaveLayoutOptions.peakBottomProgressColorHex === undefined) {
            
            userWaveLayoutOptions.peakBottomProgressColorHex = '3498DB';
            
        }
        
        return userWaveLayoutOptions;
        
    };
    

    

    

    
    waveform.prototype.setWaveData = function setWaveDataFunction(data) {
        
        if (data !== undefined) {
        
            if (data instanceof Array) {

                this.waveData = data;

            } else if (data.peaks !== undefined) {

                if (data.peaks instanceof Array) {

                    this.waveData = data.peaks;

                }

            }
            
        }
        
    };

    waveform.prototype.setLayoutOptions = function setLayoutOptionsFunction(layoutOptions) {
        
        this.waveLayoutOptions = layoutOptions;
        
    };
    
    function callPlugin(method, datas, breakValue) {
        
        for (var i = 0, len = this._plugins.length; i < len; ++i) {
            
            if (!(method in this._plugins[i])) {
                
                continue;
                
            }
            
            var returnValue = this._plugins[i][method].apply(this, datas);
            
            if (breakValue !== undefined && returnValue === breakValue) {
                
                return false;
                
            }
            
        }
        
        return true;
        
    }
    
    waveform.prototype.addPlugin = function addPluginFunction(plugin) {
        
        this._plugins.push(plugin);
        
    };
    
    waveform.prototype._plugins = null;

    var drawStop = false;
    var frameHandle;
    
    var drawRange = function drawRangeFunction() {
        
        var that = this;

        frameHandle = requestFrame(function() {

            if (!drawStop) {
                
                that.events.once(that.events.constants.progressEvent, function(data) {

                    var range = (data.position/data.duration)*100;

                    // redraw wave with different color until song progress
                    that.draw(range);

                    drawRange.call(that);
                    
                });
                
            }
            
        });
        
    };

    waveform.prototype.updateRangeStart = function drawRangeFunction() {
        
        drawStop = false;

        drawRange.call(this);
        
    };
    
    waveform.prototype.updateRangeStop = function updateRangeStopFunction() {
        
        drawStop = true;
        
        if (typeof frameHandle !== 'undefined') {
            
            clearInterval(frameHandle);
            
            
        }
        
        this.events.off(this.events.constants.progressEvent);
        
    };
    
    waveform.prototype.startListening = function() {

        var that = this;

        // on play listen for progress
        this.events.on(this.events.constants.playEvent, function waveformPlayerPlayListener(isPlaying) {
            
            if (isPlaying && callPlugin.call(that, 'onPlay', arguments, false)) {
            
                that.updateRangeStart();
                
            }
            
        });
        
        // on stop, stop listening for progress
        this.events.on(this.events.constants.stopEvent, function waveformPlayerStopListener(isPlaying) {
            
            if (!isPlaying) {
            
                that.updateRangeStop();
                
            }
            
        });
        
    };


    var requestFrame = (function requestFrameFunction(callback) {
        
        // requestAnimationFrame() shim by Paul Irish
        // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function(callback){
                    frameHandle = window.setTimeout(callback, 1000 / 60);
                };
        
    })();
    */


}
    