# POPS: Misspecification-aware regression
Any regression scheme minimizing the expected loss, including Bayesian schemes, provably ignores model misspecification — the error arising from a limited model form. Parameter uncertainties can be strongly underestimated, especially in the near-deterministic (weak aleatoric) limit of broad interest for computational surrogate modeling. 

Theoretically, one can show this arises as the expected loss is a misspecification-blind upper bound to the generalization error. POPS is an efficient method to approximately minimize the generalization error which ensures posterior coverage in the near-determinstic limit. A demonstration compared to Bayesian regression is shown below. 

This website details the theory; documentation for Python and Julia implemetations are given below. 

[How POPS works](method/index.md) ·
[Algorithm](method/algorithm.md) ·
[Paper](https://doi.org/10.1088/2632-2153/ad9fce)

![Quartic polynomial fitted to an oscillatory target at three data densities.
Bayesian Ridge uncertainty collapses as data are added, while the POPS
posterior retains uncertainty where the model class cannot follow the
target.](assets/pops-vs-bayesian-ridge.png){ .figure }
/// caption
A quartic polynomial (P = 5) fitted to an oscillatory target as the data grow.
**Top:** the Bayesian Ridge posterior overconcentrates around the best fit model parameters, ignoring model-form errors.
**bottom:** the POPS hypercube posterior keeps uncertainty where the best fit model cannot interpolate training data.

///

## Quick start

=== "Python"

    ```bash
    pip install popsregression
    ```

    ```python
    from popsregression import POPSRegression

    model = POPSRegression().fit(X_train, y_train)

    # y_std combines misspecification and epistemic uncertainty
    y_pred, y_std = model.predict(X_test, return_std=True)
    ```

    `POPSRegression` is a scikit-learn estimator, so it drops into pipelines
    and hyperparameter search unchanged.

    [Quick start](getting-started/python.md) ·
    [Documentation](https://pops-uq.github.io/popsregression/) ·
    [Repository](https://github.com/POPS-UQ/popsregression)

=== "Julia"

    ```julia
    import Pkg; Pkg.add("POPSRegression")
    ```

    ```julia
    using POPSRegression

    model = fit(POPSModel, X_train, Y_train)

    pred = predict(model, X_test; return_std=true, return_bounds=true)
    pred.mean, pred.std, pred.lower, pred.upper
    ```

    `POPSModel` follows StatsAPI.jl conventions and supports multivariate
    targets.

    [Quick start](getting-started/julia.md) ·
    [Documentation](https://pops-uq.github.io/POPSRegression.jl/) ·
    [Repository](https://github.com/POPS-UQ/POPSRegression.jl)

The two implementations are independent, with their own APIs, versions and
releases. This site owns the shared scientific context — what the method does
and why. Each implementation's own site remains the authority for installation,
API and language-specific workflows.
