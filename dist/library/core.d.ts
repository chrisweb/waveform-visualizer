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
export declare class Waveform {
    static layoutOptions: IWaveLayoutOptions;
    protected _canvasContext: CanvasRenderingContext2D;
    protected _canvasElement: HTMLCanvasElement;
    protected _waveData: number[];
    protected _waveLayoutOptions: IWaveLayoutOptions;
    protected _firstDrawing: boolean;
    protected _latestRange: number | null;
    protected _plugins: [];
    protected _waveClickCallback: IWaveClickCallback | null;
    constructor(waveCoreOptions?: IWaveCoreOptions);
    setCanvasElement(canvasElement: HTMLCanvasElement): void;
    getCanvasElement(): HTMLCanvasElement;
    setWaveData(data: number[]): void;
    getWaveData(): number[];
    setLayoutOptions(layout: IWaveLayoutOptions): void;
    getLayoutOptions(): IWaveLayoutOptions;
    setWaveformClickCallback(waveformClickCallback: IWaveClickCallback): void;
    getWaveformClickCallback(): IWaveClickCallback;
    protected _addClickWaveListener(): void;
    protected _removeClickWaveListener(): void;
    protected _canvasElementClick(event: MouseEvent): void;
    protected _getMouseHorizontalPosition(event: MouseEvent): number;
    /**
     *
     * @param range
     */
    draw(range?: number, force?: boolean): void;
    destroy(): void;
}
