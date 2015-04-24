(function (angular) {
'use strict';

angular.module('mvd.mathjax', ['ngSanitize'])
  .provider('mathjax', function () {
    var _initialized = false
      , _mj
      , _baseUrl = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config={$CONFIG}&delayStartupUntil=configured'
      , _config = 'TeX-AMS-MML_HTMLorMML'
      , _opts = {
        tex2jax: {
          inlineMath: [['$','$'], ['\\(','\\)']]
        }
      };

    var _configure = function () {
      _mj.Hub.Config(_opts);
      _mj.Hub.Configured();
      _initialized = true;
    };

    var loadAndConfigure = function (w, d, config, opts) {
      var url = _baseUrl.replace('{$CONFIG}', config);
      w.MathJax = {
        AuthorInit: function () {
          _mj = w.MathJax;
          _mj.Hub.Register.StartupHook("Begin Config", _configure);
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
      return {};
    }];

    return this;
  })
  .run(['mathjax', function (mathjax) {

  }])
})(angular);