'use strict';

const API_KEY = 'AIzaSyDP6X1_N95A5pEKOyNgzWNtRK04sL12oek';
const NODE5_LOCATION = {
  lat: 50.0663614,
  lng: 14.4005557
};
const MUZEUM_METRO_STATION_LOCATION = {
  lat: 50.0814746,
  lng: 14.4302696
};

var _init = function() {
  var cssPath = chrome.extension.getURL('/styles/panel.css');
  $('head').append('<link rel="stylesheet" href="' + cssPath + '" type="text/css" />');
  var fontPath = chrome.extension.getURL('bower_components/font-awesome/css/font-awesome.min.css');
  $('head').append('<link rel="stylesheet" href="' + fontPath + '" type="text/css" />');
};

var _loadPlaces = function(type, location, radiusMeters) {
  return $.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.lat + ',' + location.lng +
    '&radius=' + radiusMeters + '&type='+ type +'&key=' + API_KEY);
};

var _loadLiftago = function(locationFrom, locationTo) {
  return $.get('http://54.93.66.14:8000/api?t=1468582200&pickup='+ locationFrom.lat + ',' + locationFrom.lng +
  '&dest=' + locationTo.lat + ',' + locationTo.lng);
};

var _loadTransitAvailibility = function(address) {
  const DESTINATIONS = 'Muzeum,Praha|Radlická 180/50, Praha'; // Node5 = Radlická 180/50, Praha
  const MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';

  var distanceMatrixApiUrl = MAPS_API_BASE_URL + '?origins=' + encodeURI(address) + '&destinations=' + encodeURI(DESTINATIONS) + '&mode=transit&language=cs&key=' + API_KEY;
  return $.get(distanceMatrixApiUrl);
};

function _formatPrice(price) {
  return Math.round(price) + ' Kč';
}

var _loadParkingZones = function(location) {
  return $.get('http://10.2.22.117:8080/rest/zones-count?lat=' + location.lat + '&lon=' + location.lng + '&dist=500');
};

var _loadPanel = function(address) {
  $.get(chrome.extension.getURL('/panel.html'), function(html) {

      $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address) + '&key=' + API_KEY, function(response) {
          var location = response.results[0].geometry.location;
          var liftagoP = _loadLiftago(location, NODE5_LOCATION);
          var liftagoFromMuzeumToP = _loadLiftago(MUZEUM_METRO_STATION_LOCATION, location);
          var transitP = _loadTransitAvailibility(address);

          var pubsP = _loadPlaces('restaurant', location);
          var nightClubsP = _loadPlaces('night_club', location);
          var stopsP = _loadPlaces('transit_station', location);
          var parkP = _loadPlaces('park', location);
          var schoolP = _loadPlaces('school', location);
          var zonesP = _loadParkingZones(location);

          $.when(liftagoP, liftagoFromMuzeumToP, transitP, pubsP, nightClubsP, stopsP, parkP, schoolP, zonesP)
          .done(function(liftago, liftagoFromMuzeumTo, transit, pubs, nightClubs, stops, parks, schools, zones) {
            html = html.replace('@@HEADER@@', address.replace(/,.*/, ''));
            html = html.replace('@@LIFTAGO_NODE5@@', _formatPrice(liftago[0][0].price));
            html = html.replace('@@LIFTAGO_FROM_MUZEUM@@', _formatPrice(liftagoFromMuzeumTo[0][0].price));

            var distancesArray = transit[0].rows[0].elements;
            html = html.replace('@@DOJEZD_MUZEUM_MHD@@', distancesArray[0].duration.text);
            html = html.replace('@@DOJEZD_NODE5_MHD@@', distancesArray[1].duration.text);

            html = html.replace('@@ZONES@@', zones[0].count);

            var tags = ' ';
            if (pubs[0].results.length > 3) {
              tags += '<span class="tag" title="No beer no fun, right? Walk a little bit and choose at least from 3 pubs/restaurants!">PUBS</span>';
            }
            if (nightClubs[0].results.length > 2) {
              tags += '<span class="tag" title="Party time! At least 2 clubs close to property!">PARTY</span>';
            }
            if (stops[0].results.length > 3) {
              tags += '<span class="tag" title="At least 3 stops in close distance">Public Transit</span>';
            }
            if (parks[0].results.length > 0) {
              tags += '<span class="tag" title="Greeeeen!! At least 1 park in neighbourhood">NATURE</span>';
            }
            if (schools[0].results.length > 2) {
              tags += '<span class="tag" title="Lot of kids around. Number of schools > 2 in neighbourhood">KIDS</span>';
            }

            html = html.replace('@@TAGS@@', tags);

            $('body').append(html);

            $('.reality-panel .toggle-app-button').on('click', function() {
                console.debug('toggle app button clicked');
                $('.reality-panel').toggleClass('reality-panel-closed');
            })
          });
        });

  });
};

window.addEventListener('load', function() {
  _init();
  _loadPanel($('h2').first().text());
});
