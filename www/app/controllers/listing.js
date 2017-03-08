/* global ionic, define */
define([
  'app',
  'services/listings',
  'services/user'
  ], function (app) {
    'use strict';

    app.controller('ListingCtrl', [
      '$scope',
      '$stateParams',
      '$window',
      '$ionicPopup',
      'listingService',
      'userService',
      '$state',
      function ($scope, $stateParams, $window, $ionicPopup, listingService, userService, $state) {


        $scope.addListing = function(){
          $state.go('new_listing');
        };


        $scope.getProfileAndListings = function(objectId) {

          var query = new Parse.Query(Parse.User);
          query.equalTo("objectId", objectId);
          query.find({
            success: function(result) {  
              if(result.length != 1){
                alert("User not found");
                return;
              }

              var profile = result[0];
              profile.name = profile.get("firstName") + " " + profile.get("lastName");
              profile.city = profile.get("city");
              profile.imageURL = profile.get("imageURL");
              console.log(profile.imageURL);
              if (profile.imageURL === null){
                profile.imageURL = "http://placehold.it/100x100";
              }

              profile.number = profile.get("streetNumber");
              profile.street = profile.get("street");
              profile.city = profile.get("city");     
              $scope.listingOwner = profile; 
              $scope.getListings(profile);

            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
        };

        $scope.getListings = function(owner) {
          var listingsQuery = Parse.Object.extend("Listings");
          var query = new Parse.Query(listingsQuery);
          query.equalTo("parent", owner);
          // TODO query.include
          query.find({
            success: function(results) {
              console.log('Found ' + results.length + " listings");
              var listings = [];
              console.log(results);
              for (var i = 0; i < results.length; i++) {
                var listing = results[i];
                if(listing.get("show")){
                  listing.title = listing.get("title");
                  listing.desc = listing.get("desc");
                  listing.price = listing.get("price");
                  listing.imageURL = listing.get("imageURL");
                  if (listing.imageURL == null){
                    console.log("found null");
                    listing.imageURL = "http://www.novelupdates.com/img/noimagefound.jpg";
                  }
                  listing.parent = listing.get('parent');
                  listing.username = listing.get('username');
                  listings.push(listing);  
                }
              }

              $scope.events = listings;
              $scope.loading = false;

           },
           error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
        };


        // Start loading and load listingOwner and there listings
        $scope.loading = true;
        $scope.getProfileAndListings($stateParams.id);


        $scope.reload = function () {
          // TODO
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





        };
      }
      ]);
});

