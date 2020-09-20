import { PlayerCore, ISound } from '../../node_modules/web-audio-api-player/dist/index.js';
export interface IListenersOptions {
    playPauseButtonElementId: string;
    stopButtonElementId: string;
    volumeSliderId: string;
}
export declare type onPlaylingCallbackType = (playingProgress: number, maximumValue: number, currentValue: number) => void;
export declare type onStoppedCallbackType = (playTimeOffset: number) => void;
export declare class Player {
    protected player: PlayerCore;
    protected playerAudioContext: AudioContext;
    protected isPlayOrPause: string;
    constructor();
    loadSong(songId: number): ISound;
    goToPosition(positionInPercent: number): void;
    protected _playPauseAction(): void;
    protected _buttonDomPause(): void;
    protected _buttonDomPlay(): void;
    protected _stopAction(): void;
    protected _changeVolumeAction(volume: number): void;
    initializeClickListeners(listenersOptions: IListenersOptions): void;
}
