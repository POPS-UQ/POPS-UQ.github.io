# Python · popsregression

The JAX implementation provides two estimators for models linear in their parameters. Use `POPSRegression` for a hypercube or pointwise ensemble, and `POPSEllipseRegression` for an ellipsoid predictive distribution with optional empirical-Bayes or PAC-Bayes regularization.

## Installation

These pages describe the `jax-integration` branch. Install it with Python 3.10 or newer.

```bash
python -m pip install "popsregression @ git+https://github.com/POPS-UQ/popsregression.git@jax-integration"
```

## Fit a polynomial surrogate

```python
import numpy as np
from popsregression import POPSRegression

x = np.linspace(-1, 1, 32)
X = np.polynomial.legendre.legvander(x, 4)
y = np.sin(2 * np.pi * x)
model = POPSRegression().fit(X, y)

x_test = np.linspace(-1, 1, 201)
X_test = np.polynomial.legendre.legvander(x_test, 4)
mean, std = model.predict(X_test, return_std=True)
```

For pointwise corrections, hypercube sampling and fitted attributes, see [Hypercube and ensemble regression](usage.md). To fit a finite-sample risk bound and propagate joint predictions, follow the [PAC-Ellipse worked example](pac-ellipse.md). The [API reference](api.md) gives the estimator signatures and certificate fields.
