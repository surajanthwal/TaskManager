// The appliction logic part is in this main controller module
angular.module('MainCtrl', ['ngNotify'])
//Controller for all activities in the home screen
    .controller('TaskController', ['$scope', '$http', 'TaskService', 'ngNotify',
        function ($scope, $http, TaskService, ngNotify) {
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
                vm.lists = result.data;
                if (vm.lists.length > 0) {
                    vm.lists[0].booleanSelected = true;
                    vm.tasks = vm.lists[0].tasks;
                }

                //notification message for first time
                ngNotify.set('Please first click on Add List to create a list and then you can add multiple task inside the list. All CRUD operation can be done. This message will vanish after 20s',
                    {
                        position: 'middle', // sticky: true,
                        duration: 20000
                    });


            });


            //Showing tasks for the selected list
            vm.selectList = function (list) {
                vm.currentList = list;
                angular.forEach(vm.lists, function (value, key) {
                    vm.lists[key].booleanSelected = false;
                });
                list.booleanSelected = true;
                if (list.tasks)
                    vm.tasks = list.tasks;
                else
                    vm.tasks = [];
            };

            //deleting List and its relevant tasks from the server using Task Service
            vm.trashList = function (list) {
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

            //Editing a list on clicking the pencil glyphicon
            vm.editList = function (list) {
                list.booleanEdit = true;
                vm.inputList = list.title;
            };

            //Editing a task on clicking the pencil glyphicon
            vm.editTask = function (task) {
                task.booleanEdit = true;
                vm.inputTask = task.title;
            };

            //Saving the list on press enter
            vm.saveList = function (list) {
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

            //Save a task on enter press
            vm.saveTask = function (task) {

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

            //Save newly created list byy pressing enter
            vm.saveNewList = function () {
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
                    });
                });
                vm.newList = "";
                vm.booleanNewList = false;
            };

            //Save neewly created task by pressing enter
            vm.saveNewTask = function () {
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

                            console.log("New task");
                            console.log(task);

                        });
                    });


                    vm.newTask = "";
                    vm.booleanNewTask = false;
                });
            };


        }]);
