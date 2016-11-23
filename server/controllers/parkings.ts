/*
 * Copyright (C) 2016 Marcin Chojnacki <marcinch7@gmail.com>
 */

import { Router, Response, Request } from 'express';
import { jsonResponse } from '../models/orginal-api'

const publicRouter: Router = Router();

publicRouter.get('/', (request: Request, response: Response) => {
    var charts = request.query.charts == "true";
    var pretty = request.query.pretty == "true";

    console.log('GET /parkings { charts: ' + charts + ', pretty: ' + pretty + ' }');

    function chartReplacer(key, value) {
        if (key == 'chart') return undefined;
        return value;
    }
    request.app.set('json spaces', pretty ? 2 : null);
    request.app.set('json replacer', charts ? null : chartReplacer);

    response.json(jsonResponse);
});

export { publicRouter }
