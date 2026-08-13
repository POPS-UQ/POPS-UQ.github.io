# The POPS approach for misspecified regression problems

This page explains the POPS approach for misspecified regression and implementation for linear models. 
The [algorithm page](method/hypercube.md) gives the complete linear
construction and its numerical details
The [glossary](glossary.md) defines the terminology used across both implementations.

## Overconfidence in Bayesian regression

Take a linear model \(\mathbf x^\mathsf T\mathbf w\) fitted to \(N\)
observations. Standard Bayesian linear regression assumes specification, i.e. 
the *true* data can be modelled by 

\[
y_n = \mathbf x_n^\mathsf T\bar{\mathbf w} + \epsilon_n
\]

where $\bar{\mathbf w}$ is the best fit parameter and $\epsilon_n$ is some *aleatoric* noise, 
i.e. varies randomly each time we query the true function with input \(\mathbf x_n\).
The approach returns a posterior over parameters with covariance

\[
{\bf\Sigma}_{\text{epistemic}}
= \left( N\langle\mathbf x^\mathsf T\mathbf x\rangle + \lambda\mathbf I\right)^{-1},
\]

*If* the problem was specified, this would be correct: this is how much
the finite sample fails to pin down \(\mathbf w\). In the large data limit,
the covariance shrinks like \(1/N\), and the posterior concentrates on a point.

That is the correct answer to the question it asks. The difficulty is that in
many applications the question is wrong in two ways at once:

- **The model class is misspecified.** The target function is not in the span of
  the features. A quartic polynomial fitted to an oscillatory function, or a
  linear interatomic potential fitted to a quantum-mechanical energy surface,
  cannot reproduce the target however much data it is given. There is a
  residual that no amount of data removes.

- **The aleatoric noise is negligible.** Deterministic simulation output has no
  measurement noise worth speaking of. So the residual is not noise: it is
  model-form error, a systematic and reproducible function of \(\mathbf x\).

Fit such data with a standard Bayesian method and the two failures compound.
The estimator sees a large residual and attributes it to noise. Meanwhile
\(\bf\Sigma_{\text{epistemic}}\) keeps shrinking, so the *parameter*
uncertainty collapses even as the model stays systematically wrong. The top row
of the figure on the [home page](./index.md) shows exactly this: at N/P = 100
the Bayesian Ridge credible interval is tight and excludes the truth over most
of the domain.

Reporting a confident wrong answer is worse than reporting an uncertain one,
particularly when the fitted model is a surrogate whose predictions feed a
downstream calculation.

## The POPS approach: ask each observation what it would need

POPS attacks the problem from the residuals rather than from the noise model.
The question it asks about observation \(n\) is:

> How far would the parameters have to move for the model to fit *this*
> observation exactly?

There are many answers to this question, as there are many values of model parameters 
which would exactly fit a given observation. For each observation, we can thus define 
a **pointwise optimal parameter set** — POPS - the (typically open) set of all possible parameters 
which can interpolate a given data point. The POPS algorithm aims to map disagreement 
by finding \(\mathbf w_n\) the total loss minimiser *within each POPS*, producing a set 
of parameter vectors. Any posterior whose support covers the span of these vectors is guaranteed to 
cover all training data. The POPS paper shows how as \(N\to\infty\) ensuring any posterior has this support 
is essential to avoid a divergent generalisation error. 

Furthermore, for regularized linear regression we can find \(\mathbf w_n\) analytically:

\[
\mathbf w_n = \bar{\mathbf w} + \frac{e_n}{h_n}\,\mathbf a_n,
\qquad\text{giving}\qquad
\mathbf x_n^\mathsf T(\mathbf w + \Delta\mathbf w_n) = y_n ,
\]

where \(\mathbf C = \langle \mathbf x^\mathsf T\mathbf x\rangle + \Sigma_0/N\) is the
regularized feature covariance, \(h_n = \mathbf x_n^\mathsf T\mathbf a_n\) is the leverage\
 \(e_n = y_n - \mathbf x_n\bar{\mathbf w}\)  the residual and \(\mathbf C\mathbf a_n = \mathbf x_n\).


