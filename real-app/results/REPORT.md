## Shipped JavaScript (Vite 8.3.1 production build, whole app incl. React 19.2)

| variant | raw | gzip-9 | Brotli-11 | Brotli Δ vs no-markdown app |
|---|---:|---:|---:|---:|
| none | 193,483 | 60,172 | 51,950 | – |
| up | 310,588 | 94,972 | 82,134 | 30,184 |
| lil | 282,260 | 89,957 | 77,787 | 25,837 |
| up-gfm | 348,442 | 105,566 | 90,991 | 39,041 |
| lil-upgfm | 323,962 | 101,823 | 88,056 | 36,106 |
| lil-gfm | 315,577 | 100,769 | 87,288 | 35,338 |
| up-full | 627,629 | 187,225 | 157,237 | 105,287 |
| lil-upfull | 621,258 | 189,231 | 158,491 | 106,541 |
| lil-full | 613,103 | 188,470 | 158,544 | 106,594 |

| pair | upstream Brotli | port Brotli | port − upstream | markdown stack Δ |
|---|---:|---:|---:|---:|
| up → lil | 82,134 | 77,787 | -4,347 | −14.4% |
| up-gfm → lil-upgfm | 90,991 | 88,056 | -2,935 | −7.5% |
| up-gfm → lil-gfm | 90,991 | 87,288 | -3,703 | −9.5% |
| up-full → lil-upfull | 157,237 | 158,491 | 1,254 | +1.2% |
| up-full → lil-full | 157,237 | 158,544 | 1,307 | +1.2% |

## chromium 151.0.7922.34

### Page load, desktop (12 fresh loads per variant; median)

| variant | markdown on screen (ms) | Δ vs no-markdown app | JS execution (ms) | heap after GC (MB) | JS transferred (B) |
|---|---:|---:|---:|---:|---:|
| none | 60.7 | – | 20.1 | 1.55 | 52,250 |
| up | 144.8 | 84.0 | 99.1 | 2.78 | 82,434 |
| lil | 145.8 | 85.0 | 97.8 | 2.69 | 78,087 |
| up-gfm | 161.4 | 100.7 | 113.6 | 2.95 | 91,291 |
| lil-upgfm | 161.5 | 100.7 | 111.6 | 2.95 | 88,356 |
| lil-gfm | 167.5 | 106.7 | 116.6 | 2.97 | 87,588 |
| up-full | 187.6 | 126.9 | 128.1 | 3.78 | 157,537 |
| lil-upfull | 194.3 | 133.6 | 130.0 | 3.89 | 158,791 |
| lil-full | 196.1 | 135.4 | 134.0 | 3.82 | 158,844 |

| pair (same-round) | median Δ on-screen (ms) | port faster in | median Δ JS execution (ms) |
|---|---:|---:|---:|
| up → lil | -5.2 | 9/12 | -3.8 |
| up-gfm → lil-upgfm | -5.1 | 7/12 | -1.8 |
| up-gfm → lil-gfm | 2.8 | 5/12 | 1.7 |
| up-full → lil-upfull | 7.1 | 4/12 | 2.5 |
| up-full → lil-full | 10.9 | 2/12 | 7.5 |

### Page load, mobile-slow4g (12 fresh loads per variant; median)

| variant | markdown on screen (ms) | Δ vs no-markdown app | JS execution (ms) | heap after GC (MB) | JS transferred (B) |
|---|---:|---:|---:|---:|---:|
| none | 877.0 | – | 85.8 | 1.55 | 52,250 |
| up | 1,320.4 | 443.3 | 385.7 | 2.75 | 82,434 |
| lil | 1,306.0 | 429.0 | 382.3 | 2.66 | 78,087 |
| up-gfm | 1,407.9 | 530.8 | 428.6 | 2.91 | 91,291 |
| lil-upgfm | 1,407.1 | 530.1 | 438.3 | 2.90 | 88,356 |
| lil-gfm | 1,421.8 | 544.8 | 456.6 | 2.92 | 87,588 |
| up-full | 1,873.2 | 996.2 | 528.2 | 3.75 | 157,537 |
| lil-upfull | 1,867.7 | 990.7 | 520.6 | 3.86 | 158,791 |
| lil-full | 1,888.7 | 1,011.6 | 543.9 | 3.79 | 158,844 |

