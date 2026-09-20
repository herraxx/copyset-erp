import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const fail = message => { throw new Error(message); };

const html = read('index.html');
const js = read('runtime/copyset-runtime.js');
const css = read('runtime/copyset-runtime.css');

new vm.Script(js, { filename: 'runtime/copyset-runtime.js' });

let braces = 0;
for (const char of css) {
  if (char === '{') braces += 1;
  if (char === '}') braces -= 1;
  if (braces < 0) fail('CSS has an unexpected closing brace.');
}
if (braces !== 0) fail(`CSS brace balance is ${braces}, expected 0.`);

const scriptRefs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
const styleRefs = [...html.matchAll(/<link[^>]+href="([^"]+\.css[^\"]*)"/g)].map(match => match[1]);
if (scriptRefs.length !== 1 || !scriptRefs[0].startsWith('/runtime/copyset-runtime.js')) fail('index.html must load exactly one runtime JavaScript bundle.');
if (styleRefs.length !== 1 || !styleRefs[0].startsWith('/runtime/copyset-runtime.css')) fail('index.html must load exactly one runtime CSS bundle.');

for (const required of ['Tarjous', 'Tilaus', 'Vahvistettu', 'Tuotannossa', 'Valmis', 'Laskutusvalmis', 'Laskutettu', 'TILAUSVAHVISTUS', 'Työkortti', 'Lähete', 'Lähetyslappu']) {
  if (!js.includes(required)) fail(`Required workflow label is missing: ${required}`);
}

if (!css.includes('Canonical mobile contract')) fail('Canonical mobile contract is missing.');
if (!css.includes('@media print')) fail('Print styles are missing.');
if (/\b(?:TODO|FIXME)\b/.test(js + css)) fail('Unresolved TODO/FIXME marker found in runtime files.');

console.log('CopySet ERP release validation passed.');
console.log(JSON.stringify({
  javascriptBytes: Buffer.byteLength(js),
  cssBytes: Buffer.byteLength(css),
  scriptRefs,
  styleRefs
}, null, 2));
