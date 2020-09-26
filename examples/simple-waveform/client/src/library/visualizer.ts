import {
    Waveform,
    IWaveLayoutOptions,
    ICoreOptions,
    IWaveformClickCallback,
//} from '../../../../../dist/index.js';
} from '../../node_modules/waveform-visualizer/dist/index.js';


export interface IVisualizerOptions {
    waveformData: number[]
    canvasElementId: string;
    waveformClickCallback: IWaveformClickCallback
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
            data: visualizerOptions.waveformData,
            waveformClickCallback: visualizerOptions.waveformClickCallback,
        };

        const waveform = new Waveform(waveformOptions);

        const canvasElement = document.getElementById(visualizerOptions.canvasElementId) as HTMLCanvasElement;

        waveform.setCanvasElement(canvasElement);

        this.waveform = waveform;

    }

    public draw(playingProgress: number): void {

        this.waveform.draw(playingProgress);

    }

}