| pair (same-round) | median Δ on-screen (ms) | port faster in | median Δ JS execution (ms) |
|---|---:|---:|---:|
| up → lil | -28.1 | 7/12 | -12.4 |
| up-gfm → lil-upgfm | -12.9 | 9/12 | 8.6 |
| up-gfm → lil-gfm | 4.3 | 6/12 | 18.4 |
| up-full → lil-upfull | -6.5 | 7/12 | -14.3 |
| up-full → lil-full | 21.3 | 2/12 | 15.8 |

### Rendering, CPU 1× (5 fresh pages per variant; ms, median of per-page medians)

| pair | document | first call up | first call port | pipeline up | pipeline port | Δ | React mount up | React mount port | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| up → lil | small | 1.74 | 1.63 | 0.295 | 0.285 | −3.4% | 0.405 | 0.355 | −11.8% |
| up → lil | chat | 8.04 | 9.27 | 1.525 | 1.383 | −8.7% | 1.713 | 1.555 | −10.1% |
| up → lil | gfmreadme | 31.84 | 33.03 | 10.723 | 9.595 | −14.4% | 11.130 | 10.055 | −9.3% |
| up → lil | readme | 33.73 | 33.51 | 16.977 | 14.732 | −11.6% | 17.875 | 16.235 | −9.4% |
| up → lil | unified | 49.88 | 43.75 | 31.910 | 27.520 | −13.8% | 34.663 | 31.908 | −8.6% |
| up → lil | spec | 148.07 | 124.27 | 106.675 | 97.585 | −8.8% | 108.580 | 99.180 | −8.4% |
| up → lil | conversation(40) | 8.41 | 8.56 | – | – | – | 7.723 | 7.265 | −7.0% |
| up-gfm → lil-upgfm | small | 2.08 | 2.11 | 0.410 | 0.420 | −1.9% | 0.463 | 0.508 | +10.3% |
| up-gfm → lil-upgfm | chat | 13.70 | 12.94 | 2.762 | 2.692 | −2.7% | 3.137 | 2.985 | −4.3% |
| up-gfm → lil-upgfm | gfmreadme | 34.23 | 34.00 | 14.095 | 13.260 | −5.5% | 15.855 | 14.095 | −10.1% |
| up-gfm → lil-upgfm | readme | 38.20 | 40.71 | 23.160 | 20.777 | −9.9% | 24.633 | 22.413 | −7.8% |
| up-gfm → lil-upgfm | unified | 62.10 | 60.06 | 44.225 | 41.967 | −6.5% | 48.298 | 41.935 | −13.0% |
| up-gfm → lil-upgfm | spec | 199.48 | 187.76 | 154.473 | 139.515 | −10.4% | 155.925 | 141.295 | −9.4% |
| up-gfm → lil-upgfm | conversation(40) | 16.47 | 15.23 | – | – | – | 13.622 | 13.020 | −5.7% |
| up-gfm → lil-gfm | small | 2.08 | 2.40 | 0.410 | 0.390 | −4.9% | 0.463 | 0.485 | +5.4% |
| up-gfm → lil-gfm | chat | 13.70 | 14.41 | 2.762 | 3.143 | +11.9% | 3.137 | 3.583 | +12.4% |
| up-gfm → lil-gfm | gfmreadme | 34.23 | 40.70 | 14.095 | 15.290 | +7.5% | 15.855 | 16.570 | +4.6% |
| up-gfm → lil-gfm | readme | 38.20 | 44.85 | 23.160 | 23.787 | +2.7% | 24.633 | 25.788 | +4.7% |
| up-gfm → lil-gfm | unified | 62.10 | 65.63 | 44.225 | 46.658 | +5.0% | 48.298 | 48.803 | −0.7% |
| up-gfm → lil-gfm | spec | 199.48 | 227.23 | 154.473 | 175.858 | +13.4% | 155.925 | 176.820 | +13.3% |
| up-gfm → lil-gfm | conversation(40) | 16.47 | 18.59 | – | – | – | 13.622 | 15.520 | +15.2% |
| up-full → lil-upfull | small | 1.95 | 2.21 | 0.430 | 0.435 | −0.6% | 0.505 | 0.485 | −4.0% |
| up-full → lil-upfull | chat | 12.85 | 15.20 | 2.932 | 2.855 | −2.6% | 3.202 | 2.940 | −9.6% |
| up-full → lil-upfull | readme | 53.78 | 61.48 | 23.935 | 22.257 | −7.3% | 27.400 | 25.910 | −2.7% |
| up-full → lil-upfull | math | 49.98 | 41.18 | 21.695 | 16.557 | −25.0% | 28.495 | 22.265 | −21.9% |
| up-full → lil-upfull | conversation(40) | 22.60 | 23.86 | – | – | – | 17.200 | 19.785 | +15.0% |
| up-full → lil-full | small | 1.95 | 2.88 | 0.430 | 0.460 | +7.1% | 0.505 | 0.505 | −1.0% |
| up-full → lil-full | chat | 12.85 | 17.11 | 2.932 | 3.092 | +4.4% | 3.202 | 3.277 | +0.2% |
| up-full → lil-full | readme | 53.78 | 66.40 | 23.935 | 23.933 | +0.1% | 27.400 | 28.535 | +6.5% |
| up-full → lil-full | math | 49.98 | 30.57 | 21.695 | 8.273 | −61.9% | 28.495 | 13.850 | −52.6% |
| up-full → lil-full | conversation(40) | 22.60 | 19.02 | – | – | – | 17.200 | 16.295 | −5.8% |

