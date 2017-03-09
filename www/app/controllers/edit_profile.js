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

        $scope.loadProfile = function() {

          $scope.profile.email = $scope.profile.get("email");
          $scope.profile.imageURL = $scope.profile.get("imageURL");
          $scope.profile.number = $scope.profile.get("streetNumber");
          $scope.profile.street = $scope.profile.get("street");
          $scope.profile.city = $scope.profile.get("city");     
          $scope.profile.hours = $scope.profile.get("hours");  
          console.log($scope.profile.get("hours"));   

          $scope.loading = false;
        };

        $scope.profile = Parse.User.current();
        $scope.loadProfile();

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

        $scope.addHour = function () {
          if($scope.profile.hours !== 'undefined'){
              $scope.profile.hours[$scope.profile.hours.length] = "";
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
