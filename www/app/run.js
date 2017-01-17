define([
  'app',
  'services/user'

  ], function (app) {
    'use strict';

  // the run blocks
  app.run([
    '$ionicPlatform',
    '$state',
    'userService',

    // 'parse-starter.controllers', 
    // 'parse-starter.factories',
    function ($ionicPlatform, $state, userService) {


      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        // if (window.cordova && window.cordova.plugins.Keyboard) {
        //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //   cordova.plugins.Keyboard.disableScroll(true);
        // }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        console.log("about to initialize parse");
        Parse.initialize("uvQmMNsdZStxEvEfMeMdrH85sGW7wKMl8Ms2Bm0j", "YHcdSEyXhQ8qX0vykcFCerM4rQmajQG22iu44BvT", "0gauJiwUIqjTabTNOOZEcgE17wGxFyKtPq8g40sm", "z4wnNa2HnXgPly14Z3sDzxl8LDlMwj6WroUMuamT");
        Parse.serverURL = 'https://parseapi.back4app.com/';
        //Parse.FacebookUtils.init();


        if (Parse.User.current()) {
          userService.username = Parse.User.current().get('username');
          
            //console.log(Parse.User.current().get('username'));
            
            $state.go('dashboard');
          }else{
            $state.go('login');
          }

        });
    }
    ]);

});
