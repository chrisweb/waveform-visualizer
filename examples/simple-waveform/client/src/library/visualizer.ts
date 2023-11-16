import {
    Waveform,
    IWaveLayoutOptions,
    IWaveCoreOptions,
    IWaveClickCallback,
} from '../../../../../dist/index.js'

export interface IVisualizerOptions {
    waveformData: number[]
    canvasElementId: string
    waveformClickCallback: IWaveClickCallback
}

export class VisualizerExample {

    protected waveform: Waveform

    constructor(visualizerOptions: IVisualizerOptions) {

        const waveLayoutOptions: IWaveLayoutOptions = {
            waveTopPercentage: 50,
        }

        const waveCoreOptions: IWaveCoreOptions = {
            layout: waveLayoutOptions,
            // tslint:disable-next-line
            data: visualizerOptions.waveformData,
            waveformClickCallback: visualizerOptions.waveformClickCallback,
        }

        const waveform = new Waveform(waveCoreOptions)

        this.waveform = waveform

        const canvasElement = document.getElementById(visualizerOptions.canvasElementId) as HTMLCanvasElement

        waveform.setCanvasElement(canvasElement)

        const waveCanvasContext = waveform.getCanvasElement().getContext('2d')

        const linearGradiantTopPeaks = waveCanvasContext.createLinearGradient(0,0,0,50)

        linearGradiantTopPeaks.addColorStop(0, 'yellow')
        linearGradiantTopPeaks.addColorStop(1, 'red')

        const linearGradiantBottomPeaks = waveCanvasContext.createLinearGradient(0,50,0,100)

        linearGradiantBottomPeaks.addColorStop(0, 'orange')
        linearGradiantBottomPeaks.addColorStop(1, 'yellow')

        const solidColorTopProgressFillStyle = 'red'
        const solidColorBottomProgressFillStyle = 'orange'

        waveform.setLayoutOptions({
            peakTopFillStyle: linearGradiantTopPeaks,
            peakBottomFillStyle: linearGradiantBottomPeaks,
            peakTopProgressFillStyle: solidColorTopProgressFillStyle,
            peakBottomProgressFillStyle: solidColorBottomProgressFillStyle,
        })

    }

    public draw(playingProgress: number): void {

        this.waveform.draw(playingProgress)

    }

}