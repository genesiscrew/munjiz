define([
  'app',

  ], function (app) {
    'use strict';

  // the run blocks
  app.run([
    '$ionicPlatform',
    // 'parse-starter.controllers', 
    // 'parse-starter.factories',
    function ($ionicPlatform) {


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


        Parse.initialize("uvQmMNsdZStxEvEfMeMdrH85sGW7wKMl8Ms2Bm0j", "YHcdSEyXhQ8qX0vykcFCerM4rQmajQG22iu44BvT");


        // Testing parse code below


        // var PeopleObject = Parse.Object.extend("PeopleObject");
        // var person = new PeopleObject();
        // person.set("name", "Adam");
        // person.save(null, {});

      });
    }
    ]);

});
