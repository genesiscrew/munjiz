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
        //sAuth.watchAuthenticationStatusChange();
        console.log("i am there");
        FB.AppEvents.logPageView();
        // FB.Event.subscribe('auth.login', function (response) {
        //     userService.username = $scope.user.username;
        //   alert("Logged in.. Redirecting you now...");
        //   console.log("i am there");
        //   $scope.go('dashboard');
        // });

        FB.Event.subscribe('auth.authResponseChange', function(res) {

          if (res.status === 'connected') {

      /*
       The user is already logged,
       is possible retrieve his personal info
       */
       //_self.getUserInfo();
       $state.go('dashboard');

      /*
       This is also the point where you should create a
       session for the current user.
       For this purpose you can use the data inside the
       res.authResponse object.
       */

     }
     else {

      /*
       The user is not logged to the app, or into Facebook:
       destroy the session on the server.
       */
       $state.go('login');
     }

   });

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
           // window.alert(user.username);
           userService.username = user.username;
           userService.isLogged = true;
           $state.go("dashboard");
           return;

         } else {
          $state.go("dashboard");

        }
      },
      error: function(user, error) {
        console.log(user,error);
        alert("Error: " + error);
      }
    });
    };


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
                      // gets facebook ID of user who succesfully logged in
                      FB.api('/me', function (response) {
                        console.log(response.id);
                      });
                      if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!");
                          //window.alert(user.username);
                          Parse.User.current().set('username', 'johnson');
                          userService.username = Parse.User.current().get('username');
                          userService.isLogged = true;
                          $state.go("dashboard");
                          return;

                        } else {
                          // alert("User logged in through Facebook!");
                          userService.username = user.name;
                          userService.isLogged = true;
                          console.log("username is:");
                          console.log(user.name);
                          console.log("user logged into");
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


