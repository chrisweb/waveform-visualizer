import { Waveform } from '../../../../../dist/index.js';
export interface IVisualizerOptions {
    waveformData: number[];
    canvasElementId: string;
}
export declare class Visualizer {
    protected waveform: Waveform;
    constructor(visualizerOptions: IVisualizerOptions);
    draw(): void;
}
