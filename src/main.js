/**
* Created by J.S.Patrick on 2019/11/20.
* 提供丰富的echarts图库，write once run manytimes
*/
import tool from './utils'
class Morecharts {
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
		option.series[0].data = tool.deepClone(option.series[0].data);
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
		option.series[0].data = tool.deepClone(option.series[0].data);
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

export default new Morecharts()

