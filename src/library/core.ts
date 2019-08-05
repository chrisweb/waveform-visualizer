import { Canvas } from './canvas';
import { Events } from './events';

export interface ICoreOptions {
    canvasContext?: CanvasRenderingContext2D;
    canvasElement?: HTMLCanvasElement;
    data?: number[];
    layout?: IWaveLayoutOptions;
}

export interface IWaveLayoutOptions {
    readonly waveHeightInPixel?: number;
    readonly waveBackgroundColorHex?: string;
    readonly peakWidthInPixel?: number;
    readonly spaceWidthInPixel?: number;
    readonly waveTopPercentage?: number;
    readonly peakTopColorHex?: string;
    readonly peakBottomColorHex?: string;
    readonly peakTopProgressColorHex?: string;
    readonly peakBottomProgressColorHex?: string;
}

export class Waveform {

    static layoutOptions: IWaveLayoutOptions = {
        waveHeightInPixel: 200,
        waveBackgroundColorHex: '000000',
        peakWidthInPixel: 2,
        spaceWidthInPixel: 1,
        waveTopPercentage: 70,
        peakTopColorHex: 'f222ff',
        peakBottomColorHex: 'ff2975',
        peakTopProgressColorHex : 'ffd319',
        peakBottomProgressColorHex: 'ff901f'
    };

    protected canvasContext: CanvasRenderingContext2D;
    protected canvasElement: HTMLCanvasElement;
    protected waveData: number[];
    protected waveLayoutOptions: IWaveLayoutOptions;
    protected firstDrawing: boolean = true;
    protected latestRange: number;
    protected _plugins: [] = [];
    protected events: Events;

    constructor(waveformOptions?: ICoreOptions) {

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

    public setCanvasContext(canvasContext: CanvasRenderingContext2D): void {

        this.canvasContext = canvasContext;

        this.canvasElement = this.canvasContext.canvas;

        this.activateClickListener();

    }

    public setCanvasElement(canvasElement: HTMLCanvasElement): void {

        this.canvasElement = canvasElement;

        let canvas = new Canvas();

        try {
            this.canvasContext = canvas.getContext(canvasElement);
        } catch (error) {
            // TODO: handle error properly
            console.log(error);
        }

        this.activateClickListener();

    }

    public setWaveData(data: number[]): void {

        this.waveData = data;

    }

    public setLayoutOptions(layout: IWaveLayoutOptions): void {

        let waveLayoutOptions = Object.assign(Waveform.layoutOptions, layout);

        this.waveLayoutOptions = waveLayoutOptions;

    }

    protected activateClickListener() {

        this.canvasElement.addEventListener('click', this.canvasElementClick);

    }

    protected canvasElementClick(event: MouseEvent) {

        event.preventDefault();

        let canvasPositionInPixel = this.getMousePosition(event);

        let pixelsPerPercent = this.canvasElement.width / 100;

        let clickPositionInPercent = canvasPositionInPixel / pixelsPerPercent;

        console.log(clickPositionInPercent);

        this.events.trigger(this.events.constants.clickEvent, clickPositionInPercent);

    }

    protected getMousePosition(event: MouseEvent): number {

        let boundingClientRectangle = this.canvasElement.getBoundingClientRect();

        let position = event.clientX - boundingClientRectangle.left;

        //console.log(position);

        return position;

    }

    public draw(range?: number) {

        // measure fps
        //this.fps();

        const peaksLength = this.waveData.length;

        // the canvas width is the width of all the peaks, plus the width of
        // all the spaces, the amount of spaces is equal to the amount of peaks
        // minus one
        const canvasWidth = (peaksLength * this.waveLayoutOptions.peakWidthInPixel) + ((peaksLength - 1) * this.waveLayoutOptions.spaceWidthInPixel);

        let peaksRange = 0;

        if (range !== undefined) {

            const peaksPercentage = peaksLength / 100;

            peaksRange = Math.round(range * peaksPercentage);

            // if the range did not change since last draw don't redraw
            if (peaksRange === this.latestRange) {
                return;
            }

            this.latestRange = peaksRange;

        }

        const canvasHeight = this.waveLayoutOptions.waveHeightInPixel;

        // canvas dimensions
        this.canvasElement.height = canvasHeight;
        this.canvasElement.width = canvasWidth;

        // each peak is the line and the line width is the peak width
        this.canvasContext.lineWidth = this.waveLayoutOptions.peakWidthInPixel;

        // the max height of the top peaks
        const topPeakMaxHeightInPixel = this.waveLayoutOptions.waveHeightInPixel * (this.waveLayoutOptions.waveTopPercentage / 100);

        // the max height of the bottom peaks
        const bottomPeakMaxHeightInPixel = this.waveLayoutOptions.waveHeightInPixel  * ((100 - this.waveLayoutOptions.waveTopPercentage) / 100);

        // canvas background color
        this.canvasContext.fillStyle = '#' + this.waveLayoutOptions.waveBackgroundColorHex;
        this.canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

        let i;

        for (i = 0; i < peaksLength; i++) {

            let topStrokeColor;
            let bottomStrokeColor;

            if (i < peaksRange) {

                topStrokeColor = '#' + this.waveLayoutOptions.peakTopProgressColorHex;
                bottomStrokeColor = '#' + this.waveLayoutOptions.peakBottomProgressColorHex;

            } else {

                topStrokeColor = '#' + this.waveLayoutOptions.peakTopColorHex;
                bottomStrokeColor = '#' + this.waveLayoutOptions.peakBottomColorHex;

            }

            const peakHeightInPercent = this.waveData[i];

            // the horizontal position of a peak
            const peakHorizontalPosition = ((i + 1) * this.waveLayoutOptions.peakWidthInPixel) + (i * this.waveLayoutOptions.spaceWidthInPixel);

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
    }
}
