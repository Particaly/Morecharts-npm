/*
* 检查器   通过实例化的echarts对象在调用setOption时
* 会先通过该检查器的验证判断
* 触发对应图表类型的数据检查
* 最后将被处理之后的数据返回
* */
import tool from "../util/utils";
import Trigger from './tirgger';

class Inspect {
	constructor(){
		this.tool = tool;
		this.trigger = Trigger;
	}
	run(option){
		option = this.tool.deepClone(option);
		if(this.tool.hasSeries(option)){
			for(let i in option.series){
				if(option.series.hasOwnProperty(i)){
					this.trigger.triggerEvent(option.series[i].type,option.series[i])
				}
			}
		}
		return option
	}
}

export default new Inspect()
