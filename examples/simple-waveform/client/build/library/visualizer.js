import { Waveform } from '../../../../../dist/index.js';
export class Visualizer {
    constructor(visualizerOptions) {
        const customLayoutOptions = {
            waveBackgroundColorHex: 'fff',
            peakTopColorHex: 'ff00e3',
            peakBottomColorHex: 'c900ff',
        };
        const waveLayoutOptions = Object.assign(Waveform.layoutOptions, customLayoutOptions);
        const waveformOptions = {
            layout: waveLayoutOptions,
            // tslint:disable-next-line
            data: visualizerOptions.waveformData
        };
        const waveform = new Waveform(waveformOptions);
        const canvasElement = document.getElementById(visualizerOptions.canvasElementId);
        waveform.setCanvasElement(canvasElement);
        this.waveform = waveform;
    }
    draw() {
        this.waveform.draw();
    }
}
//# sourceMappingURL=Visualizer.js.map