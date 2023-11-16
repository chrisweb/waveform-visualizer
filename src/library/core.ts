import { Canvas } from './canvas';

export interface IWaveCoreOptions {
    canvasElement?: HTMLCanvasElement;
    data?: number[];
    layout?: IWaveLayoutOptions;
    waveformClickCallback?: IWaveClickCallback;
}

export interface IWaveLayoutOptions {
    readonly waveHeightInPixel?: number;
    readonly waveBackgroundFillStyle?: string | CanvasGradient | CanvasPattern;
    readonly peakWidthInPixel?: number;
    readonly spaceWidthInPixel?: number;
    readonly waveTopPercentage?: number;
    readonly peakTopFillStyle?: string | CanvasGradient | CanvasPattern;
    readonly peakBottomFillStyle?: string | CanvasGradient | CanvasPattern;
    readonly peakTopProgressFillStyle?: string | CanvasGradient | CanvasPattern;
    readonly peakBottomProgressFillStyle?: string | CanvasGradient | CanvasPattern;
}

export interface IWaveClickCallback {
    (clickHorizontalPositionInPercent: number): void;
}

export class Waveform {

    static layoutOptions: IWaveLayoutOptions = {
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

    protected _canvasContext: CanvasRenderingContext2D;
    protected _canvasElement: HTMLCanvasElement;
    protected _waveData: number[];
    protected _waveLayoutOptions: IWaveLayoutOptions = Waveform.layoutOptions;
    protected _firstDrawing = true;
    protected _latestRange: number | null = null;
    protected _plugins: [] = [];
    protected _waveClickCallback: IWaveClickCallback | null = null;

    constructor(waveCoreOptions?: IWaveCoreOptions) {

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

    public setCanvasElement(canvasElement: HTMLCanvasElement): void {

        this._canvasElement = canvasElement;

        const canvas = new Canvas();

        this._canvasContext = canvas.getContext(canvasElement);

        this._addClickWaveListener();

    }

    public getCanvasElement(): HTMLCanvasElement {

        return this._canvasElement;

    }

    public setWaveData(data: number[]): void {

        // reset the _latestRange to allow a new
        // draw even if the range did not change
        this._latestRange = null;

        this._waveData = data;

    }

    public getWaveData(): number[] {

        return this._waveData;

    }

    public setLayoutOptions(layout: IWaveLayoutOptions): void {

        Object.assign(this._waveLayoutOptions, layout);

    }

    public getLayoutOptions(): IWaveLayoutOptions {

        return this._waveLayoutOptions;

    }

    public setWaveformClickCallback(waveformClickCallback: IWaveClickCallback): void {

        this._waveClickCallback = waveformClickCallback;

    }

    public getWaveformClickCallback(): IWaveClickCallback {

        return this._waveClickCallback;

    }

    protected _addClickWaveListener(): void {

        this._canvasElement.addEventListener('click', this._canvasElementClick.bind(this));

    }

    protected _removeClickWaveListener(): void {

        this._canvasElement.removeEventListener('click', this._canvasElementClick.bind(this));

    }

    protected _canvasElementClick(event: MouseEvent): void {

        if (this._waveClickCallback !== null) {

            event.preventDefault();

            const canvasHorizontalPositionInPixel = this._getMouseHorizontalPosition(event);
            const pixelsPerPercent = this._canvasElement.width / 100;
            const clickHorizontalPositionInPercent = canvasHorizontalPositionInPixel / pixelsPerPercent;

            this._waveClickCallback(clickHorizontalPositionInPercent);

        }

    }

    protected _getMouseHorizontalPosition(event: MouseEvent): number {

        const boundingClientRectangle = this._canvasElement.getBoundingClientRect();
        const position = event.clientX - boundingClientRectangle.left;

        return position;

    }

    /**
     * 
     * @param range 
     */
    public draw(range: number = 0, force = false): void {

        // measure fps
        //this.fps();

        const peaksLength = this._waveData.length;

        if (peaksLength === 0) {
            // nothing to draw
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
        this._canvasContext.fillStyle = this._waveLayoutOptions.waveBackgroundFillStyle;
        this._canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

        let i;

        for (i = 0; i < peaksLength; i++) {

            let topStrokeFillStyle;
            let bottomStrokeFillStyle;

            if (i < peaksRange) {

                topStrokeFillStyle = this._waveLayoutOptions.peakTopProgressFillStyle;
                bottomStrokeFillStyle = this._waveLayoutOptions.peakBottomProgressFillStyle;

            } else {

                topStrokeFillStyle = this._waveLayoutOptions.peakTopFillStyle;
                bottomStrokeFillStyle = this._waveLayoutOptions.peakBottomFillStyle;

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

    public destroy(): void {

        this._removeClickWaveListener();

    }
}