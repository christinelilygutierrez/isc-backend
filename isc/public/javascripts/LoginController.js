var iscApp = angular.module('iscApp', []);
iscApp.controller('LoginController', ['$scope','$http', '$window', function($scope, $http, $window) {
  $scope.login=function(user){
    console.log(user);
    var payload=JSON.stringify(user)
    var response=$http({
        method : "POST",
        url : "/api/authenticate",
        data: payload,
        headers: {
                'Content-Type': 'application/json'
     }
    });
    response.then(function mySucces(response) {
      console.log(response.data);

      $window.sessionStorage.token = response.data.token;
      $scope.message=response.data.message;

    }, function myError(response) {
      console.log(response.data);

      delete $window.sessionStorage.token;
      $scope.message=response.data.message;
    });
  }
}]);
