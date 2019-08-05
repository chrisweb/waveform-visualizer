import { PlayerCore } from '../../node_modules/web-audio-api-player/dist/index.js';
export class Player {
    constructor() {
        let playerOptions = {};
        let playerCore = new PlayerCore();
        playerCore.getAudioContext().then((audioContext) => {
            this.playerAudioContext = audioContext;
        }).catch((error) => {
            console.log(error);
        });
        let playButtonElement = document.getElementById('player-button-play');
        let pauseButtonElement = document.getElementById('player-button-play');
        document.addEventListener('click', this.resumeAudioContext);
        document.addEventListener('touch', this.resumeAudioContext);
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