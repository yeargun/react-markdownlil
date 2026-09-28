## Shipped JavaScript (Vite 8.3.1 production build, whole app incl. React 19.2)

| variant | raw | gzip-9 | Brotli-11 | Brotli Δ vs no-markdown app |
|---|---:|---:|---:|---:|
| none | 193,483 | 60,172 | 51,950 | – |
| up | 310,588 | 94,972 | 82,134 | 30,184 |
| lil | 285,640 | 91,293 | 79,004 | 27,054 |
| up-gfm | 348,442 | 105,566 | 90,991 | 39,041 |
| lil-upgfm | 327,396 | 103,171 | 89,138 | 37,188 |
| lil-gfm | 317,924 | 101,738 | 88,032 | 36,082 |
| up-full | 627,629 | 187,225 | 157,237 | 105,287 |
| lil-upfull | 624,672 | 190,643 | 159,468 | 107,518 |
| lil-full | 617,625 | 190,361 | 159,672 | 107,722 |

| pair | upstream Brotli | port Brotli | port − upstream | markdown stack Δ |
|---|---:|---:|---:|---:|
| up → lil | 82,134 | 79,004 | -3,130 | −10.4% |
| up-gfm → lil-upgfm | 90,991 | 89,138 | -1,853 | −4.7% |
| up-gfm → lil-gfm | 90,991 | 88,032 | -2,959 | −7.6% |
| up-full → lil-upfull | 157,237 | 159,468 | 2,231 | +2.1% |
| up-full → lil-full | 157,237 | 159,672 | 2,435 | +2.3% |

## chromium 151.0.7922.34

### Page load, desktop (12 fresh loads per variant; median)

| variant | markdown on screen (ms) | Δ vs no-markdown app | JS execution (ms) | heap after GC (MB) | JS transferred (B) |
|---|---:|---:|---:|---:|---:|
| none | 64.7 | – | 21.0 | 1.55 | 52,250 |
| up | 154.8 | 90.1 | 103.9 | 2.78 | 82,434 |
| lil | 152.5 | 87.8 | 100.8 | 2.71 | 79,304 |
| up-gfm | 164.4 | 99.7 | 114.6 | 2.95 | 91,291 |
| lil-upgfm | 176.8 | 112.1 | 120.5 | 2.96 | 89,438 |
| lil-gfm | 169.8 | 105.1 | 117.3 | 3.01 | 88,332 |
| up-full | 201.0 | 136.2 | 134.9 | 3.78 | 157,537 |
| lil-upfull | 219.0 | 154.2 | 147.2 | 3.90 | 159,768 |
| lil-full | 207.6 | 142.9 | 138.9 | 3.96 | 159,972 |

| pair (same-round) | median Δ on-screen (ms) | port faster in | median Δ JS execution (ms) |
|---|---:|---:|---:|
| up → lil | -3.1 | 8/12 | -2.8 |
| up-gfm → lil-upgfm | 7.2 | 5/12 | 8.2 |
| up-gfm → lil-gfm | 2.8 | 5/12 | 1.6 |
| up-full → lil-upfull | 15.9 | 2/12 | 9.6 |
| up-full → lil-full | 3.4 | 4/12 | 3.7 |

### Page load, mobile-slow4g (12 fresh loads per variant; median)

| variant | markdown on screen (ms) | Δ vs no-markdown app | JS execution (ms) | heap after GC (MB) | JS transferred (B) |
|---|---:|---:|---:|---:|---:|
| none | 882.5 | – | 88.4 | 1.55 | 52,250 |
| up | 1,341.1 | 458.7 | 408.3 | 2.75 | 82,434 |
| lil | 1,343.2 | 460.8 | 420.3 | 2.67 | 79,304 |
| up-gfm | 1,471.3 | 588.8 | 483.5 | 2.92 | 91,291 |
| lil-upgfm | 1,454.1 | 571.7 | 479.7 | 2.92 | 89,438 |
| lil-gfm | 1,444.8 | 562.4 | 476.0 | 2.97 | 88,332 |
| up-full | 1,872.4 | 989.9 | 526.0 | 3.75 | 157,537 |
| lil-upfull | 1,887.0 | 1,004.5 | 534.5 | 3.87 | 159,768 |
| lil-full | 1,902.8 | 1,020.3 | 548.0 | 3.92 | 159,972 |

