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


          // FB auth init

          window.fbAsyncInit = function () {
            Parse.FacebookUtils.init({
              appId: '1228598830554599',
                  status: true,  // check Facebook Login status
                  cookie: true,  // enable cookies to allow Parse to access the session
                  xfbml: true,  // initialize Facebook social plugins on the page
                  version: 'v2.8'

                });
            FB.AppEvents.logPageView();
              // FB.Event.subscribe('auth.login', function (response) {
              //     userService.username = $scope.user.username;
              //   alert("Logged in.. Redirecting you now...");
              //   console.log("i am there");
              //   $scope.go('dashboard');
              // });

            };


            (function (d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) { return; }
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_US/sdk/debug.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));


            $scope.$watchGroup(['user.username', 'user.password'], function (newVal) {
              var user = newVal[0] !== undefined && newVal[0].length > 4,
              password = newVal[1] !== undefined && newVal[1].length > 4;
              $scope.ready = !!(user && password);
            });


            $scope.login = function (user) {
              Parse.User.logIn(user.username, user.password, {
                success: function (user) {
                  $state.go('dashboard');
                },
                error: function (user, error) {
                  alert("Error: " + error.message);
                }
              });
            };


            $scope.checkUserDetails = function(response, user){

              var foundUser = false;

                     // query to see if a user exists in DB with the 
                      //same fb id as the one who logged in through fb
                      console.log(user);
                      var query = new Parse.Query("User");
                      query.equalTo('username', response.id);
                      query.find({
                        success: function (results) {
                          if(results.length > 0)
                            foundUser = true;
                          
                        },
                        error: function (error) {
                          alert("Error: " + error.code + " " + error.message);
                        }
                      });


                      // coming here means the user does not exist in database and also 
                      // there is no user in DB with similar FB ID
                      if (!user.existed() && !foundUser) {

                        alert("New user " + response.first_name + " " + "signed up and logged in through Facebook!");
                          // updating user record based on accesible facebook data
                          console.log(response);
                          user.set('username', response.id);
                          user.set('email', response.email);
                          user.set('firstName', response.first_name);
                          user.set('lastName', response.last_name);
                          user.set('imageURL', response.picture.data.url);
                          user.set('total_unread', 0);
                          user.save();

                          // go to dashbboard
                          alert("Created new user");
                          $state.go("dashboard");

                        } else {
                          // the current parse user is already in the database,
                          // so we just proceed to the dashboard
                          alert("Logged in!");
                          $state.go("dashboard");
                        }
                      }

          //Todo
          $scope.fbLogin = function () {
              // Already signed in - go straight to dashboard
              FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                  console.log("going to dashbboard")  ;                         
                  $state.go('dashboard');
                  return;
                }
              });


              
              Parse.FacebookUtils.logIn(null, {
                success: function (user) {                  
                      // Gets facebook details of user who succesfully logged in into facebook
                      FB.api('/me?fields=first_name, last_name, email, picture', function (response) {
                       $scope.checkUserDetails(response, user);
                     });              

                    },

                    error: function (user, error) {
                      alert("Error: " + error.message);
                    }
                  });
              
            };

          }
          ]);
});


