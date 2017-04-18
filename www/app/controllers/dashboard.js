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
      $scope.searchQuery = "";
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
            gmarkers = [], // List of markers
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
              // Get name and listings
              var usersListingsQuery = new Parse.Query(Parse.Object.extend("Listings"));
              usersListingsQuery.equalTo("parent", Parse.User.createWithoutData(marker.userId));
              var listings = usersListingsQuery.find({
                success: function (listings) {
                  var listingsString = "Listings: \r\n";
                  for (var i = 0; i < listings.length; i++) {
                    listingsString += listings[i].get("title") + "\r\n\ ";
                  }
                  console.log(listings);
                  showPopup(marker, listingsString);
                }
              });

            });
          }


          function showPopup(marker, listingsString) {
            var markerName = marker.name;

            $ionicPopup.show({
              title: markerName,
              subTitle: listingsString,
              cancelText: "Cancel",
              buttons: [
                {
                  text: 'Cancel',
                  type: "button-light"
                },

                {
                  text: "View Profile",
                  type: "button-positive",
                  onTap: function (e) {
                    $rootScope.userID = marker.userId;
                    console.log("Selected user id: " + marker.userId);
                    goToProfile(marker.userId);
                  }
                }
              ]
            });
          }


          // This function adds markers on the map only for the users who have items matching the search
          function showMatchingSearchResultListings() {
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
            query.include("parent");
            query.find({
                success: function (results) {
                  // For every user
                  for (var i = 0; i < results.length; i++) {
                    var parent = results[i].get('parent');

                    // Make a new marker
                    var mapsMarker = new $window.google.maps.Marker({
                      position: new $window.google.maps.LatLng(parent.get('location').latitude, parent.get('location').longitude),
                      map: map,
                      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                      clickable: true,
                      userId: parent.id,
                      name: parent.attributes.firstName + " " + parent.attributes.lastName
                    });

                    gmarkers.push(mapsMarker);
                    addClick(mapsMarker);
                  }
                }
              }
            );
          };


          // Go to the selected users profile
          function goToProfile(objectId) {
            $state.go("profile", {id: objectId});
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
                var lat = pos.coords.latitude;
                var long = pos.coords.longitude;

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
