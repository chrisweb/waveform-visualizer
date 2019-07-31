export class Canvas {

    public getContext(element: HTMLCanvasElement): CanvasRenderingContext2D {

        let canvasContext = element.getContext('2d');

        return canvasContext;

    }

}
