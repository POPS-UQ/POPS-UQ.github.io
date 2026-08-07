# POPS

## Misspecification-aware uncertainty quantification for regression

[Get started with Python](getting-started/python.md){ .md-button .md-button--primary }
[Get started with Julia](getting-started/julia.md){ .md-button .md-button--primary }
[Read about the method](method/index.md){ .md-button }
[Read the paper](https://doi.org/10.1088/2632-2153/ad9fce){ .md-button }

POPS is a misspecification-aware uncertainty-quantification method for
regression in low-noise or near-deterministic settings.

Regression and surrogate models can be structurally imperfect. When the data
have little measurement noise, treating residual error purely as noise can
produce uncertainty estimates that do not represent this model
misspecification. POPS uses **Pointwise Optimal Parameter Sets** to quantify
parameter uncertainty associated with that misspecification.

## Choose an implementation

<div class="grid cards" markdown>

-   :fontawesome-brands-python: **Python — `popsregression`**

    ---

    A scikit-learn-compatible implementation.

    [Python documentation](https://pops-uq.github.io/popsregression/)
    · [Repository](https://github.com/POPS-UQ/popsregression)

-   :simple-julia: **Julia — `POPSRegression.jl`**

    ---

    A Julia implementation using StatsAPI conventions.

    [Julia documentation](https://pops-uq.github.io/POPSRegression.jl/)
    · [Repository](https://github.com/POPS-UQ/POPSRegression.jl)

</div>

The implementations have independent APIs, versions, releases, and build
systems. This site owns their shared scientific context; each implementation's
site remains the authority for its installation, API, and language-specific
workflows.