### Rendering, CPU 4× (5 fresh pages per variant; ms, median of per-page medians)

| pair | document | first call up | first call port | pipeline up | pipeline port | Δ | React mount up | React mount port | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| up → lil | small | 7.55 | 6.36 | 1.400 | 1.365 | −1.8% | 1.725 | 1.920 | +14.0% |
| up → lil | chat | 33.77 | 36.56 | 9.280 | 8.095 | −14.3% | 7.685 | 7.350 | −3.4% |
| up → lil | gfmreadme | 114.16 | 119.71 | 43.393 | 39.178 | −9.7% | 50.855 | 45.410 | −12.4% |
| up → lil | readme | 113.73 | 119.43 | 68.980 | 62.615 | −8.7% | 75.285 | 67.950 | −7.6% |
| up → lil | unified | 202.72 | 179.08 | 135.473 | 137.990 | −2.2% | 156.195 | 141.615 | −10.2% |
| up → lil | spec | 592.07 | 510.45 | 462.980 | 405.830 | −12.3% | 472.920 | 433.085 | −7.7% |
| up → lil | conversation(40) | 44.36 | 38.79 | – | – | – | 40.440 | 33.287 | −13.2% |
| up-gfm → lil-upgfm | small | 8.84 | 8.85 | 2.240 | 2.115 | −2.7% | 2.540 | 2.685 | +7.6% |
| up-gfm → lil-upgfm | chat | 55.53 | 55.37 | 12.130 | 11.300 | −6.8% | 13.895 | 12.660 | −8.6% |
| up-gfm → lil-upgfm | gfmreadme | 148.85 | 149.73 | 60.275 | 56.188 | −9.5% | 65.215 | 62.470 | −3.6% |
| up-gfm → lil-upgfm | readme | 177.13 | 147.42 | 113.070 | 101.900 | −6.6% | 113.035 | 103.420 | −6.9% |
| up-gfm → lil-upgfm | unified | 265.66 | 225.57 | 194.355 | 183.580 | −5.5% | 216.345 | 183.325 | −15.1% |
| up-gfm → lil-upgfm | spec | 827.43 | 765.69 | 628.125 | 583.960 | −7.8% | 743.035 | 661.985 | −7.1% |
| up-gfm → lil-upgfm | conversation(40) | 74.18 | 72.74 | – | – | – | 66.225 | 66.627 | −0.5% |
| up-gfm → lil-gfm | small | 8.84 | 9.84 | 2.240 | 1.840 | −16.2% | 2.540 | 2.375 | −6.5% |
| up-gfm → lil-gfm | chat | 55.53 | 59.37 | 12.130 | 13.995 | +15.4% | 13.895 | 15.020 | +8.1% |
| up-gfm → lil-gfm | gfmreadme | 148.85 | 155.65 | 60.275 | 64.033 | +6.7% | 65.215 | 72.945 | +7.0% |
| up-gfm → lil-gfm | readme | 177.13 | 175.61 | 113.070 | 113.550 | −1.5% | 113.035 | 115.730 | +3.3% |
| up-gfm → lil-gfm | unified | 265.66 | 277.29 | 194.355 | 200.603 | +2.7% | 216.345 | 210.645 | −3.0% |
| up-gfm → lil-gfm | spec | 827.43 | 951.21 | 628.125 | 810.535 | +28.2% | 743.035 | 799.815 | +8.1% |
| up-gfm → lil-gfm | conversation(40) | 74.18 | 81.24 | – | – | – | 66.225 | 72.480 | +9.4% |
| up-full → lil-upfull | small | 8.42 | 9.51 | 2.340 | 2.265 | +4.4% | 2.565 | 2.390 | −6.8% |
| up-full → lil-upfull | chat | 56.38 | 60.58 | 13.025 | 12.345 | −7.1% | 15.045 | 13.840 | −9.4% |
| up-full → lil-upfull | readme | 220.49 | 217.83 | 115.735 | 102.250 | −12.8% | 118.315 | 108.180 | −12.2% |
| up-full → lil-upfull | math | 219.42 | 191.69 | 103.490 | 77.340 | −23.3% | 128.775 | 105.330 | −17.4% |
| up-full → lil-upfull | conversation(40) | 93.32 | 95.77 | – | – | – | 83.018 | 84.930 | +2.7% |
| up-full → lil-full | small | 8.42 | 10.73 | 2.340 | 2.530 | +9.8% | 2.565 | 2.625 | +1.8% |
| up-full → lil-full | chat | 56.38 | 67.86 | 13.025 | 14.865 | +11.4% | 15.045 | 16.595 | +17.2% |
| up-full → lil-full | readme | 220.49 | 237.25 | 115.735 | 114.430 | −2.1% | 118.315 | 112.915 | −4.7% |
| up-full → lil-full | math | 219.42 | 134.88 | 103.490 | 37.905 | −61.8% | 128.775 | 57.835 | −54.0% |
| up-full → lil-full | conversation(40) | 93.32 | 75.66 | – | – | – | 83.018 | 71.050 | −15.0% |

