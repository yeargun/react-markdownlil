import {cp, mkdir, copyFile, readFile, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {execFileSync} from 'node:child_process'
import {buildPackage} from './compiler-package.mjs'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
execFileSync(process.execPath, ['scripts/source-graph.mjs', '--require-siblings'], {cwd:root, stdio:'inherit'})
const stage = resolve(root, '.tmp/conditions/node')
await mkdir(stage, {recursive: true})
await cp(resolve(root, 'src'), stage, {recursive: true})
await copyFile(resolve(root, 'package-conditions/node.lil'), resolve(stage, 'graph/unified/vfile-imports.lil'))
const entry = resolve(stage, 'index.lil')
await writeFile(entry, 'import extern "node:path";\nimport extern "node:process";\nimport extern "node:url";\n' + await readFile(entry, 'utf8'))
await buildPackage({root, profiles:[
  {name:'public',config:'lilscript.toml'},
  {name:'development',config:'config/development.toml',mode:'development'},
  {name:'browser',config:'config/browser.toml'},
  {name:'closed',config:'lilscript.closed.toml'},
  {name:'worker',config:'config/worker.toml'},
  {name:'worker-development',config:'config/worker-development.toml',mode:'development'},
  {name:'browser-development',config:'config/browser-development.toml',mode:'development'},
], aliases:{'react-markdown.raw.js':'react-markdown.esm.js'}})
