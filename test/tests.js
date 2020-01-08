const { DOMParser, XMLSerializer } = require("xmldom");
const Segmentize = require("../svg-segmentize");

// add booleans into this array
const tests = [];


// test #1
// test all input and output types. svg, string, data
const simpleString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- comment -->
  <rect fill="none" x="10" y="10" width="80" height="80"/>
  <line stroke="black" x1="0" y1="0" x2="100" y2="100"/>
</svg>`;
// convert the above string to an SVG Element
const simpleElement = (new DOMParser()).parseFromString(simpleString, "text/xml").documentElement;
const simpleTest_string_svg = Segmentize(simpleString, { output: "svg" });
const simpleTest_string_string = Segmentize(simpleString, { output: "string" });
const simpleTest_string_data = Segmentize(simpleString, { output: "data" });
const simpleTest_svg_svg = Segmentize(simpleElement, { input: "svg", output: "svg" });
const simpleTest_svg_string = Segmentize(simpleElement, { input: "svg", output: "string" });
const simpleTest_svg_data = Segmentize(simpleElement, { input: "svg", output: "data" });
tests.push(simpleTest_string_string.constructor.name === "String");
tests.push(simpleTest_string_svg.constructor.name === "Element");
tests.push(simpleTest_string_data.constructor.name === "Array");
tests.push(simpleTest_svg_string.constructor.name === "String");
tests.push(simpleTest_svg_svg.constructor.name === "Element");
tests.push(simpleTest_svg_data.constructor.name === "Array");
// Element types, get number of child nodes
tests.push(simpleTest_string_svg.childNodes.length === 5);
tests.push(simpleTest_svg_svg.childNodes.length === 5);
// array data types, get number in the array
tests.push(simpleTest_string_data.length === 5);
tests.push(simpleTest_svg_data.length === 5);


// test #2
// all primitive types
const allPrimitives = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="75 75 350 350" width="45vmax" height="45vmax">
    <style type="text/css">
      .pen { stroke: black; }
      .alpha-fill { fill: rgba(0,0,0,0.2); }
      .no-fill { fill: none; }
    </style>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#f8eed9;"/>
        <stop offset="100%" style="stop-color:#e35536;"/>
      </linearGradient>
    </defs>
    <g>
      <line class="pen" stroke-lineCap="round" stroke-width="3" x1="197.5" y1="185" x2="160" y2="250"/>
      <line class="pen" stroke-lineCap="round" stroke-width="3" x1="340" y1="250" x2="302.5" y2="185"/>
      <rect class="pen alpha-fill" x="187.5" y="92.5" width="75" height="75"/>
      <rect class="pen alpha-fill" x="237.5" y="87.5" width="75" height="75"/>
      <rect class="pen alpha-fill" x="212.5" y="82.5" width="75" height="75"/>
      <circle class="pen" fill="url(#gradient)" cx="350" cy="310" r="40"/>
      <ellipse  transform="rotate(-30 360 200)" class="pen no-fill" stroke-dashArray="7 2 1 2 " cx="360" cy="200" rx="12.5" ry="37.5"/>
      <!-- hexagon -->
      <polygon fill="none" stroke-dashArray="3 3" stroke="black" points="287.5,185 212.5,185 175,250 212.5,315 287.5,315 325,250 "/>
      <!-- hexagon interior -->
      <polyline stroke="#e35536" stroke-width="2" fill="none" points="278.1,201.3 306.2,250 278.1,298.7 221.9,298.7 193.8,250 221.9,201.3 "/>
      <!-- spiral (open path) -->
      <path class="pen no-fill" d="M108.6,217.5c-15.4,30.4-14.1,68.6,3.3,97.8c4.5,7.6,10.7,15,19.3,17c9.1,2.1,18.2-2.5,26.4-7c8.7-4.8,18.3-10.6,20.6-20.3c1.5-6.3-0.6-13-3.5-18.8c-5.5-10.8-15.1-20.6-27.2-21.7c-7.3-0.7-14.6,1.8-21.2,5c-4.7,2.3-9.4,5.1-12,9.7c-3.9,7-1.5,15.9,2.5,22.8c2.8,4.9,6.4,9.4,11.4,12.1c4.9,2.7,11.2,3.3,16.1,0.5c2-1.2,3.8-2.9,4.6-5.1c0.9-2.3,0.7-4.8,0-7.1c-1.1-3.9-3.9-7.5-7.7-8.9s-8.6-0.2-10.8,3.2c-2.2,3.4-0.8,8.8,3,10.3"/>
      <!-- round rect (closed path) -->
      <path style="stroke: black; fill: none;" d="M275.5,322.5h-51c-6.6,0-12,5.4-12,12v51c0,6.6,5.4,12,12,12h51c6.6,0,12-5.4,12-12v-51C287.5,327.9,282.1,322.5,275.5,322.5z"/>
    </g>
  </svg>`;
