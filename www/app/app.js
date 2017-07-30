// The main app definition
// --> where you should load other module depdendencies
define([
  'ionic'], function () {
  'use strict';

  // the app with its used plugins
  var app = angular.module('app', ['ionic', 'ngCordova', 'angular-md5', 'ion-autocomplete', 'ionic-close-popup']);

  // return the app so you can require it in other components
  return app;
});
