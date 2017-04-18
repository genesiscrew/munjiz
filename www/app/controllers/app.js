define([
  'app',
  'services/user',
], function (app) {
  'use strict';

  app.controller('AppCtrl', [
    '$scope',
    '$rootScope',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$sce',
    '$ionicPopup',
    '$ionicHistory',
    '$state',
    'userService',
    '$timeout',
    '$ionicLoading',
    'PubNubService',
    'ShareFactory',
    function ($scope, $rootScope, $ionicModal, $ionicScrollDelegate, $sce, $ionicPopup, $ionicHistory, $state, userService, $timeout, $ionicLoading, PubNubService, ShareFactory) {
      var pubnub = PubNubService;
      var message = false;
      var redCircle;
      var currentUser = Parse.User.current();
      $scope.ready = true;
      $rootScope.totalMessages = 0;
      $scope.zxcv = false;


      $scope.$on('$ionicView.enter', function () {
        if (Parse.User.current()) {

          $scope.number = Parse.User.current().get("total_unread");
          if ($scope.number > 0) {
            console.log("should not be here");
            $scope.zxcv = true;
            //  $scope.$apply();

          }
          else {
            $scope.zxcv = false;
            $scope.$apply();

          }
        }
      });

      $scope.logout = function () {
        message = false;
        $ionicPopup.confirm({
          scope: $scope,
          title: '<span class="energized">Log out</span>',
          subTitle: '<span class="stable">Are you sure you would like to log out?</span>',
          buttons: [
            {
              text: 'Cancel',
              type: "button-light"
            },

            {
              text: "Yes",
              type: "button-positive",
              onTap: function (e) {
                Parse.User.logOut();
                $timeout(function (res) {
                  $ionicLoading.hide();
                  $ionicHistory.clearCache();
                  $ionicHistory.clearHistory();
                  console.log("logging out of facebook");
                  FB.logout();
                  $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                  $state.go('login');
                }, 30);
              }
            }]
        });
      };


      $rootScope.messageNotification = function () {
        if (typeof Parse.User.current() === "undefined" || Parse.User.current() === null) {
          console.log("undefined user trying to recieve a message");
          return;
        }

        return redCircle;
      };


      var messageReceived = function () {


        currentUser.fetch({
          success: function (myObject) {
            // The object was refreshed successfully.
            console.log("user succesfully refreshed");
            $scope.number = currentUser.get("total_unread");
            console.log("should only enter here once and total unread is" + $scope.number);
            var newCount;


            // if ($scope.number > 0) {
            console.log("current state is: " + $state.current.name + $scope.number);
            newCount = String($scope.number);
            // if (!$scope.zxcv) {
            $scope.zxcv = true;
            console.log("should refresh");
            $scope.$apply();
          }
        });
      };

      $scope.$on('$ionicView.loaded', function () {
        if (Parse.User.current()) {

          $scope.number = Parse.User.current().get("total_unread");
          //console.log("success and here it is: " + $rootScope.totalMessages);
        }
      });


      $rootScope.messageNotification = function () {
        if (typeof Parse.User.current() === "undefined" || Parse.User.current() === null) {
          console.log("undefined user trying to recieve a message");
          return;
        }

        var newCount;
        //
        if ($state.current.name != 'chat') {
          $scope.number = Parse.User.current().get("total_unread");
        }


        if ($scope.number > 0) {
          newCount = String($scope.number);
          return $sce.trustAsHtml('<span class="badge-assertive badge">' + newCount + '</span>');
        }

        else {
          return "";
        }
      };


      $scope.goCurrentUserListings = function () {
        message = false;
        var objectId = Parse.User.current().id;
        $state.go("listing", {id: objectId});
      };


      $scope.$on('$ionicView.loaded', function () {
        if (Parse.User.current()) {

          currentUser.fetch({
            success: function (myObject) {
              // The object was refreshed successfully.
              $scope.number = currentUser.get("total_unread");
            },
            error: function (myObject, error) {
              // The object was not refreshed successfully.
              // error is a Parse.Error with an error code and message.
            }
          });


        }
      });


      $scope.goProfile = function () {
        message = false;
        var objectId = Parse.User.current().id;
        $state.go("profile", {id: objectId});
      };

      $scope.goDashBoard = function () {
        message = false;
        var objectId = Parse.User.current().id;
        $state.go("dashboard", {id: objectId});
      };

      pubnub.subscribe({
        channel: 'Global',
        withPresence: true,
        callback: function (message) {
          if (message.from != Parse.User.current().id) {
            //showNotification(message);
            if ($state.current.name != 'chat') {
              messageReceived();
              $scope.$apply()

            }
          }
          else {
            console.log("problem with notification");
          }
        }
      });

      $scope.goCurrentUserListings = function () {
        message = false;
        var objectId = Parse.User.current().id;
        $state.go("listing", {id: objectId});
      };

      $scope.goProfile = function () {
        message = false;
        var objectId = Parse.User.current().id;
        $state.go("profile", {id: objectId});
      };

      $scope.goDashBoard = function () {
        message = false;
        var objectId = Parse.User.current().id;
        $state.go("dashboard", {id: objectId});
      };

      $scope.goChat = function (chatSource) {
        message = false;
        var objectId = Parse.User.current().id;
        console.log("chat source is from:" + chatSource);
        $rootScope.userID = chatSource;
        $state.go("chat", {id: objectId});
      };

      $scope.goMessages = function () {
        var objectId = Parse.User.current().id;

        if (message) {
          message = false;
          $state.go("dashboard", {id: objectId});
        }
        else {
          message = true;
          $state.go("messages", {id: objectId});
        }

      };


    }
  ]);
});
