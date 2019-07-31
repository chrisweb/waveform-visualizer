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

export class Events {

    protected events: IEvents;
    static constants: IConstants;

    // events constants
    constants: IConstants = {
        // player events
        positionEvent: 'player:position',
        progressEvent: 'player:progress',
        playEvent: 'player:play',
        pauseEvent: 'player:pause',
        stopEvent: 'player:stop',
        volumeEvent: 'player:volume',
        pannerEvent: 'player:panner',
        playbackRateEvent: 'player:playbackRate',
        bufferingEvent: 'player:bufferingEvent',
        // waveform events
        clickEvent: 'waveform:clickEvent'
    };

    constructor() {

    }

    public trigger(name: string, ...triggerArguments: any[]): this {

        let triggerArgumentsArray = Array.prototype.slice.call(triggerArguments, 1);

        if (name in this.events) {

            let eventsList = this.events[name];

            let eventsListLength = eventsList.length;
            let i;

            for (i = 0; i < eventsListLength; i++) {

                let callback = eventsList[i].callback;
                let context = eventsList[i].context;

                callback.apply(context, triggerArgumentsArray);

            }

        }

        return this;

    }

    public on(name: string, callback: ICallback, context: string) {

        let eventsContainer;

        if (!(name in this.events)) {
            this.events[name] = [];
        }

        eventsContainer = this.events[name];

        if (context === undefined) {
            context = null;
        }

        eventsContainer.push({
            callback: callback,
            context: context
        });

        return this;

    }

    public off(name: string): this {

        if (name in this.events) {
            //this.events[name] = [];
            delete this.events[name];
        }

        return this;

    }

    public once(name: string, callback: ICallback, context: string) {

        let onceCallback = function() {

            this.off(name);

            callback.apply(name, arguments);

        };

        return this.on(name, onceCallback, context);

    }

}
