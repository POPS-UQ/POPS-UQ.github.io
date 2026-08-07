# Instructions for POPS contributors and coding agents

- POPS is a language-independent scientific algorithm.
- This repository, `POPS-UQ.github.io`, owns shared conceptual and mathematical documentation.
- [`popsregression`](https://github.com/POPS-UQ/popsregression) owns the Python implementation. Python should follow scikit-learn conventions.
- [`POPSRegression.jl`](https://github.com/POPS-UQ/POPSRegression.jl) owns the Julia implementation. Julia should follow Julia and StatsAPI conventions.
- Do not force the public APIs to match syntactically.
- Do not duplicate substantial shared theory across repositories.
- Changes to the mathematical algorithm should eventually be validated against both implementations.
- Do not silently alter scientific definitions while editing documentation.
- Do not change implementation APIs as part of documentation cleanup.
- Do not synchronize Python and Julia version numbers artificially.
- Preserve stable published documentation URLs where practical.

