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
export declare class Waveform {
    static layoutOptions: IWaveLayoutOptions;
    protected _canvasContext: CanvasRenderingContext2D;
    protected _canvasElement: HTMLCanvasElement;
    protected _waveData: number[];
    protected _waveLayoutOptions: IWaveLayoutOptions;
    protected _firstDrawing: boolean;
    protected _latestRange: number;
    protected _plugins: [];
    protected _waveformClickCallback: IWaveformClickCallback | null;
    constructor(waveformOptions?: ICoreOptions);
    setCanvasContext(canvasContext: CanvasRenderingContext2D): void;
    getCanvasContext(): CanvasRenderingContext2D;
    setCanvasElement(canvasElement: HTMLCanvasElement): void;
    getCanvasElement(): HTMLCanvasElement;
    setWaveData(data: number[]): void;
    getWaveData(): number[];
    setLayoutOptions(layout: IWaveLayoutOptions): void;
    getLayoutOptions(): IWaveLayoutOptions;
    setWaveformClickCallback(waveformClickCallback: IWaveformClickCallback): void;
    getWaveformClickCallback(): IWaveformClickCallback;
    protected _canvasElementClick(event: MouseEvent): void;
    protected _getMouseHorizontalPosition(event: MouseEvent): number;
    /**
     *
     * @param range
     */
    draw(range?: number): void;
}