Each observation therefore names one parameter vector that is optimal for it. 

These vectors map model disagreement via the directions in
parameter space along which the observations pull against each other.

The set \(\{\mathbf w_n\}\) is the POPS posterior support. The
implementations either use it directly (`ensemble`) or enclose it in an
axis-aligned box in its own principal-component basis and sample from that
(`hypercube`), which smooths the estimate and makes propagation cheap. Both are
[derived on the algorithm page](hypercube.md).

## Why this behaves correctly

**The uncertainty does not vanish with more data.** The scale of each
perturbation is set by \(e_n\), the residual at that point. Under
misspecification the residuals are systematic model-form error, so they do not
shrink as \(N\) grows — collecting more data from the same target does not make
a quartic polynomial able to follow an oscillation. The spread of
\(\{\Delta\mathbf w_n\}\) therefore persists in the large-data limit, which is
the behaviour the epistemic covariance cannot produce. In the figure, the POPS
bands at N/P = 100 are still wide where the polynomial cannot follow the
target — and, importantly, still *narrow* where it can.

**The uncertainty is where the error is.** \(\Delta\mathbf w_n\) is
proportional to \(e_n\), so observations the model already fits contribute
almost nothing, while observations it cannot fit contribute in the specific
parameter direction \(\mathbf a_n\) that they load onto. The result is
heteroscedastic and structured rather than a uniform inflation of the error
bars: propagating the posterior widens predictions in the regions and along the
feature combinations where the model class is actually failing.

**It is a direct answer to a well-posed question.** The construction assumes
nothing about the *distribution* of the model error — only that residuals in
the low-noise regime are informative about model form rather than about noise.
That is a much weaker assumption than the Gaussian-noise story it replaces, and
one that is easier to check: it holds when the data are near-deterministic.

**It is cheap.** The corrections for all \(N\) observations follow fromone extra solve reusing the same
factorization as the fit, plus an eigendecomposition in parameter space
(\(P\times P\), not \(N\times N\)). There is no MCMC, no bootstrap, no ensemble
of retrained models. This matters in the surrogate-modelling setting the method
targets, where refitting is the expensive step and the whole point of the
surrogate is to be fast.

**It degrades gracefully.** If the model class is in fact adequate and the data
are clean, the residuals are small, the corrections are small, and the POPS
contribution shrinks toward zero, leaving the ordinary epistemic term. The
method adds uncertainty when there is misspecification to report and stays out
of the way when there is not.

**It is essential for propagation**
A fitted model exposes a misspecification covariance alongside the usual
epistemic one, samples from the POPS posterior, and predictions carrying
combined uncertainty and min/max bounds over the posterior. Since the posterior
is a set of parameter vectors, it propagates through any downstream calculation
that consumes the model — not just through the prediction of \(y\).

**Some important limitations**:

- POPS quantifies **parameter** uncertainty from misspecification. It is not a
  noise model, and it does not attempt to correct the mean prediction. A
  misspecified model remains misspecified; POPS says how much to distrust it.
- The hypercube is an *enclosure* of the pointwise corrections. Points inside it
  were not themselves observed as pointwise optima, and its axes are specifically
  the principal directions of the corrections.
- Coverage is only guaranteed *a priori* for strict interpolation. The bands are wide where the residuals
  say they should be wide; whether that matches the true error on unseen data is
  an empirical question, addressed for several cases in the paper.
- The construction above is for linear models — including nonlinear features
  under a linear fit, which is the usual surrogate-modelling case.

## Reference

> Thomas D. Swinburne and Danny Perez, "Parameter uncertainties for imperfect
> surrogate models in the low-noise regime," *Machine Learning: Science and
> Technology* **6**, 015008 (2025).
> DOI: [10.1088/2632-2153/ad9fce](https://doi.org/10.1088/2632-2153/ad9fce)

Consult the paper for the derivations, assumptions and validation behind the
summary given here. Continue to [glossary](glossary.md) for terminology, or to
the [algorithm](method/hypercube.md) for the full construction.
