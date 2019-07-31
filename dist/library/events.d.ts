export interface ICallback {
    (context: string, ...triggerArguments: any[]): any;
}
export interface IEvent {
    callback: ICallback;
    context: string;
}
export interface IEvents {
    [key: string]: IEvent[];
}
export interface IConstants {
    readonly positionEvent: string;
    readonly progressEvent: string;
    readonly playEvent: string;
    readonly pauseEvent: string;
    readonly stopEvent: string;
    readonly volumeEvent: string;
    readonly pannerEvent: string;
    readonly playbackRateEvent: string;
    readonly bufferingEvent: string;
    readonly clickEvent: string;
}
export declare class Events {
    protected events: IEvents;
    static constants: IConstants;
    constants: IConstants;
    constructor();
    trigger(name: string, ...triggerArguments: any[]): this;
    on(name: string, callback: ICallback, context: string): this;
    off(name: string): this;
    once(name: string, callback: ICallback, context: string): this;
}
