# Python

Install the Python package from PyPI:

```bash
pip install popsregression
```

`popsregression` follows scikit-learn estimator conventions. A workflow fits a
`POPSRegression` estimator with feature and target arrays and then requests
predictions:

```python
from popsregression import POPSRegression

model = POPSRegression(...)
model.fit(X_train, y_train)
prediction = model.predict(X_test)
```

The constructor arguments and uncertainty-returning methods depend on the
regression setup. Use the package's maintained
[example](https://pops-uq.github.io/popsregression/example/) for executable code
and its [API reference](https://pops-uq.github.io/popsregression/api/) for the
current signatures.

[Open the full Python documentation](https://pops-uq.github.io/popsregression/){ .md-button .md-button--primary }

