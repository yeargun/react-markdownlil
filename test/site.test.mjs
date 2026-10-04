import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {verifyComparison} from '../scripts/build-comparison.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('three independently targeted builds have current artifact and config hashes',()=>{
 const data=verifyComparison(root);
 assert.deepEqual(data.objectives.map(row=>row.objective),['raw','gzip','brotli']);
 for(const row of data.objectives){
  assert.equal(row.metric,{raw:'raw',gzip:'gzip9',brotli:'brotli11'}[row.objective]);
  assert.equal(row.ratio,row.lilscript.sizes[row.metric]/row.original.sizes[row.metric]);
  assert.equal(row.original.sizes[row.metric],Math.min(...data.minifiers.map(m=>m.sizes[row.metric])));
  assert.ok(row.lilscript.buildSeconds>0);assert.ok(row.original.buildSeconds>0);
 }
});
test('public comparison describes current versus original and distinguishes build stages',()=>{
 const html=readFileSync(join(root,'site/index.html'),'utf8');
 const module=readFileSync(join(root,'site/objective-comparison.js'),'utf8');
 assert.match(html,/id="compression-comparison"/);assert.match(html,/id="objective-build-times"/);
 assert.match(module,/separate compilation targeting/);assert.match(module,/upstream package from its original TypeScript sources/);
 assert.doesNotMatch(html,/previous release|previous version|old compiler|earlier compiler|last release/i);
 const data=JSON.parse(readFileSync(join(root,'site/comparison.json'),'utf8'));
 assert.equal(data.schemaVersion,4);assert.ok(data.validation.checks>0);
 assert.ok(data.upstream.sharedExports.length>0);assert.ok(data.minifiers.length>=2);
});
test('built Pages artifact contains the current data and measured downloads',()=>{
 const data=JSON.parse(readFileSync(join(root,'site/comparison.json'),'utf8'));
 assert.equal(readFileSync(join(root,'_site/comparison.json'),'utf8'),readFileSync(join(root,'site/comparison.json'),'utf8'));
 for(const row of data.objectives)for(const item of [row.lilscript,row.original])assert.ok(existsSync(join(root,'_site',item.artifact)));
 for(const file of ['app.js','styles.css','objective-comparison.js','objective-comparison.css','.nojekyll'])assert.ok(existsSync(join(root,'_site',file)),file);
});
test('speed receipt measures the current shipped files on identical input',()=>{
 const perf=JSON.parse(readFileSync(join(root,'site/performance.json'),'utf8'));
 const sha=file=>createHash('sha256').update(readFileSync(join(root,file))).digest('hex').slice(0,16);
 const vendored=file=>readFileSync(join(root,file),'utf8').replace(/(\bfrom\s*)(["'])(react|react\/jsx-runtime)\2/g,'$1"./vendor.mjs"');
 assert.equal(readFileSync(join(root,'site/perf/lil-browser.mjs'),'utf8'),vendored('dist/react-markdown.browser.js'));
 assert.equal(readFileSync(join(root,'site/perf/lil-portable.mjs'),'utf8'),vendored('site/comparison-artifacts/lilscript-brotli.mjs'));
 assert.equal(readFileSync(join(root,'site/perf/original-portable.mjs'),'utf8'),vendored('site/comparison-artifacts/original-terser.mjs'));
 for(const [name,hash] of Object.entries(perf.artifacts))assert.equal(sha(`site/perf/${name}.mjs`),hash,`${name} changed since it was timed; rerun bench/run-all.sh`);
 for(const [doc,{sha256}] of Object.entries(perf.corpus)){assert.equal(sha(`bench/corpus/${doc}.md`),sha256);assert.equal(sha(`site/perf/corpus/${doc}.md`),sha256)}
 assert.ok(perf.runtimes.some(r=>r.id.startsWith('node')));assert.ok(perf.runtimes.some(r=>r.id.startsWith('chromium')));
 for(const rt of perf.runtimes)for(const pair of Object.values(rt.pairs))for(const cell of Object.values(pair.docs))assert.ok(cell.originalMs>0&&cell.lilscriptMs>0);
 for(const file of ['performance.json','performance.js','performance.css','perf/runner.js','perf/bench.html','perf/vendor.mjs'])assert.ok(existsSync(join(root,'_site',file)),file);
});
