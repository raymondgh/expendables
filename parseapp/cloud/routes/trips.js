var request = require('request')
  , csv = require('express-csv')
  , _ = require('underscore')
  , moment = require('moment-timezone')
  , async = require('async');

exports.trips = function(req, res) {
  request.get({
    uri: 'https://api.automatic.com/v1/trips',
    qs: { page: req.query.page },
    headers: {Authorization: 'token ' + req.session.access_token}
  }, function(e, r, body) {
    try {
      res.json(JSON.parse(body));
    } catch(e) {
      console.log("error: " + e);
      res.json(400, {"message": "Invalid access_token"});
    }
  });
}


exports.downloadTripsJSON = function(req, res) {
  try {
    downloadAllTrips(req, function(e, trips) {
      if(req.query.trip_ids) {
        var trip_ids = req.query.trip_ids.split(',');
        var trips = filterTrips(trips, trip_ids);
      }
      res.json(trips);
    });
  } catch(e) {
    res.json(500, undefined);
  }
}


exports.downloadTripsCSV = function(req, res) {
  try {
    downloadAllTrips(req, function(e, trips) {
      if(req.query.trip_ids) {
        var trip_ids = req.query.trip_ids.split(',');
        var trips = filterTrips(trips, trip_ids);
      }
      var tripsAsArray = trips.map(tripToArray);
      tripsAsArray.unshift(fieldNames());

      res.setHeader('Content-disposition', 'attachment; filename=trips.csv');
      res.csv(tripsAsArray);
    });
  } catch(e) {
    res.json(500, undefined);
  }
}


function downloadAllTrips(req, cb) {
  var finished = false
    , uri = 'https://api.automatic.com/v1/trips'
    , trips = [];
  async.until(function(){ return finished }, function(cb) {
    request.get({
      uri: uri,
      headers: {Authorization: 'token ' + req.session.access_token}
    }, function(e, r, body) {
      trips = trips.concat(JSON.parse(body));
      link_headers = parse_link_header(r.headers['link']);
      if(link_headers['next']) {
        uri = link_headers['next'];
      } else {
        finished = true;
      }
      cb();
    });
  }, function(e) {
    cb(e, trips);
  });
}


function filterTrips(trips, trip_ids) {
  return _.filter(trips, function(trip) {
    return trip_ids.indexOf(trip.id) != -1;
  });
}


function fieldNames() {
  return [
    'Vehicle',
    'Start Location Name',
    'Start Location Lat',
    'Start Location Lon',
    'Start Location Accuracy (meters)',
    'Start Time',
    'End Location Name',
    'End Location Lat',
    'End Location Lon',
    'End Location Accuracy (meters)',
    'End Time',
    'Path',
    'Distance (mi)',
    'Hard Accelerations',
    'Hard Brakes',
    'Duration Over 80 mph (secs)',
    'Duration Over 75 mph (secs)',
    'Duration Over 70 mph (secs)',
    'Fuel Cost (USD)',
    'Fuel Volume (gal)',
    'Average MPG'
  ]
}


function tripToArray(t) {
  return [
    formatVehicle(t.vehicle),
    t.start_location.name,
    t.start_location.lat,
    t.start_location.lon,
    t.start_location.accuracy_m,
    formatTime(t.start_time, t.start_time_zone),
    t.end_location.name,
    t.end_location.lat,
    t.end_location.lon,
    t.end_location.accuracy_m,
    formatTime(t.end_time, t.end_time_zone),
    t.path,
    formatDistance(t.distance_m),
    t.hard_accels,
    t.hard_brakes,
    t.duration_over_80_s,
    t.duration_over_75_s,
    t.duration_over_70_s,
    formatFuelCost(t.fuel_cost_usd),
    t.fuel_volume_gal,
    t.average_mpg
  ]
}


function formatTime(time, timezone) {
  try {
    return moment(time).tz(timezone).format('YYYY-MM-DD h:mm A');
  } catch(e) {
    return moment(time).format('YYYY-MM-DD h:mm A');
  }
}


function formatVehicle(v) {
  return [(v.year || ''), (v.make || ''), (v.model || '')].join(' ');
}


function formatDistance(distance) {
  //convert from m to mi
  return (distance / 1609.34).toFixed(2);
}


function formatFuelCost(fuelCost) {
  return '$' + fuelCost.toFixed(2);
}


/* From https://gist.github.com/niallo/3109252 */
function parse_link_header(header) {
  var links = {};
  if (header) {
    var parts = header.split(',');
    parts.forEach(function(p) {
      var section = p.split(';');
      if (section.length != 2) {
        throw new Error("section could not be split on ';'");
      }
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });
  }
  return links;
}
