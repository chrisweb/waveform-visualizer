import { PlayerExample, onPlaylingCallbackType, onStoppedCallbackType } from './library/player.js'
import { VisualizerExample } from './library/visualizer.js'

const player = new PlayerExample()

const listenerOptions = {
    playPauseButtonElementId: 'js-play-pause-button',
    stopButtonElementId: 'js-stop-button',
    volumeSliderId: 'js-player-volume',
}

const onPlaylingCallback: onPlaylingCallbackType = (playingProgress, maximumValue, currentValue) => {

    console.log('onPlaylingCallback,  playingProgress, maximumValue, currentValue: ', playingProgress, maximumValue, currentValue)

    visualizer.draw(playingProgress)

}

const onStoppedCallback: onStoppedCallbackType = (playTimeOffset) => {

    console.log('onStoppedCallback, playTimeOffset: ', playTimeOffset)

    visualizer.draw(0)

}

const songId = 1100511

const song = player.loadSong(songId)

song.onPlaying = onPlaylingCallback
song.onStopped = onStoppedCallback

player.initializeClickListeners(listenerOptions)

const waveformClickCallback = (clickHorizontalPositionInPercent: number): void => {

    console.log('waveformClickCallback: ', clickHorizontalPositionInPercent)

    player.goToPosition(clickHorizontalPositionInPercent)

}

// visualizer initialisation
const visualizerOptions = {
    // data generated using: https://github.com/chrisweb/waveform-data-generator
    waveformData: [7,18,25,16,4,10,7,42,90,38,60,72,69,86,98,70,83,67,81,92,78,85,68,76,85,81,71,19,72,91,88,87,90,84,90,92,88,85,84,90,96,83,92,81,89,96,89,96,82,78,84,85,85,76,77,83,83,83,80,77,84,83,83,80,70,84,89,79,89,78,89,98,85,89,80,91,89,91,91,84,82,90,89,89,87,81,92,89,93,92,71,62,56,55,52,53,61,53,60,53,52,48,58,61,53,56,49,60,60,57,51,89,92,96,89,92,77,94,100,87,82,84,90,100,89,93,85,90,95,90,78,52,74,84,83,85,80,78,85,84,83,79,72,86,87,79,79,71,83,96,81,90,74,82,87,82,86,73,78,83,81,85,80,76,85,83,85,79,71,84,88,84,85,69,84,98,72,82,67,80,90,78,85,73,76,84,82,88,78,73,83,84,89,87,49,9,1,0,0,0],
    canvasElementId: 'waveformCanvas',
    waveformClickCallback: waveformClickCallback,
}

const visualizer = new VisualizerExample(visualizerOptions)

visualizer.draw(0)