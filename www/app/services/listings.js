define([
  'app',
  'services/data'
], function (app) {
  'use strict';

  app.service('listingService', [
    '$q',
    '$timeout',
    'dataService',
    function ($q, $timeout, dataService) {

      function check(show) {
        return show;
      }


      this.search = function (searchString) {
        var events = dataService.listings,
            deferred = $q.defer(),
            founds = [],
            currentEvent,
            i = 0;

        for (i; i < events.length; i = i + 1) {
          currentEvent = events[i];
          if (currentEvent.name && currentEvent.name.indexOf(searchString) !== -1 || currentEvent.desc && currentEvent.desc.indexOf(searchString) !== -1) {
            if (check(currentEvent.show)) {
              currentEvent.thumb = 'http://lorempixel.com/200/200/sports/?' + ((new Date()).getTime() + i);
              founds.push(currentEvent);
            }
          }
        }
        // simulate asynchronous requests
        $timeout(function () {
          deferred.resolve(angular.copy(founds));
        }, 2000);

        return deferred.promise;
      };


       this.searchByOwner = function (ownerID) {
        var events = dataService.listings,
            deferred = $q.defer(),
            founds = [],
            currentEvent,
            i = 0;

        console.log('ownerID');
        for (i; i < events.length; i = i + 1) {
          currentEvent = events[i];
                    console.log(currentEvent.ownerID );

          if (currentEvent.parentID == ownerID) {
            if (check(currentEvent.show)) {
                                  console.log(currentEvent);

              currentEvent.thumb = currentEvent.imageURL;
              founds.push(currentEvent);
            }
          }
        }
        // simulate asynchronous requests
        $timeout(function () {
          deferred.resolve(angular.copy(founds));
        }, 2000);

        return deferred.promise;
      };

      this.getNext = function () {
        var deferred = $q.defer(),
            events = [],
            i = 0;

        for (i; i < dataService.events.length; i = i + 1) {
          if (i === 5) {
            break;
          }
          dataService.events[i].thumb = 'http://lorempixel.com/200/200/sports/?' + ((new Date()).getTime() + i);
          events.push(dataService.events[i]);
        }

        $timeout(function () {
          deferred.resolve(events);
        }, 1000);

        return deferred.promise;
      };

      this.getOne = function (id) {
        var deferred = $q.defer(),
            event,
            i = 0;

        for (i; i < dataService.events.length; i = i + 1) {
          if (dataService.events[i].id.toString() === id.toString()) {
            event = angular.copy(dataService.events[i]);
            event.image = 'http://lorempixel.com/620/480/sports/?' + ((new Date()).getTime() + i);
            break;
          }
        }

        $timeout(function () {
          if (event) {
            deferred.resolve(event);
          } else {
            deferred.reject();
          }
        }, 1000);

        return deferred.promise;
      };


      this.getOneListing = function (id) {
        var deferred = $q.defer(),
            event,
            i = 0;

        for (i; i < dataService.events.length; i = i + 1) {
          if (dataService.events[i].id.toString() === id.toString()) {
            event = angular.copy(dataService.events[i]);
            event.image = 'http://placehold.it/100x100';
            break;
          }
        }

        $timeout(function () {
          if (event) {
            deferred.resolve(event);
          } else {
            deferred.reject();
          }
        }, 1000);

        return deferred.promise;
      };




    }
  ]);
});
