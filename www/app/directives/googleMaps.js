/* globals define, document */
define([
  'app',
  'services/user'
], function (app) {
    'use strict';

    app.directive('googleMap', [
      '$state',
      '$window',
      'userService',

      
     
      function ($state, $window, userService) {
          return {
              scope: {
                  events: '=',
                  apiKey: '@'
              },
              restrict: 'A',
              link: function (scope, element) {
                  var counter = 0,
                      map,
                      object,
                      object2,
                      mylat,
                      mylong,
                      eventsReady = false;

                  function addClick(marker, id) {
                      $window.google.maps.event.addListener(marker, 'click', function () {
                          $state.go('detail', {
                              id: id
                          });
                      });
                  }

                
                 
                  function makeMarkers() {

                      //if (eventsReady || !scope.events) {
                      //  return;
                      //}

                      eventsReady = true;

                      var i = 0,
                          mapsMarker;
                      var query = new Parse.Query('Listings');
                      query.include('parent');
                      query.find({
                          success: function (results) {
                              //window.alert("Successfully retrieved " + results.length + " scores.");
                              //window.alert(userService.username);
                              console.log(userService.username);
                              // Do something with the returned Parse.Object values
                              for (var i = 0; i < results.length; i++) {
                                  object = results[i];
                                  object2 = object.get('parent');
                                 // window.alert(object2.get('firstName'));
                                  
                                 // window.alert(mylong + ' ' + object2.get('long'));
                                  //window.alert(mylat + ' ' + object2.get('lat'));
                                  // window.alert(object2.get('lat'));
                                  // window.alert(object2.get('long'));
                                  
                                  //var position2 = new $window.google.maps.LatLng(object2.get('lat'), object2.get('long'));
                                  //if (mylat == object2.get('lat') && mylong == object2.get('long')) {
                                    //  window.alert(456);
                                  //}
                                  
                                  if (mylat != object2.get('lat') && mylong != object2.get('long')) {
                                      mapsMarker = new $window.google.maps.Marker({
                                          position: new $window.google.maps.LatLng(object2.get('lat'), object2.get('long')),
                                          map: map,
                                          clickable: true
                                      });
                                  }

                                  // center on first hit

                                  //addClick(mapsMarker, scope.events[i].id);
                              }

                          },
                          error: function (error) {
                              alert("Error: " + error.code + " " + error.message);
                          }
                      });


                  }
                  

                  var watcher = scope.$watch(function () {
                      return scope.events;
                  }, function (events) {
                      if (events && events.length) {
                          if (map) {
                              makeMarkers();
                          }
                          watcher();
                      }
                  });

                  function makeMapAndMarkers() {
                     
                      var mapOptions = {
                          zoom: 13,
                          disableDefaultUI: true
                      };
                      if (!map) {
                          map = new $window.google.maps.Map(element[0], mapOptions);

                          if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (pos) {
                              var myloc = new google.maps.Marker({

                                  clickable: false,
                                  icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                                                  new google.maps.Size(22, 22),
                                                                                  new google.maps.Point(0, 18),
                                                                                  new google.maps.Point(11, 11)),
                                  shadow: null,
                                  zIndex: 999,
                                  map: map
                              });



                              var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                              mylat = pos.coords.latitude;
                              mylong = pos.coords.longitude;
                              map.setCenter(me);
                              myloc.setPosition(me);
                          }, function (error) {
                              // ...
                          });
                      }
                      makeMarkers();
                  }

                  //load google maps api script async, avoiding 'document.write' error
                  function injectGoogle() {
                      var cbId,
                          wf,
                          s,
                          apiKey;

                      //callback id
                      cbId = '_gmap_' + counter;
                      $window[cbId] = makeMapAndMarkers;
                      apiKey = 'key=' + scope.apiKey + '&';
                     
                      wf = document.createElement('script');
                      wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
                           '://maps.googleapis.com/maps/api/js?' + apiKey + 'v=3&callback=' + cbId;
                      wf.type = 'text/javascript';
                      wf.async = 'true';
                      document.body.appendChild(wf);
                  }

                  if (!$window.google) {
                      counter += 1;
                      injectGoogle();
                      //window.alert("inject google");
                  } else {
                      makeMapAndMarkers();
                  }
              }
          };
      }
    ]);
});