### Streaming (re-render the growing message every 12 characters; ms)

| CPU | stream | pair | upstream / port |  |  |  |
|---|---:|---:|---:|---:|---:|---:|
| 1× | chat (277 updates) | up → lil | total 225 / 210 (−7.5%) | p95 1.57 / 1.41 | last 1.54 / 1.33 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-gfm → lil-upgfm | total 383 / 370 (−4.8%) | p95 2.75 / 2.45 | last 2.75 / 2.46 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-gfm → lil-gfm | total 383 / 418 (+10.4%) | p95 2.75 / 2.96 | last 2.75 / 2.96 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-full → lil-upfull | total 428 / 431 (+1.0%) | p95 3.07 / 2.91 | last 2.95 / 2.95 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-full → lil-full | total 428 / 436 (+1.6%) | p95 3.07 / 3.08 | last 2.95 / 3.14 | >16.7ms 0 / 0 |
| 1× | long (834 updates) | up → lil | total 3,660 / 3,181 (−13.7%) | p95 7.60 / 6.63 | last 8.16 / 6.55 | >16.7ms 0 / 0 |
| 1× | long (834 updates) | up-gfm → lil-upgfm | total 5,346 / 4,855 (−9.7%) | p95 11.91 / 10.52 | last 11.27 / 11.04 | >16.7ms 3 / 1 |
| 1× | long (834 updates) | up-gfm → lil-gfm | total 5,346 / 5,711 (+5.8%) | p95 11.91 / 12.57 | last 11.27 / 11.93 | >16.7ms 3 / 3 |
| 1× | long (834 updates) | up-full → lil-upfull | total 5,595 / 5,525 (−2.1%) | p95 12.30 / 12.09 | last 11.55 / 11.16 | >16.7ms 3 / 3 |
| 1× | long (834 updates) | up-full → lil-full | total 5,595 / 5,800 (+3.7%) | p95 12.30 / 12.55 | last 11.55 / 13.68 | >16.7ms 3 / 5 |
| 1× | chat-realtime-30ms | up → lil | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 1× | chat-realtime-30ms | up-gfm → lil-upgfm | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 1× | chat-realtime-30ms | up-gfm → lil-gfm | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 1× | chat-realtime-30ms | up-full → lil-upfull | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 1× | chat-realtime-30ms | up-full → lil-full | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 4× | chat (277 updates) | up → lil | total 1,009 / 905 (−9.3%) | p95 7.04 / 6.45 | last 6.69 / 5.86 | >16.7ms 0 / 0 |
| 4× | chat (277 updates) | up-gfm → lil-upgfm | total 1,690 / 1,585 (−6.2%) | p95 12.34 / 10.88 | last 11.86 / 11.28 | >16.7ms 1 / 0 |
| 4× | chat (277 updates) | up-gfm → lil-gfm | total 1,690 / 1,873 (+9.7%) | p95 12.34 / 13.32 | last 11.86 / 14.59 | >16.7ms 1 / 2 |
| 4× | chat (277 updates) | up-full → lil-upfull | total 1,918 / 1,867 (−2.9%) | p95 13.42 / 12.83 | last 12.51 / 12.49 | >16.7ms 4 / 2 |
| 4× | chat (277 updates) | up-full → lil-full | total 1,918 / 1,985 (+2.1%) | p95 13.42 / 14.03 | last 12.51 / 13.22 | >16.7ms 4 / 1 |

