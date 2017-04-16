define([
    'app',

], function (app) {
    'use strict';

    app.controller('ChatCtrl', [
        '$scope',
        '$state',
        '$ionicPopup',
        '$rootScope',
        'PubNubService',
        'md5',

        function ($scope, $stateParams, $ionicPopup, $rootScope, PubNubService, md5) {



            //window.onload = function () {

            // $(document).ready(function () {
            // Initialize the PubNub API connection.
            var message1 = "";
            var chatRoom = 'chat';


            if ($rootScope.userID) {
                var x = Number($rootScope.userID);
                var y = Number(Parse.User.current().get('username'));
                if (x > y) {
                    chatRoom = x + "" + y;
                }
                else {

                    chatRoom = y + "" + x;
                }

            }
            else {
                console.log("no user found");

            }
            
            var pubnub = PubNubService;
            getHistory();
            console.log(pubnub.uuid());
            var messageReceived = {};
            var existingListener;

            //var md =  md5.createHash('hamid' || '');



            if (!$rootScope.start) {
                // Initialize the PubNub service
                console.log("pubnub initialized");
                //pubnub = PubNub.getPub();




                $rootScope.start = true;
            }





            function getHistory() {
                console.log("getting history");
                console.log(chatRoom);
                pubnub.history({
                    channel: chatRoom,
                    count: 30,
                    callback: function (messages) {
                        messages[0].forEach(function (m) {
                            console.log(m.text);
                            $scope.messages.push(m);
                        });

                    }
                });
                //$scope.$apply();
            }
            // Subscribe to messages coming in from the channel.

            pubnub.subscribe({
                channel: chatRoom,
                withPresence: true,
                //connect: publish(),
                callback: function (m) {
                    handleMessage(m);

                },
            });



            function publish() {

                pubnub.publish({
                    channel: chatRoom,
                    message: $scope.data,



                }

                );
            };


            // Grab references for all of our elements.
            var messageContent = document.getElementById('messageContent'),
                // sendMessageButton = $('#sendMessageButton'),
                messageList = [];
            $scope.data = {};
            $scope.messages = [];

            // Handles all the messages coming in from pubnub.subscribe.

            function handleMessage(message) {
                /** var messageEl = $("<li class='message'>"
                     + "<span class='username'>" + message.username + ": </span>"
                     + message.text
                     + "</li>"); */
                console.log("we recevied message from: " + message.username);
                $scope.data = message;

                $scope.messages.push(message);
                $scope.$apply();
                //$scope.data = null;


                // Scroll to bottom of page
                //  $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 'slow');
            };

            // Compose and send a message when the user clicks our send message button.
            //while (1==1) {}







            $scope.sendMessage = function (event) {
                message1 = messageContent.value;

                if (message1 != '') {
                    var messagetobeSent = {
                        username: Parse.User.current().get('firstName'),
                        text: message1
                    }
                    $scope.data = messagetobeSent;
                    //  $scope.messages.push($scope.data);
                    console.log(Parse.User.current().get('firstName'));
                    publish();
                    // $scope.apply();
                    // $scope.data = null;
                    // getHistory();


                    messageContent.value = "Message";

                }
            };


            $scope.getBubbleClass = function (username) {
                var classname = 'from-them';
                console.log("formatting chat");
                if ($scope.messageIsMine(username)) {
                    classname = 'from-me';
                }
                return classname;
            };

            $scope.messageIsMine = function (username) {
                return username === Parse.User.current().get('firstName');
            };
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