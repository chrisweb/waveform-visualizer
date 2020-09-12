import { PlayerCore, ISoundAttributes, ICoreOptions } from '../../node_modules/web-audio-api-player/dist/index.js';

export class Player {

    protected playerAudioContext: AudioContext;

    constructor() {

        let playerOptions: ICoreOptions = {

        };

        let playerCore = new PlayerCore();

        playerCore.getAudioContext().then((audioContext: AudioContext) => {
            this.playerAudioContext = audioContext;
        }).catch((error) => {
            console.log(error);
        });

        let playButtonElement = document.getElementById('js-play-pause-button');
        let stopButtonElement = document.getElementById('js-stop-button');

        document.addEventListener('click', this.resumeAudioContext);
        document.addEventListener('touch', this.resumeAudioContext);

    }

    protected resumeAudioContext() {

        if (this.playerAudioContext.state !== 'running') {

            this.playerAudioContext.resume().then(() => {
                console.log('audiocontext got resumed');
            }).catch(() => {
                console.log('resuming audiocontext failed');
            });

        }
    }
}
