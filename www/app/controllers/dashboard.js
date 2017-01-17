define([
  'app',
  'services/event',
  
], function (app) {
  'use strict';

  app.controller('DashboardCtrl', [
    '$scope',
    '$state',
    'eventService',
    '$ionicNavBarDelegate',
    function ($scope, $state, eventService, $ionicNavBarDelegate) {

       $ionicNavBarDelegate.showBackButton(false);

        $scope.apiKey = 'AIzaSyAvdX3YgqPd5prRV8OzvwnpuXrcySuK27c';
        $scope.height = window.screen.height;
        $scope.width = window.screen.width;
        $scope.search = {};
        $scope.makeMarkings = function () {


            if ($scope.search.string) {
                $scope.searching = $scope.search.string;
                
            }
            
            
           // $scope.searching = ;
        }



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
