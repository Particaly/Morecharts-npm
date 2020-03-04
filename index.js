(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Morecharts = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 工具函数
  var tool = {
    deepClone: function deepClone(source) {
      var targetObj = source.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象

      for (var keys in source) {
        // 遍历目标
        if (source.hasOwnProperty(keys)) {
          if (source[keys] && _typeof(source[keys]) === 'object') {
            // 如果值是对象，就递归一下
            targetObj[keys] = source[keys].constructor === Array ? [] : {};
            targetObj[keys] = this.deepClone(source[keys]);
          } else {
            // 如果不是，就直接赋值
            targetObj[keys] = source[keys];
          }
        }
      }

      return targetObj;
    },
    isType: function isType(type, target) {
      var Tag = "[object ".concat(type, "]");
      return Object.prototype.toString.call(target) === Tag;
    },
    hasSeries: function hasSeries(source) {
      return !!(source === null || source === void 0 ? void 0 : source.series);
    }
  };

  var version = "0.1.0";

  function interval (series) {
    var flag = series.interval;

    if (flag === 'auto') {
      var data = series.data;
      var total = 0;

      for (var i in data) {
        total += Number(data[i].value || data[i]);
      }

      for (var _i in data) {
        data.splice(2 * _i + 1, 0, {
          name: '',
          value: total * 0.04,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        });
      }
    } else if (flag) {
      if (window.isNaN(flag)) {
        throw new TypeError("interval need to be a number or 'auto'");
      }

      var _data = series.data;
      var _total = 0;

      for (var _i2 in _data) {
        _total += Number(_data[_i2].value || _data[_i2]);
      }

      for (var _i3 in _data) {
        _data.splice(2 * _i3 + 1, 0, {
          name: '',
          value: _total * flag / 100,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        });
      }
    }
  }

  var handbox = {
    interval: interval
  };

  function pieHandler(series) {
    for (var eventer in handbox) {
      if (handbox.hasOwnProperty(eventer) && (series === null || series === void 0 ? void 0 : series[eventer])) {
        handbox[eventer](series);
      }
    }
  }

  var Tirgger =
  /*#__PURE__*/
  function () {
    function Tirgger() {
      _classCallCheck(this, Tirgger);

      this.handler = {
        pie: pieHandler
      };
    }

    _createClass(Tirgger, [{
      key: "triggerEvent",
      value: function triggerEvent(type, series) {
        if (this.handler.hasOwnProperty(type)) {
          this.handler[type](series);
        }
      }
    }]);

    return Tirgger;
  }();

  var Trigger = new Tirgger();

  var Inspect =
  /*#__PURE__*/
  function () {
    function Inspect() {
      _classCallCheck(this, Inspect);

      this.tool = tool;
      this.trigger = Trigger;
    }

    _createClass(Inspect, [{
      key: "run",
      value: function run(option) {
        option = this.tool.deepClone(option);

        if (this.tool.hasSeries(option)) {
          for (var i in option.series) {
            if (option.series.hasOwnProperty(i)) {
              this.trigger.triggerEvent(option.series[i].type, option.series[i]);
            }
          }
        }

        return option;
      }
    }]);

    return Inspect;
  }();

  var Inspecter = new Inspect();

  var database, _echart;

  if (window.namespace.morechartsData) {
    var dataArray = window.namespace.morechartsData;
    database = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = dataArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        database[item.chartInfo.name] = item.chartInfo.code;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  var Morecharts =
  /*#__PURE__*/
  function () {
    function Morecharts() {
      _classCallCheck(this, Morecharts);

      this.verson = version;
    }
    /*
    * 初始化echarts,返回值是被代理的echarts
    * */


    _createClass(Morecharts, [{
      key: "init",
      value: function init(echarts) {
        // 中间参数，先保存init方法，并挂上代理
        var tempInit = echarts.init; // 挂回去，实际运行的必须是 proxy 对象，代理 init 方法

        echarts.init = new Proxy(tempInit, {
          apply: function apply(target, thisArg, argArray) {
            /*
            * target      : 被代理的init原始方法
            * thisArg     : echarts对象     // 暂时不清楚是如何拿到的
            * argArray    : 参数列表
            * */
            if (tool.isType('String', argArray[0])) {
              argArray[0] = document.querySelector(argArray[0]);
            }

            var ECharts = Reflect.apply.apply(Reflect, arguments); // ECharts实例的原型对象是同一个原型，所以不要重复挂代理

            if (!ECharts.__proto__.isMorechartLoaded) {
              ProxyEcharts(ECharts); // 再次挂上代理

              ECharts.__proto__.isMorechartLoaded = true;
            } // let ECharts = target.apply(thisArg, argArray);      // 直接运行得到返回值


            return ECharts; // 返回被初始化了的 echarts 对象
          }
        });
        _echart = echarts;
        return echarts;
      }
    }]);

    return Morecharts;
  }(); // 代理 setOption 方法


  function ProxyEcharts(ECharts) {
    var tempSetOption = ECharts.__proto__.setOption;
    ECharts.__proto__.setOption = new Proxy(tempSetOption, {
      apply: function apply(target, thisArg, argArray) {
        if (tool.isType('String', argArray[0])) {
          argArray[0] = runScript(argArray[0]);
        }

        if (tool.isType('Object', argArray[1])) {
          mixinsOptions(argArray[0], argArray[1]);
        }

        argArray[0] = Inspecter.run(argArray[0]);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }

  function runScript(id) {
    var code = database[id] + ";\nreturn option;";

    try {
      return new Function('echarts', code)(_echart);
    } catch (e) {
      console.log(e);
    }
  }

  function mixinsOptions(source, target) {
    // 目标是对象
    if (tool.isType('Object', target) || tool.isType('Array', target)) {
      for (var i in target) {
        // 获取目标的值
        if (target.hasOwnProperty(i) && target[i] !== undefined) {
          // 若仍然是对象，递归
          // 托不是对象数组，赋值
          // 如果两者类型不同，直接赋值
          if (getType(target[i]) !== getType(source[i])) {
            source[i] = target[i];
          } else if (tool.isType('Object', target[i]) || tool.isType('Array', target[i])) {
            mixinsOptions(source[i], target[i]);
          } else {
            source[i] = target[i];
          }
        }
      }
    }
  }

  function getType(target) {
    return Object.prototype.toString.call(target).replace('[object ', '').replace(']', '');
  }

  var main = new Morecharts();

  return main;

})));
