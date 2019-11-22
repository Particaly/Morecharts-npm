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
