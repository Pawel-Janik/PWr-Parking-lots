import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as compression from 'compression';

import { json, urlencoded } from 'body-parser';

import { publicRouter } from './controllers/parkings';
import { startRefreshing } from './models/orginal-api'
import { REFRESH_INTERVAL } from "./config";


const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// allow cors only for local dev
app.use(cors({
  origin: 'http://localhost:4200'
}));

// app.set('env', 'production');

var PORT = 2137;

app.listen(PORT, function() {
    console.log('Running on port ' + PORT + ' refreshing every ' + REFRESH_INTERVAL + ' minutes');
    startRefreshing();
});

// api routes
app.use('/api/public', publicRouter);


if (app.get('env') === 'production') {
  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, '/../client')));
}

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
  let err = new Error('Not Found');
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export { app }
