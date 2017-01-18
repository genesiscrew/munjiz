/* global ionic, define */
define([
  'app',
  'services/event',
  'services/listings',
  'services/user'
  ], function (app) {
    'use strict';

    app.controller('ListingCtrl', [
      '$scope',
      '$stateParams',
      '$window',
      '$ionicPopup',
      'eventService',
      'listingService',
      'userService',
      '$state',
      function ($scope, $stateParams, $window, $ionicPopup, eventService, listingService, userService, $state) {

        $scope.loading = true;
        var object;
        var object2;

        $scope.getListings = function(ownerID) {

          var listingsQuery = Parse.Object.extend("Listings");
          var query = new Parse.Query(listingsQuery);
          query.equalTo("parent", Parse.User.current());
          console.log(Parse.User.current().id);
          query.find({
            success: function(results) {

              var listings = [];
              console.log(results.length);
              for (var i = 0; i < results.length; i++) {
                var listing = results[i];
                if(listing.get("show")){
                  listing.title = listing.get("title");
                  listing.desc = listing.get("desc");
                  
                  listing.price = listing.get("price");
                  listing.imageURL = listing.get("imageURL");
                  object = listing.get('parent');
                  object2 = object.get('username');
                  console.log('listing' + listing.title);

                  listings.push(listing);
                  
                }
              }

              $scope.events = listings;
             // alert("Successful");

           },
           error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
        };



        // Hardcoded
        $scope.getListings(2);


        eventService.getOne($stateParams.id).then(function (event) {
          $scope.owner = event;
        }).finally(function () {
          $scope.loading = false;

        });


        $scope.reload = function () {
          eventService.getOne($stateParams.id).then(function (event) {
            $scope.event = event;
          }).finally(function () {
            $scope.$broadcast('scroll.refreshComplete');
          });
        };

        $scope.call = function () {
          $window.open('tel:' + $scope.event.contact.tel, '_system');
        };

        $scope.mail = function () {
          $window.open('mailto:' + $scope.event.contact.email, '_system');
        };

        $scope.website = function () {
          $window.open($scope.event.website, '_system');
        };

        $scope.map = function () {
          if (ionic.Platform.isIOS()) {
            $window.open('maps://?q=' + $scope.event.lat + ',' + $scope.event.lng, '_system');
          } else {
            $window.open('geo://0,0?q=' + $scope.event.lat + ',' + $scope.event.lng + '(' + $scope.event.name + '/' + $scope.event.city + ')&z=15', '_system');
          }
        };

        $scope.report = function () {
          $ionicPopup.prompt({
            scope: $scope,
            title: '<span class="energized">Report an issue</span>',
            subTitle: '<span class="stable">What\'s wrong or missing?</span>',
            inputType: 'text',
            inputPlaceholder: ''
          }).then(function (res) {
            if (res) {
          // here connect to backend and send report
        }
      });

          $scope.addListing = function(){
            console.log('hi');
            $state.go('new_listing');
          };





          $scope.getListings = function(ownerID) {

            var listings = Parse.Object.extend("Listings");
            var query = new Parse.Query(listings);
          //query.equalTo("parentID", ownerID);
          query.find({
            success: function(results) {
              alert("Successfully retrieved " + results.length + " scores.");
                // Do something with the returned Parse.Object values
                $scope.events = results;
              //   for (var i = 0; i < results.length; i++) {
              //     var object = results[i];
              //     alert(object.id + ' - ' + object.get('playerName'));
              //   }
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
        };

      };
    }
    ]);
});

