// public/js/app.js
angular.module('MyApp', ['ngRoute', 'appRoutes', 'MainCtrl'])
    .directive('dobasync', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.dobasync = function (modelValue, viewValue) {
                    var birthDate = new Date();

                    birthDate.setFullYear(viewValue.substring(0, viewValue.indexOf("-")));
                    birthDate.setMonth(viewValue.substring(viewValue.indexOf("-") + 1, viewValue.lastIndexOf("-")) - 1);
                    birthDate.setDate(viewValue.substring(viewValue.lastIndexOf("-") + 1, viewValue.length));

                    var currentDate = new Date();

                    if (birthDate >= currentDate) {
                        
                        return false;
                    }
                    return true;
                };
            }
        };
    })
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
    });
