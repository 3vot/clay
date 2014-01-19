// Define application module.
angular.module('3votApp', [ 'ngRoute' ])
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/main', {
        name        : 'main',
        controller  : 'MainCtrl',
        templateUrl : window._3vot.path + '/assets/main.html'
      })
      .when('/how', {
        name        : 'how',
        templateUrl : window._3vot.path + '/assets/how.html'
      })
      .otherwise({
        redirectTo : '/main'
      });
  })
  .run(function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (e, current) {
      $rootScope.currentRoute = current.$$route && current.$$route.name;
    });
  });

  

