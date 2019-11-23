/**
* Created by J.S.Patrick on 2019/11/20.
* 提供丰富的echarts图库，write once run manytimes
*/
import tool from './util/utils';
import { version } from "../package.json";
import Inspecter from './functional/inspecter'

class Morecharts {
	constructor(){
		this.verson = version;
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
			for (let i in argArray){
				// 遍历参数对象，检查是否含有重写的参数 - 检查器
				if(argArray.hasOwnProperty(i)){
					argArray[i] = Inspecter.run(argArray[i])
				}
			}
			return Reflect.apply(...arguments);
		}
	})
}

export default new Morecharts()

