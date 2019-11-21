"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Created by J.S.Patrick on 2019/11/20.
 * 提供丰富的echarts图库，write once run manytimes
 */
// UMD魔法代码
// if the module has no dependencies, the above pattern can be simplified to
(function (factory) {
  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
    // commonjs模块规范，nodejs环境
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD模块规范，如require.js
    define(factory);
  } else if (typeof define === 'function' && define.cmd) {
    // CMD模块规范，如sea.js
    define(function (require, exports, module) {
      module.exports = factory();
    });
  } else {
    // 没有模块环境，直接挂载在全局对象上
    window.Morechart = factory();
  }
})(function () {
  var Morechart =
  /*#__PURE__*/
  function () {
    function Morechart() {
      _classCallCheck(this, Morechart);

      this.verson = '0.0.1';
      this.token = null;
      this.server = null;
    }
    /*
    * 初始化echarts,返回值是被代理的echarts
    * */


    _createClass(Morechart, [{
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
        return echarts;
      }
    }]);

    return Morechart;
  }(); // 代理 setOption 方法


  function ProxyEcharts(ECharts) {
    var tempSetOption = ECharts.__proto__.setOption;
    ECharts.__proto__.setOption = new Proxy(tempSetOption, {
      apply: function apply(target, thisArg, argArray) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = argArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var option = _step.value;
            // 遍历参数对象，检查是否含有重写的参数 - 检查器
            inspect(option);
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

        return Reflect.apply.apply(Reflect, arguments);
      }
    });
  }

  var Inspect =
  /*#__PURE__*/
  function () {
    function Inspect() {
      _classCallCheck(this, Inspect);
    }

    _createClass(Inspect, [{
      key: "run",
      value: function run() {}
    }]);

    return Inspect;
  }(); // 检查器


  function inspect(option) {
    if (tool.hasSeries(option)) {
      if (option.series[0].type === 'pie') {
        triggerPie(option);
      }
    }
  } // 触发器 - 触发对应的操作


  function triggerPie(option) {
    var flag = option.series[0].interval;

    if (flag === 'auto') {
      option.series[0].data = tool.deepClone(option.series[0].data);
      var data = option.series[0].data;
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

      option.series[0].data = tool.deepClone(option.series[0].data);
      var _data = option.series[0].data;
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
  } // 工具函数


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
  return new Morechart();
});