| pair (same-round) | median Δ on-screen (ms) | port faster in | median Δ JS execution (ms) |
|---|---:|---:|---:|
| up → lil | -17.2 | 7/12 | -1.2 |
| up-gfm → lil-upgfm | -5.3 | 6/12 | 2.4 |
| up-gfm → lil-gfm | -13.6 | 6/12 | -3.0 |
| up-full → lil-upfull | 23.6 | 2/12 | 13.8 |
| up-full → lil-full | 21.7 | 5/12 | 8.3 |

### Rendering, CPU 1× (5 fresh pages per variant; ms, median of per-page medians)

| pair | document | first call up | first call port | pipeline up | pipeline port | Δ | React mount up | React mount port | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| up → lil | small | 1.70 | 1.72 | 0.310 | 0.300 | −3.3% | 0.410 | 0.390 | −4.9% |
| up → lil | chat | 8.31 | 8.98 | 1.620 | 1.470 | −4.7% | 1.782 | 1.750 | +0.3% |
| up → lil | gfmreadme | 35.46 | 33.69 | 11.172 | 9.548 | −10.8% | 11.595 | 10.525 | −10.1% |
| up → lil | readme | 34.07 | 37.69 | 17.432 | 15.255 | −11.8% | 18.710 | 17.062 | −6.9% |
| up → lil | unified | 55.94 | 54.10 | 33.107 | 30.157 | −10.2% | 37.555 | 33.828 | −8.4% |
| up → lil | spec | 178.28 | 139.72 | 119.045 | 109.535 | −8.0% | 120.340 | 107.245 | −8.2% |
| up → lil | conversation(40) | 8.76 | 8.58 | – | – | – | 8.195 | 7.883 | −9.4% |
| up-gfm → lil-upgfm | small | 2.20 | 2.70 | 0.418 | 0.422 | +1.2% | 0.472 | 0.465 | −0.5% |
| up-gfm → lil-upgfm | chat | 14.73 | 16.22 | 2.813 | 2.773 | −3.0% | 3.242 | 3.088 | −4.3% |
| up-gfm → lil-upgfm | gfmreadme | 37.72 | 43.76 | 15.245 | 14.177 | −4.8% | 15.940 | 15.000 | −5.1% |
| up-gfm → lil-upgfm | readme | 48.25 | 49.44 | 24.385 | 22.182 | −9.0% | 25.247 | 24.818 | −6.5% |
| up-gfm → lil-upgfm | unified | 84.13 | 70.56 | 45.790 | 45.835 | +1.7% | 50.115 | 45.863 | −10.8% |
| up-gfm → lil-upgfm | spec | 225.46 | 223.19 | 160.500 | 157.495 | −1.9% | 161.215 | 150.890 | −7.6% |
| up-gfm → lil-upgfm | conversation(40) | 16.53 | 15.66 | – | – | – | 14.405 | 13.300 | −7.2% |
| up-gfm → lil-gfm | small | 2.20 | 2.94 | 0.418 | 0.472 | +13.2% | 0.472 | 0.470 | +0.6% |
| up-gfm → lil-gfm | chat | 14.73 | 15.03 | 2.813 | 2.547 | −9.6% | 3.242 | 2.898 | −9.5% |
| up-gfm → lil-gfm | gfmreadme | 37.72 | 41.89 | 15.245 | 13.833 | −10.8% | 15.940 | 14.345 | −13.1% |
| up-gfm → lil-gfm | readme | 48.25 | 53.36 | 24.385 | 21.355 | −13.4% | 25.247 | 24.587 | −7.3% |
| up-gfm → lil-gfm | unified | 84.13 | 68.03 | 45.790 | 45.627 | −5.1% | 50.115 | 42.930 | −14.2% |
| up-gfm → lil-gfm | spec | 225.46 | 218.66 | 160.500 | 156.463 | −1.9% | 161.215 | 150.570 | −6.3% |
| up-gfm → lil-gfm | conversation(40) | 16.53 | 19.64 | – | – | – | 14.405 | 14.752 | −1.6% |
| up-full → lil-upfull | small | 2.17 | 2.36 | 0.600 | 0.455 | −28.3% | 0.540 | 0.533 | −4.1% |
| up-full → lil-upfull | chat | 14.53 | 15.06 | 3.153 | 3.310 | +0.2% | 3.398 | 2.977 | −11.9% |
| up-full → lil-upfull | readme | 64.16 | 56.58 | 24.477 | 22.438 | −6.7% | 28.635 | 27.862 | −9.5% |
| up-full → lil-upfull | math | 61.52 | 47.55 | 22.358 | 17.590 | −26.1% | 31.230 | 24.825 | −24.3% |
| up-full → lil-upfull | conversation(40) | 20.69 | 23.83 | – | – | – | 18.660 | 18.055 | −3.2% |
| up-full → lil-full | small | 2.17 | 2.31 | 0.600 | 0.492 | −30.8% | 0.540 | 0.502 | −4.7% |
| up-full → lil-full | chat | 14.53 | 16.00 | 3.153 | 2.653 | −17.9% | 3.398 | 2.830 | −16.0% |
| up-full → lil-full | readme | 64.16 | 70.19 | 24.477 | 22.378 | −7.0% | 28.635 | 28.110 | −1.8% |
| up-full → lil-full | math | 61.52 | 48.14 | 22.358 | 16.840 | −24.7% | 31.230 | 24.250 | −22.9% |
| up-full → lil-full | conversation(40) | 20.69 | 23.30 | – | – | – | 18.660 | 19.242 | +5.1% |

