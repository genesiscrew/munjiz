define([
  'app'
], function (app) {
  'use strict';

  app.controller('DashboardCtrl', [
    '$scope',
    '$state',
    '$ionicNavBarDelegate',
    function ($scope, $state, $ionicNavBarDelegate) {

      $ionicNavBarDelegate.showBackButton(false);
      $scope.apiKey = 'AIzaSyBLn2Bi6M50mbmml_uq-jzcZKDMKR_OyTY';
      $scope.searchValue = "";
      $scope.height = window.screen.height;
      $scope.width = window.screen.width;
      $scope.search = {};
      $scope.model = "";

      $scope.callbackMethod = function (query, isInitializing) {
        if (isInitializing) {
          return [query];
        }
        // Load predictions instead
        var listingsQuery = new Parse.Query(Parse.Object.extend("Listings"));
        var items = [];
        $scope.searchValue = query;

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
        $scope.searchValue = callback.item;
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
    function ($state, $window, userService, $ionicPopup, $rootScope) {
      return {
        restrict: 'A',
        scope: {
          apiKey: '@',
          model: '=ngModel',
        },

        link: function (scope, element, attrs) {
          var counter = 0,
            map,
            mapsMarker,
            gmarkers = [],
            lat,
            long,
            searchedItem;

          // Watches the text box, on change it updates the matching results
          scope.$watch('model', function (value) {
            console.log("updated value from watcher: " + value);
            searchedItem = value;

            if (searchedItem.length == 0) {
              showAllClosestListings()
            } else {
              showMatchingSearchResultListings();
            }
          });


          // Alert for when an event is clicked
          function addClick(marker) {
            $window.google.maps.event.addListener(marker, 'click', function () {
              $ionicPopup.alert({
                template: '<input type ="text" ng-model = "data.model">',
                okText: "GOT IT!",
                buttons: [
                  {
                    text: "chat",
                    type: "button-default",
                    onTap: function (e) {
                      $rootScope.userID = marker.userID;
                      $state.go('chat');
                    }
                  }
                ]
              });
            });
          }


          // this function adds markers on the map only for the users who have items matching the search
          function showMatchingSearchResultListings() {
            // Find parents
            var currentLocation = Parse.User.current().get("location");
            var findCloseListings = new Parse.Query('User');
            findCloseListings.near("location", currentLocation);
            findCloseListings.limit(100);
            console.log("showing select results matching: " + searchedItem);

            findCloseListings.find({
              success: function (users) {
                // Find listings
                var query = new Parse.Query('Listings');
                query.include('parent');
                query.containedIn("parent", users);
                query.contains("title", searchedItem);
                showListingsFromQuery(query);
              }
            });
          };


          // Shows all the closest listings on the map
          function showAllClosestListings() {
            // Find parents
            var currentLocation = Parse.User.current().get("location");
            var findCloseListings = new Parse.Query('User');
            findCloseListings.near("location", currentLocation);
            findCloseListings.limit(100);

            findCloseListings.find({
              success: function (users) {
                // Find listings
                var query = new Parse.Query('Listings');
                query.include('parent');
                query.containedIn("parent", users);
                showListingsFromQuery(query);
              }
            });
          };


          // Shows the listings on the map from a query
          function showListingsFromQuery(query) {
            removeMarkers();
            query.find({
                success: function (results) {
                  for (var i = 0; i < results.length; i++) {
                    var parent = results[i].get('parent');

                    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
                    mapsMarker = new $window.google.maps.Marker({
                      position: new $window.google.maps.LatLng(parent.get('location').latitude, parent.get('location').longitude),
                      map: map,

                      icon: image,
                      clickable: true
                    });

                    gmarkers.push(mapsMarker);
                    addClick(mapsMarker);
                  }
                }
              }
            );
          };


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
              // add a keyboard listener to the map, this probably needs to be modified for mobile use
              // since key pressed would be different than ENTER
              // google.maps.event.addDomListener(document, 'keyup', function (e) {
              //   var code = (e.keyCode ? e.keyCode : e.which);
              //
              //   if (code == 13) {
              //     // here we remove the markers, and redraw them based on new search
              //     removeMarkers();
              //     if (searchedItem.length == 0) {
              //       showAllClosestListings();
              //       console.log("showing all listings");
              //       console.log("searchedItem is: " + searchedItem);
              //     } else {
              //       console.log("showing listings that match: " + searchedItem);
              //       showMatchingSearchResultListings();
              //     }
              //   }
              // });

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
                // set fields of lat and long in user DB

                Parse.User.current().set("location", new Parse.GeoPoint(lat, long));
                Parse.User.current().save();
                map.setCenter(me);
                myloc.setPosition(me);
              }, function (error) {
                alert(error.message);
              });
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
            showAllClosestListings();
          } else {
            StyleMap();
            makeMapAndMarkers();


          }
        }
      };


    }
  ]);
});
