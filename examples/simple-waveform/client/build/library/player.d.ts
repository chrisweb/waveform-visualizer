import { PlayerCore } from '../../node_modules/web-audio-api-player/dist/index.js';
export interface IListenersOptions {
    playPauseButtonElementId: string;
    stopButtonElementId: string;
    volumeSliderId: string;
}
export declare class Player {
    protected player: PlayerCore;
    protected playerAudioContext: AudioContext;
    protected isPlayOrPause: string;
    constructor();
    loadSong(songId: number): void;
    protected playPauseAction(): void;
    protected stopAction(): void;
    protected changeVolumeAction(volume: number): void;
    initializeClickListeners(listenersOptions: IListenersOptions): void;
    protected resumeAudioContext(): void;
}
