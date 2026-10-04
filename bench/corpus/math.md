# Notes on Fourier analysis

The Fourier transform of an integrable function $f$ is
$\hat f(\xi) = \int_{-\infty}^{\infty} f(x)\, e^{-2\pi i x \xi}\, dx$, and when
$\hat f$ is integrable too the inversion formula holds:

$$
f(x) = \int_{-\infty}^{\infty} \hat f(\xi)\, e^{2\pi i x \xi}\, d\xi .
$$

## Plancherel

For $f \in L^1 \cap L^2$ we have $\|f\|_2 = \|\hat f\|_2$, so the transform
extends to a unitary map on $L^2(\mathbb{R})$.

$$
\int_{\mathbb{R}} |f(x)|^2 \, dx = \int_{\mathbb{R}} |\hat f(\xi)|^2 \, d\xi
$$

## Convolution

If $h = f * g$ with $(f * g)(x) = \int f(y) g(x - y)\, dy$, then
$\hat h = \hat f \cdot \hat g$. The Gaussian $g(x) = e^{-\pi x^2}$ is its own
transform, $\hat g = g$.

| Function | Transform |
| --- | --- |
| $e^{-\pi x^2}$ | $e^{-\pi \xi^2}$ |
| $\mathbf{1}_{[-1/2, 1/2]}(x)$ | $\operatorname{sinc}(\xi) = \frac{\sin \pi \xi}{\pi \xi}$ |
| $f(x - a)$ | $e^{-2\pi i a \xi} \hat f(\xi)$ |
| $f'(x)$ | $2\pi i \xi\, \hat f(\xi)$ |

## Poisson summation

For a Schwartz function $f$:

$$
\sum_{n \in \mathbb{Z}} f(n) = \sum_{k \in \mathbb{Z}} \hat f(k)
$$

Applied to $f(x) = e^{-\pi t x^2}$ this gives the theta identity
$\theta(t) = t^{-1/2}\, \theta(1/t)$ where $\theta(t) = \sum_n e^{-\pi n^2 t}$.

## A matrix

$$
\begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1}
= \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix},
\qquad ad - bc \neq 0 .
$$

- [x] inversion
- [x] Plancherel
- [ ] uncertainty principle: $\Delta x\, \Delta \xi \ge \frac{1}{4\pi}$
