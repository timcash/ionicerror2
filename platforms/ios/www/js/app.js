window.localStorage['projects'] = "";

angular.module('todo', ['ionic',"firebase"])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
    .factory('Projects', function() {
        return {
            all: function() {
                var projectString = window.localStorage['projects'];
                if(projectString) {
                    return angular.fromJson(projectString);
                }
                return [];
            },
            save: function(projects) {
                window.localStorage['projects'] = angular.toJson(projects);
            },
            newProject: function(projectTitle) {
                // Add a new project
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
            getLastActiveIndex: function() {
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },
            setLastActiveIndex: function(index) {
                window.localStorage['lastActiveProject'] = index;
            }
        }
    })

    .controller('TodoCtrl', function($scope, $firebase, $timeout, Modal, Projects) {

        $scope.projects2 = {};
        $scope.user = {};

        $scope.projects2 = $firebase(new Firebase("https://scoreboard3.firebaseio.com/projects"));

        $scope.user = $firebase(new Firebase("https://scoreboard3.firebaseio.com/Users/Tim"));

        $scope.projects2.$on("loaded", function() {
            console.log($scope.projects2);
            window.projects2 = $scope.projects2;
        });

        $scope.projects2.$on("loaded", function() {
            console.log($scope.user);
            window.user = $scope.user;
        });
        // A utility function for creating a new project
        // with the given projectTitle
        var createProject = function(projectTitle) {
            //var newProject = Projects.newProject(projectTitle);
            //var newproj = $scope.projects2.$child(projectTitle);
           // newproj = [];
            //newproj.$save();
            $scope.projects2[projectTitle] = [];
            $scope.projects2.$save(projectTitle);
            $scope.selectProject(projectTitle);
        }



        // Called to create a new project
        $scope.newProject = function() {
            var projectTitle = prompt('Project name');
            if(projectTitle) {
                createProject(projectTitle);
            }
        };

        // Called to select the given project
        $scope.selectProject = function(project) {
            $scope.user.lastproject = project;
            $scope.sideMenuController.close();
        };

        // Create our modal
        Modal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        $scope.createTask = function(task) {
            if(!$scope.user.lastproject) {
                return;
            }

            var name = $scope.user.lastproject;
            $scope.projects2[name].push(task.title);
            $scope.projects2.$save(name);
            $scope.taskModal.hide();

            task.title = "";
        };

        $scope.newTask = function() {
            $scope.taskModal.show();
        };

        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        }

        $scope.toggleProjects = function() {
            $scope.sideMenuController.toggleLeft();
        };

    });