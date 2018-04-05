(function() {

  angular.module('chat')
  .factory('UserService', function($http) {

    var username = "";
    var address = "";
    var email = "";
    var id = 0;
    var category = "all";

    return {
      // getUsername: getUsername,

      setUser: function(idP, nameP, addressP, emailP){
        console.log(idP);
        console.log(nameP);
        console.log(addressP);
        console.log(emailP);
        id = idP;
        username = nameP;
        address = addressP;
        email = emailP;
      },

      getName: function() {
        return username;
      },

      getAddress: function() {
        return address;
      },

      getEmail: function() {
        return email;
      },

      getId: function() {
        return  id;
      },

      getCategory: function() {
        return  category;
      },

      setCategory: function(categoryP) {
        console.log("categoryP " + categoryP);
        category = categoryP;
      },

      clearData: function() {
        var username = "";
        var address = "";
        var email = "";
        var id = 0;

      }

    };
  })

  .factory('HttpService', function($http) {
    return {
      post: function(path, data, callback){
        $http.post('/API/' + path, data, {withCredentials: true}).success(callback);
      },
      get: function(path, callback){
        $http.get('/API/' + path).success(callback);
      }
    };
  });

})();
