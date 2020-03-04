/**
* Created by J.S.Patrick on 2019/11/20.
* 提供丰富的echarts图库，write once run manytimes
*/
import tool from './util/utils';
import {version} from "../package.json";
import Inspecter from './functional/inspecter'

let database,_echart;
if(window.namespace.morechartsData){
	let dataArray = window.namespace.morechartsData;
	database = {};
	for(let item of dataArray){
		database[item.chartInfo.name] = item.chartInfo.code;
	}
}

class Morecharts {
	constructor(){
		this.verson = version;
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
		_echart = echarts;
		return echarts
	}
}

// 代理 setOption 方法
function ProxyEcharts(ECharts){
	let tempSetOption = ECharts.__proto__.setOption;
	ECharts.__proto__.setOption = new Proxy(tempSetOption, {
		apply(target, thisArg, argArray) {
			if(tool.isType('String',argArray[0])){
				argArray[0] = runScript(argArray[0]);
			}
			if(tool.isType('Object',argArray[1])){
				mixinsOptions(argArray[0],argArray[1]);
			}
			argArray[0] = Inspecter.run(argArray[0]);
			return Reflect.apply(target, thisArg, argArray);
		}
	})
}

function runScript(id) {
	let code = database[id] + `;\nreturn option;`;
	try{
		return new Function('echarts',code)(_echart);
	}catch (e) {
		console.log(e);
	}
}

function mixinsOptions(source, target) {
	// 目标是对象
	if(tool.isType('Object',target)||tool.isType('Array',target)){
		for(let i in target){
			// 获取目标的值
			if(target.hasOwnProperty(i)&&target[i]!==undefined){
				// 若仍然是对象，递归
				// 托不是对象数组，赋值
				// 如果两者类型不同，直接赋值
				if(getType(target[i])!==getType(source[i])){
					source[i] = target[i];
				}else if(tool.isType('Object',target[i])||tool.isType('Array',target[i])){
					mixinsOptions(source[i],target[i])
				}else{
					source[i] = target[i];
				}
			}
		}
	}
}

function getType(target) {
	return Object.prototype.toString.call(target).replace('[object ','').replace(']','')
}

export default new Morecharts()

