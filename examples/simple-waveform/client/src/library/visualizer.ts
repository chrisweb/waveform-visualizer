import {
    Waveform,
    IWaveLayoutOptions,
    ICoreOptions
} from '../../../../../dist/index.js';

export interface IVisualizerOptions {
    waveformData: number[]
    canvasElementId: string;
}

export class Visualizer {

    protected waveform: Waveform;

    constructor(visualizerOptions: IVisualizerOptions) {

        const customLayoutOptions: IWaveLayoutOptions = {
            waveBackgroundColorHex: 'fff',
            peakTopColorHex: 'ff00e3',
            peakBottomColorHex: 'c900ff',
        };

        const waveLayoutOptions = Object.assign(Waveform.layoutOptions, customLayoutOptions);

        const waveformOptions: ICoreOptions = {
            layout: waveLayoutOptions,
            // tslint:disable-next-line
            data: visualizerOptions.waveformData
        };

        const waveform = new Waveform(waveformOptions);

        const canvasElement = document.getElementById(visualizerOptions.canvasElementId) as HTMLCanvasElement;

        waveform.setCanvasElement(canvasElement);

        this.waveform = waveform;

    }

    public draw(): void {

        this.waveform.draw();

    } 

}