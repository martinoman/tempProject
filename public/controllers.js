var chattControllers = angular.module('chattControllers', []);

angular.module("chattControllers").directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

chattControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      console.log("location = " + $scope.location);
    };

  }
]);


chattControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    if(user.getId() == 0){
      $scope.name = "";
      $scope.done = function() {
        http.post('setUser', {name: $scope.firstname + " " + $scope.lastname, email: $scope.email, address: $scope.address}, function(data) {
          var temp = JSON.stringify(data.id);
          var user_id = temp.substring(21, temp.length-2);
          console.log(user_id);
           user.setUser(user_id, $scope.firstname + " " + $scope.lastname, $scope.address, $scope.email);
          console.log("name: " + user.getName() + " id: " + user.getId() + "   email: " + user.getEmail());
          $location.path('/start');
        });
      };
    }else{
      $location.hash("");
      $location.path('/user/' + user.getId());

    }

  }
]);



chattControllers.controller('startController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    var socket = io().connect();
    $scope.categories = ["all", "car", "bike", "pet"];
    $scope.file = "";
    $scope.ads = [];
    $scope.select = "all";

    console.log("user " + user.getCategory());
    socket.emit('updateCategory', {category: user.getCategory()});
    socket.emit('updateCategory', {category: $scope.select});

    if($scope.select == "all"){
          console.log("in all")
          http.get('/getAds', function(data){
            $scope.ads = data.list;
          });
          socket.emit('joinCategory', {category: $scope.select, leave: $scope.categories});
    }else{
      http.get('/getCategoryAds/' + $scope.select, function(data){
        $scope.ads = data.list;
      });
    }

    socket.on('updateCategory', function(data){
      $scope.$apply(function(){
        if($scope.select == "all"){
          http.get('/getAds', function(data){
            $scope.ads = data.list;
          });
        }else{
          http.get('/getCategoryAds/' + $scope.select, function(data){
            $scope.ads = data.list;
          });
        }
      });
    });

    $scope.redirect = function(ad){
      console.log(ad);
      $location.hash("");
      $location.path('/ad/' + ad.ad_id);
    }

    $scope.done = function(){
      $location.hash("");
      $location.path("/addAd");
    };

    $scope.searchCategory = function(){
      var tempList = [];
      for (var i = 0; i < $scope.categories.length; i++) {
        if($scope.categories[i] == $scope.select){

        }else{
          tempList.push($scope.categories[i]);
        }
      }
      console.log(tempList);
      console.log($scope.select);

      socket.emit('joinCategory', {category: $scope.select, leave: tempList});

      if($scope.select == "all"){
          http.get('/getAds', function(data){
            $scope.ads = data.list;
          });
        }else{
          http.get('/getCategoryAds/' + $scope.select, function(data){
            $scope.ads = data.list;
          });
        }
    };

  }
]);

chattControllers.controller('userController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.userId = user.getId();
    $scope.username = user.getName();
    $scope.email = user.getEmail();
    $scope.address = user.getAddress();
    $scope.values = [];

    console.log("i userController");
    http.get('/getUserAds/'+$scope.userId, function(data){
      $scope.userAds = data.list;
    });

    $scope.accept = function(ad){
      http.post('/sold', {ad: ad}, function(data){
      });
      
      alert("SOLD - " + ad.name + " for " + ad.price + "kr");
      http.get('/getUserAds/'+$scope.userId, function(data){
        $scope.userAds = data.list;
      });
    };


    $scope.redirect = function(ad){
      console.log(ad);
      $location.hash("");
      $location.path('/ad/' + ad.ad_id);
    };

    $scope.update = function(){
      http.get('/getUserAds/'+$scope.userId, function(data){
        $scope.userAds = data.list;
      });
    };

  }
]);


chattControllers.controller('addAdController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {

    $scope.done = function(){
      if(user.getId() == 0){
        alert("You must be logged in in order to add an ad!!");
      }else{
        http.post('/addAd', {file: $scope.fileArray, user: user.getId(), name: $scope.name, description: $scope.description, price: $scope.price, category: $scope.category}, function(data){
        });
        user.setCategory($scope.category);
        console.log("category " + $scope.category);
        $scope.fileArray = null;
        $scope.name = "";
        $scope.description = "";
        $scope.price = null;
        $scope.category = "";

        console.log("här");
        $location.hash("");
        $location.path('/start');
      }
    };
  }
]);

chattControllers.controller('adController', ['$scope', 'HttpService', '$location', 'UserService', '$routeParams',
  function($scope, http, $location, user, routeParams) {
    var socket = io().connect();
    $scope.ad_id = routeParams.ad_id;
    $scope.ad = null;
    $scope.bids = [];


    http.get('/getAdById/'+$scope.ad_id, function(data){
      $scope.ad = data.ad[0];
      console.log($scope.ad);
      socket.emit('join', {ad_id: $scope.ad_id});
    });


    http.get('/getBids/'+ $scope.ad_id, function(data){
      $scope.bids = data.list;
      console.log($scope.bids);
    });


    $scope.done = function(){
      var bidJson = {price: $scope.price, ad_id: $scope.ad_id, user: user.getId(), bids: $scope.bids};
      if(user.getId() == 0){
        alert("You must be logged in to bid");
      }else{
        http.post('/addBid', bidJson, function(data){
          socket.emit('update', bidJson);
        });
      }

      http.post('/updatePrice', {ad_id: $scope.ad_id, price: $scope.price}, function(data){
      });

      $scope.price = "";
    };

    socket.on('update', function(data){
      $scope.$apply(function(){
        http.get('/getBids/'+ $scope.ad_id, function(data){
          $scope.bids = data.list;
        });
      });
    });

  }
]);












//hjälp
