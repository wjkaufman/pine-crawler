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
    $scope.courses = []
    $scope.distribs = ['W', 'NW', 'CI', 'ART', 'LIT', 'TMV', 'INT',
        'SOC', 'QDS', 'SCI', 'SLA', 'TAS', 'TLA']
    
    // get list of subjects
    $http.get('/api/subjects')
    .then((res) => {
      $scope.subjects = res.data
    })
    
    // get course data
    $scope.getCourseData = function(subj) {
      $http.get('/api/courses?subj=' + subj)
      .then((res) => {
        $scope.courses = res.data
      })
    }
  })
