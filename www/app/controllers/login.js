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
              console.log("i am there");
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
              var user = newVal[0] != undefined && newVal[0].length > 4,
              password = newVal[1] != undefined && newVal[1].length > 4;

              $scope.ready = !!(user && password);
          });


          $scope.login = function (user) {
              console.log(user);
              Parse.User.logIn(user.username, user.password, {
                  success: function (user) {
                      // Do stuff after successful login.
                      console.log("i am logged in");
                      $state.go('dashboard');
                  },
                  error: function (user, error) {
                      // error
                      // alert("Error: " + error.message);
                  }
              });
          };



          $scope.facebookLogin = function () {

              FB.getLoginStatus(function (response) {
                  console.log(response);
                  console.log("i am logged in");

              });
          };


          //Todo
          $scope.fbLogin = function () {

              console.log('facebook login');

              FB.getLoginStatus(function (response) {
                  console.log(response);
                  if (response.status === 'connected') {
                      console.log('Logged in.');
                     
                      ;
                      //$state.go('dashboard');
                      return;
                  }
              });
              
              
              Parse.FacebookUtils.logIn(null, {
                  success: function (user) {
                      console.log('success ');
                      var userID;
                      var email;
                      var firstname;
                      var lastname;
                      var foundUser = false;
                      // gets facebook details of user who succesfully logged in into facebook
                      FB.api('/me?fields=first_name, last_name, email', function (response) {
                          $scope.userID = response.id;
                          $scope.email = response.email;
                          $scope.firstname = response.first_name;
                          $scope.lastname = response.last_name;
                          console.log(response);
                      });
                      // query to see if a user exists in DB with the 
                      //same fb id as the one who logged in through fb
                      var query = new Parse.Query("User");
                      query.include('username');
                      query.find({
                          success: function (results) {
                              for (var i = 0; i < results.length; i++) {
                                  var object = results[i];
                                 
                                  if (object.get("username") == userID) {
                                      foundUser = true;
                                      }
                              }
                             
                           
                          },
                          error: function (error) {
                              alert("Error: " + error.code + " " + error.message);
                          }
                      });
                      if (!user.existed() && !foundUser) {
                          // coming here means the user does not exist in database and also 
                          // there is no user in DB with similar FB ID
                          alert("New user " + firstname + " " + "signed up and logged in through Facebook!");
                          window.alert("about to create new user");
                          var createuser = Parse.User.current();
                          // updating user record based on accesible facebook data
                          createuser.set('username', $scope.userID);
                          createuser.set('email', $scope.email);
                          createuser.set('firstName', $scope.firstname);
                          createuser.set('lastName', $scope.lastname);
                          createuser.save();
                          // the code below is used to store details of current logged in user
                          // i think it is sort of redundant now as i have found out that
                          // parse.user.current() basically provides similar functionality
                          userService.username = Parse.User.current().get('username');
                          userService.isLogged = true;
                          // go to dashbboard
                          $state.go("dashboard");
                          return;

                      } else {
                          // the current parse user is already in the database,
                          ///so we just proceed to the dashboard
                          alert("User already signed up and just logged in through Facebook!");
                   
                          userService.username = user.name;
                          userService.isLogged = true;
                          $state.go("dashboard");

                      }
                  },
                  error: function (user, error) {
                      // console.log(user.getObjectId());
                      console.log("wttf");
                      alert("Error: " + error.message);
                      //  alert("User cancelled the Facebook login or did not fully authorize.");
                  }
              });
              
          };



      }
    ]);
});


