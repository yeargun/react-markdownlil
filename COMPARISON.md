# Current comparison with the original

Portable main-entry ESM with matching shared named exports and external imports. The original uses production/default package conditions. Package Node, browser and development variants are tested separately.

Each compression row uses a separate LilScript compilation targeting that objective. Original results are the smallest of Terser, esbuild and Oxc for the named codec.

| Objective | LilScript bytes | Original minified bytes | Original minifier | LilScript build (s) | Original bundle + minify (s) |
|---|---:|---:|---|---:|---:|
| raw | 117,050 | 146,329 | Terser | 63.454 | 2.354 |
| gzip | 44,398 | 46,814 | Terser | 77.829 | 2.354 |
| brotli | 37,684 | 41,092 | Terser | 163.961 | 2.354 |

Original version: `react-markdown@10.1.0`. gzip level 9; Brotli quality 11/window 22. Each time is one sequential fresh-output build on the recorded shared machine. Original timing starts from installed ESM and does not include the original repository’s TypeScript compilation. Dependency installation, tests and final file compression are excluded.

Validation: 2,895 checks across raw, gzip and Brotli main entries. This does not cover every package format or establish complete upstream API equivalence.

[Artifacts, hashes and settings](site/comparison.json) · [Commands, source identities and timings](site/comparison-builds.json) · [Exact checked source inputs](site/comparison-artifacts/sources.tar.gz).
