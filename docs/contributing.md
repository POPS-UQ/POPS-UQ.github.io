# Contributing

- Submit Python installation, scikit-learn workflows, docstrings, and API
  documentation to [`popsregression`](https://github.com/POPS-UQ/popsregression).
- Submit Julia installation, StatsAPI workflows, docstrings, ACE/MD examples,
  and API documentation to
  [`POPSRegression.jl`](https://github.com/POPS-UQ/POPSRegression.jl).
- An approved PR into the Python and /or Julia implementations should be followed by a PR to this website detailing the new functionality. 


## Editing this site

Edit Markdown under `docs/`. GitHub Actions builds and deploys every accepted
change to `main`; no local documentation installation is required. An optional
local validation is:

```bash
python -m pip install -r requirements-docs.txt
mkdocs build --strict
```

Do not commit generated HTML. Preserve the existing Python and Julia project
documentation URLs while the sites remain independently deployed.

