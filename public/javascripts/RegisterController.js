var iscApp = angular.module('iscApp', []);
iscApp.controller('RegisterController', ['$scope','$http', function($scope, $http) {
  $scope.register=function(user){
    console.log(user);
    var payload=JSON.stringify(user)
    var response=$http({
        method : "POST",
        url : "/api/register",
        data: payload,
        headers: {
                'Content-Type': 'application/json'
     }
    });
    response.then(function mySucces(response) {
      console.log(response.data);

    }, function myError(response) {
      console.log(response.data);
    });
  }
}]);
