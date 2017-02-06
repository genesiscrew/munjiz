define([
  'app',
  'services/event',
  
], function (app) {
    'use strict';

    app.controller('ChatCtrl', [
      '$scope',
      '$state',
      '$ionicPopup',
     
     
      function ($scope, $stateParams, $ionicPopup) {

          
      
          //window.onload = function () {
            
             // $(document).ready(function () {
                  // Initialize the PubNub API connection.
                
                  var pubnub = new PubNub({
                      publishKey: 'pub-c-30d2f626-ff6d-4379-bad2-a2513d33a646',
                      subscribeKey: 'sub-c-4b18eb38-e884-11e6-81cc-0619f8945a4f',
                      uuid: Parse.User.current().get('firstName'),
                  })
                  
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
                      messageList.listview('refresh');
                      console.log(messageList);

                      // Scroll to bottom of page
                    //  $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 'slow');
                  };

          // Compose and send a message when the user clicks our send message button.

                  pubnub.addListener({
                      message: function (message) {
                          console.log(message)
                      }
                  })
                  
          // Subscribe to messages coming in from the channel.
                  pubnub.subscribe({
                      channel: 'chat',
                      message: handleMessage
                  });
                  
                  $scope.sendMessage = function (event) {
                      var message1 = messageContent.value;
                 
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
                          pubnub.publish({
                              channel: 'chat',
                              message: {
                                  username: Parse.User.current().get('firstName'),
                                  text: message1
                              },
                           
                              
                          }
                          );

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