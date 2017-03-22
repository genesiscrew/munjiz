define([
    'app',
    'services/event',



], function (app) {
    'use strict';

    app.controller('ChatCtrl', [
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
            var chatRoom = 'chat';
            var user;
            var foundChat = false;
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
                var query = new Parse.Query('ChatRooms');
                //query.include(' parent');
                query.equalTo("chat_name", chatRoom);
                query.first({
                    success: function (results) {
                        console.log("great grea success");
                        if (results.get('chat_from') == Parse.User.current().id) {
                            results.set("chat_from_online", true);
                            results.save();
                        }
                        else {
                            results.set("chat_to_online", true);
                            results.save();
                        }

                    }
                });

            });


            $scope.$on("$ionicView.leave", function (event) {
                console.log("we have exited chat");
                var query = new Parse.Query('ChatRooms');
                //query.include(' parent');
                query.equalTo("chat_name", chatRoom);
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
                console.log("confirming userid as:" + $rootScope.userID);


                var x = $rootScope.userID;
                var y = Parse.User.current().id;
                console.log("the fuckuser id is" + x);

                if (x > y) {
                    chatRoom = x + "" + y;

                    // we updload history using the chatroom we just created
                    getHistory();
                    var query = new Parse.Query('ChatRooms');
                    //query.include(' parent');
                    query.find({
                        success: function (results) {
                            // Do something with the returned Parse.Object values
                            foundChat = false;
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];
                                if (chatRoom == object.get('chat_name')) {
                                    console.log("chat room exists");
                                    foundChat = true;
                                    // if chat room exists, we check history count of messages in parse with pubnub
                                    updateHistoryCount();

                                }

                            }
                            if (!foundChat) {
                                console.log("chat room  does not exist");
                                createChatRoom();

                            }

                        }
                    });

                }
                else {
                    chatRoom = y + "" + x;

                    getHistory();
                    var query = new Parse.Query('ChatRooms');
                    //query.include(' parent');
                    query.find({
                        success: function (results) {
                            // Do something with the returned Parse.Object values
                            foundChat = false;
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];
                                if (chatRoom == object.get('chat_name')) {
                                    console.log("chat room exists");
                                    foundChat = true;
                                    updateHistoryCount();

                                }

                            }
                            if (!foundChat) {
                                createChatRoom();

                            }

                        }
                    });
                }

            }
            else {
                console.log("no user found");

            }


            // console.log(pubnub.uuid());
            var messageReceived = {};
            var existingListener;

            //var md =  md5.createHash('hamid' || '');



            if (!$rootScope.start) {
                // Initialize the PubNub service
                console.log("pubnub initialized");
                //pubnub = PubNub.getPub();




                $rootScope.start = true;
            }

            function getUser() {



            }


            function createChatRoom() {
                // chat room does not exist so we set up new chat room in DB

                var query = new Parse.Query('User');
                //query.include(' parent');
                console.log("getting the user");
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            console.log("looping throug users");
                            if ($rootScope.userID == object.id) {
                                var Chat = Parse.Object.extend("ChatRooms");
                                var newChat = new Chat();
                                newChat.set("chat_from", Parse.User.current().id);
                                newChat.save();
                                newChat.set("chat_to", object.id);
                                newChat.save();
                                newChat.set("chat_from_name", Parse.User.current().get("firstName"));
                                newChat.save();
                                console.log(object.get("username"));
                                newChat.set("chat_to_name", object.get("firstName"));
                                newChat.save();
                                newChat.set("chat_name", chatRoom);
                                newChat.set("HistoryCountMe", 0);
                                newChat.save();
                                newChat.set("HistoryCountTo", 0);
                                newChat.save();

                                console.log("chat room added to DB succesfully");


                            }
                        }

                    }
                });



            }
            function chatRoomExists() {


                var query = new Parse.Query('ChatRooms');
                //query.include(' parent');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values
                        foundChat = false;
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            if (chatRoom == object.get('chat_name')) {
                                console.log("chat room exists");
                                foundChat = true;

                            }

                        }
                        if (!foundChat) {
                            console.log("chat room  does not exist");

                        }

                    }
                });
            }




            function getHistory() {
                console.log("getting history");
                //console.log("the current historycount is:" + historyCount);
                pubnub.history({
                    channel: chatRoom,
                    count: 1000000,
                    callback: function (messages) {
                        messages[0].forEach(function (m) {
                            //console.log("messages as: " + m.text);
                            // historyCount++;
                            $scope.messages.push(m);
                        });
                        // console.log("history counttTTTtt is: " + historyCount);

                    }
                });



            }
            // Subscribe to messages coming in from the channel.

            pubnub.subscribe({
                channel: chatRoom,
                withPresence: true,
                //connect: publish(),
                callback: function (m) {
                    handleMessage(m);

                },
                presence: function (presenceEvent) {
                    console.log("HALLIUUKAAAAL");
                }


            });






            function publish() {

                pubnub.publish({
                    channel: chatRoom,
                    message: $scope.data,
                });
                pubnub.publish({
                    channel: 'Global',
                    to: $scope.data.to,
                    from: $scope.data.from,
                    message: $scope.data,

                });




            };

            function updateHistoryCount() {
                console.log("are we here");
                var query = new Parse.Query('ChatRooms');
                query.find({
                    success: function (results) {
                        // Do something with the returned Parse.Object values
                        foundChat = false;
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            if (chatRoom == object.get('chat_name')) {
                                var historicalCount;
                                if (object.get('chat_from') == Parse.User.current().id) {
                                    //historyCount = object.get("HistoryCountMe");

                                    console.log(object.get("HistoryCountTo"));
                                    if (object.get("HistoryCountTo") > object.get("HistoryCountMe")) {
                                        console.log("we are heere4");
                                        historyCount = object.get("HistoryCountTo");
                                        var amount = (object.get("HistoryCountTo") - object.get("HistoryCountMe"));
                                        console.log("amount is: " + amount);
                                        $scope.number = $scope.number - amount;
                                        var query = new Parse.Query('User');
                                        //query.include(' parent');
                                        query.equalTo("objectId", $rootScope.userID);
                                        //  console.log("getting the user");
                                        var current_unread = Parse.User.current().get("total_unread");
                                        console.log("WOHOOOOO" + current_unread);
                                        if (current_unread > 0) {
                                            Parse.Cloud.run('decrementChatCount', { objectId: Parse.User.current().id, amount: amount }, {
                                                success: function (results) {
                                                    console.log("success");

                                                },
                                                error: function (error) {
                                                    console.error(error);
                                                }
                                            });
                                        }
                                        $rootScope.messageNotification();
                                        object.set("HistoryCountMe", object.get("HistoryCountTo"));
                                        console.log("history count for hamid is" + historyCount);
                                        object.save();

                                    }
                                    else {
                                        historyCount = object.get("HistoryCountMe");
                                    }


                                }
                                else {
                                    if (object.get("HistoryCountMe") > object.get("HistoryCountTo")) {
                                        historyCount = object.get("HistoryCountMe");
                                        var amount = (object.get("HistoryCountMe") - object.get("HistoryCountTo"));
                                        $scope.number = $scope.number - amount;
                                        var query = new Parse.Query('User');
                                        //query.include(' parent');
                                        query.equalTo("objectId", $rootScope.userID);
                                        console.log("history count for adam is" + historyCount);
                                        var current_unread = Parse.User.current().get("total_unread");
                                        if (current_unread > 0) {
                                            Parse.Cloud.run('decrementChatCount', { objectId: Parse.User.current().id, amount: amount }, {
                                                success: function (results) {
                                                    console.log("success");

                                                },
                                                error: function (error) {
                                                    console.error(error);
                                                }
                                            });
                                        }
                                        $rootScope.messageNotification();
                                        console.log("should not be here");
                                        object.set("HistoryCountTo", object.get("HistoryCountMe"));
                                        object.save();

                                    }
                                    else {
                                        historyCount = object.get("HistoryCountTo");
                                    }


                                }


                                if (historyCount != historicalCount) {
                                    // console.log("we have a new motherfucking message, histories dont match");
                                    //newMessagesReceived = true;
                                }
                            }
                        }
                    }
                });


            }


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
                // console.log("we recevied message from: " + message.username);

                //query.include(' parent');
                query.equalTo("objectId", $rootScope.userID);
                //  console.log("getting the user");
                /**       Parse.Cloud.run('decrementChatCount', { objectId: Parse.User.current().id, amount: 1 }, {
                           success: function (results) {
                               console.log("success");
       
                           },
                           error: function (error) {
                               console.error(error);
                           }
                       }); */

                $scope.data = message;

                $scope.messages.push(message);


                $scope.$apply();
                // console.log($scope.messages[$scope.messages.length - 1]);
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 300);

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
                        text: message1,
                        to: $rootScope.userID,
                        from: Parse.User.current().id
                    }
                    $scope.data = messagetobeSent;
                    //  $scope.messages.push($scope.data);
                    // console.log(Parse.User.current().get('firstName'));
                    publish();
                    var query = new Parse.Query('ChatRooms');
                    query.find({
                        success: function (results) {
                            // Do something with the returned Parse.Object values
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];
                                if (chatRoom == object.get('chat_name')) {
                                    ++historyCount;
                                    console.log(" i am HERE NOW and history count for" + object.id + "is:" + object.get("HistoryCountTo"));
                                    if (object.get('chat_from') == Parse.User.current().id) {

                                        //var old = object.get("HistoryCountMe");
                                        object.set("HistoryCountMe", historyCount);
                                        object.save();

                                    }
                                    
                                    if (object.get('chat_to_online') == true) {
                                        // var old = object.get("HistoryCountTo");
                                        console.log("shoud not be here")
                                        object.set("HistoryCountTo", historyCount);
                                        object.save();

                                    }



                                }
                            }
                        }
                    });
  
                    var query = new Parse.Query('ChatRooms');
                    //query.include(' parent');
                    query.equalTo("chat_name", chatRoom);
                    query.first({
                        success: function (results) {
                            console.log("great grea success");
                            if (results.get('chat_from') == Parse.User.current().id) {
                                if (results.get("chat_to_online") == false) {
                                    Parse.Cloud.run('incrementChatCount', { objectId: $rootScope.userID }, {
                                        success: function (results) {
                                            console.log("success");

                                        },
                                        error: function (error) {
                                            console.error(error);
                                        }
                                    });
                                }
                            }
                            else {
                                if (results.get("chat_from_online") == false) {
                                    Parse.Cloud.run('incrementChatCount', { objectId: $rootScope.userID }, {
                                        success: function (results) {
                                            console.log("success");
                                        },
                                        error: function (error) {
                                            console.error(error);
                                        }
                                    });
                                }

                            }

                        }
                    });





                    messageContent.value = "Message";

                }
            };


            $scope.getBubbleClass = function (username) {
                var classname = 'from-them';
                //  console.log("formatting chat");
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