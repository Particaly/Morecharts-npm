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

export default tool;
