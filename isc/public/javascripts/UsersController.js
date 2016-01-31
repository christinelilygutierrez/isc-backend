var iscApp = angular.module("iscApp",[]);

iscApp.controller("UsersController", ['$scope', '$http', '$window', function($scope, $http, $window){
      var response=$http({
          method :'GET',
          url : '/api/users',
          headers:{
            'x-access-token': $window.sessionStorage.token
          }
      });
      response.then(function successCallback(response){
        //response.users=response.data;
        //console.log(response);
        $scope.users=response.data;
      }, function errorCallback(response){
        //response.message=response.message;
      });
}]);
