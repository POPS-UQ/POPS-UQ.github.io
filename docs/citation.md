# Citation

When using POPS, cite the method paper:

> Thomas D. Swinburne and Danny Perez. “Parameter uncertainties for imperfect
> surrogate models in the low-noise regime.” *Machine Learning: Science and
> Technology* (2025). [doi:10.1088/2632-2153/ad9fce](https://doi.org/10.1088/2632-2153/ad9fce).

```bibtex
@article{SwinburnePerez2025,
  author  = {Swinburne, Thomas D. and Perez, Danny},
  title   = {Parameter uncertainties for imperfect surrogate models in the low-noise regime},
  journal = {Machine Learning: Science and Technology},
  year    = {2025},
  doi     = {10.1088/2632-2153/ad9fce}
}
```

For software citation metadata tied to a particular release, also consult that
implementation's repository:

- [Python repository](https://github.com/POPS-UQ/popsregression)
- [Julia repository](https://github.com/POPS-UQ/POPSRegression.jl)


## Follow the research

**Why parameter uncertainty survives in a low-noise fit.** Swinburne and Perez derive the pointwise construction and study approximate parameter distributions for imperfect surrogate models. The constrained line in the interactive lab is a two-parameter instance of that construction. [MLST (2025)](https://doi.org/10.1088/2632-2153/ad9fce)

**What happens to a downstream observable.** Perez, Subramanyam, Maliyov and Swinburne study tungsten phase and defect properties. Brute-force resampling and an implicit Taylor expansion carry uncertainty from fitted interatomic-potential parameters to the calculated properties. [npj Computational Materials (2025)](https://doi.org/10.1038/s41524-025-01758-4)

**What finite data can certify.** “PAC-Bayesian regression for misspecified, near-deterministic surrogate models” considers distributions over hyperparameters and bounds generalization error. Its force-field and PDE examples address finite-data risk. In the tutorial, the grid coverage counts actual hits on one known simulator, a different quantity from a PAC risk bound. [NeurIPS Sim2Science workshop](https://openreview.net/forum?id=gD3LoosP0w)
