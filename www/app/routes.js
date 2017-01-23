define([
  'app',
  // Load Controllers here
  'controllers/app',
  'controllers/dashboard',
  'controllers/results',
  'controllers/profile',
  'controllers/listing',
  'controllers/chat',
  'controllers/login',
  'controllers/new_listing',
  'controllers/edit_profile',


], function (app) {
  'use strict';
  // definition of routes
  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      // url routes/states
      $urlRouterProvider.otherwise('/login');

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

        .state('edit_profile', {
          url: '/edit_profile/',
          controller: 'EditProfileCtrl',
          templateUrl: 'app/templates/edit_profile.html'
        })

        .state('listing', {
          url: '/listing/:id',
          controller: 'ListingCtrl',
          templateUrl: 'app/templates/listing.html'
        })

        .state('chat', {
          url: '/chat/:senderID/:recieverID',
          controller: 'AppCtrl',
          templateUrl: 'app/templates/chat.html'
        })

        .state('new_listing', {
          url: '/new_listing',
          controller: 'NewListingCtrl',
          templateUrl: 'app/templates/new_listing.html'
        })

        .state('login', {
          url: '/login',
          controller: 'LoginCtrl',
          templateUrl: 'app/templates/login.html'
        });


        
    }
  ]);
});
