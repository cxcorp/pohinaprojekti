import * as path from 'path';
import * as express from 'express';
import { CachingProcessWatcher, Process } from '../util/processWatcher';
import createLogger from '../logger';
const logger = createLogger(__filename);
const swaggerSpec = require('../../data/swagger.json');

export default function createRouter(processWatcher: CachingProcessWatcher) {
    const router = express.Router();

    router.get('/swagger.json', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.json(swaggerSpec);
    });

    router.get('/processes', (req, res) => {
        processWatcher.fetch().then(procs => {
            res.json({
                result: procs
            });
        }).catch(err => {
            logger.error('An error occurred while fetching the process list', err);
            res.status(500).json({
                result: [],
                err: 'An error occurred while fetching the process list.'
            });
        });
    });

    router.use(((err, req, res, next) => {
        logger.error('Uncaught error caught!', err);
        res.json({
            err: 'An error has occurred.'
        });
    }) as express.ErrorRequestHandler);

    return router;
}