/* global ionic, define */
define([
  'app',
  'services/listings',
  'services/user'
], function (app) {

  app.controller('ListingCtrl', [
    '$scope',
    '$stateParams',
    '$window',
    '$ionicPopup',
    'listingService',
    'userService',
    '$state',
    function ($scope, $stateParams, $window, $ionicPopup, listingService, userService, $state) {

      // Go to the add listing view
      $scope.addListing = function () {
        $state.go('new_listing');
      };

      // Edit the listing
      $scope.editListing = function (listingObjectId) {
        console.log("going to edit listing: " + listingObjectId);
        $state.go("new_listing", {id: listingObjectId});
      };


      // Gets the current user whose object id is specified, sets it as $scope.profile
      // Then calls getListings
      $scope.getProfileAndListings = function (objectId) {
        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", objectId);

        query.first().then(function (profile) {
          $scope.getListings(profile);
        }, function (error) {
          console.error("Error finding user " + error);
        });

      };


      // Gets the user specifieds listings and sets them as $scope.listings
      // For all the listings it checks to see if an image is specified, if not it will set a default url.
      $scope.getListings = function (owner) {
        var listingsQuery = Parse.Object.extend("Listings");
        var query = new Parse.Query(listingsQuery);
        query.equalTo("parent", owner);
        query.find({
          success: function (results) {
            console.log("loaded");
            for (var i = 0; i < results.length; i++) {
              var listing = results[i];

              // Check if they have an image, if not set the default image
              if (listing.attributes.imageURL == null) {
                listing.imageURL = "http://www.novelupdates.com/img/noimagefound.jpg";
              } else {
                listing.imageURL = listing.attributes.imageURL;
              }

            }

            $scope.listings = results;
            $scope.loading = false;
          },
          error: function (error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
      };


      // Start loading and load listing owner and there listings
      $scope.loading = true;
      $scope.getProfileAndListings($stateParams.id);

      // Not being currently used
      // Used to refresh the page and update content
      $scope.reload = function () {
        $state.go("listing", {id: $scope.profile.id});
      };


      // Called by a button click on the UI
      // Launched a map application on the users device with the current users position.
      $scope.map = function () {
        if (ionic.Platform.isIOS()) {
          $window.open('maps://?q=' + $scope.profile.attributes.lat + ',' + $scope.profile.attributes.long, '_system');
        } else {
          $window.open('geo://0,0?q=' + $scope.profile.attributes.lat + ',' + $scope.profile.attributes.long + '(' + $scope.profile.attributes.firstName + '/' + $scope.profile.attributes.city + ')&z=15', '_system');
        }
      };


      // TODO backend logic
      // It opens a prompt to enter a message to report a user
      $scope.report = function () {
        $ionicPopup.prompt({
          scope: $scope,
          title: '<span class="energized">Report an issue</span>',
          subTitle: '<span class="stable">What\'s wrong or missing?</span>',
          inputType: 'text',
          inputPlaceholder: ''
        }).then(function (res) {
          if (res) {
            // TODO
          }

        });


      };

    }
  ]);
});
