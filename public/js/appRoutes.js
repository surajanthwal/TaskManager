
angular.module('appRoutes', ['ui.router']).config(['$stateProvider', '$routeProvider', '$locationProvider','$httpProvider', function ($stateProvider, $routeProvider, $locationProvider,$httpProvider) {

    $stateProvider
        .state('patientInfo', {
            url: '/',
            controller: 'PatientController as vm',
            templateUrl: 'views/patientInfo.html'
        })
        .state('patients', {
            url:'/allPatients',
            controller:"AllPatients as vm",
            templateUrl:'views/allPatients.html',
            resolve:{
                allUsers:function ($http) {
                   return $http.get('/allUsers');
                }
            }
        });
    $locationProvider.html5Mode(true);

}]);


