import interval from './interval'

let handbox = {
	interval
};

function pieHandler(series){
	for(let eventer in handbox){
		if(handbox.hasOwnProperty(eventer)&&series?.[eventer]){
			handbox[eventer](series)
		}
	}
}

export { pieHandler }
