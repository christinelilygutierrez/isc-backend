var iscApp = angular.module('iscApp', ['ngFileUpload']);
iscApp.controller("UploadCtrl", ['$scope', 'Upload', function($scope, Upload){
  $scope.submit = function() {
    console.log("submit start");
    if ($scope.form.file.$valid && $scope.file) {
      console.log("Getting ready to call the submit");
      $scope.upload($scope.file);
    }
    console.log("submit end");
  };
  // upload on file select or drop
  $scope.upload = function (file) {
      Upload.upload({
          url: 'api/upload/image',
          data: {file: file}
      }).then(function (response) {
          console.log('Success ' + response.config.data.file.name + ' uploaded. Response status: ' + response.status);
      }, function (response) {
          console.log('Error status: ' + response.status);
      }, function (event) {
          var progressPercentage = parseInt(100.0 * event.loaded / event.total);
          console.log('progress: ' + progressPercentage + '% ' + event.config.data.file.name);
      });
  };
}]);