## firefox 153.0

### Page load, desktop (20 fresh loads per variant; median)

| variant | markdown on screen (ms) | Δ vs no-markdown app | JS execution (ms) | heap after GC (MB) | JS transferred (B) |
|---|---:|---:|---:|---:|---:|
| none | 130.0 | – | – | – | 52,250 |
| up | 244.7 | 114.7 | – | – | 82,434 |
| lil | 240.7 | 110.7 | – | – | 78,087 |
| up-gfm | 273.1 | 143.1 | – | – | 91,291 |
| lil-upgfm | 265.6 | 135.6 | – | – | 88,356 |
| lil-gfm | 289.3 | 159.3 | – | – | 87,588 |
| up-full | 311.5 | 181.5 | – | – | 157,537 |
| lil-upfull | 307.6 | 177.6 | – | – | 158,791 |
| lil-full | 320.9 | 190.9 | – | – | 158,844 |

| pair (same-round) | median Δ on-screen (ms) | port faster in | median Δ JS execution (ms) |
|---|---:|---:|---:|
| up → lil | -6.9 | 13/20 | – |
| up-gfm → lil-upgfm | -5.5 | 14/20 | – |
| up-gfm → lil-gfm | 13.0 | 6/20 | – |
| up-full → lil-upfull | -1.8 | 11/20 | – |
| up-full → lil-full | 4.2 | 9/20 | – |

### Rendering, CPU 1× (5 fresh pages per variant; ms, median of per-page medians)

