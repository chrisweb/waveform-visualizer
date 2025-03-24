export class Canvas {

    public getContext(element: HTMLCanvasElement): CanvasRenderingContext2D {

        if (element === null) {
            throw new Error('No element to get context from')
        }

        const canvasContext = element.getContext('2d')
        
        if (canvasContext === null) {
            throw new Error('No context found')
        }

        return canvasContext

    }

}