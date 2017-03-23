define([
  'app',
  // Load Controllers
  'controllers/app',
  'controllers/dashboard',
  'controllers/profile',
  'controllers/listing',
  'controllers/messages',
  'controllers/chat',
  'controllers/login',
  'controllers/new_listing',
  'controllers/edit_profile',

], function (app) {
  'use strict';

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      
      // Default route if not found
      $urlRouterProvider.otherwise('/login');

      $stateProvider

        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'app/templates/dashboard.html',
          controller: 'DashboardCtrl'
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
          cache: false,
          controller: 'ChatCtrl',
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
        })

        .state('messages', {
          url: '/messages',
          cache: false,
          reload: true,
          controller: 'MessageCtrl',
          templateUrl: 'app/templates/messages.html'
        });

    }
  ]);
});
