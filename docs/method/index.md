# Method overview

POPS addresses uncertainty in regression when the chosen model class is an
imperfect description of low-noise or near-deterministic observations. In this
setting, discrepancies between model and data need not be well represented as
independent measurement noise.

The method constructs Pointwise Optimal Parameter Sets (POPS): parameter values
that make individual observations optimal subject to the regression problem.
Their spread describes parameter variation induced by model misspecification.
Practical implementations use this structure to construct an uncertainty
distribution and an efficient hypercube approximation.

This concise overview deliberately follows the published scope rather than
introducing a new derivation. For definitions, derivations, assumptions, and
validation, consult the [paper](https://doi.org/10.1088/2632-2153/ad9fce):

> Thomas D. Swinburne and Danny Perez, “Parameter uncertainties for imperfect
> surrogate models in the low-noise regime,” *Machine Learning: Science and
> Technology* (2025). DOI: 10.1088/2632-2153/ad9fce.

See [Concepts](concepts.md) for terminology used across both implementations.

