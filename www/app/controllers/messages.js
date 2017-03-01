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

        function ($scope, $stateParams, $ionicPopup, $rootScope) {

            $scope.messages = [];
            var chatname;
            var chatFrom
            var userName = "";
            var chats = [];

            var userID = Parse.User.current().id;

            $scope.$on("$ionicView.enter", function (event) {
                console.log("ENTERED");
                var query = new Parse.Query('ChatRooms');
                //query.include(' parent');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values

                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            console.log("HEY HEY" + userID);
                            console.log(results.length);
                            if (userID == object.get('chat_from') || userID == object.get('chat_to')) {
                                console.log("user belongs to this chat room");
                                chatname = object.get('chat_name');
                                chatFrom;
                                if (userID == object.get('chat_from')) {
                                    chatFrom = object.get('chat_to');
                                    userName = object.get('chat_to_name');
                                }
                                else {
                                    chatFrom = object.get('chat_from');
                                    userName = object.get('chat_from_name');
                                }

                                var message = { chatID: chatname, chatSource: chatFrom, username: userName };
                                console.log(message);
                                var a = chats.indexOf(chatname);
                                if (a == -1) {
                                    chats.push(chatname);
                                    $scope.messages.push(message);
                                    $scope.$apply();
                                }


                            }

                        }


                    }
                });


            })


        }

    ]);
});