### Rendering, CPU 4× (5 fresh pages per variant; ms, median of per-page medians)

| pair | document | first call up | first call port | pipeline up | pipeline port | Δ | React mount up | React mount port | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| up → lil | small | 7.77 | 7.86 | 1.520 | 1.485 | +1.4% | 1.715 | 1.950 | +15.0% |
| up → lil | chat | 35.23 | 40.39 | 9.745 | 8.810 | −13.7% | 8.440 | 9.335 | +0.4% |
| up → lil | gfmreadme | 124.03 | 137.28 | 50.517 | 43.665 | −12.9% | 58.030 | 50.500 | −11.0% |
| up → lil | readme | 131.41 | 136.15 | 79.450 | 73.550 | −6.3% | 86.230 | 84.200 | −2.7% |
| up → lil | unified | 213.98 | 216.56 | 168.593 | 151.375 | −5.2% | 184.695 | 159.865 | −9.9% |
| up → lil | spec | 633.35 | 568.42 | 503.080 | 462.540 | −5.4% | 506.795 | 473.585 | −5.6% |
| up → lil | conversation(40) | 46.32 | 47.47 | – | – | – | 44.340 | 39.748 | −2.4% |
| up-gfm → lil-upgfm | small | 9.58 | 9.03 | 2.330 | 2.300 | −4.1% | 2.955 | 2.495 | −13.1% |
| up-gfm → lil-upgfm | chat | 66.93 | 60.36 | 13.515 | 13.100 | +0.8% | 14.775 | 14.645 | −1.9% |
| up-gfm → lil-upgfm | gfmreadme | 159.79 | 160.27 | 71.282 | 65.250 | −4.9% | 81.800 | 74.985 | −10.2% |
| up-gfm → lil-upgfm | readme | 172.35 | 170.68 | 125.330 | 118.150 | −5.6% | 126.350 | 128.990 | +2.0% |
| up-gfm → lil-upgfm | unified | 282.33 | 284.95 | 237.900 | 218.252 | −12.8% | 245.615 | 221.845 | −9.3% |
| up-gfm → lil-upgfm | spec | 933.91 | 869.55 | 685.115 | 648.380 | −5.2% | 799.905 | 756.815 | −5.3% |
| up-gfm → lil-upgfm | conversation(40) | 77.22 | 83.02 | – | – | – | 75.443 | 74.617 | +1.1% |
| up-gfm → lil-gfm | small | 9.58 | 10.13 | 2.330 | 2.385 | +0.6% | 2.955 | 2.425 | −20.9% |
| up-gfm → lil-gfm | chat | 66.93 | 64.52 | 13.515 | 11.930 | −13.2% | 14.775 | 14.550 | +0.1% |
| up-gfm → lil-gfm | gfmreadme | 159.79 | 162.83 | 71.282 | 63.822 | −11.4% | 81.800 | 72.325 | −15.4% |
| up-gfm → lil-gfm | readme | 172.35 | 166.13 | 125.330 | 110.850 | −12.1% | 126.350 | 122.370 | −3.6% |
| up-gfm → lil-gfm | unified | 282.33 | 274.50 | 237.900 | 201.530 | −13.4% | 245.615 | 225.130 | −13.0% |
| up-gfm → lil-gfm | spec | 933.91 | 866.51 | 685.115 | 644.730 | −7.2% | 799.905 | 713.980 | −12.0% |
| up-gfm → lil-gfm | conversation(40) | 77.22 | 77.94 | – | – | – | 75.443 | 74.375 | −1.8% |
| up-full → lil-upfull | small | 11.39 | 11.20 | 2.615 | 2.480 | −6.9% | 3.125 | 2.725 | −17.3% |
| up-full → lil-upfull | chat | 67.01 | 69.28 | 15.910 | 14.385 | −9.4% | 19.355 | 17.115 | −13.7% |
| up-full → lil-upfull | readme | 247.14 | 249.31 | 130.660 | 121.475 | −8.7% | 139.465 | 136.040 | −2.0% |
| up-full → lil-upfull | math | 252.97 | 212.20 | 114.805 | 88.773 | −21.1% | 143.875 | 115.655 | −18.6% |
| up-full → lil-upfull | conversation(40) | 100.36 | 104.63 | – | – | – | 93.807 | 93.638 | +0.7% |
| up-full → lil-full | small | 11.39 | 12.79 | 2.615 | 2.390 | −9.7% | 3.125 | 2.700 | −13.7% |
| up-full → lil-full | chat | 67.01 | 62.20 | 15.910 | 13.445 | −16.6% | 19.355 | 15.230 | −25.7% |
| up-full → lil-full | readme | 247.14 | 227.53 | 130.660 | 111.310 | −14.8% | 139.465 | 124.660 | −16.7% |
| up-full → lil-full | math | 252.97 | 207.19 | 114.805 | 89.355 | −23.3% | 143.875 | 119.590 | −16.5% |
| up-full → lil-full | conversation(40) | 100.36 | 109.73 | – | – | – | 93.807 | 90.852 | −4.2% |

