import { PlayerCore } from '../../node_modules/web-audio-api-player/dist/index.js';
export class Player {
    constructor() {
        const playerOptions = {
            soundsBaseUrl: 'https://mp3l.jamendo.com/?trackid=',
            playingProgressIntervalTime: 500,
            loadSoundMode: PlayerCore.SOUND_MODE_AUDIO
        };
        const player = new PlayerCore(playerOptions);
        this.player = player;
        player.getAudioContext().then((audioContext) => {
            this.playerAudioContext = audioContext;
        }).catch((error) => {
            console.log(error);
        });
        this.isPlayOrPause = 'pause';
    }
    loadSong(songId) {
        const songAttributes = {
            source: [{ url: songId + '&format=mp31', codec: 'mp3' }, { url: songId + '&format=ogg1', codec: 'ogg', isPreferred: true }],
            id: songId,
            onLoading: (loadingProgress, maximumValue, currentValue) => {
                console.log('loading: ', loadingProgress, maximumValue, currentValue);
            },
            onPlaying: (playingProgress, maximumValue, currentValue) => {
                console.log('playing: ', playingProgress, maximumValue, currentValue);
                console.log('firstSound.duration: ', song.duration);
            },
            onStarted: (playTimeOffset) => {
                console.log('started', playTimeOffset);
            },
            onPaused: (playTimeOffset) => {
                console.log('paused', playTimeOffset);
            },
            onStopped: (playTimeOffset) => {
                console.log('stopped', playTimeOffset);
            },
            onResumed: (playTimeOffset) => {
                console.log('resumed', playTimeOffset);
            },
            onEnded: (willPlayNext) => {
                console.log('ended', willPlayNext);
                if (!willPlayNext) {
                    this.stopAction();
                }
            }
        };
        const song = this.player.addSoundToQueue({ soundAttributes: songAttributes });
    }
    playPauseAction() {
        if (this.isPlayOrPause === 'play') {
            this.player.pause();
            this.isPlayOrPause = 'pause';
            document.getElementById('js-pause').classList.add('hidden');
            document.getElementById('js-play').classList.remove('hidden');
        }
        else {
            this.player.play();
            this.isPlayOrPause = 'play';
            document.getElementById('js-pause').classList.remove('hidden');
            document.getElementById('js-play').classList.add('hidden');
        }
    }
    stopAction() {
        this.player.stop();
        this.isPlayOrPause = 'pause';
    }
    changeVolumeAction(volume) {
        this.player.setVolume(volume);
    }
    initializeClickListeners(listenersOptions) {
        const playPauseButtonElement = document.getElementById(listenersOptions.playPauseButtonElementId);
        const stopButtonElement = document.getElementById(listenersOptions.stopButtonElementId);
        const volumdSlideElement = document.getElementById(listenersOptions.volumeSliderId);
        playPauseButtonElement.addEventListener('click', () => {
            this.playPauseAction();
        });
        playPauseButtonElement.addEventListener('touch', () => {
            this.playPauseAction();
        });
        stopButtonElement.addEventListener('click', () => {
            this.stopAction();
        });
        stopButtonElement.addEventListener('touch', () => {
            this.stopAction();
        });
        volumdSlideElement.addEventListener('change', (event) => {
            const targetElement = event.target;
            const volume = parseInt(targetElement.value);
            this.changeVolumeAction(volume);
        });
    }
    resumeAudioContext() {
        if (this.playerAudioContext.state !== 'running') {
            this.playerAudioContext.resume().then(() => {
                console.log('audiocontext got resumed');
            }).catch(() => {
                console.log('resuming audiocontext failed');
            });
        }
    }
}
//# sourceMappingURL=player.js.map