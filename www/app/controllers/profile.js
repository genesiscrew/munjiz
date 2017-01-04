/* global ionic, define */
define([
  'app',
  'services/event'
], function (app) {
  'use strict';

  app.controller('ProfileCtrl', [
    '$scope',
    '$stateParams',
    '$window',
    '$ionicPopup',
    'eventService',
    function ($scope, $stateParams, $window, $ionicPopup, eventService) {
      $scope.loading = true;



        $scope.getProfile = function(objectID) {

          var query = new Parse.Query(Parse.User);
          query.equalTo("objectId", objectID);
          query.find({
            success: function(result) {  

              var profile = result[0];

              profile.name = profile.get("firstName") + " " + profile.get("lastName");
              profile.city = profile.get("city");
              profile.imageURL = profile.get("imageURL");
              profile.number = profile.get("streetNumber");
              profile.street = profile.get("street");
              profile.city = profile.get("city");
          
              

              profile.id = 1;

              $scope.profile = profile;            

          

              $scope.loading = false;
              console.log(profile);
              alert("Successful profile");

            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
        };

      $scope.getProfile("SQBSA2iCYX");

      // eventService.getOne($stateParams.id).then(function (event) {
      //   $scope.profile = event;
      // }).finally(function () {
      //   $scope.loading = false;
      // });

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
      };
    }
  ]);
});
