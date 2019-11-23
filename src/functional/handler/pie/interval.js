export default function (series) {
	let flag = series.interval;
	if(flag==='auto'){
		let data = series.data;
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
		let data = series.data;
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
