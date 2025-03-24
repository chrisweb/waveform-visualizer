// vendor
import express from 'express';
// nodejs
import path from 'path';
import { fileURLToPath } from 'url';
export class Server {
    application;
    constructor() {
        // create a new express.js application
        this.application = express();
    }
    run() {
        const META = import.meta;
        const DIRNAME = path.dirname(fileURLToPath(META.url));
        const ROOTPATH = path.join(DIRNAME, '../..');
        console.log('ROOTPATH', path.join(ROOTPATH, '..', '..', 'dist'));
        this.application.use('/client', express.static(path.join(ROOTPATH, 'client', 'build')));
        this.application.use('/dist', express.static(path.join(ROOTPATH, '..', '..', 'dist')));
        this.application.use('/node_modules/web-audio-api-player/dist', express.static(path.join(ROOTPATH, 'client', 'node_modules', 'web-audio-api-player', 'dist')));
        this.application.use('/node_modules/waveform-visualizer/dist', express.static(path.join(ROOTPATH, 'client', 'node_modules', 'waveform-visualizer', 'dist')));
        this.application.get('/', (request, response) => {
            // options list: http://expressjs.com/en/api.html#res.sendFile
            const mainPageSendfileOptions = {
                root: path.join(ROOTPATH, 'html'),
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                },
            };
            response.sendFile('main.html', mainPageSendfileOptions);
        });
        const port = process.env.PORT || 35000;
        this.application.listen(port, () => console.log(`Server running, visit http://localhost:${port}`));
    }
}
const server = new Server();
server.run();
//# sourceMappingURL=server.js.map