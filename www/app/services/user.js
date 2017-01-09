define([
  'app'
], function (app) {
    'use strict';


    app.service('userService', function() {
        console.log("i am here now");
    return {
        isLogged: false,
        username: null
    }

});
});