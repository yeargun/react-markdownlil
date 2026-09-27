# Source-build measurements

Measured 2026-09-27T16:12:27Z on this port's release host (Azure Standard_B8als_v2, 8 vCPUs, Node v24.11.1) using LilScript `249686599dc3bf1b6bf70dc9a030081b755bbb24` (binary SHA-256 `47048e41164027e92d3bf1d1840d8d83e04c60532c031ceb3346222e194b3041`) and the upstream Git revision recorded in `job.json`.

`result.json` records the commands, wall time, CPU time, machine and exit codes, and every compiler invocation of each LilScript build. `esm.json` records the production ESM assembly of the original and its exact input graph; it resolves the browser graph (`decode-named-character-reference/index.dom.js`), which ships no entity table, so the page compares it with the port's browser build. The lockfiles record dependency resolution. The public page uses `site/source-build.json` for the consolidated record.

The protocol is comparison/page-refresh/source-build-worker.py of the LilScript repository, run on this host instead of the retired build pool: three clean builds per lane in alternating order, dependency installation excluded. Build output scope differs between the repositories; no build speedup is inferred. The host is burstable and other sessions compiled on it during the run.

The previous records (2026-09-24, compiler `aa2052f0`, this host) are in the Git history of this directory.
