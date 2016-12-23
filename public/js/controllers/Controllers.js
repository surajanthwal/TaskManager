// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', ['ngNotify'])
    .controller('TaskController', ['$scope', '$http', 'TaskService',
        function ($scope, $http, TaskService) {
            var vm = this;
            vm.newList = "";
            vm.newTask = "";
            vm.booleanNewList = false;
            vm.booleanNewTask = false;
            vm.lists = [{
                id: 1,
                booleanEdit: false,
                title: "Swimming late night"
            }, {
                id: 1,
                booleanEdit: false,
                title: "Gymming early morning"
            }, {
                id: 1,
                booleanEdit: false,
                title: "Football @2pm"
            }, {
                id: 1,
                booleanEdit: false,
                title: "Bornfire @2am"
            }];
            vm.tasks = [{
                id: 1,
                listId: 1,
                booleanEdit: false,
                title: "Buying new sport shoes"
            }, {
                id: 1,
                listId: 1,
                booleanEdit: false,
                title: "Online Sale on Amazon"
            }, {
                id: 1,
                listId: 1,
                booleanEdit: false,
                title: "Watching a new romcom"
            }, {
                id: 1,
                listId: 1,
                booleanEdit: false,
                title: "New Guitar Strings"
            }];
            console.log(TaskService.getListsAndTasks());

            vm.trashList = function (list) {
                console.log(list);
            };
            vm.trashTask = function (task) {
                console.log(task);

            };
            vm.editList = function (list) {
                list.booleanEdit = true;
                vm.inputList = list.title;
            };
            vm.editTask = function (task) {
                task.booleanEdit = true;
                vm.inputTask = task.title;
            };
            vm.saveList = function (list) {
                console.log(list);
                if (vm.inputList == null || vm.inputList.trim() == "") {
                    alert("Sorry, you cannt create an empty list");
                    vm.inputList = list.title;

                } else {
                    list.title = vm.inputList;
                }
                list.booleanEdit = false;
            };

            vm.saveTask = function (task) {
                console.log(task);
                if (vm.inputTask == null || vm.inputTask.trim() == "") {
                    alert("Sorry, you cannt create an empty Task");
                    vm.inputTask = task.title;

                } else {
                    task.title = vm.inputTask;
                }
                task.booleanEdit = false;
            };

            vm.saveNewList = function () {
                console.log("New list");
                if (vm.newList == null || vm.newList.trim() == "") {
                    alert("Please enter a list name");
                    vm.newList = "";
                    return;
                }
                var list = {};
                list.title = vm.newList;
                vm.lists.unshift(list);
                vm.newList = "";
                vm.booleanNewList = false;
            };

            vm.saveNewTask = function () {
                console.log("New task");
                if (vm.newTask == null || vm.newTask.trim() == "") {
                    alert("Please enter a task name");
                    vm.newTask = "";
                    return;
                }
                var list = {};
                list.title = vm.newTask;
                vm.tasks.unshift(list);
                vm.newTask = "";
                vm.booleanNewTask = false;
            };

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
