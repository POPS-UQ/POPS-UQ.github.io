# Linear POPS algorithm

This page specifies the POPS construction for regularized linear regression.
It separates two operations:

1. find the ordinary loss minimizer and the parameter correction required to
   fit each observation exactly; and

2. enclose those corrections in a hyperrectangle in their active
   singular-vector basis and sample from it.

The notation here fixes row and column orientations explicitly. Implementations
may store transposed arrays internally without changing the mathematics.

## Inputs and notation

Let

\[
\mathbf X \in \mathbb R^{N\times P},\qquad
\mathbf y \in \mathbb R^N,\qquad
\bf\Sigma_0 \in \mathbb R^{P\times P},
\]

where $N$ is the number of observations, $P$ is the number of model
parameters, and \(\bf\Sigma_0\) is the regularization (prior-covariance)
term used by the regression problem. Define the regularized feature covariance

\[
\mathbf C = \mathbf X^\mathsf T\mathbf X
             + {\bf\Sigma_0}.
\]

All occurrences of `solve` below mean solving a linear system; an implementation
should not form \(\mathbf C^{-1}\) explicitly.

## 1. Pointwise constrained minimizers

First solve for the regularized least-squares minimizer:

\[
\mathbf C\bar{\mathbf w} = \mathbf X^\mathsf T\mathbf y.
\]

Its residual vector is

\[
\mathbf e = \mathbf y-\mathbf X\bar{\mathbf w}.
\]

Next solve all feature-response systems at once:

\[
\mathbf C\mathbf A = \mathbf X^\mathsf T,
\qquad \mathbf A\in\mathbb R^{P\times N}.
\]

Column \(\mathbf a_n=\mathbf A_{:,n}\) gives the parameter-space response for
observation $n$. The associated leverage score is

\[
h_n = \mathbf x_n^\mathsf T\mathbf a_n,
\qquad
\mathbf h=\operatorname{diag}(\mathbf X\mathbf A).
\]

The correction that makes observation $n$ exact while minimizing the global loss is

\[
\Delta\mathbf w_n = \frac{e_n}{h_n}\mathbf a_n.
\]

Indeed,

\[
\mathbf x_n^\mathsf T(\mathbf w+\Delta\mathbf w_n)
= \mathbf x_n^\mathsf T\bar{\mathbf w}
+ \frac{e_n}{h_n}\mathbf x_n^\mathsf T\mathbf a_n
= y_n.
\]

Stacking the transposed corrections as rows gives

\[
\mathbf T =
\begin{bmatrix}
\Delta\mathbf w_1^\mathsf T\\
\vdots\\
\Delta\mathbf w_N^\mathsf T
\end{bmatrix}
\in\mathbb R^{N\times P}.
\]

Equivalently, if division and multiplication broadcast over the columns of
\(\mathbf A\), then

\[
\mathbf T^\mathsf T
= \mathbf A\odot(\mathbf e\oslash\mathbf h).
\]

The Pointwise Optimal Parameter Set used by the approximation is therefore

\[
\left\{\bar{\mathbf w}+\Delta\mathbf w_n\right\}_{n=1}^{N}.
\]

### Algorithm 1

```text
Input: X ∈ ℝᴺˣᴾ, y ∈ ℝᴺ, Σ₀ ∈ ℝᴾˣᴾ

1. C ← XᵀX + Σ₀/N
2. w ← solve(C, Xᵀy)
3. e ← y - Xw
4. A ← solve(C, Xᵀ)
5. h ← diag(XA)
6. for n = 1, …, N:
       T[n, :] ← (e[n] / h[n]) A[:, n]ᵀ
7. return w, T
```

## 2. Hypercube approximation

The correction matrix can be rank deficient: only a subspace of parameter
space may be informed by the pointwise corrections. Compute a thin singular
value decomposition

\[
\mathbf T = \mathbf U\mathbf S\mathbf V^\mathsf T
\]

and let \(R=\operatorname{rank}(\mathbf S)\), using the implementation's stated
numerical rank tolerance. Retain the active right singular vectors

\[
\mathbf V_R = \mathbf V_{:,1:R}\in\mathbb R^{P\times R}.
\]

Project every correction into that active basis:

\[
\widetilde{\mathbf T}=\mathbf T\mathbf V_R
\in\mathbb R^{N\times R}.
\]

For each active coordinate $r$, take the observed extrema

\[
l_r=\min_n\widetilde T_{nr},
\qquad
u_r=\max_n\widetilde T_{nr}.
\]

These bounds define an axis-aligned hyperrectangle in singular-vector
coordinates. Draw

\[
\mathbf z^{(m)}_r\sim\operatorname{Uniform}(l_r,u_r)
\]

independently for each coordinate, and rotate the correction back to parameter
space:

\[
\Delta\mathbf w^{(m)}=\mathbf V_R\mathbf z^{(m)}.
\]

The corresponding parameter sample is

\[
\mathbf w^{(m)}=\mathbf w+\Delta\mathbf w^{(m)}.
\]

The output of Algorithm 2 below contains corrections. Adding the baseline
minimizer \(\mathbf w\) produces parameter samples.

### Algorithm 2

```text
Input: T ∈ ℝᴺˣᴾ, number of samples M

1. U, S, Vᵀ ← svd(T)
2. R ← numerical_rank(S)
3. V_R ← V[:, 1:R]
4. T̃ ← T V_R
5. l ← column_minimum(T̃)
6. u ← column_maximum(T̃)
7. for m = 1, …, M:
       z ← Uniform(l, u)       # component-wise draws
       T_sample[m, :] ← zᵀ V_Rᵀ
8. return T_sample
```

## What the approximation preserves

The SVD rotation removes directions absent from the pointwise corrections and
expresses their active span in orthogonal coordinates. The coordinate-wise
minimum and maximum ensure that every projected pointwise correction lies
inside the hyperrectangle. Sampling fills that enclosure; it does **not** mean
that all enclosed points were themselves observed pointwise optima.

The construction is basis-aware but not invariant to replacing the bounding
hyperrectangle with an arbitrary rotation: its axes are specifically the right
singular vectors of \(\mathbf T\).

## Numerical considerations

- **Small leverage scores.** The ratio \(e_n/h_n\) is undefined when $h_n=0$
  and can be unstable when $h_n$ is very small. Implementations should expose
  or document how such observations and numerical tolerances are handled.
- **Linear solves.** Reuse a factorization of \(\mathbf C\) for the solves in
  steps 2 and 4 rather than computing an inverse.
- **Numerical rank.** The retained dimension $R$ depends on the SVD tolerance;
  results should be interpreted with that tolerance in mind.
- **Zero-rank case.** If $R=0$, there are no active correction directions and
  the hypercube collapses to the baseline minimizer.
- **Sampling interpretation.** The uniform hypercube is an approximation built
  from extrema of the pointwise corrections, not a claim that model error or
  measurement noise is uniformly distributed.

For the scientific motivation and scope, return to the
[method overview](../overview.md). Public function names, array layouts, tolerances,
and sampling interfaces belong to the [Python](../implementations/python.md) and
[Julia](../implementations/julia.md) implementation documentation.
