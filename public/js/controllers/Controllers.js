// The appliction logic part is in this main controller module
angular.module('MainCtrl', ['ngNotify'])
//Controller for all activities in the home screen
    .controller('TaskController', ['$scope', '$http', 'TaskService',
        function ($scope, $http, TaskService) {
            var vm = this;

            //initialising all the variables
            vm.newList = "";
            vm.newTask = "";
            vm.booleanNewList = false;
            vm.booleanNewTask = false;
            vm.lists = [];
            vm.tasks = [];
            vm.currentList = {};


            //server call using Task Service to get all the list and tasks
            TaskService.getListsAndTasks().then(function (result) {
                angular.forEach(result.data, function (value, key) {
                    result.data[key].booleanSelected = false;
                });

                console.log(result.data);
                vm.lists = result.data;
                if (vm.lists.length > 0) {
                    vm.lists[0].booleanSelected = true;
                    vm.tasks = vm.lists[0].tasks;
                }

            });


            //Showing tasks for the selected list
            vm.selectList = function (list) {
                vm.currentList = list;
                angular.forEach(vm.lists, function (value, key) {
                    vm.lists[key].booleanSelected = false;
                });
                list.booleanSelected = true;
                console.log(list);
                if (list.tasks)
                    vm.tasks = list.tasks;
                else
                    vm.tasks = [];
            };

            //deleting List from the server using Task Service
            vm.trashList = function (list) {


                angular.forEach(list.tasks, function (value, key) {
                    if (list.tasks[key].listId == list.id) {
                        console.log("task:");
                        console.log(list.tasks[key]);
                        vm.trashTask(list.tasks[key]);
                    }
                });

                angular.forEach(vm.lists, function (value, key) {
                    if (vm.lists[key].id == list.id) {
                        vm.lists.splice(key, 1);
                    }
                });

                TaskService.deleteList(list.id);

                vm.tasks = [];
                console.log(vm.tasks);

            };

            //deleting task from server
            vm.trashTask = function (task) {
                console.log("task deleted");
                TaskService.deleteTask(task.id);
                angular.forEach(vm.currentList.tasks, function (value, key) {
                    if (vm.currentList.tasks[key].id == task.id) {
                        vm.currentList.tasks.splice(key, 1);
                    }
                });
                angular.forEach(vm.tasks, function (value, key) {
                    if (vm.tasks[key].id == task.id) {
                        vm.tasks.splice(key, 1);
                    }
                });

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
                    vm.inputList = vm.inputList.trim();
                    list.title = vm.inputList;
                }
                list.booleanEdit = false;

                TaskService.updateList(list);
            };

            vm.saveTask = function (task) {
                console.log(task);
                if (vm.inputTask == null || vm.inputTask.trim() == "") {
                    alert("Sorry, you cannt create an empty Task");
                    vm.inputTask = task.title;

                } else {
                    vm.inputTask = vm.inputTask.trim();
                    task.title = vm.inputTask;
                }
                task.booleanEdit = false;
                TaskService.updateTask(task);

            };

            vm.saveNewList = function () {
                console.log("New list");
                if (vm.newList == null || vm.newList.trim() == "") {
                    alert("Please enter a list name");
                    vm.newList = "";
                    return;
                }
                var list = {};
                vm.newList = vm.newList.trim();

                list.title = vm.newList;
                if (vm.lists.length == 0)
                    vm.lists.push(list);
                else
                    vm.lists.unshift(list);


                TaskService.createList(list).then(function (data) {
                    TaskService.getListDetails(list).then(function (result) {
                        list.id = result.data.id;
                        vm.selectList(list);
                        console.log("Callback: ");
                        console.log(list);

                    });
                });
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
                var task = {};
                task.title = vm.newTask;

                TaskService.getListDetails(vm.currentList).then(function (result) {
                    vm.currentList.id = result.data.id;
                    task.listId = vm.currentList.id;
                    TaskService.createTask(task).then(function (data) {
                        TaskService.getTaskDetails(task).then(function (result) {
                            task.id = result.data.id;
                            if (vm.tasks.length == 0)
                                vm.tasks.push(task);
                            else
                                vm.tasks.unshift(task);

                            if (!vm.currentList.tasks)
                                vm.currentList.tasks = [];
                            vm.currentList.tasks.push(task);
                            console.log(task);
                        });
                    });


                    vm.newTask = "";
                    vm.booleanNewTask = false;
                });
            };

        }]);