| pair | document | first call up | first call port | pipeline up | pipeline port | Δ | React mount up | React mount port | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| up → lil | small | 4.26 | 4.60 | 0.400 | 0.400 | −2.5% | 0.560 | 0.570 | +0.0% |
| up → lil | chat | 12.74 | 12.72 | 2.530 | 2.360 | −9.1% | 2.960 | 2.700 | −9.8% |
| up → lil | gfmreadme | 50.32 | 52.46 | 18.370 | 17.080 | −7.3% | 20.600 | 19.940 | +2.4% |
| up → lil | readme | 52.74 | 49.42 | 28.050 | 26.130 | −5.4% | 33.360 | 29.130 | −7.1% |
| up → lil | unified | 82.66 | 83.24 | 55.470 | 50.250 | −11.8% | 65.370 | 55.660 | −9.6% |
| up → lil | spec | 245.76 | 223.76 | 188.680 | 174.020 | −10.1% | 204.660 | 192.480 | −9.8% |
| up → lil | conversation(40) | 19.94 | 17.96 | – | – | – | 16.180 | 13.340 | −9.5% |
| up-gfm → lil-upgfm | small | 4.00 | 4.74 | 0.600 | 0.580 | −3.3% | 0.740 | 0.720 | −2.7% |
| up-gfm → lil-upgfm | chat | 19.44 | 19.22 | 4.040 | 3.760 | −6.9% | 4.570 | 4.420 | −2.6% |
| up-gfm → lil-upgfm | gfmreadme | 55.16 | 53.52 | 22.880 | 21.980 | −2.8% | 23.000 | 24.280 | +6.8% |
| up-gfm → lil-upgfm | readme | 64.02 | 57.80 | 36.070 | 34.520 | −7.2% | 40.360 | 38.880 | −3.7% |
| up-gfm → lil-upgfm | unified | 96.78 | 99.60 | 72.180 | 67.500 | −10.4% | 75.450 | 72.630 | −6.8% |
| up-gfm → lil-upgfm | spec | 296.34 | 288.78 | 252.110 | 236.190 | −3.4% | 267.140 | 258.900 | −0.8% |
| up-gfm → lil-upgfm | conversation(40) | 31.86 | 29.64 | – | – | – | 24.530 | 22.450 | −8.5% |
| up-gfm → lil-gfm | small | 4.00 | 4.38 | 0.600 | 0.670 | +11.7% | 0.740 | 0.800 | +8.3% |
| up-gfm → lil-gfm | chat | 19.44 | 22.80 | 4.040 | 4.860 | +20.6% | 4.570 | 5.570 | +20.8% |
| up-gfm → lil-gfm | gfmreadme | 55.16 | 63.52 | 22.880 | 27.270 | +13.9% | 23.000 | 29.200 | +25.2% |
| up-gfm → lil-gfm | readme | 64.02 | 67.40 | 36.070 | 45.160 | +33.8% | 40.360 | 48.510 | +20.9% |
| up-gfm → lil-gfm | unified | 96.78 | 110.84 | 72.180 | 84.590 | +20.5% | 75.450 | 92.420 | +21.8% |
| up-gfm → lil-gfm | spec | 296.34 | 382.80 | 252.110 | 330.390 | +33.3% | 267.140 | 352.980 | +32.1% |
| up-gfm → lil-gfm | conversation(40) | 31.86 | 46.10 | – | – | – | 24.530 | 25.600 | +7.7% |
| up-full → lil-upfull | small | 4.76 | 4.24 | 0.700 | 0.700 | −2.9% | 0.840 | 0.820 | −4.8% |
| up-full → lil-upfull | chat | 21.16 | 23.72 | 4.400 | 4.300 | −3.1% | 4.580 | 4.530 | −0.7% |
| up-full → lil-upfull | readme | 81.10 | 90.80 | 40.140 | 38.700 | −3.9% | 41.990 | 41.240 | −3.1% |
| up-full → lil-upfull | math | 63.52 | 55.66 | 25.300 | 21.470 | −18.1% | 38.960 | 33.840 | −12.6% |
| up-full → lil-upfull | conversation(40) | 32.32 | 31.26 | – | – | – | 26.680 | 25.450 | −2.9% |
| up-full → lil-full | small | 4.76 | 4.58 | 0.700 | 0.760 | +6.7% | 0.840 | 0.840 | +4.4% |
| up-full → lil-full | chat | 21.16 | 23.36 | 4.400 | 5.030 | +12.9% | 4.580 | 5.180 | +13.1% |
| up-full → lil-full | readme | 81.10 | 87.26 | 40.140 | 44.170 | +8.6% | 41.990 | 44.780 | +6.6% |
| up-full → lil-full | math | 63.52 | 41.36 | 25.300 | 10.740 | −57.4% | 38.960 | 21.080 | −45.9% |
| up-full → lil-full | conversation(40) | 32.32 | 27.44 | – | – | – | 26.680 | 25.260 | −1.8% |

### Streaming (re-render the growing message every 12 characters; ms)

