// es6 import http://2ality.com/2014/09/es6-modules-final.html

// vendor
import express from 'express';

// nodejs
import path from 'path';

// hack because __dirname is not defined
// https://github.com/nodejs/node/issues/16844
// fileURLToPath got added in nodejs v10.12.0
import { fileURLToPath } from 'url';

//declare global  {
    interface IImportMeta extends ImportMeta {
        url: string;
    }
//}

export class Server {

    private application: express.Application;

    constructor() {

        // create a new expressjs application
        this.application = express();

    }

    public run() {

        const META = import.meta as IImportMeta;
        const DIRNAME = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(META.url));
        const ROOTPATH = path.join(DIRNAME, '..', '..');

        this.application.use('/client', express.static(ROOTPATH + '/../client/build'));

        this.application.get('/', (request: express.Request, response: express.Response) => {

            // options list: http://expressjs.com/en/api.html#res.sendFile
            let mainPageSendfileOptions = {
                root: path.join(ROOTPATH, '..', 'html'),
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };

            response.sendFile('main.html', mainPageSendfileOptions);

        });

        let port = process.env.PORT || 35000;

        this.application.listen(port, () => console.log(`Example app listening on port ${port}!`));

    }

}
