
//Creating routes for our angular app. Front end routing
angular.module('appRoutes', ['ui.router']).config(['$stateProvider', '$routeProvider', '$locationProvider','$httpProvider', function ($stateProvider, $routeProvider, $locationProvider,$httpProvider) {
//Setting state for our angular app. Here for this app we only have one state
    $stateProvider
        .state('taskList', {
            url: '/',
            controller: 'TaskController as vm',
            templateUrl: 'views/homeScreen.html'
        });
    $locationProvider.html5Mode(true);
}]);


