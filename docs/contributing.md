# Contributing

Choose the repository that owns the proposed change:

- Submit shared motivation, theory, terminology, citation, and cross-language
  material to this central website.
- Submit Python installation, scikit-learn workflows, docstrings, and API
  documentation to [`popsregression`](https://github.com/POPS-UQ/popsregression).
- Submit Julia installation, StatsAPI workflows, docstrings, ACE/MD examples,
  and API documentation to
  [`POPSRegression.jl`](https://github.com/POPS-UQ/POPSRegression.jl).

Do not silently change a scientific definition during editorial cleanup. A
change to the mathematical algorithm should be reviewed against the paper and,
eventually, validated against both implementations.

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