### Streaming (re-render the growing message every 12 characters; ms)

| CPU | stream | pair | upstream / port |  |  |  |
|---|---:|---:|---:|---:|---:|---:|
| 1× | chat (277 updates) | up → lil | total 256 / 237 (−7.7%) | p95 1.78 / 1.70 | last 1.59 / 1.49 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-gfm → lil-upgfm | total 422 / 372 (−12.2%) | p95 3.05 / 2.72 | last 2.73 / 2.48 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-gfm → lil-gfm | total 422 / 369 (−8.4%) | p95 3.05 / 2.77 | last 2.73 / 2.36 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-full → lil-upfull | total 465 / 406 (−12.7%) | p95 3.20 / 2.92 | last 3.10 / 2.92 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-full → lil-full | total 465 / 441 (−6.2%) | p95 3.20 / 3.02 | last 3.10 / 2.76 | >16.7ms 0 / 0 |
| 1× | long (834 updates) | up → lil | total 3,850 / 3,507 (−8.4%) | p95 8.34 / 7.34 | last 8.33 / 8.16 | >16.7ms 0 / 0 |
| 1× | long (834 updates) | up-gfm → lil-upgfm | total 5,839 / 5,321 (−7.0%) | p95 13.28 / 12.09 | last 12.17 / 11.53 | >16.7ms 10 / 6 |
| 1× | long (834 updates) | up-gfm → lil-gfm | total 5,839 / 5,101 (−9.9%) | p95 13.28 / 11.26 | last 12.17 / 10.06 | >16.7ms 10 / 3 |
| 1× | long (834 updates) | up-full → lil-upfull | total 5,832 / 5,711 (−3.6%) | p95 13.15 / 12.86 | last 13.00 / 11.39 | >16.7ms 10 / 9 |
| 1× | long (834 updates) | up-full → lil-full | total 5,832 / 5,726 (−8.5%) | p95 13.15 / 12.58 | last 13.00 / 11.88 | >16.7ms 10 / 9 |
| 1× | chat-realtime-30ms | up → lil | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 1× | chat-realtime-30ms | up-gfm → lil-upgfm | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 1× | chat-realtime-30ms | up-gfm → lil-gfm | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 1× | chat-realtime-30ms | up-full → lil-upfull | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 1× | chat-realtime-30ms | up-full → lil-full | frames>33ms 0 / 0 | p95 frame 16.7 / 16.7 | max frame 16.7 / 16.7 |  |
| 4× | chat (277 updates) | up → lil | total 1,127 / 1,018 (−8.5%) | p95 8.07 / 6.84 | last 8.98 / 6.09 | >16.7ms 0 / 0 |
| 4× | chat (277 updates) | up-gfm → lil-upgfm | total 1,883 / 1,822 (−5.1%) | p95 13.57 / 13.14 | last 12.77 / 11.97 | >16.7ms 3 / 2 |
| 4× | chat (277 updates) | up-gfm → lil-gfm | total 1,883 / 1,690 (−9.2%) | p95 13.57 / 12.50 | last 12.77 / 11.21 | >16.7ms 3 / 4 |
| 4× | chat (277 updates) | up-full → lil-upfull | total 2,178 / 2,051 (−6.8%) | p95 15.77 / 14.53 | last 15.05 / 12.28 | >16.7ms 7 / 3 |
| 4× | chat (277 updates) | up-full → lil-full | total 2,178 / 1,854 (−14.7%) | p95 15.77 / 12.64 | last 15.05 / 12.10 | >16.7ms 7 / 1 |

