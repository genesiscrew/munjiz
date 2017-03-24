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
      '$ionicPlatform',
      '$cordovaCamera',
      '$stateParams',
      function ($scope, userService, $ionicHistory, $rootScope, $state, $ionicActionSheet, $ionicPlatform, $cordovaCamera, $stateParams) {

        // Wait until the title and price are ready then highlight the button 
        $scope.$watchGroup(['listing.title', 'listing.desc', 'listing.price'], function (newVal) {
          var title = newVal[0] !== undefined,
          price = newVal[2] !== undefined;
          
          // Check all are valid inputs
          if(title && price){
            $scope.ready = true;
          }else{
            $scope.ready = false;
          }
        });


        $scope.fillOutListingFields = function(){
          var id = $stateParams.id;
          if(id == 0){
            console.log("creating new listing");
            return;
          }
          
          // Must be editing a listing. Fill Out the text fields
          var Listing = Parse.Object.extend("Listings");
          var query = new Parse.Query(Listing);
          query.equalTo("objectId", id);
          query.first({
            success: function(listing) {
              $scope.listing = listing;
              $scope.listing.title = listing.attributes.title;
              $scope.listing.desc = listing.attributes.desc;
              $scope.listing.price = listing.attributes.price;
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });

        };

        var initView = function(){
           // Start loading
           $scope.ready = false;
           $scope.listing = {};
           if($stateParams.id == 0){
            $scope.submitButtonTitle = "Create Listing";

          }else{
            $scope.submitButtonTitle = "Save Listing";
          }
          $scope.fillOutListingFields();
        };

        // Load view 
        initView();



        // Create the listing and upload it to Parse, then go to the listing page
        $scope.createListing = function(){
          var Listing = Parse.Object.extend("Listings");
          var newListing = new Listing();
          newListing.set("title", $scope.listing.title);
          newListing.set("desc", $scope.listing.desc);
          newListing.set("price", $scope.listing.price);
          newListing.set("show", true);
          newListing.set("parent", Parse.User.current());
          newListing.set("image", $scope.imageURI);
          newListing.save();
          
          // Go back to listings
          var objectId = Parse.User.current().id;
          $state.go("listing", {id:objectId});
        };


        $scope.createListing = function(){
          var Listing = Parse.Object.extend("Listings");
          var newListing = new Listing();
          newListing.set("title", $scope.listing.title);
          newListing.set("desc", $scope.listing.desc);
          newListing.set("price", $scope.listing.price);
          newListing.set("show", true);
          newListing.set("parent", Parse.User.current());
          newListing.set("image", $scope.imageURI);
          newListing.save();
          
          // Go back to listings
          var objectId = Parse.User.current().id;
          $state.go("listing", {id:objectId});
        };


        $scope.saveExistingListing = function(){
          $scope.listing.set("title", $scope.listing.title);
          $scope.listing.set("desc", $scope.listing.desc);
          $scope.listing.set("price", $scope.listing.price);
          $scope.listing.set("show", true);
          $scope.listing.set("image", $scope.imageURI);
          $scope.listing.save();

          // Go back to listings
          var objectId = Parse.User.current().id;
          $state.go("listing", {id:objectId});

        };


        $scope.submit = function (){
          if(typeof id == "undefined"){
            $scope.createListing();

          }else{
            $scope.saveExistingListing();
          }      
        };


        // Trigged by a button click to add an image to a listing. Opens a sheet and displays the option of taking a pboto
        // or choosing one from the gallery. Then it calls $scope.getPhoto()
        $scope.addMedia = function() {
          $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
            { text: 'Take photo' },
            { text: 'Photo from library' }
            ],
            titleText: 'Add images',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
              $scope.getPhoto(index);
            }
          });
        };


        // index = 0 = photo lib
        // index = 1 = camera
        // Get the image URI from the data, and set it to be $scope.imageURI
        $scope.getPhoto = function(index) {
          console.log(index);
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
            $scope.listing.imgageURI = imageData;
          }, function(err) {
            alert("Failed because: " + err);
            console.log('Failed because: ' + err);
          });
        };



      }
      ]);
});


