define([
    'app',




], function (app) {
    'use strict';

    app.controller('TrackingCtrl', [
        '$scope',
        '$state',
        '$ionicPopup',
        '$rootScope',
        'PubNubService',
        'md5',
        '$ionicScrollDelegate',
        '$timeout',
        'ShareFactory',

        function ($scope, $stateParams, $ionicPopup, $rootScope, PubNubService, md5, $ionicScrollDelegate, $timeout, ShareFactory) {



            //window.onload = function () {

            // $(document).ready(function () {
            // Initialize the PubNub API connection.
            var message1 = "";
            var deliveryName = 'chat';
            var user;
            var foundDelivery = false;
            var pubnub = PubNubService;
            var historyCount = 0;

            $scope.number = '';
            $scope.$watch('number', function (newValue, oldValue) {
                if (newValue !== oldValue) ShareFactory.setValue(newValue);
            });

            $scope.$on("$ionicView.afterEnter", function (event) {
                console.log("entered chat");

                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom();
                });
                var query = new Parse.Query('Deliveries');
                //query.include(' parent');
                query.equalTo("delivery_name", deliveryName);
                query.first({
                    success: function (results) {
                        if (results.get('delivery_from') == Parse.User.current().id) {
                            results.set("chat_from_online", true);
                            results.save();
                        }
                        else {
                            results.set("delivery_to_online", true);
                            results.save();
                        }

                    }
                });

            });


            $scope.$on("$ionicView.leave", function (event) {
                var query = new Parse.Query('Deliveries');
                //query.include(' parent');
                query.equalTo("delivery_name", deliveryName);
                query.first({
                    success: function (results) {
                        console.log("great grea success");
                        if (results.get('chat_from') == Parse.User.current().id) {
                            results.set("chat_from_online", false);
                            results.save();
                        }
                        else {
                            results.set("chat_to_online", false);
                            results.save();
                        }

                    }
                });

            });





            if ($rootScope.userID) {
                var x = $rootScope.userID;
                var y = Parse.User.current().id;
                var z = $rootScope.deliveryBy;

                if (x > y) {
                    deliveryName = x + z + y;

                    // we updload history using the deliveryName we just created
                    getHistory();
                    var query = new Parse.Query('Deliveries');
                    //query.include(' parent');
                    query.find({
                        success: function (results) {
                            // Do something with the returned Parse.Object values
                            foundDelivery = false;
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];
                                if (deliveryName == object.get('delivery_name')) {
                                    foundDelivery = true;
                                    // if chat room exists, we check history count of messages in parse with pubnub
                                    updateHistoryCount();

                                }

                            }
                            if (!foundDelivery) {
                                createdeliveryName();

                            }

                        }
                    });

                }
                else {
                    deliveryName = y + z + x;

                    getHistory();
                    var query = new Parse.Query('deliveryNames');
                    //query.include(' parent');
                    query.find({
                        success: function (results) {
                            // Do something with the returned Parse.Object values
                            foundDelivery = false;
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];
                                if (deliveryName == object.get('delivery_name')) {
                                    foundDelivery = true;
                                    updateHistoryCount();

                                }

                            }
                            if (!foundDelivery) {
                                createDelivery();

                            }

                        }
                    });
                }

            }
            else {
                //console.log("no user found");

            }


            // console.log(pubnub.uuid());
            var messageReceived = {};
            var existingListener;

            //var md =  md5.createHash('hamid' || '');



            if (!$rootScope.start) {
                // Initialize the PubNub service
               // console.log("pubnub initialized");
                //pubnub = PubNub.getPub();




                $rootScope.start = true;
            }

    


            function createDelivery() {
                // chat room does not exist so we set up new chat room in DB

                var query = new Parse.Query('User');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];

                            if ($rootScope.userID == object.id) {
                                var delivery = Parse.Object.extend("Deliveries");
                                var newChat = new delivery();
                                newChat.set("deliver_from", Parse.User.current().id);
                                newChat.save();
                                newChat.set("delivery_to", object.id);
                                newChat.save();
                                newChat.set("delivery_by", $rootScope.deliveryBy);
                                newChat.save();
                                newChat.set("delivery_from_name", Parse.User.current().get("firstName"));
                                newChat.save();

                                newChat.set("delivery_to_name", object.get("firstName"));
                                newChat.save();
                                newChat.set("delivery_name", deliveryName);
                                newChat.set("HistoryCountMe", 0);
                                newChat.save();
                                newChat.set("HistoryCountTo", 0);
                                newChat.save();

                            }
                        }

                    }
                });



            }
            function deliveryNameExists() {


                var query = new Parse.Query('deliveryNames');
                //query.include(' parent');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values
                        foundDelivery = false;
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            if (deliveryName == object.get('chat_name')) {
                                foundDelivery = true;

                            }

                        }
                        if (!foundDelivery) {

                        }

                    }
                });
            }
