import minify from 'rollup-plugin-babel-minify';
import cleanup from "rollup-plugin-cleanup";

module.exports = {
	input: './src/index.js',
	output: {
		name: 'Segmentize',
		file: 'svg-segmentize.js',
		format: 'umd',
		// format: 'es',
		banner: "/* (c) Robby Kraft, MIT License */"
	},
	plugins: [
		cleanup({
			comments: "none",
			maxEmptyLines: 0
		}),
		minify({
			bannerNewLine: true,
			comments: false
		})
	]
};
