define([
  'app'
], function (app) {
    'use strict';


    app.service('userService', function() {
    return {
        isLogged: false,
        username: "hamid"
    }

});
});