import { Router, Response, Request } from 'express';
import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as path from 'path';
import * as cors from 'cors';
import * as compression from 'compression';


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

const publicRouter: Router = Router();

/*
 * Copyright (C) 2016 Marcin Chojnacki <marcinch7@gmail.com>
 *
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from
 * the use of this software.
 */

var request = require('request');

// TCP port on which server is listening
var PORT = 2137;

// Parking data refresh interval in minutes
var REFRESH_INTERVAL = 1;

// Static parking data
var PARKING_DATA = [
    {
        originalId: 1,
        shortName: 'SKS',
        longName: 'Strefa Kultury Studenckiej',
        pictureUrl: 'images/sks.png',
        totalPlaces: 272
    },
    {
        originalId: 4,
        shortName: 'WRO',
        longName: 'Parking Wrońskiego',
        pictureUrl: 'images/wro.png',
        totalPlaces: 147
    },
    {
        originalId: 2,
        shortName: 'C13',
        longName: 'Polinka',
        pictureUrl: 'images/c13.png',
        totalPlaces: 54
    }
];


/*
 * API fetching and converting module
 */

function convertTime(time) {
    var match = time.match(/([0-9]{2}:[0-9]{2})/);
    return match == null ? "00:00" : match[1];
}

function convertChart(chart) {
    var result = [];

    for (var i = 1; i < chart.x.length; i++) {
        var dataPoint = {
            time: convertTime(chart.x[i]),
            places: parseInt(chart.data[i])
        };

        result.push(dataPoint);
    }

    return result;
}

function fetchOriginalData(onSuccess, onError) {
    var options = {
        url: 'http://parking.pwr.edu.pl/modules/iparking/scripts/ipk_operations.php?o=get_parks',
        headers: {
            'User-Agent': 'Parkingosz/1.0',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'http://parking.pwr.edu.pl/'
        }
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body);
            onSuccess(parsedData);
        } else {
            onError();
        }
    });
}

function fetchData(onSuccess, onError) {
    fetchOriginalData(function(originalData) {
        var allParkings = [];

        for (var i = 0; i < PARKING_DATA.length; i++) {
            // find corresponding parking in original data
            var originalParking = null;
            for (var j = 0; j < originalData.places.length && originalParking == null; j++) {
                var currentId = parseInt(originalData.places[j].parking_id);
                if (currentId == PARKING_DATA[i].originalId) {
                    originalParking = originalData.places[j];
                }
            }

            // when parking has been found
            if (originalParking != null) {
                // total places workaround
                var freePlaces = parseInt(originalParking.liczba_miejsc);
                var totalPlaces = PARKING_DATA[i].totalPlaces;
                if (totalPlaces < freePlaces) {
                    totalPlaces = freePlaces;
                }

                var parkingPlace = {
                    shortName: PARKING_DATA[i].shortName,
                    longName: PARKING_DATA[i].longName,
                    pictureUrl: PARKING_DATA[i].pictureUrl,
                    freePlaces: freePlaces,
                    totalPlaces: totalPlaces,
                    measureTime: convertTime(originalParking.czas_pomiaru),
                    trend: parseInt(originalParking.trend),
                    parkingId: parseInt(originalParking.parking_id),
                    chart: convertChart(originalParking.chart)
                };

                allParkings.push(parkingPlace);
            }
        }

        var responseData = {
            success: true,
            parkings: allParkings
        };

        onSuccess(responseData);
    }, onError);
}


/*
 * Background refreshing module
 */

// default response
var jsonResponse = {
    success: false
};

function refreshCallback() {
    fetchData(function(data) {
        console.log('Downloaded new parking data');
        jsonResponse = data;
    }, function() {
        console.log('Failed to download parking data');
    });
}

function startRefreshing() {
    setInterval(refreshCallback, 1000 * 60 * REFRESH_INTERVAL);
    refreshCallback();
}


/*
 * RESTful API and web server module
 */


publicRouter.get('/', (req: Request, res: Response) => {
  var charts = req.query.charts == "true";
    var pretty = req.query.pretty == "true";

    console.log('GET /parkings { charts: ' + charts + ', pretty: ' + pretty + ' }');

    function chartReplacer(key, value) {
        if (key == 'chart') return undefined;
        return value;
    }
    req.app.set('json spaces', pretty ? 2 : null);
    req.app.set('json replacer', charts ? null : chartReplacer);

    console.log(req.app.get('json spaces'));
    console.log(req.app.get('json replacer'));

    res.json(jsonResponse);
});

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
