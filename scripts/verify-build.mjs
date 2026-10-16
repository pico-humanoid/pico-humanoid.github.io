import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve('dist');
assert.ok(existsSync(root), 'Run npm run build before verifying the output.');
const expected = ['index.html', 'guides/index.html', 'platform/mechanism/index.html', 'platform/electronics/index.html', 'platform/firmware/index.html', 'platform/software/index.html', 'research/publications/index.html', 'about/team/index.html', '404.html'];
expected.forEach(file => assert.ok(existsSync(join(root, file)), `Missing page: ${file}`));

const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) files.push(path);
  }
}
walk(root);
assert.equal(files.length, expected.length, 'Unexpected number of generated pages.');
const titles = new Set();
let references = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  assert.match(html, /<html\b[^>]*\blang="zh-CN"/, `Missing language: ${file}`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title, `Missing title: ${file}`);
  assert.ok(!titles.has(title), `Duplicate title: ${title}`);
  titles.add(title);
  assert.match(html, /name="description"/, `Missing description: ${file}`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    const value = match[1];
    assert.ok(value && value !== '#', `Empty destination: ${file}`);
    assert.ok(!value.startsWith('javascript:'), `Invalid destination: ${file}`);
    if (/^(?:https?:|data:|mailto:|tel:|\/\/)/.test(value)) continue;
    const url = new URL(value, 'https://local.invalid/' + file.slice(root.length + 1).replaceAll('\\', '/'));
    let target = value.startsWith('#') ? file : value.startsWith('/') ? join(root, decodeURIComponent(url.pathname)) : resolve(dirname(file), value.split(/[?#]/)[0]);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    assert.ok(existsSync(target), `Broken local link: ${value} in ${file}`);
    if (url.hash) {
      const targetHtml = readFileSync(target, 'utf8');
      const ids = [...targetHtml.matchAll(/\bid="([^"]+)"/g)].map(item => item[1]);
      assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))), `Missing anchor: ${value} in ${file}`);
    }
    references++;
  }
}
assert.ok(existsSync(join(root, 'assets/PICO.png')), 'Missing logo.');
assert.ok(existsSync(join(root, 'robots.txt')), 'Missing robots.txt.');
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
assert.equal([...sitemap.matchAll(/<loc>/g)].length, 8, 'Sitemap must contain eight content pages.');
console.log(`Verified ${files.length} pages, ${references} local links/assets, eight sitemap entries, and the logo.`);
