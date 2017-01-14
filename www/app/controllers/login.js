
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

      window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({
            appId: '1228598830554599',
          status: true,  // check Facebook Login status
          cookie: true,  // enable cookies to allow Parse to access the session
          xfbml: true,  // initialize Facebook social plugins on the page
          version: 'v2.8'

        });
        sAuth.watchAuthenticationStatusChange();
        console.log("i am there");
        FB.AppEvents.logPageView();
        // FB.Event.subscribe('auth.login', function (response) {
        //     userService.username = $scope.user.username;
        //   alert("Logged in.. Redirecting you now...");
        //   console.log("i am there");
        //   $scope.go('dashboard');
        // });

      };


      (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
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
          success: function(user) {
          // Do stuff after successful login.
            $state.go('dashboard');
        },
        error: function(user, error) {
          // error
          alert("Error: " + error.message);
        }
      });   
      };



      $scope.facebookLogin = function () {

        FB.getLoginStatus(function(response) {
          console.log(response);

        });
      };


    //Todo
    $scope.fbLogin = function () {

      console.log('facebook login');
     
      FB.getLoginStatus(function(response) {
        console.log(response);
        if (response.status === 'connected') {
            console.log('Logged in.'); 
            $state.go('dashboard');
            return;
        }
      });


      Parse.FacebookUtils.logIn(null, {
        success: function(user) {
          console.log('success ' + user);
          if (!user.existed()) {
              console.log("User signed up and logged in through Facebook!");
              window.alert(user.username);
              userService.username = user.username;
              userService.isLogged = true;
            $state.go("dashboard");
            return;

          } else {
            alert("User logged in through Facebook!");
            $state.go("dashboard");

          }
        },
        error: function(user, error) {
         // console.log(user.getObjectId());
          console.log(user,error);
        //  alert("User cancelled the Facebook login or did not fully authorize.");
      }
    });
    };



  }
  ]);
  });


