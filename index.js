/**
 * Created by J.S.Patrick on 2019/11/20.
 * 提供丰富的echarts图库，write once run manytimes
 */
// UMD魔法代码
// if the module has no dependencies, the above pattern can be simplified to
(function(root, factory) {
	if (typeof module === 'object' && typeof module.exports === 'object') {
		// commonjs模块规范，nodejs环境
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		// AMD模块规范，如require.js
		define(factory)
	} else if (typeof define === 'function' && define.cmd) {
		// CMD模块规范，如sea.js
		define(function(require, exports, module) {
			module.exports = factory()
		})
	} else {
		// 没有模块环境，直接挂载在全局对象上
		root.Morechart = factory();
	}
}(this, function() {
	class Morechart {
		constructor(){
			this.verson = '0.0.1';
			this.token = null;
			this.server = null;
		}
		/*
		* 初始化echarts,返回值是被代理的echarts
		* */
		init(echarts){
			// 中间参数，先保存init方法，并挂上代理
			let tempInit = echarts.init;
			// 挂回去，实际运行的必须是 proxy 对象，代理 init 方法
			echarts.init = new Proxy(tempInit,{
				apply :function (target, thisArg, argArray) {
					/*
					* target      : 被代理的init原始方法
					* thisArg     : echarts对象     // 暂时不清楚是如何拿到的
					* argArray    : 参数列表
					* */
					if(tool.isType('String',argArray[0])){argArray[0] = document.querySelector(argArray[0])}
					let ECharts = Reflect.apply(...arguments);
					// ECharts实例的原型对象是同一个原型，所以不要重复挂代理
					if(!ECharts.__proto__.isMorechartLoaded){
						ProxyEcharts(ECharts);      // 再次挂上代理
						ECharts.__proto__.isMorechartLoaded = true;
					}
					// let ECharts = target.apply(thisArg, argArray);      // 直接运行得到返回值
					return ECharts              // 返回被初始化了的 echarts 对象
				}
			});
			return echarts
		}
	}
	
	// 代理 setOption 方法
	function ProxyEcharts(ECharts){
		let tempSetOption = ECharts.__proto__.setOption;
		ECharts.__proto__.setOption = new Proxy(tempSetOption, {
			apply(target, thisArg, argArray) {
				for (let option of argArray){
					// 遍历参数对象，检查是否含有重写的参数 - 检查器
					inspect(option)
				}
				return Reflect.apply(...arguments);
			}
		})
	}
	
	class Inspect {
		constructor(){
		
		}
		run(){
		
		}
	}
	
	
	
	// 检查器
	function inspect(option) {
		if(tool.hasSeries(option)){
			if(option.series[0].type==='pie'){
				triggerPie(option)
			}
		}
		
	}
	
	// 触发器 - 触发对应的操作
	function triggerPie(option) {
		let flag = option.series[0].interval;
		if(flag==='auto'){
			option.series[0].data = deepClone(option.series[0].data);
			let data = option.series[0].data;
			let total = 0;
			for(let i in data){
				total+=Number(data[i].value||data[i]);
			}
			for(let i in data){
				data.splice(2*i+1,0,{
					name:'',
					value: total*0.04,
					label:{
						show:false,
					},
					labelLine:{
						show:false,
					},
					itemStyle: {
						color: 'rgba(0,0,0,0)',
						borderWidth: 0,
						borderColor: 'rgba(0,0,0,0)'
					}
				})
			}
		}else if(flag){
			if(window.isNaN(flag)){
				throw new TypeError("interval need to be a number or 'auto'")
			}
			option.series[0].data = deepClone(option.series[0].data);
			let data = option.series[0].data;
			let total = 0;
			for(let i in data){
				total+=Number(data[i].value||data[i]);
			}
			for(let i in data){
				data.splice(2*i+1,0,{
					name:'',
					value: total*flag/100,
					label:{
						show:false,
					},
					labelLine:{
						show:false,
					},
					itemStyle: {
						color: 'rgba(0,0,0,0)',
						borderWidth: 0,
						borderColor: 'rgba(0,0,0,0)'
					}
				})
			}
		}
	}
	
	
	
	// 工具函数
	let tool = {
		deepClone: function (source){
			const targetObj = source.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
			for(let keys in source){ // 遍历目标
				if(source.hasOwnProperty(keys)){
					if(source[keys] && typeof source[keys] === 'object'){ // 如果值是对象，就递归一下
						targetObj[keys] = source[keys].constructor === Array ? [] : {};
						targetObj[keys] = this.deepClone(source[keys]);
					}else{ // 如果不是，就直接赋值
						targetObj[keys] = source[keys];
					}
				}
			}
			return targetObj;
		},
		isType: function (type,target){
			const Tag = `[object ${type}]`;
			return Object.prototype.toString.call(target) === Tag
		},
		hasSeries: function (source) {
			return !!source?.series
		}
	};
	
	return new Morechart()
}));
