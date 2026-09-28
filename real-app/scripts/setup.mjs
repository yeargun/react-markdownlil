// Packs this repository's package exactly as `npm publish` would, installs the
// app against that tarball and the npm registry, installs the micromark 2.0.3
// control, and writes the test corpus.
import {execFileSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const here = path.resolve(import.meta.dirname, '..')
const run = (cmd, args, cwd = here) => execFileSync(cmd, args, {cwd, stdio: 'inherit'})
fs.rmSync(path.join(here, 'pkgs'), {recursive: true, force: true})
fs.mkdirSync(path.join(here, 'pkgs'))
run('npm', ['pack', '--ignore-scripts', '--pack-destination', path.join(here, 'pkgs')], path.resolve(here, '..'))
run('npm', ['install', '--no-audit', '--no-fund'])
// The port is installed from the fresh tarball without touching package.json or the lockfile,
// whose other entries stay pinned.
const tarball = fs.readdirSync(path.join(here, 'pkgs')).find((file) => file.endsWith('.tgz'))
run('npm', ['install', '--no-save', '--no-audit', '--no-fund', `./pkgs/${tarball}`])
run('npm', ['install', '--no-audit', '--no-fund'], path.join(here, 'upstream-203'))
run('npx', ['playwright', 'install', 'chromium', 'firefox'])
run(process.execPath, ['scripts/prepare-corpus.mjs'])
