define([
  'app',
  'services/page',
  'services/user'
  ], function (app) {
    'use strict';

    app.controller('NewListingCtrl', [
      '$scope',
      'userService',
      '$ionicHistory',
      '$rootScope',
      '$state',
      '$ionicActionSheet',
      '$cordovaCamera',
      function ($scope, userService, $ionicHistory, $rootScope, $state, $ionicActionSheet, $cordovaCamera) {

        $scope.ready = false;
        $scope.listing = {};

        $scope.$watchGroup(['listing.title', 'listing.desc', 'listing.price'], function (newVal) {
          var title = newVal[0] != undefined,
          desc = newVal[1] != undefined,
          price = newVal[2] != undefined;
          
          // check all are valid inputs
          if(title && desc && price){
            $scope.ready = true;
          }else{
            $scope.ready = false;
          }

        });


        $scope.createListing = function(){

          if(!$scope.ready){
            alert("Please ensure you have filled out all fields");
          }else{

            console.log(Parse.User.current());
            var Listing = Parse.Object.extend("Listings");
            var newListing = new Listing();
            newListing.set("title", $scope.listing.title);
            newListing.set("desc", $scope.listing.desc);
            newListing.set("price", $scope.listing.price);
            newListing.set("show", true);
            newListing.set("parent", Parse.User.current());
            newListing.save();
          }
          var objectId = Parse.User.current().id;
          $state.go("listing", {id:objectId});
        };


        $scope.addMedia = function() {
          $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
            { text: 'Take photo' },
            { text: 'Photo from library' }
            ],
            titleText: 'Add images',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
              $scope.getPhoto();
            }
          });
        };


        $scope.getPhoto = function() {

          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            mediaType: Camera.MediaType.ALLMEDIA,
            saveToPhotoAlbum: true
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log("img URI= " + imageData);        
            // Here you will be getting image data 
            }, function(err) {
              alert("Failed because: " + err);
              console.log('Failed because: ' + err);
            });
        };



    }
    ]);
  });


