// es6 import http://2ality.com/2014/09/es6-modules-final.html
// vendor
import express from 'express';
// nodejs
import path from 'path';
// hack because __dirname is not defined
// https://github.com/nodejs/node/issues/16844
// fileURLToPath got added in nodejs v10.12.0
import { fileURLToPath } from 'url';
//}
export class Server {
    constructor() {
        // create a new expressjs application
        this.application = express();
    }
    run() {
        const META = (import.meta);
        const DIRNAME = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(META.url));
        const ROOTPATH = path.join(DIRNAME, '..', '..');
        console.log('ROOTPATH: ', ROOTPATH);
        this.application.use('/client', express.static(ROOTPATH + '/../client/build'));
        this.application.use('/dist', express.static(ROOTPATH + '/../../../dist'));
        this.application.use('/node_modules/web-audio-api-player/dist', express.static(ROOTPATH + '/../client/node_modules/web-audio-api-player/dist'));
        this.application.get('/', (request, response) => {
            // options list: http://expressjs.com/en/api.html#res.sendFile
            const mainPageSendfileOptions = {
                root: path.join(ROOTPATH, '..', 'html'),
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            response.sendFile('main.html', mainPageSendfileOptions);
        });
        const port = process.env.PORT || 35000;
        this.application.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }
}
//# sourceMappingURL=server.js.map