// Google maps code
app.directive('googleMap', [
    '$state',
    '$window',
    'userService',
    '$ionicPopup',
    '$rootScope',
    'IonicClosePopupService',
    'PubNubService',
    function ($state, $window, userService, $ionicPopup, $rootScope, IonicClosePopupService,PubNubService) {
      return {
        restrict: 'A',
        scope: {
          apiKey: '@',
          model: '=ngModel',
        },

        link: function (scope, element, attrs) {
          var counter = 0,
            map,
            gmarkers = [], // List of marker
            searchedItem,
            lineCoords = [],
            lat,
            long,
            mark,
            pnChannel = "map-channel",
            pubnub = PubNubService;

            pubnub.subscribe({
              channel: pnChannel,
              withPresence: true,
              callback: function (m) {
                  handleMessage(m);

              },
              presence: function (presenceEvent) {
              }


          });
          function handleMessage(message) {
            redraw(message);
          };

         

          // Watches the text box, on change it updates the matching results
          scope.$watch('model', function (value) {
            searchedItem = value;
            findListingsAndDisplay();
          });


          // Alert for when an event is clicked
          function addClickListener(marker) {
            $window.google.maps.event.addListener(marker, 'click', function () {
              showPopup(marker);
            });
          }


          // Returns an array of the size num
          function getNumber(num) {
            return new Array(num);
          }


          var redraw = function(payload) {
            
            if (payload.lat != null) {
            
            var lat = payload.lat;
            var lng = payload.lng;
          
            
            map.setCenter({lat:lat, lng:lng, alt:0});
            if (mark != null) {
              mark.setMap(null);

            }
            mark = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
            gmarkers.push(mark);
            
            mark.setPosition({lat:lat, lng:lng, alt:0});
            lineCoords.push(new google.maps.LatLng(lat, lng));
            var lineCoordinatesPath = new google.maps.Polyline({
              path: lineCoords,
              geodesic: true,
              strokeColor: '#2E10FF'
            });
            
            lineCoordinatesPath.setMap(map);
            
          };
          };


          function calculateRatings(rating) {
            // Calc full star ratings
            var ratingFloor = Math.floor(rating);
            scope.full_stars = getNumber(ratingFloor);

            // Calc half star and outline ratings
            scope.half_stars = rating - ratingFloor;
            if (scope.half_stars >= 0.5) {
              // there is a half rating
              scope.half_stars = getNumber(1);
              scope.outline_stars = getNumber(5 - 1 - ratingFloor);
            } else {
              // no half rating
              scope.half_stars = getNumber(0);
              scope.outline_stars = getNumber(5 - ratingFloor);
            }
          }


          // Shows a popup when a user clicks on a listing
          function showPopup(marker) {
            scope.marker = marker;
            calculateRatings(marker.rating);

            var template =
              '<div class="row no-padding">' +
              '<span align="left" class="col col-30 no-padding"> <p>Rating: </p> </span>' +
              '<div ng-repeat="i in full_stars track by $index"> <i class = "icon icon ion-ios-star star-icon"></i> </div>' +
              '<div ng-repeat="i in half_stars track by $index"> <i class = "icon icon ion-ios-star-half star-icon"></i> </div>' +
              '<div ng-repeat="i in outline_stars track by $index"> <i class = "icon icon ion-ios-star-outline star-icon"></i> </div>' +
              '</div>' +
              '<p class="popup-price-text"> Price : {{marker.price}} </p>' +
              '<p class="popup-desc-text"> {{marker.desc}} </p>' +

              '<style>.popup-title { color: black; } ' +
              '.star-icon{ color: black; font-size: 20px;} ' +
              'p{color: #000 !important; text-align: left;} ' +
              '.no-padding{padding: 0px;} </style>';

            if (marker.ready) {
              template += '<style>.popup-head{background-color : green;}</style>';
            } else {
              template += '<style>.popup-head{background-color : orange;}</style>';
            }

            var popup = $ionicPopup.show({
              template: template,
              title: marker.title,
              scope: scope,
              buttons: [
                {
                  text: 'Profile',
                  type: "button-light",
                  onTap: function (e) {
                    $rootScope.userID = marker.userId;
                    goToProfile(marker.userId);
                  }
                },
                {
                  text: "Listing",
                  type: "button-positive",
                  onTap: function (e) {
                    goToListing(marker.id);
                  }
                }
              ]
            });
            IonicClosePopupService.register(popup);
          }


          // This function adds markers on the map only for the users who have items matching the search
          function findListingsAndDisplay() {
            // Find listings
            var listingQuery = new Parse.Query('Listings');
            listingQuery.include('parent');

            // If the user has specified search params then we want to include it in the search
            if (typeof searchedItem != 'undefined' && searchedItem.length != 0) {
              listingQuery.contains("title", searchedItem);
            }

            // Near user
            var userQuery = new Parse.Query(Parse.User);
            userQuery.near("location", Parse.User.current().get("location"));

            // Limit to 100, and ensure they are near the user
            listingQuery.limit(100);
            listingQuery.matchesQuery("parent", userQuery);

            listingQuery.find({
              success: function (listings) {
                showListings(listings);
              }
            });
          }


          // Shows the listings on the map from a query
          function showListings(listings) {
            removeMarkers();

            // For every listings
            for (var i = 0; i < listings.length; i++) {
              var listing = listings[i];
              var parent = listing.get('parent');

              // Make a new marker
              var mapsMarker = new $window.google.maps.Marker({
                position: new $window.google.maps.LatLng(parent.get('location').latitude, parent.get('location').longitude),
                map: map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                clickable: true,
                userId: parent.id,
                title: listing.get("title"),
                price: listing.get("price"),
                desc: listing.get("desc"),
                id: listing.id,
                ready: listing.get("ready"),
                rating: parent.get("ratingsAverage")
              });

              gmarkers.push(mapsMarker);
              addClickListener(mapsMarker);
            }
          }


          // Go to the selected users profile
          function goToProfile(objectId) {
            $state.go("profile", {id: objectId});
          }

          // Go to the selected listing
          function goToListing(objectId) {
            $state.go("listing", {id: objectId});
          }


          // Remove all the markers on screen
          function removeMarkers() {
            for (i = 0; i < gmarkers.length; i++) {
              gmarkers[i].setMap(null);
            }
          }

          


          // Make the map
          function makeMapAndMarkers() {

            var mapOptions = {
              zoom: 13,
              disableDefaultUI: true
            };

            if (!map) {
              map = new $window.google.maps.Map(element[0], mapOptions);
           
            }
          }

          // Load google maps api script async, avoiding 'document.write' error
          function injectGoogle() {
            var cbId,
              wf,
              s,
              apiKey;

            //callback id
            cbId = '_gmap_' + counter;
            $window[cbId] = makeMapAndMarkers;
            apiKey = 'key=' + scope.apiKey + '&';


            wf = document.createElement('script');
            wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
              '://maps.googleapis.com/maps/api/js?' + apiKey + 'v=3&callback=' + cbId;
            wf.type = 'text/javascript';
            wf.async = 'true';
            document.body.appendChild(wf);
          }

          if (!$window.google) {
            counter += 1;
            injectGoogle();
            findListingsAndDisplay();
            setInterval(function() {
              if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (pos) {
                $rootScope.latitude  = pos.coords.latitude;
                $rootScope.longtitude = pos.coords.longitude;
                pubnub.publish({channel:deliveryName, message:{lat:$rootScope.latitude, lng:$rootScope.longtitude}});
              });
              
              
            }, 5000); 
          } else {
            StyleMap();
            makeMapAndMarkers();
           /* setInterval(function() {
              $rootScope.latitude +=  0.001;
              $rootScope.longtitude += 0.01;
              pubnub.publish({channel:pnChannel, message:{lat:$rootScope.latitude, lng:$rootScope.longtitude}});
            }, 5000); */


          }
        }
      };


    }
  ])
  ;


   
          






           

           


          






          


          
            // Also send a message when the user hits the enter button in the text area.
            /* messageContent.bind('keydown', function (event) {
                  if ((event.keyCode || event.charCode) !== 13) return true;
                  sendMessageButton.click();
                  return false;
              });
 
 
*/



            // });


        }
        //}
    ]);
});