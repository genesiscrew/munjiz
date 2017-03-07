define([
  'app',
  'services/user'

  ], function (app) {
    'use strict';
    Parse.initialize("uvQmMNsdZStxEvEfMeMdrH85sGW7wKMl8Ms2Bm0j", "YHcdSEyXhQ8qX0vykcFCerM4rQmajQG22iu44BvT", "0gauJiwUIqjTabTNOOZEcgE17wGxFyKtPq8g40sm", "z4wnNa2HnXgPly14Z3sDzxl8LDlMwj6WroUMuamT");
    Parse.serverURL = 'https://parseapi.back4app.com/';

    var pubnub;
    console.log("about to run the app");
    // the run blocks
    app.factory('PubNubService', function() {
      pubnub = null;
      var authKey = PUBNUB.uuid();

      console.log("pubnub id is: " + authKey);

      pubnub = PUBNUB.init({
        publish_key: 'pub-c-30d2f626-ff6d-4379-bad2-a2513d33a646',
        subscribe_key: 'sub-c-4b18eb38-e884-11e6-81cc-0619f8945a4f',
        auth_key: authKey,
        origin: 'pubsub.pubnub.com',
        ssl: false
      });
      console.log("pubnub created");
      return pubnub;

    })
    .run([
      '$ionicPlatform',
      '$state',
      'userService',
      '$rootScope',


      function ($ionicPlatform, $state, userService, $rootScope) {


        $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        $rootScope.start= false;
        $rootScope.pubnub = pubnub;


          // FB authentication

            // UI Router Authentication Check
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
              if (!Parse.User.current()) {
                // User isn’t authenticated
                $state.transitionTo("login");
                event.preventDefault(); 
              }
            });

     });


      }
      ]);

  });
