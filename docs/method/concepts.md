# Concepts

Terminology used across both implementations. See [How POPS works](index.md)
for the rationale and the [algorithm](algorithm.md) for the construction.

## Three kinds of uncertainty

**Aleatoric** uncertainty is irreducible randomness in the observations —
measurement noise. More data does not remove it. In the setting POPS targets it
is negligible by construction, which is why the implementations estimate a noise
precision but do not use it for prediction.

**Epistemic** uncertainty is ignorance due to a finite sample: how much the data
fail to pin down the parameters. It shrinks as \(1/N\). This is what standard
Bayesian regression reports.

**Misspecification** uncertainty is the consequence of a model class that cannot
represent the target. It is not randomness and it does not shrink with more
data. It is what POPS estimates, and what the other two miss.

The three are separable in the implementations: predictions can return the
epistemic standard deviation on its own or combined with the misspecification
term.

## Low-noise regime

The regime where aleatoric noise is small compared with model-form error —
deterministic simulation output, converged numerical calculations, interatomic
potentials fitted to electronic-structure data. Here the residual of a fit is
dominated by what the model cannot represent, so treating the whole residual as
noise discards the informative part. POPS is designed for this regime and its
assumptions are weakest here; with genuinely noisy data, the residuals mix noise
and model error and the interpretation blurs.

## Misspecification

The model class does not contain the target function. This is the normal
situation for a surrogate: a finite basis is chosen for tractability, and by
construction the best member of that basis still deviates from the target. Note
that misspecification is a property of the *model class*, not of the fit — no
amount of optimization removes it.

## Pointwise Optimal Parameter Sets

For each observation, the parameter vector that makes that observation exactly
fitted, given the regression problem. Each is *optimal* for its own observation
and generally suboptimal for the rest; the collection maps how strongly the
observations disagree, and along which parameter directions. This set is the
support of the POPS posterior.

## Leverage score

\(h_n = \mathbf x_n^\mathsf T\mathbf C^{-1}\mathbf x_n\): how strongly
observation \(n\) constrains the fit. It appears as the denominator of the
pointwise correction, so low-leverage points produce large and numerically
unstable corrections while contributing little information. The implementations
expose a leverage percentile to restrict the posterior to high-leverage points —
this both stabilizes the estimate and cuts cost.

## Posterior form: ensemble and hypercube

**Ensemble** uses the pointwise corrections directly as the posterior samples.
It is the raw construction, with no smoothing.

**Hypercube** rotates the corrections into their own principal-component basis,
retains the numerically active directions, takes an axis-aligned bounding box,
and samples inside it. Sampling fills the enclosure, so the posterior is no
longer restricted to the \(N\) observed corrections; this smooths the estimate
and makes propagation cheap. The trade is that interior points were not
themselves observed as pointwise optima — the box is an enclosure, not a
distribution derived from data density. Percentile clipping shrinks the box
away from the extreme corrections when outliers dominate.

The middle and bottom rows of the figure on the [home page](../index.md) show
the two forms on the same problem.

## Active dimension

The pointwise corrections often span fewer than \(P\) directions: some parameter
combinations are simply not implicated in the model's failures. The hypercube is
built only over directions whose eigenvalue exceeds a relative threshold, so the
posterior has an effective dimension \(R \le P\). If \(R = 0\), there are no
active correction directions and the posterior collapses to the point estimate.

## Interpretation and limits

POPS uncertainty describes sensitivity to model misspecification under the
method's assumptions. It is not a measurement-noise model, not a correction to
the mean prediction, and not an a priori coverage guarantee. It also does not
substitute for checking that the model class and data are appropriate — a
diagnosis of large misspecification uncertainty is a reason to reconsider the
model class, not only to widen the error bars. Consult the
[paper](../citation.md) before drawing scientific conclusions from an
application.
