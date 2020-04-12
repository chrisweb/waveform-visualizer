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
export declare class Waveform {
    static layoutOptions: IWaveLayoutOptions;
    protected canvasContext: CanvasRenderingContext2D;
    protected canvasElement: HTMLCanvasElement;
    protected waveData: number[];
    protected waveLayoutOptions: IWaveLayoutOptions;
    protected firstDrawing: boolean;
    protected latestRange: number;
    protected _plugins: [];
    protected events: Events;
    constructor(waveformOptions?: ICoreOptions);
    setCanvasContext(canvasContext: CanvasRenderingContext2D): void;
    setCanvasElement(canvasElement: HTMLCanvasElement): void;
    setWaveData(data: number[]): void;
    setLayoutOptions(layout: IWaveLayoutOptions): void;
    protected activateClickListener(): void;
    protected canvasElementClick(event: MouseEvent): void;
    protected getMousePosition(event: MouseEvent): number;
    draw(range?: number): void;
}
