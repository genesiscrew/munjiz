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
      $scope.loading = true;

       $scope.editProfile = function(){
          $state.go('edit_profile');
        };

      $scope.getProfile = function(objectID) {

          var query = new Parse.Query(Parse.User);
          query.equalTo("objectId", objectID);
          query.find({
            success: function(result, reloading) {  

              var profile = result[0];

              profile.name = profile.get("firstName") + " " + profile.get("lastName");
              profile.city = profile.get("city");
              profile.imageURL = profile.get("imageURL");
              profile.number = profile.get("streetNumber");
              profile.street = profile.get("street");
              profile.city = profile.get("city");  
              profile.hours = profile.get("hours");     
              profile.id = Parse.User.current().id;
              $scope.profile = profile;   

              console.log("done");         
              if(reloading){
                 $scope.$broadcast('scroll.refreshComplete');
              }else{
                $scope.loading = false;
              }
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
        };
      $scope.getProfile($stateParams.id, false);

      $scope.reload = function () {
          $scope.getProfile($stateParams.id, true);
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
