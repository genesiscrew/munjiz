define([
  'app',
  'services/page',
  'services/user'
  ], function (app) {
    'use strict';

    app.controller('LoginCtrl', [
      '$scope',
      'userService',
      '$ionicHistory',
      '$rootScope',
      '$state',
      function ($scope, userService, $ionicHistory, $rootScope, $state) {

        $scope.user = {};
        $ionicHistory.nextViewOptions({
          disableBack: true
        });


        // Facebook auth init
        window.fbAsyncInit = function () {
          Parse.FacebookUtils.init({
            appId: '1228598830554599',
                status: true,  // check Facebook Login status
                cookie: true,  // enable cookies to allow Parse to access the session
                xfbml: true,  // initialize Facebook social plugins on the page
                version: 'v2.8'
              });
          FB.AppEvents.logPageView();
        };  


        // Load Facebook SDK
        (function (d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) { return; }
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk/debug.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));


        // Watch username and password until they are both filled out, and when both text.length > 4
        // The user is allowed to click login
        $scope.$watchGroup(['user.username', 'user.password'], function (newVal) {
          var user = newVal[0] !== undefined && newVal[0].length > 4,
          password = newVal[1] !== undefined && newVal[1].length > 4;
          $scope.ready = !!(user && password);
        });


        // Login using username + password
        $scope.login = function (user) {
          Parse.User.logIn(user.username, user.password, {
            success: function (user) {
              $state.go('dashboard');
            },
            error: function (user, error) {
              alert("Login Error: " + error.message);
            }
          });
        };


        // Checks the users FB details to see if they have registered with the app before
        $scope.checkUserDetails = function(response, user){
          var foundUser = false;

          // Query to see if a user exists in DB with the same fb id as the one who logged in through fb
          var query = new Parse.Query("User");
          query.equalTo('username', response.id);
          query.first({
            success: function (results) {
                // Exsisting user found
                foundUser = true;
              },
              error: function (error) {
                alert("Error: " + error.code + " " + error.message);
              }
            });

          if (!user.existed() && !foundUser) {
              // User does not exist in database and also there is no user in DB with similar FB ID

              // Updating user record based on accesible facebook data
              user.set('username', response.id);
              user.set('email', response.email);
              user.set('firstName', response.first_name);
              user.set('lastName', response.last_name);
              user.set('imageURL', response.picture.data.url);
              user.set('total_unread', 0);
              user.save();

              // Go to dashbboard
              $state.go("dashboard");

            } else {
            // The current parse user is already in the database, so we just proceed to the dashboard
            $state.go("dashboard");
          }
        };


        // Log the user in through Facebook
        $scope.fbLogin = function () {

            // Check to see if they are already authenticated
            FB.getLoginStatus(function (response) {
              if (response.status === 'connected') {
                // Already signed in, so go straight to dashboard
                $state.go('dashboard');
                return;
              }
            });

            // Sign up user
            Parse.FacebookUtils.logIn(null, {
              success: function (user) {                  
                // Gets facebook details of the user who succesfully logged in into facebook
                FB.api('/me?fields=first_name, last_name, email, picture', function (response) {
                  $scope.checkUserDetails(response, user);
                });    

              },error: function (user, error) {
                alert("Error trying to sign up with Parse: " + error.message);
              }
            });
          };



        }
        ]);
});


