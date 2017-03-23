/* global ionic, define */
define([
  'app',
  ], function (app) {
    'use strict';

    app.controller('EditProfileCtrl', [
      '$scope',
      '$stateParams',
      '$window',
      '$ionicPopup',
      '$state',
      function ($scope, $stateParams, $window, $ionicPopup, $state) {
        $scope.loading = true;

        // Save the user to Parse
        $scope.save = function(){
          $scope.profile.set("email", $scope.profile.email);
          $scope.profile.set("imageURL",  $scope.profile.imageURL);
          $scope.profile.set("streetNumber", $scope.profile.number);
          $scope.profile.set("street", $scope.profile.street);
          $scope.profile.set("hours", $scope.profile.hours);
          $scope.profile.set("city", $scope.profile.city);
          $scope.profile.save();  

          var objectId = Parse.User.current().id;
          $state.go('profile', {id: objectId});
        };

        // Loads the users profile by setting the attributes to be modifiable
        $scope.loadProfile = function() {
          
          // TODO default image URL 
          $scope.profile.imageURL = $scope.profile.attributes.imageURL;
          $scope.profile.email = $scope.profile.attributes.email;
          $scope.profile.number = $scope.profile.attributes.streetNumber;
          $scope.profile.street = $scope.profile.attributes.street;
          $scope.profile.city = $scope.profile.attributes.city;    
          $scope.profile.hours = $scope.profile.attributes.hours;
          $scope.loading = false;
        };

        // Load profile
        $scope.profile = Parse.User.current();
        $scope.loadProfile();

  

      }
      ]);
  });
