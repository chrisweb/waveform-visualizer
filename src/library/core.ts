import { Canvas } from './canvas';

export interface ICoreOptions {
    canvasContext?: CanvasRenderingContext2D;
    canvasElement?: HTMLCanvasElement;
    data?: number[];
    layout?: IWaveLayoutOptions;
    waveformClickCallback?: IWaveformClickCallback;
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

export interface IWaveformClickCallback {
    (clickHorizontalPositionInPercent: number): void;
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

    protected _canvasContext: CanvasRenderingContext2D;
    protected _canvasElement: HTMLCanvasElement;
    protected _waveData: number[];
    protected _waveLayoutOptions: IWaveLayoutOptions;
    protected _firstDrawing: boolean = true;
    protected _latestRange: number;
    protected _plugins: [] = [];
    protected _waveformClickCallback: IWaveformClickCallback | null = null;

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

            if (waveformOptions.waveformClickCallback !== undefined) {

                this.setWaveformClickCallback(waveformOptions.waveformClickCallback);

            }

        }

    }

    public setCanvasContext(canvasContext: CanvasRenderingContext2D): void {

        this._canvasContext = canvasContext;

        this._canvasElement = this._canvasContext.canvas;

        //this._activateClickListener();

    }

    public getCanvasContext(): CanvasRenderingContext2D {

        return this._canvasContext;

    }

    public setCanvasElement(canvasElement: HTMLCanvasElement): void {

        this._canvasElement = canvasElement;

        let canvas = new Canvas();

        try {
            this._canvasContext = canvas.getContext(canvasElement);
        } catch (error) {
            // TODO: handle error properly
            console.log(error);
        }

        //this._activateClickListener();

    }

    public getCanvasElement(): HTMLCanvasElement {

        return this._canvasElement;

    }

    public setWaveData(data: number[]): void {

        this._waveData = data;

    }

    public getWaveData(): number[] {

        return this._waveData;

    }

    public setLayoutOptions(layout: IWaveLayoutOptions): void {

        let waveLayoutOptions = Object.assign(Waveform.layoutOptions, layout);

        this._waveLayoutOptions = waveLayoutOptions;

    }

    public getLayoutOptions(): IWaveLayoutOptions {

        return this._waveLayoutOptions;

    }

    public setWaveformClickCallback(waveformClickCallback: IWaveformClickCallback): void {

        this._waveformClickCallback = waveformClickCallback;

    }

    public getWaveformClickCallback(): IWaveformClickCallback {

        return this._waveformClickCallback;

    }

    /*protected _activateClickListener() {

        this._canvasElement.addEventListener('click', this.canvasElementClick);

    }*/

    protected _canvasElementClick(event: MouseEvent) {

        event.preventDefault();

        let canvasHorizontalPositionInPixel = this._getMouseHorizontalPosition(event);

        let pixelsPerPercent = this._canvasElement.width / 100;

        let clickHorizontalPositionInPercent = canvasHorizontalPositionInPixel / pixelsPerPercent;

        if (this._waveformClickCallback !== null) {
            this._waveformClickCallback(clickHorizontalPositionInPercent);
        }

    }

    protected _getMouseHorizontalPosition(event: MouseEvent): number {

        let boundingClientRectangle = this._canvasElement.getBoundingClientRect();

        let position = event.clientX - boundingClientRectangle.left;

        return position;

    }

    public draw(range?: number) {

        // measure fps
        //this.fps();

        const peaksLength = this._waveData.length;

        // the canvas width is the width of all the peaks, plus the width of
        // all the spaces, the amount of spaces is equal to the amount of peaks
        // minus one
        const canvasWidth = (peaksLength * this._waveLayoutOptions.peakWidthInPixel) + ((peaksLength - 1) * this._waveLayoutOptions.spaceWidthInPixel);

        let peaksRange = 0;

        if (range !== undefined) {

            const peaksPercentage = peaksLength / 100;

            peaksRange = Math.round(range * peaksPercentage);

            // if the range did not change since last draw don't redraw
            if (peaksRange === this._latestRange) {
                return;
            }

            this._latestRange = peaksRange;

        }

        const canvasHeight = this._waveLayoutOptions.waveHeightInPixel;

        // canvas dimensions
        this._canvasElement.height = canvasHeight;
        this._canvasElement.width = canvasWidth;

        // each peak is the line and the line width is the peak width
        this._canvasContext.lineWidth = this._waveLayoutOptions.peakWidthInPixel;

        // the max height of the top peaks
        const topPeakMaxHeightInPixel = this._waveLayoutOptions.waveHeightInPixel * (this._waveLayoutOptions.waveTopPercentage / 100);

        // the max height of the bottom peaks
        const bottomPeakMaxHeightInPixel = this._waveLayoutOptions.waveHeightInPixel  * ((100 - this._waveLayoutOptions.waveTopPercentage) / 100);

        // canvas background color
        this._canvasContext.fillStyle = '#' + this._waveLayoutOptions.waveBackgroundColorHex;
        this._canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

        let i;

        for (i = 0; i < peaksLength; i++) {

            let topStrokeColor;
            let bottomStrokeColor;

            if (i < peaksRange) {

                topStrokeColor = '#' + this._waveLayoutOptions.peakTopProgressColorHex;
                bottomStrokeColor = '#' + this._waveLayoutOptions.peakBottomProgressColorHex;

            } else {

                topStrokeColor = '#' + this._waveLayoutOptions.peakTopColorHex;
                bottomStrokeColor = '#' + this._waveLayoutOptions.peakBottomColorHex;

            }

            const peakHeightInPercent = this._waveData[i];

            // the horizontal position of a peak
            const peakHorizontalPosition = ((i + 1) * this._waveLayoutOptions.peakWidthInPixel) + (i * this._waveLayoutOptions.spaceWidthInPixel);

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
    }
}