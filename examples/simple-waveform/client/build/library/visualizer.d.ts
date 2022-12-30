import { Waveform, IWaveformClickCallback } from '../../../../../dist/index.js';
export interface IVisualizerOptions {
    waveformData: number[];
    canvasElementId: string;
    waveformClickCallback: IWaveformClickCallback;
}
export declare class VisualizerExample {
    protected waveform: Waveform;
    constructor(visualizerOptions: IVisualizerOptions);
    draw(playingProgress: number): void;
}
