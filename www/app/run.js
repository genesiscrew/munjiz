define([
  'app',
  'services/user'

], function (app) {
  'use strict';
  var pubnub;

  app
    .run([
      '$ionicPlatform',
      '$state',
      'userService',
      '$rootScope',
      function ($ionicPlatform, $state, userService, $rootScope) {

        Parse.initialize("uvQmMNsdZStxEvEfMeMdrH85sGW7wKMl8Ms2Bm0j", "YHcdSEyXhQ8qX0vykcFCerM4rQmajQG22iu44BvT", "z4wnNa2HnXgPly14Z3sDzxl8LDlMwj6WroUMuamT");
        Parse.serverURL = 'https://parseapi.back4app.com/';

        // Called when Ionic is ready.
        // Sets the keyboard, checks when the user isnt auth. and manages the users messages when < 0.
        $ionicPlatform.ready(function () {
          $rootScope.start = false;

          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs) TODO get working
          // if (window.cordova && window.cordova.plugins.Keyboard) {
          //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          //   cordova.plugins.Keyboard.disableScroll(true);
          // }
          if (window.StatusBar) {
            StatusBar.styleDefault();
          }


          // Checks to see when the user isn't authenticated on a state change
          // If they aren't then it takes them to the login page
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (!Parse.User.current()) {
              // User isn’t authenticated take them to the login page
              $state.transitionTo("login");
              event.preventDefault();
            }
          });


          if (Parse.User.current()) {
            // Logged in
            userService.username = Parse.User.current().get('username');

            if (Parse.User.current().get('total_unread') <= 0) {
              $rootScope.totalMessages = 0;
            }

            // Go straight to dashboard
            $state.go('dashboard');

          } else {
            // Not logged in
            $state.go('login');
          }

        });
      }
    ])

    // Pubnub service TODO description
    .factory('PubNubService', function () {
      pubnub = null;
      pubnub = PUBNUB.init({
        publish_key: 'pub-c-30d2f626-ff6d-4379-bad2-a2513d33a646',
        subscribe_key: 'sub-c-4b18eb38-e884-11e6-81cc-0619f8945a4f',
        origin: 'pubsub.pubnub.com',
        ssl: false,
      });
      return pubnub;
    })


    // TODO description
    .factory('ShareFactory', function () {
      var data = {
        number: ''
      };
      return {
        setValue: function (number) {
          data.number = number;
        },
        getValue: function () {
          return data.number;
        }
      };
    })
});

