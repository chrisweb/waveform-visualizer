// vendor
import express from 'express'
import { SendFileOptions } from 'express-serve-static-core'

// nodejs
import path from 'path'
import { fileURLToPath } from 'url'

interface IImportMeta extends ImportMeta {
    url: string
}

export class Server {

    private application: express.Application

    constructor() {

        // create a new express.js application
        this.application = express()

    }

    public run(): void {

        const META = import.meta as IImportMeta
        const DIRNAME = path.dirname(fileURLToPath(META.url))
        const ROOTPATH = path.join(DIRNAME, '../..')

        console.log('ROOTPATH', path.join(ROOTPATH, '..', '..', 'dist'))

        this.application.use('/client', express.static(path.join(ROOTPATH, 'client', 'build')))
        this.application.use('/dist', express.static(path.join(ROOTPATH, '..', '..', 'dist')))
        this.application.use('/node_modules/web-audio-api-player/dist', express.static(path.join(ROOTPATH, 'client', 'node_modules', 'web-audio-api-player', 'dist')))
        this.application.use('/node_modules/waveform-visualizer/dist', express.static(path.join(ROOTPATH, 'client', 'node_modules', 'waveform-visualizer', 'dist')))

        this.application.get('/', (request: express.Request, response: express.Response) => {

            // options list: http://expressjs.com/en/api.html#res.sendFile
            const mainPageSendfileOptions: SendFileOptions = {
                root: path.join(ROOTPATH, 'html'),
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                },
            }

            response.sendFile('main.html', mainPageSendfileOptions)

        })

        const port = process.env.PORT || 35000

        this.application.listen(port, () => console.log(`Server running, visit http://localhost:${port}`))

    }

}

const server = new Server()

server.run()
