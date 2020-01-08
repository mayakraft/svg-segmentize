import minify from "rollup-plugin-babel-minify";
import babel from "rollup-plugin-babel";
import cleanup from "rollup-plugin-cleanup";

module.exports = [{
  input: "./src/index.js",
  output: {
    name: "Segmentize",
    file: "svg-segmentize.js",
    format: "umd",
    // format: "es",
    banner: "/* (c) Robby Kraft, MIT License\n * makes use of these libraries:\n * - SVG Path Properties by Roger Veciana i Rovira\n * - vkBeautify by Vadim Kiryukhin\n */\n",
  },
  plugins: [
    cleanup({
      comments: "none",
      maxEmptyLines: 0,
    }),
    babel({
      babelrc: false,
      presets: [["@babel/env", { modules: false }]],
    })
  ]
},
{
  input: "src/index.js",
  output: {
    name: "Segmentize",
    file: "svg-segmentize.min.js",
    format: "umd",
    // format: "es",
    banner: "/* (c) Robby Kraft, MIT License\n * makes use of these libraries:\n * - SVG Path Properties by Roger Veciana i Rovira\n * - vkBeautify by Vadim Kiryukhin\n */\n",
  },
  plugins: [
    cleanup({ comments: "none" }),
    babel({
      babelrc: false,
      presets: [["@babel/env", { modules: false }]],
    }),
    minify({ mangle: { names: false } })
  ]
}];
