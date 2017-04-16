define([
  'app',
  'services/user'

<<<<<<< HEAD
  ], function (app) {
    'use strict';
    Parse.initialize("uvQmMNsdZStxEvEfMeMdrH85sGW7wKMl8Ms2Bm0j", "YHcdSEyXhQ8qX0vykcFCerM4rQmajQG22iu44BvT", "0gauJiwUIqjTabTNOOZEcgE17wGxFyKtPq8g40sm", "z4wnNa2HnXgPly14Z3sDzxl8LDlMwj6WroUMuamT");
    Parse.serverURL = 'https://parseapi.back4app.com/';

    var pubnub;
    console.log("about to run the app");
    // the run blocks
    app.factory('PubNubService', function() {
      pubnub = null;
      var authKey = PUBNUB.uuid();

      console.log("pubnub id is: " + authKey);

      pubnub = PUBNUB.init({
        publish_key: 'pub-c-30d2f626-ff6d-4379-bad2-a2513d33a646',
        subscribe_key: 'sub-c-4b18eb38-e884-11e6-81cc-0619f8945a4f',
        auth_key: authKey,
        origin: 'pubsub.pubnub.com',
        ssl: false
      });
      console.log("pubnub created");
      return pubnub;

    })
    .run([
      '$ionicPlatform',
      '$state',
      'userService',
      '$rootScope',


      function ($ionicPlatform, $state, userService, $rootScope) {


        $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        $rootScope.start= false;
        $rootScope.pubnub = pubnub;


          // FB authentication

            // UI Router Authentication Check
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
              if (!Parse.User.current()) {
                // User isn’t authenticated
                $state.transitionTo("login");
                event.preventDefault(); 
              }
            });

     });


      }
      ]);

  });
