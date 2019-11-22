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