| CPU | stream | pair | upstream / port |  |  |  |
|---|---:|---:|---:|---:|---:|---:|
| 1× | chat (277 updates) | up → lil | total 400 / 388 (−3.1%) | p95 2.78 / 2.24 | last 2.48 / 2.20 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-gfm → lil-upgfm | total 560 / 548 (−2.0%) | p95 3.76 / 3.66 | last 3.76 / 3.56 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-gfm → lil-gfm | total 560 / 718 (+27.4%) | p95 3.76 / 5.04 | last 3.76 / 4.76 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-full → lil-upfull | total 619 / 615 (−0.4%) | p95 4.70 / 4.28 | last 4.08 / 4.00 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-full → lil-full | total 619 / 752 (+19.9%) | p95 4.70 / 6.08 | last 4.08 / 4.96 | >16.7ms 0 / 0 |
| 1× | long (834 updates) | up → lil | total 5,550 / 5,199 (−5.7%) | p95 11.84 / 10.98 | last 11.30 / 10.80 | >16.7ms 3 / 4 |
| 1× | long (834 updates) | up-gfm → lil-upgfm | total 7,516 / 7,144 (−5.1%) | p95 16.76 / 15.80 | last 15.88 / 15.26 | >16.7ms 44 / 33 |
| 1× | long (834 updates) | up-gfm → lil-gfm | total 7,516 / 9,220 (+21.9%) | p95 16.76 / 21.04 | last 15.88 / 19.44 | >16.7ms 44 / 179 |
| 1× | long (834 updates) | up-full → lil-upfull | total 8,060 / 7,454 (−5.9%) | p95 18.22 / 16.68 | last 16.72 / 15.08 | >16.7ms 76 / 41 |
| 1× | long (834 updates) | up-full → lil-full | total 8,060 / 9,100 (+16.1%) | p95 18.22 / 20.44 | last 16.72 / 18.80 | >16.7ms 76 / 168 |
| 1× | chat-realtime-30ms | up → lil | frames>33ms 0 / 0 | p95 frame 17.1 / 17.1 | max frame 17.1 / 17.1 |  |
| 1× | chat-realtime-30ms | up-gfm → lil-upgfm | frames>33ms 0 / 0 | p95 frame 17.1 / 17.1 | max frame 17.1 / 17.1 |  |
| 1× | chat-realtime-30ms | up-gfm → lil-gfm | frames>33ms 0 / 0 | p95 frame 17.1 / 17.1 | max frame 17.1 / 17.2 |  |
| 1× | chat-realtime-30ms | up-full → lil-upfull | frames>33ms 1 / 1 | p95 frame 17.1 / 17.1 | max frame 66.4 / 67.4 |  |
| 1× | chat-realtime-30ms | up-full → lil-full | frames>33ms 1 / 0 | p95 frame 17.1 / 17.1 | max frame 66.4 / 17.3 |  |

## Differential correctness in the browser (DOM of the production builds)

| browser | suite | plugin set | cases | mismatches |
|---|---:|---:|---:|---:|
| chromium | commonmark | core | 652 | 0 |
| chromium | commonmark | gfm | 652 | 0 |
| chromium | commonmark | gfm-npm-on-port | 652 | 0 |
| chromium | commonmark | full | 652 | 0 |
| chromium | commonmark | raw | 652 | 0 |
| chromium | commonmark | components | 652 | 0 |
| chromium | commonmark | filter | 652 | 0 |
| chromium | gfm-spec | gfm | 702 | 1 |
| chromium | gfm-spec | gfm-npm-on-port | 702 | 0 |
| chromium | gfm-spec | gfm-port-on-upstream | 702 | 1 |
| chromium | gfm-spec | full | 702 | 1 |
| chromium | gfm-spec | full-npm-on-port | 702 | 0 |
| chromium | gfm-spec | raw | 702 | 0 |
| chromium | entities | core | 91 | 0 |
| chromium | entities | gfm | 91 | 0 |
| chromium | fuzz | core | 3000 | 52 |
| chromium | fuzz | gfm | 3000 | 52 |
| chromium | fuzz | gfm-npm-on-port | 3000 | 51 |
| chromium | fuzz | full | 3000 | 49 |
| chromium | fuzz | raw | 3000 | 51 |
| chromium | documents | core | 7 | 0 |
| chromium | documents | gfm | 7 | 0 |
| chromium | documents | gfm-npm-on-port | 7 | 0 |
| chromium | documents | gfm-port-on-upstream | 7 | 0 |
| chromium | documents | full | 7 | 1 |
| chromium | documents | full-npm-on-port | 7 | 0 |
| chromium | documents | raw | 7 | 0 |
| chromium | documents | docsite | 7 | 0 |
| chromium | documents | components | 7 | 0 |
| chromium | documents | filter | 7 | 0 |
| firefox | commonmark | core | 652 | 0 |
| firefox | commonmark | gfm | 652 | 0 |
| firefox | commonmark | gfm-npm-on-port | 652 | 0 |
| firefox | commonmark | full | 652 | 0 |
| firefox | commonmark | raw | 652 | 0 |
| firefox | commonmark | components | 652 | 0 |
| firefox | commonmark | filter | 652 | 0 |
| firefox | gfm-spec | gfm | 702 | 1 |
| firefox | gfm-spec | gfm-npm-on-port | 702 | 0 |
| firefox | gfm-spec | gfm-port-on-upstream | 702 | 1 |
| firefox | gfm-spec | full | 702 | 1 |
| firefox | gfm-spec | full-npm-on-port | 702 | 0 |
| firefox | gfm-spec | raw | 702 | 0 |
| firefox | entities | core | 91 | 0 |
| firefox | entities | gfm | 91 | 0 |
| firefox | fuzz | core | 3000 | 52 |
| firefox | fuzz | gfm | 3000 | 52 |
| firefox | fuzz | gfm-npm-on-port | 3000 | 51 |
| firefox | fuzz | full | 3000 | 49 |
| firefox | fuzz | raw | 3000 | 51 |
| firefox | documents | core | 7 | 0 |
| firefox | documents | gfm | 7 | 0 |
| firefox | documents | gfm-npm-on-port | 7 | 0 |
| firefox | documents | gfm-port-on-upstream | 7 | 0 |
| firefox | documents | full | 7 | 1 |
| firefox | documents | full-npm-on-port | 7 | 0 |
| firefox | documents | raw | 7 | 0 |
| firefox | documents | docsite | 7 | 0 |
| firefox | documents | components | 7 | 0 |
| firefox | documents | filter | 7 | 0 |