## firefox 153.0

### Page load, desktop (8 fresh loads per variant; median)

| variant | markdown on screen (ms) | Δ vs no-markdown app | JS execution (ms) | heap after GC (MB) | JS transferred (B) |
|---|---:|---:|---:|---:|---:|
| none | 129.0 | – | – | – | 52,250 |
| up | 258.9 | 129.8 | – | – | 82,434 |
| lil | 277.5 | 148.5 | – | – | 79,304 |
| up-gfm | 288.9 | 159.8 | – | – | 91,291 |
| lil-upgfm | 281.7 | 152.6 | – | – | 89,438 |
| lil-gfm | 286.0 | 156.9 | – | – | 88,332 |
| up-full | 333.1 | 204.0 | – | – | 157,537 |
| lil-upfull | 311.9 | 182.8 | – | – | 159,768 |
| lil-full | 311.1 | 182.0 | – | – | 159,972 |

| pair (same-round) | median Δ on-screen (ms) | port faster in | median Δ JS execution (ms) |
|---|---:|---:|---:|
| up → lil | 12.1 | 3/8 | – |
| up-gfm → lil-upgfm | -4.1 | 5/8 | – |
| up-gfm → lil-gfm | -19.3 | 5/8 | – |
| up-full → lil-upfull | 2.0 | 3/8 | – |
| up-full → lil-full | -8.7 | 5/8 | – |

### Rendering, CPU 1× (5 fresh pages per variant; ms, median of per-page medians)

