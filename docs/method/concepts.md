# Concepts

## Imperfect model classes

A fitted regression model can disagree with observations because its model
class cannot represent the underlying relationship, even when observation
noise is negligible. POPS focuses on uncertainty associated with that
structural mismatch.

## Low-noise setting

In deterministic simulations and other low-noise data, interpreting the full
residual as measurement noise can obscure the distinction between data noise
and model-form error. POPS is designed for this regime.

## Pointwise Optimal Parameter Sets

For each observation, the pointwise construction identifies parameters that
make that observation optimal under the regression objective. The collection
of these parameter values is the Pointwise Optimal Parameter Set. Its geometry
provides information about parameter uncertainty caused by misspecification.

## Posterior and hypercube approximation

POPS uses the pointwise sets to construct a distribution over model parameters.
The implementations also provide a hypercube approximation for practical
sampling and uncertainty propagation. Exact public objects and output shapes
are implementation-specific; consult the [Python](../implementations/python.md)
or [Julia](../implementations/julia.md) documentation.

## Interpretation and limits

POPS uncertainty describes sensitivity to model misspecification under the
method's assumptions. It is not automatically a measurement-noise model, a
guarantee of coverage, or a substitute for checking the suitability of the
model class and data. Consult the [publication](../citation.md) before drawing
scientific conclusions from an application.

