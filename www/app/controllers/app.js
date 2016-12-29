define([
  'app',
  'services/page'
  ], function (app) {
    'use strict';

    app.controller('AppCtrl', [
      '$scope',
      '$ionicModal',
      '$ionicScrollDelegate',
      '$sce',
      '$ionicPopup',
      'pageService',
      function ($scope, $ionicModal, $ionicScrollDelegate, $sce, $ionicPopup, pageService) {
        $scope.ready = true;

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

      

     // A confirm dialog
     $scope.showPopup = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Log out',
         // template: 'Are you sure you want to log out?'
         template: "<style>.popup { width:300px; }</style><p>That's the popup content<p/>",
       });

       confirmPopup.then(function(res) {
         if(res) {
           console.log('You are sure');
         } else {
           console.log('You are not sure');
         }
       });
     };


   }
   ]);
  });
