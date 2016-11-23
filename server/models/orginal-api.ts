/*
 * Copyright (C) 2016 Marcin Chojnacki <marcinch7@gmail.com>
 */

// Static parking data
import {REFRESH_INTERVAL} from "../config";

var request = require('request');

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

                var parkingName = "";
                switch (parseInt(originalParking.parking_id)){
                    case 1:
                        parkingName = "sks.jpg";
                        break;
                    case 2:
                        parkingName = "polinka.jpg";
                        break;
                    case 4:
                        parkingName = "wronski.jpg";
                        break;
                    default:
                        parkingName = "test.jpg";
                        break;
                }

                var parkingPlace = {
                    shortName: PARKING_DATA[i].shortName,
                    longName: PARKING_DATA[i].longName,
                    pictureUrl: parkingName,
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

export { jsonResponse, startRefreshing }