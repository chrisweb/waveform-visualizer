export class Canvas {

    constructor() {

    }

    public getContext(element: HTMLCanvasElement): CanvasRenderingContext2D {

        if (element === null) {
            throw new Error('No element to get context from');
        }

        let canvasContext = element.getContext('2d');

        return canvasContext;

    }

}
