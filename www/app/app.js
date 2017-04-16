// The main app definition
// --> where you should load other module depdendencies
define([
  'ionic'], function () {
  'use strict';

  // the app with its used plugins
<<<<<<< HEAD
  var app = angular.module('app', 
  ['ionic', 'ngCordova', 'angular-md5'
  ]);
=======
  var app = angular.module('app', ['ionic', 'ngCordova', 'angular-md5']);

>>>>>>> master
  // return the app so you can require it in other components
  return app;
});
