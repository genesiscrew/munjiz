define([
    'app',
    'services/page',
    'services/user'
], function (app) {
    'use strict';

    app.controller('DeliveryCtrl', [
        '$scope',
        '$state',
        '$ionicPopup',
        '$rootScope',
        'PubNubService',
        '$sce',
        '$ionicLoading',
        '$state',
        '$timeout',
        '$http',
        function ($scope, $stateParams, $ionicPopup, $rootScope, PubNubService, $sce, $ionicLoading, $state, $timeout, $http) {

            $scope.messages = [];
            var messaging = [];
            var deliveryname;
            var deliveryBy;
            var deliveryFrom;
            var deliveryTo;
            var userName = "";
            var deliveries = [];
            var pubnub = PubNubService;
            var historyCountMe = 0;
            var historyCountFrom = 0;
            var loading = true;

             var table = document.getElementById('wow').outerHTML;
             console.log(table);
         

            var userID = Parse.User.current().id;


            // Setup the loader
             $ionicLoading.show({
                   content: '',
                   animation: 'fade-in',
                   showBackdrop: false,
                   maxWidth: 100,
                   showDelay: 0,
                   duration: 1000
               });
   
   

            var notifyState = function (state, callback) {


                setTimeout(function () {
                    /* Do something */
                    if (callback) {

                        callback();
                    }
                }, 0);
                loading = false;
            }



            var InitializeCode = function () {
                var woh = "fuck";
                messaging = [];
                $scope.messages = [];
                historyCountMe = 0;
                historyCountFrom = 0;
                deliveries = [];
                var query = new Parse.Query('Deliveries');
                //query.include(' parent');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values

                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];

                            if (userID == object.get('delivery_from') || userID == object.get('delivery_to')) {
                                //   console.log("user belongs to this chat room");
                                deliveryname = object.get('delivery_name');
                             
                                //    while (!chatname) {
                                //      getHistory();
                                //    console.log(" historical difference is: " + checkHistoryCount());
                                //}

                                deliveryFrom;
                                if (userID == object.get('delivery_from')) {
                                    deliveryBy = object.get('delivery_by');
                                    deliveryTo = object.get('delivery_to');
                                    userName = object.get('delivery_to_name');
                                }
                                else {
                                    deliveryBy = object.get('delivery_by');
                                    deliveryTo = object.get('delivery_from');
                                    userName = object.get('delivery_from_name');
                                }

                                var message = { deliveryID: deliveryname, deliveryBy: deliveryBy, 
                                    deliveryTo: deliveryTo, username: userName};
                                // console.log(message);
                                var a = deliveries.indexOf(deliveryname);
                                if (a == -1) {
                                    deliveries.push(deliveryname);

                                    messaging.push(message);

                                    // $scope.messages = messaging;
                                    // $scope.messages.push(message);
                                    // console.log("updating message listtttt");
                                    //$scope.$apply();
                                }


                            }

                        }

                        $scope.messages = messaging;
                        //console.log(woh);
                        // console.log("mtherfucking message length " + messaging.length);
                        

                    }

                });



            };



           


            InitializeCode();




          





          






        }

    ]);
});