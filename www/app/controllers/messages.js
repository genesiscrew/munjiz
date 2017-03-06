define([
    'app',
    'services/page',
    'services/user'
], function (app) {
    'use strict';

    app.controller('MessageCtrl', [
        '$scope',
        '$state',
        '$ionicPopup',
        '$rootScope',
        'PubNubService',

        function ($scope, $stateParams, $ionicPopup, $rootScope, PubNubService) {

            $scope.messages = [];
            var messaging = [];
            var chatname;
            var chatFrom
            var userName = "";
            var chats = [];
            var pubnub = PubNubService;
            var historyCount;

            var userID = Parse.User.current().id;

            function getHistories() {
                for (var i = 0; i < messaging.length; i++) {
                    var history = messaging[i].chatID;
                    //messaging[i].history  = getHistory(history);
                    getHistory(history);
                }

            }

            function getUser(chat) {
                for (var i = 0; i < messaging.length; i++) {
                    if (messaging[i].chatID == chat) {
                        return i;
                    }
                }

            }

            function getHistory(history) {
                // console.log("getting history");
                //   console.log("the current chat rooom is:" + history);
                var count = 0;

                pubnub.history({
                    channel: history,
                    count: 1000000,
                    callback: function (messages) {
                        messages[0].forEach(function (m) {
                            // console.log("messages as: " + m.text);
                            count++;
                            //$scope.messages.push(m);
                        });
                        messaging[getUser(history)].history = count;
                        //console.log("history count  for" + messaging[getUser(history)].chatID + "is: " + messaging[getUser(history)].history );

                    }
                });
                return count;
            }

            function checkHistoryCount() {

                var query = new Parse.Query('ChatRooms');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values

                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            var chatRoomFound = getUser(object.get('chat_name'));
                            if (chatRoomFound) {
                                var historicalCount = object.get('HistoryCount');
                                if (messaging[chatRoomFound] != historicalCount) {
                                    console.log("we have a new motherfucking message, histories dont match");
                                    //return historicalCount - historyCount;
                                    messaging[chatRoomFound].newMessageCount = historicalCount - historyCount;
                                }
                            }
                        }
                    }
                });


            }

            $scope.$on("$ionicView.enter", function (event) {
                //   console.log("search DB for chat rooms");
                messaging = [];
                $scope.messages = [];
                chats = [];
                var query = new Parse.Query('ChatRooms');
                //query.include(' parent');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values

                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            //   console.log("HEY HEY" + userID);
                            //   console.log(results.length);
                            if (userID == object.get('chat_from') || userID == object.get('chat_to')) {
                                //   console.log("user belongs to this chat room");
                                chatname = object.get('chat_name');
                                historyCount = object.get('HistoryCount');
                                //    while (!chatname) {
                                //      getHistory();
                                //    console.log(" historical difference is: " + checkHistoryCount());
                                //}

                                chatFrom;
                                if (userID == object.get('chat_from')) {
                                    chatFrom = object.get('chat_to');
                                    userName = object.get('chat_to_name');
                                }
                                else {
                                    chatFrom = object.get('chat_from');
                                    userName = object.get('chat_from_name');
                                }

                                var message = { chatID: chatname, chatSource: chatFrom, username: userName, historyCount: historyCount };
                                // console.log(message);
                                var a = chats.indexOf(chatname);
                                if (a == -1) {
                                    chats.push(chatname);
                                    messaging.push(message);
                                    // $scope.messages = messaging;
                                    // $scope.messages.push(message);
                                    console.log("updating message list");
                                    //$scope.$apply();
                                }

                            }

                        }


                    }
                });
                // stores historical message count into the array 
                getHistories();
                // compares the list of historical messages to that in parse
                checkHistoryCount();
                $scope.messages = messaging;
                if (messaging) {
                    console.log("updating message list 2");
                }
                else {
                    console.log("message list is empty");
                }


                // $scope.messages.push(message);
                //  $scope.$apply();

            })




        }

    ]);
});