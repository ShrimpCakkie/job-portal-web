import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const project = new URL('../', import.meta.url);
const source = new URL('src/', project);
const theme = await readFile(new URL('theme.css', source), 'utf8');
const html = await readFile(new URL('index.html', project), 'utf8');
const failures = [];

const colorProperty = /^(?:--|(?:-webkit-)?(?:color|background|border|outline|box-shadow|text-shadow|filter|fill|stroke|caret-color|accent-color|scrollbar-color|text-decoration|text-emphasis|column-rule|text-fill-color|text-stroke)(?:-|$))/i;
const colorLiteral = /#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![\w-])|\b(?:rgba?|hsla?|hwb|(?:ok)?lab|(?:ok)?lch|color|device-cmyk)\s*\(/i;
const namedColors = new Set(`
  aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown
  burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan
  darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid
  darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet
  deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro
  ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki
  lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow
  lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray
  lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine
  mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise
  mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab
  orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff
  peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown
  seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan
  teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen
`.trim().split(/\s+/));

function hasColorLiteral(value) {
  const colorValue = value.replace(/\burl\([^)]*\)|--[\w-]+/gi, '');
  const words = colorValue.toLowerCase().match(/[a-z][\w-]*/g) ?? [];
  return colorLiteral.test(colorValue) || words.some(word => namedColors.has(word));
}

function checkValue(file, contents, offset, property, value) {
  if (!colorProperty.test(property) || !hasColorLiteral(value)) return;
  const line = contents.slice(0, offset).split('\n').length;
  failures.push(`${file}:${line} ${property} must use a color variable from src/theme.css.`);
}

function checkStylesheet(file, contents) {
  const css = contents.replace(/\/\*[\s\S]*?\*\//g, comment => comment.replace(/[^\n]/g, ' '));
  for (const declaration of css.matchAll(/(?:^|[;{])\s*([\w-]+)\s*:\s*([^;{}]+)/g)) {
    checkValue(file, css, declaration.index, declaration[1], declaration[2]);
  }
}

function checkComponent(file, contents) {
  // Check directly authored JSX attributes and style properties without treating page copy as a CSS color.
  const properties = /(?:\b([a-z][\w]*)|['"](--[\w-]+)['"])\s*[:=]\s*\{?\s*(['"`])([^'"`\r\n]*)\3/gi;
  for (const match of contents.matchAll(properties)) {
    const property = (match[1] ?? match[2]).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    checkValue(file, contents, match.index, property, match[4]);
  }
}

for (const entry of await readdir(source, { recursive: true })) {
  if (entry === 'theme.css' || !/\.(?:css|[jt]sx?)$/.test(entry)) continue;
  const file = join('src', entry);
  const contents = await readFile(new URL(file, project), 'utf8');
  if (entry.endsWith('.css')) checkStylesheet(file, contents);
  else checkComponent(file, contents);
}

const pageColor = theme.match(/--color-page:\s*(#[\da-f]{6})\s*;/i)?.[1].toLowerCase();
const browserColor = html.match(/<meta\s+name="theme-color"\s+content="(#[\da-f]{6})"/i)?.[1].toLowerCase();
if (!pageColor || browserColor !== pageColor) {
  failures.push('index.html theme-color must match --color-page in src/theme.css.');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Theme color variables and browser theme color passed.');
}
