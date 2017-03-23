/* global ionic, define */
define([
  'app'], function (app) {
    'use strict';

    app.controller('ProfileCtrl', [
      '$scope',
      '$stateParams',
      '$window',
      '$ionicPopup',
      '$state',
      function ($scope, $stateParams, $window, $ionicPopup, $state) {
       // Show the edit profile view
       $scope.editProfile = function(){
        $state.go('edit_profile');
      };


      // Get the user specified by objectID and set it to be $scope.profile
      $scope.getProfile = function(objectID) {
        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", objectID);
        query.first({
          success: function(profile) {  
            $scope.profile = profile;

            // Check if they have an image, if not set the default image
            if (profile.attributes.imageURL == null){
              profile.imageURL = "http://www.novelupdates.com/img/noimagefound.jpg";
            }else{
              profile.imageURL = profile.attributes.imageURL;
            }        

            $scope.loading = false;
            console.log("done loading profile");         
            
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
      };


      // On view load: Load the users profile 
      $scope.loading = true;
      $scope.getProfile($stateParams.id);


      // Reloads the page, not currently being used at the moment 
      $scope.reload = function () {
        console.log("profile reload");
        $scope.getProfile($stateParams.id, true);
        $scope.$broadcast('scroll.refreshComplete');
      };


      // Called by a button click on the UI
      // Launched a map application on the users device with the current users position.
      $scope.map = function () {
        if (ionic.Platform.isIOS()) {
          $window.open('maps://?q=' + $scope.profile.attributes.lat + ',' + $scope.profile.attributes.long, '_system');
        } else {
          $window.open('geo://0,0?q=' + $scope.profile.attributes.lat  + ',' + $scope.profile.attributes.long  + '(' + $scope.profile.attributes.firstName  + '/' + $scope.profile.attributes.city  + ')&z=15', '_system');
        }
      };


      // Navigate the to the Listing view
      $scope.goToUsersListings = function () {
        $state.go("listing", { id: $scope.profile.id });
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
          // here connect to backend and send report
          }
        });
      };


      }
      ]);
  });
