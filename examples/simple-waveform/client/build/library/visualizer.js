import { Waveform, } from '../../../../../dist/index.js';
export class VisualizerExample {
    waveform;
    constructor(visualizerOptions) {
        const waveLayoutOptions = {
            waveTopPercentage: 50,
        };
        const waveCoreOptions = {
            layout: waveLayoutOptions,
            // tslint:disable-next-line
            data: visualizerOptions.waveformData,
            waveformClickCallback: visualizerOptions.waveformClickCallback,
        };
        const waveform = new Waveform(waveCoreOptions);
        this.waveform = waveform;
        const canvasElement = document.getElementById(visualizerOptions.canvasElementId);
        waveform.setCanvasElement(canvasElement);
        const waveCanvasContext = waveform.getCanvasContext();
        const linearGradiantTopPeaks = waveCanvasContext.createLinearGradient(0, 0, 0, 50);
        linearGradiantTopPeaks.addColorStop(0, 'yellow');
        linearGradiantTopPeaks.addColorStop(1, 'red');
        const linearGradiantBottomPeaks = waveCanvasContext.createLinearGradient(0, 50, 0, 100);
        linearGradiantBottomPeaks.addColorStop(0, 'orange');
        linearGradiantBottomPeaks.addColorStop(1, 'yellow');
        const solidColorTopProgressFillStyle = 'red';
        const solidColorBottomProgressFillStyle = 'orange';
        waveform.setLayoutOptions({
            peakTopFillStyle: linearGradiantTopPeaks,
            peakBottomFillStyle: linearGradiantBottomPeaks,
            peakTopProgressFillStyle: solidColorTopProgressFillStyle,
            peakBottomProgressFillStyle: solidColorBottomProgressFillStyle,
        });
    }
    draw(playingProgress) {
        this.waveform.draw(playingProgress);
    }
}
//# sourceMappingURL=visualizer.js.map