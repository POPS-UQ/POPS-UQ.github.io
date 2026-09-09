# POPS: Misspecification-aware regression
POPS is an efficient and rigorously grounded UQ method for misspecified (imperfect) surrogate models which avoids the overconfidence of Bayesian regression. 
POPS is primarily designed for the following setting, where existing methods fail: 

- ground truth is near-deterministic (weak aleatoric), e.g. computational surrogates (MLIPs, O/PDE integrators)

- beyond one-shot error estimation, uncertainty must be propagated downstream, requiring parameter posteriors

- we desire tight coverage bounds to assess worst-case parameter values

Any scheme minimizing the expected loss, including Bayesian approaches, provably ignores misspecification.
Conformal methods can provide calibrated error estimates but cannot assign this to parameter distributions suitable for propagation through complex workflows.
POPS provides an efficient scheme which gives naturally calibrated errors through parameter posteriors, ideally suited for multi scale propagation.

This website details the underlying theory; see [quick start](#quick-start) for details on the Python and Julia implementations. 

[How POPS works](overview.md) ·
[Algorithm](method/hypercube.md) ·
[Paper](https://doi.org/10.1088/2632-2153/ad9fce)

**Online demo from Kermode group (Warwick) [here](https://kermodegroup.github.io/demos/regression-demo.html)**

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

    [Quick start](implementations/python.md) ·
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

    [Quick start](implementations/julia.md) ·
    [Documentation](https://pops-uq.github.io/POPSRegression.jl/) ·
    [Repository](https://github.com/POPS-UQ/POPSRegression.jl)

