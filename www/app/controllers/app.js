define([
  'app',
  'services/page',
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
    'pageService',
    '$state',
    'userService',
    '$timeout',
    '$ionicLoading',
    'PubNubService',
    function ($scope, $rootScope, $ionicModal, $ionicScrollDelegate, $sce, $ionicPopup, $ionicHistory, pageService, $state, userService, $timeout, $ionicLoading, PubNubService) {
      var pubnub = PubNubService;
      var message = false;
      $scope.ready = true;
      pubnub.set_uuid(Parse.User.current().id);

      pageService.get().then(function (pages) {
        $scope.pages = pages;
      });

      $ionicModal.fromTemplateUrl('app/templates/page.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.openModal = function (index) {
        var notEqual = index !== $scope.currentPage;
        if (notEqual) {
          $scope.opening = true;
          $scope.currentPage = index;
        }
        $scope.modal.show().then(function () {
          if (notEqual) {
            $ionicScrollDelegate.$getByHandle('modal').scrollTop();
          }
          $scope.opening = false;
        });
      };

      $scope.trustHtml = function (html) {
        return $sce.trustAsHtml(html);
      };

      $scope.closeModal = function () {
        $scope.modal.hide();
      };



      $scope.logout = function () {
        message = false;
        $ionicPopup.confirm({
          scope: $scope,
          title: '<span class="energized">Log out</span>',
          subTitle: '<span class="stable">Are you sure you would like to log out?</span>',
          inputType: 'text',
          inputPlaceholder: ''
        }).then(function (res) {
          if (res) {
            Parse.User.logOut();
            $timeout(function (res) {
              $ionicLoading.hide();
              $ionicHistory.clearCache();
              $ionicHistory.clearHistory();
              console.log("logging out of facebook");
              FB.logout();
              $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
              $state.go('login');
            }, 30);


          }
        });
      };

      pubnub.subscribe({
        channel: 'Global',
        withPresence: true,
        callback: function (message) {
          if (message.from != Parse.User.current().id) {
            //showNotification(message);
            console.log("notification working")
            if ($state.current.name != 'chat') {
              $scope.messageNotification = $sce.trustAsHtml('<span class="badge-assertive badge"></span>');
              

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
        $state.go("listing", { id: objectId });
      };

      $scope.goProfile = function () {
        message = false;
        var objectId = Parse.User.current().id;
        $state.go("profile", { id: objectId });
      };

      $scope.goDashBoard = function () {
        message = false;
        var objectId = Parse.User.current().id;
        $state.go("dashboard", { id: objectId });
      };

      $scope.goChat = function (chatSource) {
        message = false;
        var objectId = Parse.User.current().id;
        console.log("chat source is from:" + chatSource);
        $rootScope.userID = chatSource;
        $state.go("chat", { id: objectId });
      };

      $scope.goMessages = function () {
        var objectId = Parse.User.current().id;

        if (message) {
          message = false;
          $state.go("dashboard", { id: objectId });
        }
        else {
          message = true;
          $state.go("messages", { id: objectId });
        }

      };


    }
  ]);
});
