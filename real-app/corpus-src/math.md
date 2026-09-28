# Notes on least squares

Given a design matrix $X \in \mathbb{R}^{n \times p}$ and targets $y \in \mathbb{R}^n$, ordinary least squares minimises $\lVert y - X\beta \rVert_2^2$.

## Normal equations

Setting the gradient to zero gives

$$
X^\top X \hat\beta = X^\top y \quad\Longrightarrow\quad \hat\beta = (X^\top X)^{-1} X^\top y
$$

when $X^\top X$ is invertible. The fitted values are $\hat y = H y$ with the *hat matrix* $H = X (X^\top X)^{-1} X^\top$, which is symmetric and idempotent: $H^2 = H$.

## Ridge regression

Adding a penalty $\lambda \lVert \beta \rVert_2^2$ with $\lambda > 0$:

$$
\hat\beta_\lambda = (X^\top X + \lambda I)^{-1} X^\top y
$$

Using the SVD $X = U \Sigma V^\top$ with singular values $\sigma_1 \ge \dots \ge \sigma_p$,

$$
\hat\beta_\lambda = \sum_{j=1}^{p} \frac{\sigma_j}{\sigma_j^2 + \lambda}\, (u_j^\top y)\, v_j
$$

so each direction is shrunk by the factor $\frac{\sigma_j^2}{\sigma_j^2 + \lambda} \in (0, 1)$.

## Bias and variance

| Quantity | OLS | Ridge |
|---|---|---|
| Bias | $0$ | $-\lambda (X^\top X + \lambda I)^{-1} \beta$ |
| Variance | $\sigma^2 (X^\top X)^{-1}$ | $\sigma^2 W X^\top X W$, $W = (X^\top X + \lambda I)^{-1}$ |
| Effective df | $p$ | $\sum_j \frac{\sigma_j^2}{\sigma_j^2+\lambda}$ |

## Gaussian likelihood

For $y_i \sim \mathcal{N}(x_i^\top \beta, \sigma^2)$ the log-likelihood is

$$
\ell(\beta, \sigma^2) = -\frac{n}{2}\log(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_{i=1}^{n}\left(y_i - x_i^\top\beta\right)^2
$$

and the maximum-likelihood variance is $\hat\sigma^2 = \frac{1}{n}\lVert y - X\hat\beta\rVert^2$, biased by the factor $\frac{n-p}{n}$.

## A matrix identity

$$
\begin{aligned}
(A + UCV)^{-1} &= A^{-1} - A^{-1}U\left(C^{-1} + VA^{-1}U\right)^{-1}VA^{-1} \\
\det(A + uv^\top) &= (1 + v^\top A^{-1} u)\det A
\end{aligned}
$$

Inline checks: $e^{i\pi} + 1 = 0$, $\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt\pi}{2}$, $\sum_{k=1}^\infty \frac{1}{k^2} = \frac{\pi^2}{6}$, and $\binom{n}{k} = \frac{n!}{k!(n-k)!}$.
