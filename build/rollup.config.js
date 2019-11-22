import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/main.js',
	output: {
		file: 'index.js',
		format: 'umd',
		name: 'Morecharts'
	},
	plugins: [
		resolve(),
		json(),
		babel({
			exclude: 'node_modules/**' // 只编译我们的源代码
		})
	]
};
