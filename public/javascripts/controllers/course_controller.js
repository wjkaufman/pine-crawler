angular.module('pineApp', [])
  .filter('keyword', function() {
    return function(course, keyword) {
      if (course.title.indexOf(keyword) >= 0 || 
          course.desc.indexOf(keyword) >= 0) {
            return course
      }
    }
  })
  .controller('courseController', function courseController($scope, $http) {
    $scope.test = 'hello, world!!'
    
    // get course data
    $http.get('/api/courses?subj=ECON')
    .then((res) => {
      $scope.courses = res.data
      console.log(res.data)
    })
  })
