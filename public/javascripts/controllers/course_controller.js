angular.module('pineApp', [])
  .filter('keyword', function() {
    return function(courses, keyword) {
      if (keyword) {
        return courses.filter(function(course) {
          return course.title.toLowerCase()
                        .indexOf(keyword.toLowerCase()) >= 0 ||
                 course.desc.toLowerCase()
                        .indexOf(keyword.toLowerCase()) >= 0
        })
      } else {
        return courses
      }
    }
  })
  .controller('courseController', function courseController($scope, $http) {
    $scope.test = 'hello, world!!'
    
    // get course data
    $http.get('/api/courses?subj=PHYS')
    .then((res) => {
      $scope.courses = res.data
      console.log(res.data)
    })
  })
