define([
  'app'
  ], function (app) {
    'use strict';

    app.service('dataService', [
      function () {

      // THE SIDE MENU ITEMS

      this.pages = [{
        alias: 'dashboard',
        title: 'Find',
        icon: 'ion-search'
      }, {
        alias: 'messages',
        title: 'Messages',
        icon: 'ion-email-unread'
      }

      ];

    }
    ]);



    app.factory('Camera', [
      function($q) {

       return {
        getPicture: function(options) {
         var q = $q.defer();

         navigator.camera.getPicture(function(result) {
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);

         return q.promise;
       }
     };
   }
   ]);

  });




});
