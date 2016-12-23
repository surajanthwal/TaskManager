// main module file for including all the custom modules.
angular.module('MyApp', ['ngRoute', 'appRoutes', 'MainCtrl'])
    //directive for using enter to save
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter)
                    });
                    event.preventDefault();
                }
            });
        };
    })
    
    //directive for focus on input element
    .directive('focus',
        function ($timeout) {
            return {
                scope: {
                    trigger: '@focus'
                },
                link: function (scope, element) {
                    scope.$watch('trigger', function (value) {
                        if (value === "true") {
                            $timeout(function () {
                                element[0].focus();
                            });
                        }
                    });
                }
            };
        })
    
    //filter for doing the keyword search for all the tasks in the selected list
    .filter('searchFilter', function () {
        return function (input, option) {
            if (option == null || option.trim() == "") {
                return input
            }
            else {
                var array = [];
                option = option.trim();
                option = option.toLowerCase();
                for (var i = 0; i < input.length; i++) {
                    if (input[i].firstName.toLowerCase().indexOf(option) != -1)
                        array.push(input[i]);
                }
                return array;
            }

        }
    })
    
    //for doing all AJAX call from front end to node server
    .factory('TaskService', function ($http) {
        return {
            getListsAndTasks: function () {
                return $http.get('/listsAndTasks')
                    .then(function (result) {
                        console.log("Data inside service:");
                        console.log(result);
                        //resolve the promise as the data
                        return result.data;
                    });
            }
        }
    });