## Node differential fuzz (Unicode-heavy)

| set | documents | mismatches | gone when non-ASCII whitespace is replaced | other |
|---|---:|---:|---:|---:|
| core | 20000 | 2232 | 2200 | 32 |
| npm remark-gfm + remark-math on both | 20000 | 2083 | 2055 | 28 |
| @itslil/remark-gfm + remark-math (npm) | 20000 | 2108 | 2056 | 52 |

## Export conditions without a DOM

| runtime conditions | package | result | resolved |
|---|---:|---:|---:|
| node (import) | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| node (import) | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.esm.js |
| cloudflare workers (wrangler) | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| cloudflare workers (wrangler) | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.esm.js |
| next.js edge runtime | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| next.js edge runtime | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.esm.js |
| deno | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| deno | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.esm.js |
| react-native (metro) | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| react-native (metro) | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.esm.js |
| browser bundle (vite/webpack prod) | upstream | CRASH document is not defined | decode-named-character-reference/index.dom.js, react-markdown/lib/index.js, react-markdown/index.js |
| browser bundle (vite/webpack prod) | port | CRASH document is not defined | @itslil/react-markdown/dist/react-markdown.browser.js |

## Where the time goes (Chromium, warm, median of 5 fresh pages; ms)

| variant | document | parse (micromark + mdast) | mdast → hast | hast → React elements | GC share | allocated per README render |
|---|---|---:|---:|---:|---:|---:|
| up | chat | 1.68 | 0.14 | 0.15 |  |  |
| up | readme | 14.71 | 1.16 | 1.21 | 2.1% | 13.52 MB |
| up | spec | 89.50 | 4.99 | 6.66 |  |  |
| lil | chat | 1.49 | 0.08 | 0.06 |  |  |
| lil | readme | 14.40 | 0.48 | 0.42 | 2.3% | 11.79 MB |
| lil | spec | 90.12 | 1.89 | 2.18 |  |  |
| up-gfm | chat | 2.64 | 0.17 | 0.23 |  |  |
| up-gfm | readme | 21.59 | 1.18 | 1.25 | 2.7% | 17.19 MB |
| up-gfm | spec | 136.58 | 4.11 | 6.89 |  |  |
| lil-upgfm | chat | 2.63 | 0.10 | 0.10 |  |  |
| lil-upgfm | readme | 22.36 | 0.50 | 0.46 | 2.5% | 15.29 MB |
| lil-upgfm | spec | 129.12 | 1.59 | 2.51 |  |  |
| lil-gfm | chat | 3.06 | 0.09 | 0.09 |  |  |
| lil-gfm | readme | 22.75 | 0.48 | 0.44 | 3.3% | 19.74 MB |
| lil-gfm | spec | 170.43 | 1.53 | 2.45 |  |  |
| up-full | chat | 2.55 | 0.30 | 0.23 |  |  |
| up-full | readme | 21.33 | 1.98 | 1.26 | 2.5% | 17.56 MB |
| up-full | spec | 134.11 | 8.91 | 6.62 |  |  |
| lil-upfull | chat | 2.58 | 0.24 | 0.10 |  |  |
| lil-upfull | readme | 20.44 | 1.36 | 0.45 | 2.5% | 15.75 MB |
| lil-upfull | spec | 131.18 | 6.54 | 2.44 |  |  |
| lil-full | chat | 3.17 | 0.11 | 0.10 |  |  |
| lil-full | readme | 23.27 | 0.56 | 0.45 | 3.6% | 19.90 MB |
| lil-full | spec | 171.84 | 1.87 | 2.40 |  |  |
