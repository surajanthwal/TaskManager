// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', ['ngNotify'])
    .controller('PatientController', ['$scope', '$http', 'ngNotify',
        function ($scope, $http, ngNotify) {
            var vm = this;
            vm.user = {};
            vm.gender = ["Male", "Female"];
            vm.setAge = function () {
                vm.user.age = new Date().getFullYear() - vm.user.dob.getFullYear();
            };

            vm.submitForm = function () {

                $http.post('/registerUser', {'data': vm.user}).then(function (response) {
                        ngNotify.set(response.data);
                    },
                    function (err) { // optional
                        console.log("Error");// failed
                    }
                );

            };
        }])
    .controller('AllPatients', ['$scope', 'allUsers', function ($scope, allUsers) {
        var vm = this;
        vm.patients = allUsers.data;
        for (var i = 0; i < allUsers.data.length; i++) {
            var date = new Date(allUsers.data[i].dob);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            vm.patients[i].dob = day + "/" + month + "/" + year;
        }


    }]);
