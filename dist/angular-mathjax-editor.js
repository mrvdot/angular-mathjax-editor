(function (angular) {
'use strict';

angular.module('mvd.mathjax', ['ngSanitize'])
  .provider('mathjax', function () {
    var _initialized = false
      , _mj = {
        ready: false,
        _onReady: []
      }
      , _baseUrl = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config={$CONFIG}&delayStartupUntil=configured'
      , _config = 'TeX-AMS-MML_HTMLorMML'
      , _opts = {
        tex2jax: {
          inlineMath: [['$','$'], ['\\(','\\)']]
        }
      };

    var _configure = function () {
      _mj.m.Hub.Config(_opts);
      _mj.m.Hub.Configured();
      _initialized = true;
    };

    var loadAndConfigure = function (w, d, config, opts) {
      var url = _baseUrl.replace('{$CONFIG}', config);
      w.MathJax = {
        AuthorInit: function () {
          var cbs = _mj._onReady;
          _mj.m = w.MathJax;
          _mj.m.Hub.Register.StartupHook("Begin Config", _configure);
          _mj.m.Hub.Register.StartupHook("End", function () {
            _mj.ready = true;
            for (var i = 0, ii = cbs.length; i < ii; i++) {
              cbs[i]();
            }
          });
        }
      }
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src  = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    this.options = function (opt, val) {
      if (!opt) {
        return _opts;
      } else if (_initialized) {
        throw "Trying to set MathJax options after already initialized";
      } else if (angular.isObject(obj)) {
        if (val === true) {
          angular.copy(opt, _opts);
        } else {
          angular.extend(_opts, opt);
        }
      } else {
        _opts[opt] = val;
      }
      return this;
    }

    this.$get = ['$window', '$document', function ($window, $document) {
      loadAndConfigure($window, $document[0], _config, _opts);
      return _mj;
    }];

    return this;
  })
  .directive('equationEditor', ['mathjax', function (mathjax) {
    return {
      template: '<div class="equation-editor">' +
        '<input type="hidden" value="{{equationText}}" />' +
        '<div class="equation-display"></div>' +
      '</div>',
      replace: true,
      require: 'ngModel',
      link: function ($scope, $element, $attrs, ngModel) {
        var jax;

        var render = function () {
          $scope.equationText = ngModel.$viewValue;
          if (!$scope.equationText) {
            return;
          };
          if (!jax) {
            var jaxs = mathjax.m.Hub.getAllJax($element[0]);
            if (!jaxs || !jaxs.length) {
              $element.find('.equation-display').html(ngModel.$viewValue);
              mathjax.m.Hub.Queue(['Typeset', mathjax.m.Hub, $element[0]]);
              return;
            };
            jax = jaxs[0];
          };
          mathjax.m.Hub.Queue(['Text', jax, ngModel.$viewValue]);
        }

        if (!mathjax.ready) {
          ngModel.$render = angular.noop;
          mathjax._onReady.push(function () {
            render();
            ngModel.$render = render;
          });
        } else {
          ngModel.$render = render;
        }
      }
    }
  }])
  .run(['mathjax', function (mathjax) {

  }])
})(angular);