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
});