| pair | document | first call up | first call port | pipeline up | pipeline port | Δ | React mount up | React mount port | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| up → lil | small | 4.42 | 4.64 | 0.420 | 0.400 | +0.0% | 0.560 | 0.560 | −3.4% |
| up → lil | chat | 13.80 | 14.26 | 2.560 | 2.420 | −5.1% | 3.250 | 2.760 | −12.0% |
| up → lil | gfmreadme | 52.10 | 51.58 | 19.130 | 18.450 | −3.6% | 22.120 | 20.560 | −2.5% |
| up → lil | readme | 52.60 | 53.74 | 30.040 | 26.740 | −11.8% | 33.600 | 31.080 | −0.8% |
| up → lil | unified | 81.02 | 89.96 | 58.430 | 55.510 | −4.2% | 67.640 | 61.900 | −10.1% |
| up → lil | spec | 241.40 | 250.88 | 205.280 | 186.180 | −10.8% | 217.040 | 200.900 | −9.4% |
| up → lil | conversation(40) | 21.28 | 19.38 | – | – | – | 15.400 | 14.780 | −14.9% |
| up-gfm → lil-upgfm | small | 4.30 | 4.90 | 0.620 | 0.610 | −1.6% | 0.780 | 0.760 | −2.6% |
| up-gfm → lil-upgfm | chat | 21.58 | 23.92 | 4.140 | 3.860 | −6.8% | 4.850 | 4.680 | −4.8% |
| up-gfm → lil-upgfm | gfmreadme | 61.54 | 67.06 | 25.310 | 22.880 | −6.7% | 25.940 | 25.260 | −3.5% |
| up-gfm → lil-upgfm | readme | 67.36 | 64.90 | 39.990 | 38.360 | −5.0% | 43.150 | 41.410 | −4.0% |
| up-gfm → lil-upgfm | unified | 106.68 | 104.16 | 75.350 | 69.560 | −8.3% | 77.140 | 77.350 | −2.2% |
| up-gfm → lil-upgfm | spec | 319.70 | 308.38 | 261.160 | 258.590 | +0.8% | 274.400 | 269.020 | +1.3% |
| up-gfm → lil-upgfm | conversation(40) | 32.14 | 28.80 | – | – | – | 24.670 | 23.650 | −6.3% |
| up-gfm → lil-gfm | small | 4.30 | 5.06 | 0.620 | 0.620 | +3.3% | 0.780 | 0.740 | +0.0% |
| up-gfm → lil-gfm | chat | 21.58 | 25.26 | 4.140 | 4.030 | −1.4% | 4.850 | 4.530 | −6.6% |
| up-gfm → lil-gfm | gfmreadme | 61.54 | 65.06 | 25.310 | 23.070 | −7.3% | 25.940 | 25.400 | −4.3% |
| up-gfm → lil-gfm | readme | 67.36 | 67.84 | 39.990 | 36.030 | −8.1% | 43.150 | 41.550 | +0.4% |
| up-gfm → lil-gfm | unified | 106.68 | 112.20 | 75.350 | 70.410 | −10.1% | 77.140 | 76.310 | −1.3% |
| up-gfm → lil-gfm | spec | 319.70 | 329.18 | 261.160 | 254.870 | −2.8% | 274.400 | 266.640 | −4.1% |
| up-gfm → lil-gfm | conversation(40) | 32.14 | 33.62 | – | – | – | 24.670 | 21.590 | −13.3% |
| up-full → lil-upfull | small | 3.94 | 4.80 | 0.720 | 0.700 | −2.8% | 0.860 | 0.820 | −2.4% |
| up-full → lil-upfull | chat | 20.12 | 26.86 | 4.460 | 4.500 | −1.6% | 4.690 | 4.690 | −1.6% |
| up-full → lil-upfull | readme | 88.86 | 100.96 | 40.770 | 40.260 | +0.4% | 44.440 | 42.540 | −2.7% |
| up-full → lil-upfull | math | 64.30 | 58.72 | 27.190 | 22.440 | −16.3% | 40.000 | 35.480 | −13.6% |
| up-full → lil-upfull | conversation(40) | 33.70 | 31.64 | – | – | – | 26.380 | 26.530 | −0.9% |
| up-full → lil-full | small | 3.94 | 4.46 | 0.720 | 0.680 | −5.6% | 0.860 | 0.820 | −2.5% |
| up-full → lil-full | chat | 20.12 | 22.04 | 4.460 | 4.330 | −4.7% | 4.690 | 4.580 | −1.5% |
| up-full → lil-full | readme | 88.86 | 94.94 | 40.770 | 38.650 | −2.4% | 44.440 | 41.420 | −1.5% |
| up-full → lil-full | math | 64.30 | 57.08 | 27.190 | 22.180 | −19.5% | 40.000 | 32.760 | −18.5% |
| up-full → lil-full | conversation(40) | 33.70 | 34.02 | – | – | – | 26.380 | 25.390 | −4.7% |

### Streaming (re-render the growing message every 12 characters; ms)

