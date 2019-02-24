import minify from 'rollup-plugin-babel-minify';

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
		minify( {
			bannerNewLine: true,
			comments: false
		} )
	]
};