const testPrimitivesString = Segmentize(allPrimitives);
const testPrimitivesSVG = Segmentize(allPrimitives, { output: "svg" });
const testPrimitivesData = Segmentize(allPrimitives, { output: "data" });
// very rough test. just checking to make sure this string is populated (should be around 51,000)
tests.push(testPrimitivesString.length > 10000);
// these differ by 2, because the SVG contains <defs> and <style> elements
tests.push(testPrimitivesSVG.childNodes.length === 410);
tests.push(testPrimitivesData.length === 408);


// test #3
// simple transform
const lineTransformString = "<line transform='rotate(-90 10 10)' x1='10' y1='10' x2='50' y2='50'/>";
const lineTransformSVG = (new DOMParser())
  .parseFromString(lineTransformString, "text/xml")
  .documentElement;
// presently the "input" option is forgiving. if the input type !== string it runs DOM parse
const lineTransformSegments = Segmentize(lineTransformString, { output: "data" });
tests.push(lineTransformSegments[0][0] === 10
  && lineTransformSegments[0][1] === 10
  && lineTransformSegments[0][2] === 50
  && lineTransformSegments[0][3] === -30);


// test #4
// small and missing data
const min0 = Segmentize("<line x1='1' y1='2' x2='3' y2='4'/>", { output: "data" });
const min1 = Segmentize("<svg><line /></svg>", { output: "data" });
const min2 = Segmentize("<svg><line x1='50' y1='50' x2='100' y2='100' /></svg>", { output: "data" });
tests.push(min0.length === 1);
tests.push(min1.length === 1);
tests.push(min2.length === 1);
tests.push(min0[0][0] === 1 && min0[0][1] === 2 && min0[0][2] === 3 && min0[0][3] === 4);
tests.push(min1[0][0] === 0 && min1[0][1] === 0 && min1[0][2] === 0 && min1[0][3] === 0);


// test #5
// circle resolution
const circle = '<circle cx="100" cy="100" r="50"/>';
const ellipse = '<ellipse cx="100" cy="100" rx="100" ry="50"/>';
const path = '<path d="M10,30A20,20 0,0,1 50,30A20,20 0,0,1 90,30Q90,60 50,90Q10,60 10,30z" />';
const circleResolutionTest1 = Segmentize(circle, { output: "data", resolution: { circle: 50 } });
const circleResolutionTest2 = Segmentize(circle, { output: "data", resolution: { circle: 6 } });
const circleResolutionTest3 = Segmentize(circle, { output: "data", resolution: 20 });
const ellipseResolutionTest1 = Segmentize(ellipse, { output: "data", resolution: { ellipse: 6 } });
const ellipseResolutionTest2 = Segmentize(ellipse, { output: "data", resolution: 20 });
const pathResolutionTest1 = Segmentize(path, { output: "data", resolution: { path: 6 } });
const pathResolutionTest2 = Segmentize(path, { output: "data", resolution: 20 });
tests.push(circleResolutionTest1.length === 50);
tests.push(circleResolutionTest2.length === 6);
tests.push(circleResolutionTest3.length === 20);
tests.push(ellipseResolutionTest1.length === 6);
tests.push(ellipseResolutionTest2.length === 20);
tests.push(pathResolutionTest1.length === 6);
tests.push(pathResolutionTest2.length === 20);


// test #6
// nested transforms
const nested_transforms = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" transform="translate(100 100)">
  <rect width="10" height="10"/>
  <g transform="translate(50 50)">
    <rect width="10" height="10"/>
    <g transform="rotate(45)">
      <rect width="10" height="10"/>
      <g transform="translate(-150 -150)">
        <rect width="10" height="10"/>
        <g transform="translate(10 10)">
          <rect width="10" height="10"/>
        </g>
      </g>
      <g transform="scale(0.707)">
        <rect width="10" height="10"/>
      </g>
    </g>
  </g>
</svg>`;

const nested = Segmentize(nested_transforms, { output: "data" });
// console.log("nested", nested);
// todo, need to figure out a way to test this. a visual look of it checks out.

// const m = Segmentize.transformStringToMatrix("translate(1,2),scale(0.5,-5),a(1,1,2,3),b(1)");
// const m2 = Segmentize.transformStringToMatrix("translate(1 2) scale(0.5 -5) a(1 1 2 3) b(1)");
// console.log(m);
// console.log(m2);
// const m3 = Segmentize.transformStringToMatrix("rotate(180) matrix(1,0,0,-1,0,0) translate(10, 0) skewX(10) skewY(2) scale(2, 2)");
// console.log(m3);


if (tests.reduce((a, b) => a && b, true)) {
  console.log("tests passed");
} else {
  throw new Error("tests failed");
}
