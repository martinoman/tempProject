(function(){
  var app = angular.module("chat", [
  'ngRoute',
  'chattControllers',
  'ui.bootstrap'
  ]);

  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
      }).
      when('/securities', {
        templateUrl: 'securities.html',
        controller: 'securityController'
      }).
      when('/market/:sec', {
        templateUrl: 'market.html',
        controller: 'marketController'
      }).
      when('/user/:id', {
        templateUrl: 'user.html',
        controller: 'userController'
      }).
      when('/start', {
        templateUrl: 'start.html',
        controller: 'startController'
      }).
       when('/addAd', {
        templateUrl: 'addAd.html',
        controller: 'addAdController'
      }).
       when('/ad/:ad_id', {
        templateUrl: 'ad.html',
        controller: 'adController'
      }).
      otherwise({
        redirectTo: '/start'
      });
  }]);
})();
