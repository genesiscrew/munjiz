define([
  'app'
], function (app) {
  'use strict';

  app.controller('DashboardCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$ionicNavBarDelegate',
    'IonicClosePopupService',
    function ($scope, $rootScope, $state, $ionicNavBarDelegate) {

      $ionicNavBarDelegate.showBackButton(false);
      $scope.apiKey = 'AIzaSyCSAtESQZoQ1Viv5rU5k_7sJcbrmz2-Whg';
      $scope.searchQuery = "";
      $scope.height = window.screen.height;
      $scope.width = window.screen.width;
      $scope.search = {};
      $scope.model = "";
      $rootScope.latitude = -41.28999339999999; 
      $rootScope.longtitude = 174.7689906;

      

      $scope.callbackMethod = function (query, isInitializing) {
        if (isInitializing) {
          return [query];
        }
        // Load predictions instead
        var listingsQuery = new Parse.Query(Parse.Object.extend("Listings"));
        var items = [];
        $scope.searchQuery = query;

        if (query.length <= 2) {
          listingsQuery.startsWith("title", query);

        } else {
          listingsQuery.contains("title", query);
        }

        return listingsQuery.find().then(function (listings) {
            for (var i = 0; i < listings.length; i++) {
              var title = listings[i].get("title");
              items[i] = title;
            }
            return items;
          }
        );
      };

      $scope.onClick = function (callback) {
        $scope.searchQuery = callback.item;
      }
    }
  ]);


  // Google maps code
  app.directive('googleMap', [
    '$state',
    '$window',
    'userService',
    '$ionicPopup',
    '$rootScope',
    'IonicClosePopupService',
    'PubNubService',
    function ($state, $window, userService, $ionicPopup, $rootScope, IonicClosePopupService,PubNubService) {
      return {
        restrict: 'A',
        scope: {
          apiKey: '@',
          model: '=ngModel',
        },

        link: function (scope, element, attrs) {
          var counter = 0,
            map,
            gmarkers = [], // List of marker
            searchedItem,
            lineCoords = [],
            lat,
            long,
            mark,
            pnChannel = "map-channel",
            pubnub = PubNubService;

            pubnub.subscribe({
              channel: pnChannel,
              withPresence: true,
              callback: function (m) {
                  handleMessage(m);

              },
              presence: function (presenceEvent) {
              }


          });
          function handleMessage(message) {
            redraw(message);
          };

         

          // Watches the text box, on change it updates the matching results
          scope.$watch('model', function (value) {
            searchedItem = value;
            findListingsAndDisplay();
          });


          // Alert for when an event is clicked
          function addClickListener(marker) {
            $window.google.maps.event.addListener(marker, 'click', function () {
              showPopup(marker);
            });
          }


          // Returns an array of the size num
          function getNumber(num) {
            return new Array(num);
          }


          var redraw = function(payload) {
            
            if (payload.lat != null) {
            
            var lat = payload.lat;
            var lng = payload.lng;
          
            
            map.setCenter({lat:lat, lng:lng, alt:0});
            if (mark != null) {
              mark.setMap(null);

            }
            mark = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
            gmarkers.push(mark);
            
            mark.setPosition({lat:lat, lng:lng, alt:0});
            lineCoords.push(new google.maps.LatLng(lat, lng));
            var lineCoordinatesPath = new google.maps.Polyline({
              path: lineCoords,
              geodesic: true,
              strokeColor: '#2E10FF'
            });
            
            lineCoordinatesPath.setMap(map);
            
          };
          };


          function calculateRatings(rating) {
            // Calc full star ratings
            var ratingFloor = Math.floor(rating);
            scope.full_stars = getNumber(ratingFloor);

            // Calc half star and outline ratings
            scope.half_stars = rating - ratingFloor;
            if (scope.half_stars >= 0.5) {
              // there is a half rating
              scope.half_stars = getNumber(1);
              scope.outline_stars = getNumber(5 - 1 - ratingFloor);
            } else {
              // no half rating
              scope.half_stars = getNumber(0);
              scope.outline_stars = getNumber(5 - ratingFloor);
            }
          }


          // Shows a popup when a user clicks on a listing
          function showPopup(marker) {
            scope.marker = marker;
            calculateRatings(marker.rating);

            var template =
              '<div class="row no-padding">' +
              '<span align="left" class="col col-30 no-padding"> <p>Rating: </p> </span>' +
              '<div ng-repeat="i in full_stars track by $index"> <i class = "icon icon ion-ios-star star-icon"></i> </div>' +
              '<div ng-repeat="i in half_stars track by $index"> <i class = "icon icon ion-ios-star-half star-icon"></i> </div>' +
              '<div ng-repeat="i in outline_stars track by $index"> <i class = "icon icon ion-ios-star-outline star-icon"></i> </div>' +
              '</div>' +
              '<p class="popup-price-text"> Price : {{marker.price}} </p>' +
              '<p class="popup-desc-text"> {{marker.desc}} </p>' +

              '<style>.popup-title { color: black; } ' +
              '.star-icon{ color: black; font-size: 20px;} ' +
              'p{color: #000 !important; text-align: left;} ' +
              '.no-padding{padding: 0px;} </style>';

            if (marker.ready) {
              template += '<style>.popup-head{background-color : green;}</style>';
            } else {
              template += '<style>.popup-head{background-color : orange;}</style>';
            }

            var popup = $ionicPopup.show({
              template: template,
              title: marker.title,
              scope: scope,
              buttons: [
                {
                  text: 'Profile',
                  type: "button-light",
                  onTap: function (e) {
                    $rootScope.userID = marker.userId;
                    goToProfile(marker.userId);
                  }
                },
                {
                  text: "Listing",
                  type: "button-positive",
                  onTap: function (e) {
                    goToListing(marker.id);
                  }
                }
              ]
            });
            IonicClosePopupService.register(popup);
          }


          // This function adds markers on the map only for the users who have items matching the search
          function findListingsAndDisplay() {
            // Find listings
            var listingQuery = new Parse.Query('Listings');
            listingQuery.include('parent');

            // If the user has specified search params then we want to include it in the search
            if (typeof searchedItem != 'undefined' && searchedItem.length != 0) {
              listingQuery.contains("title", searchedItem);
            }

            // Near user
            var userQuery = new Parse.Query(Parse.User);
            userQuery.near("location", Parse.User.current().get("location"));

            // Limit to 100, and ensure they are near the user
            listingQuery.limit(100);
            listingQuery.matchesQuery("parent", userQuery);

            listingQuery.find({
              success: function (listings) {
                showListings(listings);
              }
            });
          }


          // Shows the listings on the map from a query
          function showListings(listings) {
            removeMarkers();

            // For every listings
            for (var i = 0; i < listings.length; i++) {
              var listing = listings[i];
              var parent = listing.get('parent');

              // Make a new marker
              var mapsMarker = new $window.google.maps.Marker({
                position: new $window.google.maps.LatLng(parent.get('location').latitude, parent.get('location').longitude),
                map: map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                clickable: true,
                userId: parent.id,
                title: listing.get("title"),
                price: listing.get("price"),
                desc: listing.get("desc"),
                id: listing.id,
                ready: listing.get("ready"),
                rating: parent.get("ratingsAverage")
              });

              gmarkers.push(mapsMarker);
              addClickListener(mapsMarker);
            }
          }


          // Go to the selected users profile
          function goToProfile(objectId) {
            $state.go("profile", {id: objectId});
          }

          // Go to the selected listing
          function goToListing(objectId) {
            $state.go("listing", {id: objectId});
          }


          // Remove all the markers on screen
          function removeMarkers() {
            for (i = 0; i < gmarkers.length; i++) {
              gmarkers[i].setMap(null);
            }
          }

          


          // Make the map
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
                 lat = pos.coords.latitude;
                 long = pos.coords.longitude;

                // Update users current location
                Parse.User.current().set("location", new Parse.GeoPoint(lat, long));
                Parse.User.current().save();
                map.setCenter(me);
                myloc.setPosition(me);
              }, function (error) {
                alert(error.message);
              });
            }
          }

          // Load google maps api script async, avoiding 'document.write' error
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
            findListingsAndDisplay();
            setInterval(function() {
              $rootScope.latitude +=  0.001;
              $rootScope.longtitude += 0.01;
              pubnub.publish({channel:pnChannel, message:{lat:$rootScope.latitude, lng:$rootScope.longtitude}});
            }, 5000);
          } else {
            StyleMap();
            makeMapAndMarkers();
            setInterval(function() {
              $rootScope.latitude +=  0.001;
              $rootScope.longtitude += 0.01;
              pubnub.publish({channel:pnChannel, message:{lat:$rootScope.latitude, lng:$rootScope.longtitude}});
            }, 5000);


          }
        }
      };


    }
  ])
  ;
})
;
