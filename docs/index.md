# When the simulator outruns the surrogate

A straight line fitted to a curved response can have a precisely known slope and still give the wrong prediction. **Pointwise Optimal Parameter Sets (POPS)** use disagreement between observations to quantify model-form uncertainty in the low-noise regime.

[Explore the interactive tutorial](tutorials/index.md){ .md-button .md-button--primary }

## See the mismatch

![A quartic surrogate fitted to an oscillatory target. From left to right the number of observations increases.](assets/pops-vs-bayesian-ridge.png){ .figure }

Read each row from left to right. Adding simulator runs pins down the best quartic polynomial. The top row shows how its parameter uncertainty shrinks. The bottom row shows how much its parameters would have to vary to reach individual observations. Even at the highest data density, the target still oscillates beyond what one quartic can follow.

## From a residual to a distribution

1. **Diagnose the error.** Change the simulator in the [interactive lab](tutorials/index.md) and measure what happens between training points.
2. **Construct the ensemble.** Find the smallest increase in total loss compatible with fitting each observation exactly. Follow the [linear derivation](overview.md) and the [hypercube algorithm](method/hypercube.md).
3. **Propagate a model.** Use the same parameter draw throughout a downstream calculation. The [research guide](citation.md) connects this idea to interatomic potentials and finite-data risk bounds.

## Quick start

Choose the implementation for your workflow. The [Python package](implementations/python.md) provides a regression estimator. [POPSRegression.jl](https://pops-uq.github.io/POPSRegression.jl/) is a standalone Julia package with its own installation guide, API reference, and molecular dynamics examples.
