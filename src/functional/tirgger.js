/*
* 触发器   inspecter调用该触发器
* 触发handler中的所有类型的参数判断
* 同一种类型可以检查不同参数 验证并修改为预定的格式
* */
import { pieHandler } from "./handler/pie";

class Tirgger {
	constructor(){
		this.handler = {
			pie:pieHandler
		}
	}
	triggerEvent(type, series){
		if(this.handler.hasOwnProperty(type)){
			this.handler[type](series)
		}
	}
}

export default new Tirgger()
