define([
  'app',
  // Load Controllers here
  'controllers/app',
  'controllers/dashboard',
  'controllers/results',
  'controllers/profile',
   'controllers/listing'
], function (app) {
  'use strict';
  // definition of routes
  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      // url routes/states
      $urlRouterProvider.otherwise('dashboard');

      $stateProvider
        // app states
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'app/templates/dashboard.html',
          controller: 'DashboardCtrl'
        })
        .state('results', {
          url: '/results/:search/:satTrans/:wheelChair/:wheelChairLift',
          controller: 'ResultsCtrl',
          templateUrl: 'app/templates/results.html'
        })
        .state('profile', {
          url: '/profile/:id',
          controller: 'ProfileCtrl',
          templateUrl: 'app/templates/profile.html'
        })

        .state('listing', {
          url: '/listing/:id',
          controller: 'ListingCtrl',
          templateUrl: 'app/templates/listing.html'
        });
    }
  ]);
});
