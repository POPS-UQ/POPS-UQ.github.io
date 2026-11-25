# POPS website

This repository contains the language-neutral website for the POPS scientific
project, published at <https://pops-uq.github.io/>.

The implementations remain independent:

- Python: [`POPS-UQ/popsregression`](https://github.com/POPS-UQ/popsregression)
- Julia: [`POPS-UQ/POPSRegression.jl`](https://github.com/POPS-UQ/POPSRegression.jl)

GitHub Actions builds and deploys this site. Installing documentation software
locally is **not** required for ordinary content maintenance. For an optional
local preview:

```bash
git submodule update --init
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements-docs.txt
mkdocs serve
```

The Python reference and guides are built from the pinned package source in `vendor/popsregression`. Updating that submodule updates the documented revision.

Run the same strict validation used in CI with:

```bash
mkdocs build --strict
```

Do not commit the generated `site/` directory.

