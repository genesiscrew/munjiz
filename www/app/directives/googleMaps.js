
define([
    'app',
    'services/user'
], function (app) {
    //'use strict';

    app.directive('googleMap', [
        '$state',
        '$window',
        'userService',
        '$ionicPopup',
        '$rootScope',




        function ($state, $window, userService, $ionicPopup, $rootScope) {
            return {
                scope: {
                  //  events: '=',
                    apiKey: '@',


                },
                restrict: 'A',
                replace: true,
                transclude: false,

                link: function (scope, element) {
                    var counter = 0,
                        map,
                        mapsMarker,
                        gmarkers = [],
                        object,
                        object2,
                        mylat,
                        mylong,
                        //eventsReady = false,
                        searchedItem;
 console.log(" we are inside map");

                    function addClick(marker) {
                        $window.google.maps.event.addListener(marker, 'click', function () {
                            var userPopup = $ionicPopup.alert({
                                okText: "GOT IT!",
                                buttons: [
                                    {
                                        text: "chat",
                                        type: "button-default",
                                        onTap: function (e) {

                                            console.log(marker.userID);
                                            $rootScope.userID = marker.userID;
                                            $state.go('chat');
                                        }


                                    }


                                ]
                            });
                        });
                    }





                    // this function adds markers on the map only for the users who have items matching the search, not sure but
                    // maybe can apply lazy loading here as well? thoughts?

                    function makeMarkers() {





                        eventsReady = true;

                        var i = 0;

                        var query = new Parse.Query('Listings');
                        query.include('parent');
                        query.find({
                            success: function (results) {

                                // Do something with the returned Parse.Object values
                                for (var i = 0; i < results.length; i++) {
                                    object = results[i];
                                    object2 = object.get('parent');
                                    // code below draws marker for all users in DB except for logged in user.
                                    if (Parse.User.current().id != object2.id && object.get('title') == searchedItem) {
                                        console.log("marker added");
                                        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
                                        mapsMarker = new $window.google.maps.Marker({
                                            position: new $window.google.maps.LatLng(object2.get('lat'), object2.get('long')),
                                            map: map,

                                            icon: image,
                                            clickable: true
                                        });
                                        gmarkers.push(mapsMarker);
                                        addClick(mapsMarker);

                                    }

                                }

                            },
                            error: function (error) {
                                alert("Error: " + error.code + " " + error.message);
                            }
                        });




                    }
                    // this function adds markers on the map only for all users in DB, would need to be modified to 
                    // be a lazy loading of some sort since we dont want to load all the users but only those inside the 
                    // part of map that is showing, hence TODO: lazy loading

                    function makeMarkersforUsers() {

                        //if (eventsReady || !scope.events) {
                        //  return;
                        //}

                        eventsReady = true;

                        var i = 0;

                        var query = new Parse.Query('User');
                        //query.include(' parent');
                        query.find({
                            success: function (results) {
                                // Do something with the returned Parse.Object values
                                for (var i = 0; i < results.length; i++) {
                                    object = results[i];


                                    // code below draws marker for all users in DB except for logged in user.

                                    if (Parse.User.current().id != object.id) {
                                        // alert(Parse.User.current().id);

                                        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
                                        mapsMarker = new $window.google.maps.Marker({
                                            position: new $window.google.maps.LatLng(object.get('lat'), object.get('long')),
                                            map: map,

                                            icon: image,
                                            clickable: true,
                                            userID: object.id

                                        });
                                        gmarkers.push(mapsMarker);
                                        addClick(mapsMarker);

                                    }

                                }

                            },
                            error: function (error) {
                                alert("Error: " + error.code + " " + error.message);
                            }
                        });


                    }


                    function removeMarkers() {
                        for (i = 0; i < gmarkers.length; i++) {
                            gmarkers[i].setMap(null);
                        }
                    }

                    function makeMapAndMarkers() {
                        console.log("making map");

                        var mapOptions = {
                            zoom: 13,
                            disableDefaultUI: true
                        };
                        if (!map) {
                            map = new $window.google.maps.Map(element[0], mapOptions);
                            // add a keyboard listener to the map, this probably needs to be modified for mobile use
                            // since key pressed would be different than ENTER
                            google.maps.event.addDomListener(document, 'keyup', function (e) {
                                var div = document.getElementById('search').value

                           

                                var code = (e.keyCode ? e.keyCode : e.which);

                                if (code == 13) {
                                    if (searchedItem != div) {
                                        searchedItem = div;
                                        console.log("search function working");
                                        // here we remove the markers, and redraw them based on new search
                                        removeMarkers();
                                        makeMarkers();

                                    }



                                }


                            });


                            if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (pos) {

                                var myloc = new google.maps.Marker({

                                    clickable: false,
                                    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                        new google.maps.Size(22, 22),
                                        new google.maps.Point(0, 18),
                                        new google.maps.Point(11, 11)),
                                    shadow: null,
                                    zIndex: 999,
                                    map: map
                                });



                                var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                                mylat = pos.coords.latitude;
                                mylong = pos.coords.longitude;
                                // set fields of lat and long in user DB
                                Parse.User.current().set("lat", mylat);
                                Parse.User.current().set("long", mylong);
                                Parse.User.current().save();
                                map.setCenter(me);
                                myloc.setPosition(me);
                            }, function (error) {
                                // ...
                            });
                        }


                        if (Parse.User.current()) {
                            makeMarkersforUsers();
                        }

                    }

                    //load google maps api script async, avoiding 'document.write' error
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
                        window.alert("inject google");
                    } else {
                        makeMapAndMarkers();


                    }
                }
            };
        }
    ]);
});