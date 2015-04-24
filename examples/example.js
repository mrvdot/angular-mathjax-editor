(function (angular) {
'use strict';

angular.module('exampleApp', ['mvd.mathjax'])
  .controller('MathCtrl', function ($scope) {
    $scope.math = {
      equation: [
        '<math>',
        '<mrow>',
        '<mi>a</mi> <mo>&InvisibleTimes;</mo> <msup><mi>x</mi><mn>2</mn></msup>',
        '<mo>+</mo><mi>b</mi><mo>&InvisibleTimes;</mo><mi>x</mi>',
        '<mo>+</mo><mi>c</mi>',
        '</mrow>',
        '</math>'
      ].join('\r\n')
    }
  })
})(angular);