=======
], function (app) {
  'use strict';
  var pubnub;

  app
    .run([
      '$ionicPlatform',
      '$state',
      'userService',
      '$rootScope',
      function ($ionicPlatform, $state, userService, $rootScope) {

        // Parse.initialize("uvQmMNsdZStxEvEfMeMdrH85sGW7wKMl8Ms2Bm0j", "YHcdSEyXhQ8qX0vykcFCerM4rQmajQG22iu44BvT", "0gauJiwUIqjTabTNOOZEcgE17wGxFyKtPq8g40sm", "z4wnNa2HnXgPly14Z3sDzxl8LDlMwj6WroUMuamT");
        Parse.initialize("uvQmMNsdZStxEvEfMeMdrH85sGW7wKMl8Ms2Bm0j", "YHcdSEyXhQ8qX0vykcFCerM4rQmajQG22iu44BvT", "z4wnNa2HnXgPly14Z3sDzxl8LDlMwj6WroUMuamT");
        Parse.serverURL = 'https://parseapi.back4app.com/';
        //Parse.FacebookUtils.init();

        // Called when Ionic is ready.
        // Sets the keyboard, checks when the user isnt auth. and manages the users messages when < 0. 
        $ionicPlatform.ready(function () {
          $rootScope.start = false;

          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs) TODO get working
          // if (window.cordova && window.cordova.plugins.Keyboard) {
          //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          //   cordova.plugins.Keyboard.disableScroll(true);
          // }
          if (window.StatusBar) {
            StatusBar.styleDefault();
          }


          // Checks to see when the user isn't authenticated on a state change
          // If they aren't then it takes them to the login page
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (!Parse.User.current()) {
              // User isn’t authenticated take them to the login page
              $state.transitionTo("login");
              event.preventDefault();
            }
          });


          if (Parse.User.current()) {
            // Logged in
            userService.username = Parse.User.current().get('username');

            if (Parse.User.current().get('total_unread') < 0) {
              $rootScope.totalMessages = 0;
            }

            // Go straight to dashboard
            $state.go('dashboard');

          } else {
            // Not logged in
            $state.go('login');
          }

        });
      }
    ])

    // Pubnub service TODO description
    .factory('PubNubService', function () {
      pubnub = null;
      pubnub = PUBNUB.init({
        publish_key: 'pub-c-30d2f626-ff6d-4379-bad2-a2513d33a646',
        subscribe_key: 'sub-c-4b18eb38-e884-11e6-81cc-0619f8945a4f',
        origin: 'pubsub.pubnub.com',
        ssl: false,
      });
      return pubnub;
    })


    // TODO description
    .factory('ShareFactory', function () {
      var data = {
        number: ''
      };
      return {
        setValue: function (number) {
          data.number = number;
        },
        getValue: function () {
          return data.number;
        }
      };
    })
    .directive('googleMap', [
      '$state',
      '$window',
      'userService',
      '$ionicPopup',
      '$rootScope',




      function ($state, $window, userService, $ionicPopup, $rootScope) {
        return {
          scope: {
            //  events: '=',
            apiKey: '@',


          },
          restrict: 'A',
          replace: true,
          transclude: false,

          link: function (scope, element) {
            var counter = 0,
              map,
              mapsMarker,
              gmarkers = [],
              object,
              object2,
              mylat,
              mylong,
              eventsReady = false,
              searchedItem;
            console.log(" we are inside map");

            function addClick(marker) {
              $window.google.maps.event.addListener(marker, 'click', function () {
                var userPopup = $ionicPopup.alert({
                  okText: "GOT IT!",
                  buttons: [
                    {
                      text: "chat",
                      type: "button-default",
                      onTap: function (e) {

                        console.log(marker.userID);
                        $rootScope.userID = marker.userID;
                        $state.go('chat');
                      }


                    }


                  ]
                });
              });
            }





            // this function adds markers on the map only for the users who have items matching the search, not sure but
            // maybe can apply lazy loading here as well? thoughts?

            function makeMarkers() {

              eventsReady = true;

              var i = 0;

              var query = new Parse.Query('Listings');
              query.include('parent');
              query.find({
                success: function (results) {

                  // Do something with the returned Parse.Object values
                  for (var i = 0; i < results.length; i++) {
                    object = results[i];
                    object2 = object.get('parent');
                    // code below draws marker for all users in DB except for logged in user.
                    if (Parse.User.current().id != object2.id && object.get('title') == searchedItem) {
                      console.log("marker added");
                      var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
                      mapsMarker = new $window.google.maps.Marker({
                        position: new $window.google.maps.LatLng(object2.get('lat'), object2.get('long')),
                        map: map,

                        icon: image,
                        clickable: true
                      });
                      gmarkers.push(mapsMarker);
                      addClick(mapsMarker);

                    }

                  }

                },
                error: function (error) {
                  alert("Error: " + error.code + " " + error.message);
                }
              });




            }
            // this function adds markers on the map only for all users in DB, would need to be modified to 
            // be a lazy loading of some sort since we dont want to load all the users but only those inside the 
            // part of map that is showing, hence TODO: lazy loading

            function makeMarkersforUsers() {

              //if (eventsReady || !scope.events) {
              //  return;
              //}

              eventsReady = true;

              var i = 0;

              var query = new Parse.Query('User');
              //query.include(' parent');
              query.find({
                success: function (results) {
                  // Do something with the returned Parse.Object values
                  for (var i = 0; i < results.length; i++) {
                    object = results[i];


                    // code below draws marker for all users in DB except for logged in user.

                    if (Parse.User.current().id != object.id) {
                      //alert(Parse.User.current().id);

                      var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
                      mapsMarker = new $window.google.maps.Marker({
                        position: new $window.google.maps.LatLng(object.get('lat'), object.get('long')),
                        map: map,

                        icon: image,
                        clickable: true,
                        userID: object.id

                      });
                      gmarkers.push(mapsMarker);
                      addClick(mapsMarker);

                    }

                  }

                },
                error: function (error) {
                  alert("Error: " + error.code + " " + error.message);
                }
              });


            }


            function removeMarkers() {
              for (i = 0; i < gmarkers.length; i++) {
                gmarkers[i].setMap(null);
              }
            }

            function makeMapAndMarkers() {
              console.log("making map");

              var mapOptions = {
                zoom: 13,
                disableDefaultUI: true,
                styles: [
                  {
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#1d2c4d"
                      }
                    ]
                  },
                  {
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#8ec3b9"
                      }
                    ]
                  },
                  {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "color": "#1a3646"
                      }
                    ]
                  },
                  {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [
                      {
                        "color": "#4b6878"
                      }
                    ]
                  },
                  {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#64779e"
                      }
                    ]
                  },
                  {
                    "featureType": "administrative.neighborhood",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                      {
                        "color": "#4b6878"
                      }
                    ]
                  },
                  {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.stroke",
                    "stylers": [
                      {
                        "color": "#334e87"
                      }
                    ]
                  },
                  {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#023e58"
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#283d6a"
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#6f9ba5"
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "color": "#1d2c4d"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                      {
                        "color": "#023e58"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#3C7680"
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#304a7d"
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#98a5be"
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "color": "#1d2c4d"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#2c6675"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                      {
                        "color": "#255763"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#b0d5ce"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "color": "#023e58"
                      }
                    ]
                  },
                  {
                    "featureType": "transit",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#98a5be"
                      }
                    ]
                  },
                  {
                    "featureType": "transit",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "color": "#1d2c4d"
                      }
                    ]
                  },
                  {
                    "featureType": "transit.line",
                    "elementType": "geometry.fill",
                    "stylers": [
                      {
                        "color": "#283d6a"
                      }
                    ]
                  },
                  {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#3a4762"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#0e1626"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "labels.text",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#4e6d70"
                      }
                    ]
                  }
                ]
              };
              if (!map) {
                map = new $window.google.maps.Map(element[0], mapOptions);
                // add a keyboard listener to the map, this probably needs to be modified for mobile use
                // since key pressed would be different than ENTER
                google.maps.event.addDomListener(document, 'keyup', function (e) {
                  var div = document.getElementById('search').value



                  var code = (e.keyCode ? e.keyCode : e.which);

                  if (code == 13) {
                    if (searchedItem != div) {
                      searchedItem = div;
                      console.log("search function working");
                      // here we remove the markers, and redraw them based on new search
                      removeMarkers();
                      makeMarkers();

                    }



                  }


                });


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
                  // set fields of lat and long in user DB
                  Parse.User.current().set("lat", mylat);
                  Parse.User.current().set("long", mylong);
                  Parse.User.current().save();
                  map.setCenter(me);
                  myloc.setPosition(me);
                }, function (error) {
                  // ...
                });
              }


              if (Parse.User.current()) {
                makeMarkersforUsers();
              }

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
              StyleMap();
              makeMapAndMarkers();


            }
          }
        };
      }
    ]);

});

>>>>>>> master
