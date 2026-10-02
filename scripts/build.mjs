import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {execFileSync} from 'node:child_process'
import {buildPackage} from './compiler-package.mjs'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
execFileSync(process.execPath, ['scripts/source-graph.mjs', '--require-siblings'], {cwd:root, stdio:'inherit'})
await buildPackage({root, profiles:[
  {name:'public',config:'lilscript.toml'},
  {name:'development',config:'config/development.toml',mode:'development'},
  {name:'browser',config:'config/browser.toml'},
  {name:'closed',config:'lilscript.closed.toml'},
], aliases:{'react-markdown.raw.js':'react-markdown.esm.js'}})
