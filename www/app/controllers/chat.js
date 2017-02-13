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

        function ($scope, $stateParams, $ionicPopup, $rootScope, PubNubService) {



            //window.onload = function () {

            // $(document).ready(function () {
            // Initialize the PubNub API connection.
            var message1 = "";
            var pubnub = PubNubService;
            console.log(pubnub.uuid());
            var messageReceived = {};
            var existingListener;

       if (!$rootScope.start) {
    // Initialize the PubNub service
       console.log("pubnub initialized");
         //pubnub = PubNub.getPub();


           
   
    $rootScope.start = true;
  }
         
function initializePub() {


addListener();

}

 function addListener() {
     console.log("i should start publishing");
  /**   if (!existingListener) {
          existingListener = pubnub.addListener({
                status: function(statusEvent) {
                    console.log("i should start listening");
                    console.log(statusEvent);
       
    },
                message: function (message) {
                    if (message) {
                    console.log(message)
                    }
                    
                }
            });
           


     }
     */
   
 };    

function getHistory() {
    pubnub.history({
      channel: 'chat',
      count: 30,
      callback: function(messages) {
        messages[0].forEach(function(m){ 
         console.log(m);
        });
      }
    });
  }
      // Subscribe to messages coming in from the channel.
            
            pubnub.subscribe({
                channel: 'chat',
                withPresence: true, 
                //connect: publish(),
                callback : function(m) {
                handleMessage(m);

                },
            });

            

 function publish () {
     
    pubnub.publish({
                    channel: 'chat',
                    message: $scope.data.message,
                      callback: function(m) {
                      console.log(m);
            }


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
                console.log("we recevied message from someone");
                $scope.data.username = message.username;
                messageList.push(message);
                $scope.messages = messageList;
                console.log(messageList);

                // Scroll to bottom of page
                //  $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 'slow');
            };

            // Compose and send a message when the user clicks our send message button.
//while (1==1) {}



           

            initializePub();       

            $scope.sendMessage = function (event) {
                message1 = messageContent.value;

                if (message1 != '') {
                    var messagetobeSent = {
                        username: Parse.User.current().get('firstName'),
                        text: message1
                    }
                    $scope.data.message = messagetobeSent;
                    $scope.data.username = Parse.User.current().get('firstName');
                    messageList.push(messagetobeSent);
                    $scope.messages = messageList;
                    console.log(Parse.User.current().get('firstName'));
                    publish();
                    getHistory();
                    

                    messageContent.value = "Message";

                }
            };


            $scope.getBubbleClass = function (username) {
                var classname = 'from-them';
                if ($scope.messageIsMine(username)) {
                    classname = 'from-me';
                }
                return classname;
            };

            $scope.messageIsMine = function (username) {
                return $scope.data.username === Parse.User.current().get('firstName');
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