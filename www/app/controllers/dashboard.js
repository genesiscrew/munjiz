define([
  'app',
  
  
], function (app) {
  'use strict';

  app.controller('DashboardCtrl', [
    '$scope',
    '$state',
    'eventService',
    '$ionicNavBarDelegate',
    function ($scope, $state, eventService, $ionicNavBarDelegate) {

        $ionicNavBarDelegate.showBackButton(false);

        $scope.apiKey = 'AIzaSyBLn2Bi6M50mbmml_uq-jzcZKDMKR_OyTY';
        $scope.height = window.screen.height;
        $scope.width = window.screen.width;
        $scope.search = {};
        $scope.listview = false;
        
       
  $scope.toggleList = function() {
        $scope.listView = $scope.listView === false ? true: false;
    };

        
      // code below belong to template and is not currently being used
      $scope.goToList = function () {
        $state.go('results', {
          search: $scope.search.string,
          satTrans: $scope.search.satTrans,
          wheelChair: $scope.search.wheelChair,
          wheelChairLift: $scope.search.wheelChairLift
        });
      };

      $scope.loadNext = function () {
        eventService.getNext().then(function (events) {
          $scope.events = events;
        }).finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };
    }
  ]);
});