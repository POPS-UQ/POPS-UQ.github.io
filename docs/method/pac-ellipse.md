# PAC-Ellipse regression

With a small number of independent simulator runs, several parameter distributions can explain the same training residuals. Each distribution can give a different uncertainty for a downstream observable. PAC-Ellipse fits a distribution over the axis scales of a parameter ellipsoid and provides a finite-sample upper bound on the predictive log risk for a new simulator case.

## From parameter uncertainty to a predictive density

Consider a linear surrogate with feature vector \\(z(x)\\). If the coefficients are uniform in an ellipsoid with center \\(\\mu\\) and shape matrix \\(B\\), projecting the ellipsoid onto \\(z(x)\\) gives a one-dimensional predictive density centered at \\(z(x)^T\\mu\\). Its squared half-width is \\(z(x)^T B z(x)\\), plus the squared output-offset floor when that coordinate is included. One parameter draw defines an entire response curve. This preserves correlations between predictions when the model is used downstream.

The pilot fit starts from a POPS shape and fits an ellipsoid using the projected density. The negative log density penalizes excessive width while assigning high loss to observations near the edge of the support. In a misspecified model, different parts of the input domain can therefore require different predictive widths.

## Learning the axis scales with finite data

1. **Define independent cases.** For a PDE solver, one simulation may yield hundreds of correlated spatial outputs. Keep all those outputs in the same case when splitting the data. The number of independent simulations determines the sample size for the certificate.
2. **Fit the pilot ellipsoid.** A pilot subset fixes the features, center, orientation and baseline axis lengths. A hyperprior specifies plausible changes in the logarithms of those lengths.
3. **Use the certification cases.** The fit balances empirical log loss against the KL divergence of the fitted scale distribution from its hyperprior. Choosing among a predeclared grid of temperatures and prior scales incurs a selection correction. With cross-fitting, the two subsets exchange roles and the final predictive mixes both folds.
4. **Propagate the fitted mixture.** Draw a model once and evaluate it at every input in the downstream calculation. Predictive intervals describe the spread in individual outputs. A propagated quantity, such as the difference between two outputs, uses their joint draws.

## Interpreting the certificate

An ellipsoid has bounded support. To score a future observation even when it falls outside that support, the certificate mixes the fitted predictive density \\(p(y\\mid x)\\) with a uniform density on a **predeclared** output interval of width \\(R\\). With floor weight \\(\\beta\\), the certified quantity is

\\[
\\mathbb{E}_{\\mathrm{new\\ case}}\\!\\left[-\\log\\left((1-\\beta)p(Y\\mid X)+\\frac{\\beta}{R}\\right)\\right].
\\]

For a case with multiple rows, average its row losses first. The guarantee assumes independent cases from the deployment distribution and an interval containing all possible outputs. A physical bound, such as one from a maximum principle, can justify the interval. Training-set extrema alone cannot establish it.

The implementation reports an upper bound for the stored finite mixture, with a confidence level that accounts for sampling and Monte Carlo error. Compare it with the trivial loss ceiling \\(\\log(R/\\beta)\\) to see whether it is informative. This is a guarantee on expected log loss. Coverage of a 95% predictive interval is a separate empirical question.

## Fit PAC-Ellipse in Python

Use `POPSEllipseRegression(regularization="PAC", y_bounds=(lo, hi))` on the JAX integration branch. The package guide fits a polynomial surrogate to a bounded sinusoid, reads its certificate and propagates predictions. [Runnable JAX guide](../implementations/python/pac-ellipse.md) · [Sim2Science paper](https://openreview.net/forum?id=gD3LoosP0w)