| CPU | stream | pair | upstream / port |  |  |  |
|---|---:|---:|---:|---:|---:|---:|
| 1× | chat (277 updates) | up → lil | total 401 / 356 (−11.6%) | p95 2.58 / 2.38 | last 2.62 / 2.30 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-gfm → lil-upgfm | total 627 / 585 (−7.0%) | p95 4.48 / 4.32 | last 4.58 / 3.68 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-gfm → lil-gfm | total 627 / 539 (−15.5%) | p95 4.48 / 3.78 | last 4.58 / 3.58 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-full → lil-upfull | total 617 / 610 (−5.9%) | p95 4.90 / 4.34 | last 4.64 / 4.04 | >16.7ms 0 / 0 |
| 1× | chat (277 updates) | up-full → lil-full | total 617 / 610 (−1.6%) | p95 4.90 / 5.14 | last 4.64 / 4.34 | >16.7ms 0 / 0 |
| 1× | long (834 updates) | up → lil | total 6,076 / 5,495 (−8.7%) | p95 13.88 / 12.34 | last 12.26 / 10.60 | >16.7ms 9 / 8 |
| 1× | long (834 updates) | up-gfm → lil-upgfm | total 8,025 / 7,634 (−0.8%) | p95 17.72 / 17.98 | last 16.78 / 16.14 | >16.7ms 59 / 74 |
| 1× | long (834 updates) | up-gfm → lil-gfm | total 8,025 / 7,744 (−5.2%) | p95 17.72 / 17.08 | last 16.78 / 17.24 | >16.7ms 59 / 48 |
| 1× | long (834 updates) | up-full → lil-upfull | total 7,986 / 7,707 (−3.5%) | p95 18.08 / 17.92 | last 16.24 / 17.46 | >16.7ms 65 / 54 |
| 1× | long (834 updates) | up-full → lil-full | total 7,986 / 7,451 (−5.8%) | p95 18.08 / 17.20 | last 16.24 / 15.56 | >16.7ms 65 / 51 |
| 1× | chat-realtime-30ms | up → lil | frames>33ms 0 / 0 | p95 frame 17.1 / 17.1 | max frame 17.2 / 17.3 |  |
| 1× | chat-realtime-30ms | up-gfm → lil-upgfm | frames>33ms 0 / 0 | p95 frame 17.1 / 17.1 | max frame 17.3 / 17.4 |  |
| 1× | chat-realtime-30ms | up-gfm → lil-gfm | frames>33ms 0 / 0 | p95 frame 17.1 / 17.1 | max frame 17.3 / 17.2 |  |
| 1× | chat-realtime-30ms | up-full → lil-upfull | frames>33ms 1 / 2 | p95 frame 17.1 / 17.1 | max frame 66.4 / 67.5 |  |
| 1× | chat-realtime-30ms | up-full → lil-full | frames>33ms 1 / 1 | p95 frame 17.1 / 17.1 | max frame 66.4 / 67.5 |  |

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
| chromium | gfm-spec | gfm | 702 | 0 |
| chromium | gfm-spec | gfm-npm-on-port | 702 | 0 |
| chromium | gfm-spec | gfm-port-on-upstream | 702 | 0 |
| chromium | gfm-spec | full | 702 | 0 |
| chromium | gfm-spec | full-npm-on-port | 702 | 0 |
| chromium | gfm-spec | raw | 702 | 0 |
| chromium | entities | core | 91 | 0 |
| chromium | entities | gfm | 91 | 0 |
| chromium | fuzz | core | 3000 | 0 |
| chromium | fuzz | gfm | 3000 | 0 |
| chromium | fuzz | gfm-npm-on-port | 3000 | 0 |
| chromium | fuzz | full | 3000 | 0 |
| chromium | fuzz | raw | 3000 | 0 |
| chromium | documents | core | 7 | 0 |
| chromium | documents | gfm | 7 | 0 |
| chromium | documents | gfm-npm-on-port | 7 | 0 |
| chromium | documents | gfm-port-on-upstream | 7 | 0 |
| chromium | documents | full | 7 | 0 |
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
| firefox | gfm-spec | gfm | 702 | 0 |
| firefox | gfm-spec | gfm-npm-on-port | 702 | 0 |
| firefox | gfm-spec | gfm-port-on-upstream | 702 | 0 |
| firefox | gfm-spec | full | 702 | 0 |
| firefox | gfm-spec | full-npm-on-port | 702 | 0 |
| firefox | gfm-spec | raw | 702 | 0 |
| firefox | entities | core | 91 | 0 |
| firefox | entities | gfm | 91 | 0 |
| firefox | fuzz | core | 3000 | 0 |
| firefox | fuzz | gfm | 3000 | 0 |
| firefox | fuzz | gfm-npm-on-port | 3000 | 0 |
| firefox | fuzz | full | 3000 | 0 |
| firefox | fuzz | raw | 3000 | 0 |
| firefox | documents | core | 7 | 0 |
| firefox | documents | gfm | 7 | 0 |
| firefox | documents | gfm-npm-on-port | 7 | 0 |
| firefox | documents | gfm-port-on-upstream | 7 | 0 |
| firefox | documents | full | 7 | 0 |
| firefox | documents | full-npm-on-port | 7 | 0 |
| firefox | documents | raw | 7 | 0 |
| firefox | documents | docsite | 7 | 0 |
| firefox | documents | components | 7 | 0 |
| firefox | documents | filter | 7 | 0 |

