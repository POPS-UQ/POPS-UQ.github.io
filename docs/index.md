# POPS: Misspecification-aware uncertainties in regression
Standard Bayesian regression estimates epistemic and aleatoric uncertainties, but provably ignores model misspecification — the error arising from a limited model form. 
In the low-noise (near-deterministic) limit, weight uncertainties are significantly underestimated, since they only capture epistemic uncertainty, which decays with increasing data. 

POPS estimates the parameter uncertainty caused by the model form itself. For
each training point it minimizes the global loss from the  **Pointwise Optimal Parameter Set (POPS)**
for that point, i.e. the set of parameters that would fit that
point exactly. The collection of these POPS-constrained minimizers 
spans the directions in which the model cannot reconcile its own residuals.
Their spread defines a posterior over parameters that does not vanish in the
large-data limit, and costs one extra linear solve — no sampling chain, no
ensemble, no retraining. 

Theoretically, one can show that ignorance of misspecification arises from minimizing the expected loss, which is only a (Jensen) upper bound to the generalization error. 
The POPS approach ensures the generalization error remains finite in the low-noise limit. 

[How POPS works](method/index.md) ·
[Algorithm](method/algorithm.md) ·
[Paper](https://doi.org/10.1088/2632-2153/ad9fce)

![Quartic polynomial fitted to an oscillatory target at three data densities.
Bayesian Ridge uncertainty collapses as data are added, while the POPS
posteriors retain uncertainty where the model class cannot follow the
target.](assets/pops-vs-bayesian-ridge.png){ .figure }

/// caption
A quartic polynomial (P = 5) fitted to an oscillatory target as the data grow.
**Top:** the Bayesian Ridge posterior tightens around a wrong answer.
**Middle, bottom:** the POPS ensemble and hypercube posteriors keep uncertainty
exactly where the polynomial cannot follow the target.
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
