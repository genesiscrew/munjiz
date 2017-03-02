define([
  'app',
  'directives/googleMaps'
], function (app) {
  'use strict';

  app.controller('ResultsCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$timeout',
    '$ionicHistory',
    function ($scope, $stateParams, $state, $timeout, $ionicHistory) {
      var first = true;
      $scope.apiKey = 'AIzaSyCFWBnX_93y1BDsgY2UR2urgt9E79bDQwM';
      $scope.limit = 10;
      $scope.show = {
        list: false
      };


      $scope.reload = function () {
        $scope.loading = true;
        $scope.loading = false;

      };

      $scope.goToMap = function () {
        $ionicHistory.currentView($ionicHistory.backView());
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('results.map', {
          search: $scope.string,
          wheelChair: $scope.wheelChair,
          wheelChairLift: $scope.wheelChairLift
        });
      };
      $scope.goToList = function () {
        $ionicHistory.currentView($ionicHistory.backView());
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('results.list', {
          search: $scope.search,
          wheelChair: $scope.wheelChair,
          wheelChairLift: $scope.wheelChairLift
        });
      };
    }
  ]);
});