## Node differential fuzz (Unicode-heavy)

| set | documents | mismatches | gone when non-ASCII whitespace is replaced | other |
|---|---:|---:|---:|---:|
| core | 20000 | 0 | 0 | 0 |
| npm remark-gfm + remark-math on both | 20000 | 0 | 0 | 0 |
| @itslil/remark-gfm + remark-math (npm) | 20000 | 0 | 0 | 0 |

## Export conditions without a DOM

| runtime conditions | package | result | resolved |
|---|---:|---:|---:|
| node (import) | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| node (import) | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.esm.js |
| cloudflare workers (wrangler) | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| cloudflare workers (wrangler) | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.worker.js |
| next.js / vercel edge | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| next.js / vercel edge | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.worker.js |
| deno | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| deno | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.esm.js |
| react-native (metro) | upstream | OK <p>© Æ ∉ &amp;</p> | decode-named-character-reference/index.js, react-markdown/lib/index.js, react-markdown/index.js |
| react-native (metro) | port | OK <p>© Æ ∉ &amp;</p> | @itslil/react-markdown/dist/react-markdown.worker.js |
| browser bundle (vite/webpack prod) | upstream | CRASH document is not defined | decode-named-character-reference/index.dom.js, react-markdown/lib/index.js, react-markdown/index.js |
| browser bundle (vite/webpack prod) | port | CRASH document is not defined | @itslil/react-markdown/dist/react-markdown.browser.js |

## Where the time goes (Chromium, warm, median of 5 fresh pages; ms)

| variant | document | parse (micromark + mdast) | mdast → hast | hast → React elements | GC share | allocated per README render |
|---|---|---:|---:|---:|---:|---:|
| up | chat | 1.61 | 0.16 | 0.16 |  |  |
| up | readme | 17.89 | 1.37 | 1.34 | 2.3% | 13.60 MB |
| up | spec | 105.68 | 5.66 | 7.40 |  |  |
| lil | chat | 1.66 | 0.08 | 0.06 |  |  |
| lil | readme | 18.97 | 0.60 | 0.47 | 2.2% | 12.15 MB |
| lil | spec | 105.66 | 2.55 | 2.38 |  |  |
| up-gfm | chat | 3.07 | 0.18 | 0.25 |  |  |
| up-gfm | readme | 23.06 | 1.25 | 1.36 | 2.8% | 17.18 MB |
| up-gfm | spec | 151.06 | 5.05 | 8.39 |  |  |
| lil-upgfm | chat | 2.92 | 0.09 | 0.10 |  |  |
| lil-upgfm | readme | 22.17 | 0.54 | 0.48 | 2.3% | 15.61 MB |
| lil-upgfm | spec | 147.98 | 1.85 | 2.55 |  |  |
| lil-gfm | chat | 2.78 | 0.11 | 0.11 |  |  |
| lil-gfm | readme | 23.58 | 0.63 | 0.48 | 2.7% | 15.34 MB |
| lil-gfm | spec | 144.13 | 2.10 | 2.79 |  |  |
| up-full | chat | 3.13 | 0.36 | 0.25 |  |  |
| up-full | readme | 24.48 | 2.11 | 1.30 | 2.5% | 17.45 MB |
| up-full | spec | 145.75 | 10.04 | 7.50 |  |  |
| lil-upfull | chat | 2.95 | 0.28 | 0.11 |  |  |
| lil-upfull | readme | 25.18 | 1.54 | 0.49 | 2.7% | 16.03 MB |
| lil-upfull | spec | 151.59 | 6.82 | 2.82 |  |  |
| lil-full | chat | 3.18 | 0.35 | 0.13 |  |  |
| lil-full | readme | 23.03 | 1.41 | 0.47 | 2.9% | 15.85 MB |
| lil-full | spec | 143.99 | 6.75 | 2.77 |  |  |
