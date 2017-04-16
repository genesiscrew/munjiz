define([
  'app',
<<<<<<< HEAD
  
], function (app) {
  'use strict';

  app.controller('DashboardCtrl', [
    '$scope',
    '$state',
    '$ionicNavBarDelegate',
    function ($scope, $state, $ionicNavBarDelegate) {
=======
  ], function (app) {
    'use strict';

    app.controller('DashboardCtrl', [
      '$scope',
      '$state',
      '$ionicNavBarDelegate',
      function ($scope, $state, $ionicNavBarDelegate) {
>>>>>>> master

        $ionicNavBarDelegate.showBackButton(false);

        $scope.apiKey = 'AIzaSyBLn2Bi6M50mbmml_uq-jzcZKDMKR_OyTY';
        $scope.height = window.screen.height;
        $scope.width = window.screen.width;
        $scope.search = {};
<<<<<<< HEAD
             
    }
  ]);
});
=======

      }
      ]);
  });
>>>>>>> master
