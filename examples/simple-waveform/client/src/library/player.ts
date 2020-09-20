import { PlayerCore, ICoreOptions, ISoundAttributes, ISound } from '../../node_modules/web-audio-api-player/dist/index.js';

export interface IListenersOptions {
    playPauseButtonElementId: string;
    stopButtonElementId: string;
    volumeSliderId: string;
}

export type onPlaylingCallbackType = (playingProgress: number, maximumValue: number, currentValue: number) => void;
export type onStoppedCallbackType = (playTimeOffset: number) => void;

export class Player {

    protected player: PlayerCore;
    protected playerAudioContext: AudioContext;
    protected isPlayOrPause: string;

    constructor() {

        const playerOptions: ICoreOptions = {
            soundsBaseUrl: 'https://mp3l.jamendo.com/?trackid=',
            playingProgressIntervalTime: 500,
            loadPlayerMode: PlayerCore.PLAYER_MODE_AUDIO
        };

        const player = new PlayerCore(playerOptions);

        this.player = player;

        player.getAudioContext().then((audioContext: AudioContext) => {
            this.playerAudioContext = audioContext;
        }).catch((error) => {
            console.log(error);
        });

        this.isPlayOrPause = 'pause';

    }
    
    public loadSong(songId: number): ISound {

        const songAttributes: ISoundAttributes = {
            source: [{ url: songId + '&format=mp31', codec: 'mp3' }, { url: songId + '&format=ogg1', codec: 'ogg', isPreferred: true }],
            id: songId,
            onLoading: (loadingProgress, maximumValue, currentValue) => {
                //console.log('loading: ', loadingProgress, maximumValue, currentValue);
            },
            onPlaying: (playingProgress, maximumValue, currentValue) => {
                //console.log('playing: ', playingProgress, maximumValue, currentValue);
                //console.log('firstSound.duration: ', song.duration);
            },
            onStarted: (playTimeOffset) => {
                //console.log('started', playTimeOffset);
            },
            onPaused: (playTimeOffset) => {
                //console.log('paused', playTimeOffset);
            },
            onStopped: (playTimeOffset) => {
                //console.log('stopped', playTimeOffset);
            },
            onResumed: (playTimeOffset) => {
                //console.log('resumed', playTimeOffset);
            },
            onEnded: (willPlayNext) => {
                //console.log('ended', willPlayNext);
                if (!willPlayNext) {
                    this._stopAction();
                }
            }
        };

        const song = this.player.addSoundToQueue({ soundAttributes: songAttributes });

        //console.log(song);

        return song;

    }

    public goToPosition(positionInPercent: number): void {

        this.player.setPosition(positionInPercent);

    } 

    protected _playPauseAction(): void {

        if (this.isPlayOrPause === 'play') {
            this.player.pause();
            this.isPlayOrPause = 'pause';
            this._buttonDomPause();
        } else {
            this.player.play();
            this.isPlayOrPause = 'play';
            this._buttonDomPlay();
        }

    }

    protected _buttonDomPause(): void {
        document.getElementById('js-pause').classList.add('hidden');
        document.getElementById('js-play').classList.remove('hidden');
    }

    protected _buttonDomPlay(): void {
        document.getElementById('js-pause').classList.remove('hidden');
        document.getElementById('js-play').classList.add('hidden');
    }

    protected _stopAction(): void {
        this.player.stop();
        this.isPlayOrPause = 'pause';
        this._buttonDomPause();
    }

    protected _changeVolumeAction(volume: number): void {
        this.player.setVolume(volume);
    }

    public initializeClickListeners(listenersOptions: IListenersOptions): void {

        const playPauseButtonElement = document.getElementById(listenersOptions.playPauseButtonElementId);
        const stopButtonElement = document.getElementById(listenersOptions.stopButtonElementId);
        const volumdSlideElement = document.getElementById(listenersOptions.volumeSliderId);

        playPauseButtonElement.addEventListener('click', () => {
            this._playPauseAction();
        });

        playPauseButtonElement.addEventListener('touch', () => {
            this._playPauseAction();
        });

        stopButtonElement.addEventListener('click', () => {
            this._stopAction();
        });

        stopButtonElement.addEventListener('touch', () => {
            this._stopAction();
        });

        volumdSlideElement.addEventListener('change', (event) => {
            const targetElement = event.target as HTMLInputElement;
            const volume = parseInt(targetElement.value);
            this._changeVolumeAction(volume);
        });

    }

}
