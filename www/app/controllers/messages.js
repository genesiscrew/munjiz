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
        '$sce',
        '$ionicLoading',
        function ($scope, $stateParams, $ionicPopup, $rootScope, PubNubService, $sce, $ionicLoading) {

            $scope.messages = [];
            var messaging = [];
            var chatname;
            var chatFrom
            var userName = "";
            var chats = [];
            var pubnub = PubNubService;
            var historyCountMe = 0;
            var historyCountFrom = 0;
            var loading = true;


            var userID = Parse.User.current().id;


            // Setup the loader
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
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
                chats = [];
                var query = new Parse.Query('ChatRooms');
                //query.include(' parent');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values

                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];

                            if (userID == object.get('chat_from') || userID == object.get('chat_to')) {
                                //   console.log("user belongs to this chat room");
                                chatname = object.get('chat_name');
                                if (object.get('chat_from') == Parse.User.current().id) {
                                    historyCountMe = object.get('HistoryCountMe');
                                    historyCountFrom = object.get('HistoryCountTo');
                                }
                                else {
                                    historyCountMe = object.get('HistoryCountTo');
                                     historyCountFrom = object.get('HistoryCountMe');
                                }

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

                                var message = { chatID: chatname, chatSource: chatFrom, username: userName, historyCountMe: historyCountMe, historyCountFrom: historyCountFrom,  };
                                // console.log(message);
                                var a = chats.indexOf(chatname);
                                if (a == -1) {
                                    chats.push(chatname);

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
                        getNotifications();

                    }

                });



            };



            function getNotifications() {


                for (var i = 0; i < messaging.length; i++) {

                    getHistory(messaging[i].chatID, i);

                }
            };



            InitializeCode();




            function getUser(chat) {
                for (var i = 0; i < messaging.length; i++) {
                    if (messaging[i].chatID == chat) {
                        return i;
                    }
                }

            }


            function checkHistoryCount(i) {

                //for (var i = 0; i < messaging.length; i++) {


                console.log("success hsitory is : " + messaging[i].historyCountMe) ;
                  console.log("success hsitorical is : " + messaging[i].historyCountFrom);
                if (messaging[i].historyCountMe < messaging[i].historyCountFrom) {


             messaging[i].newMessageCount = messaging[i].historyCountFrom - messaging[i].historyCountMe;
                    console.log("success, message count :  " + messaging[i].newMessageCount );
                   // $rootScope.totalMessages = $rootScope.totalMessages + messaging[i].newMessageCount;
                    
                    var user = Parse.User.current();
                    console.log(user);
                   // user.set('total_unread', $rootScope.totalMessages);
                    user.save();
                    console.log("hoold up" + messaging[i].newMessageCount);

                }
                else {
                    messaging[i].newMessageCount = 0;
                  

                }

                // console.log("message list is ready");

            }


            function getHistory(history, i) {

                //   console.log("the current chat rooom is:" + history);
                var count = 0;

                pubnub.history({
                    channel: history,
                    count: 1000000,
                    callback: function (messages) {
                        messages[0].forEach(function (m) {
                            // console.log("messages as: " + m.text);
                            count++;

                        });
                        //  console.log("count is " + messaging[getUser(history)].chatID);
                        messaging[getUser(history)].history = count;
                        console.log("count is : " + count);
                       //  console.log("history count  for" + messaging[getUser(history)].chatID + "is: " + messaging[getUser(history)].history);
                        checkHistoryCount(i);
                        if (i == messaging.length - 1) {
                            loading = false;
                        }

                    }
                });



            }




            $scope.newMessage = function (chat_ID, messageCount) {



                // stores updated historical message count into the  messaging array 
                if (messaging[getUser(chat_ID)].newMessageCount > 0) {

                    var newCount = String(messaging[getUser(chat_ID)].newMessageCount);
                    return $sce.trustAsHtml('<span class="badge-assertive badge">' + newCount + '</span>');


                }



            }

            $scope.doRefresh = function () {

                InitializeCode();

                //Stop the ion-refresher from spinning
                console.log("refresh compleeeted");
                $scope.$broadcast('scroll.refreshComplete');;
            };




            // $scope.$on("$ionicView.afterEnter", function (event) {
            //   console.log("search DB for chat rooms");





        }

    ]);
});