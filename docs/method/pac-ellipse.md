# PAC-Ellipse algorithm

The [linear POPS construction](hypercube.md) uses pointwise corrections to determine a spread in parameter space. PAC-Ellipse uses that geometry to initialize an ellipsoid. A uniform draw from the ellipsoid defines a linear surrogate, and its prediction at any input has an analytic density. This gives a loss for learning the ellipsoid and, with an independent certification sample, a finite-sample bound on predictive risk.

## Inputs and notation

Let \(\mathbf X\in\mathbb R^{N\times P}\) have one feature vector per row and let \(\mathbf y\in\mathbb R^N\). Partition the **independent cases** into pilot and certification sets. If one simulator run contributes several rows, keep that run together. Write \(n\) for the number of certification cases.

Before inspecting the responses, specify an interval \([L,H]\) containing all possible outputs, a density floor weight \(0<\beta<1\), a minimum half-width \(\delta>0\), candidate hyperprior scales and temperatures, and failure probabilities. Write \(R=H-L\). The guarantee assumes independent cases drawn from the deployment distribution.

## 1. Fit the pilot ellipsoid

Fit the feature transformation and whitening on the pilot cases. Write \(\mathbf z\in\mathbb R^P\) for a transformed feature vector and work in centered output coordinates. The default pilot center \(\mu\in\mathbb R^P\) is the ridge estimate. Let \(\mathbf B_0\) be the fixed shape contribution obtained from the POPS hypercube. Fit a rank-\(r\) update \(\mathbf U\in\mathbb R^{P\times r}\), giving \(\mathbf B=\mathbf B_0+\mathbf U\mathbf U^\mathsf T\).

To derive the density, take \(\mathbf u\) uniform on the unit ball in dimension \(D=P+1\). The last coordinate supplies a shared output offset. A prediction at \(\mathbf z\) is

\[
Y=\mathbf z^\mathsf T\mu+
   (\mathbf B^{1/2}\mathbf z,\delta)^\mathsf T\mathbf u .
\]

By rotational symmetry, the last term has the same law as \(a u_1\), where \(a^2=\mathbf z^\mathsf T\mathbf B\mathbf z+\delta^2\). A slice of the ball at \(u_1=t\) has radius \(\sqrt{1-t^2}\), so its \((D-1)\)-dimensional volume is proportional to \((1-t^2)^{(D-1)/2}\). With \(m=\mathbf z^\mathsf T\mu\) and \(s=(y-m)/a\), the normalized density inside \(|s|<1\) is

\[
p_{\mathbf B}(y\mid\mathbf z)=
\frac{\Gamma(D/2+1)}{\sqrt{\pi}\,\Gamma((D+1)/2)}
\frac{(1-s^2)^{(D-1)/2}}{a}.
\]

The density is zero outside the support. Up to a constant, a pilot observation contributes
\(\log a-\tfrac{D-1}{2}\log(1-s^2)\) to the loss. The first term penalizes excessive width. The second increases as the observation approaches the edge. Minimizing the pilot loss fits widths in the directions sampled by the features.

### Algorithm 1

~~~text
Input: pilot cases, rank r, minimum half-width δ
1. Fit preprocessing, whitening, the ridge center μ and the POPS baseline B₀.
2. For each pilot row compute a² = zᵀ B₀ z + ‖Uᵀ z‖² + δ².
3. Optimize U against the projected negative log density using barrier continuation.
4. Diagonalize B₀ + U Uᵀ = V diag(b) Vᵀ and floor small eigenvalues.
5. Return the pilot transform, μ, V and b.
~~~

## 2. Learn the axis scales and certify the predictive

Keep the pilot axes fixed. In the default, fixed-center construction, the vector \(\omega=(\omega_1,\ldots,\omega_P)\) collects the axis scales. Each \(\omega_k\) is the log multiplier of a **semi-axis length**. Its square enters the width:

\[
a_{\omega}^2(\mathbf z)=\delta^2+
\sum_{k=1}^P b_k\,e^{2\omega_k}(\mathbf v_k^\mathsf T\mathbf z)^2.
\]

At \(\omega=0\) this recovers the pilot widths. Place a Gaussian hyperprior \(\pi_\tau=\mathcal N(0,\tau^2 I)\) on the multipliers. A Gaussian hyperposterior \(Q\) describes uncertainty about the widths. Its predictive density is the mixture \(\mathbb E_Q[p_{\omega}(y\mid\mathbf z)]\).

**Bound the loss.** On the declared output interval, score each candidate using
\(\ell_{\omega}=-\log[(1-\beta)p_{\omega}(y\mid\mathbf z)+\beta/R]\).
The uniform floor caps this loss at \(h=\log(R/\beta)\). The minimum width caps the projected density and gives a finite lower loss bound \(l\). Average row losses within each case, then average the \(n\) cases with equal weight.

**Account for data-dependent widths.** For each predeclared prior scale and temperature, construct a diagonal Laplace candidate around a regularized empirical optimum. Let \(q\) be a Monte Carlo upper estimate of its empirical expected loss, rescaled from \([l,h]\) to \([0,1]\). The default PAC-Bayes inequality bounds the similarly rescaled population loss by the largest \(p\in[q,1]\) satisfying

\[
\operatorname{kl}(q\Vert p)
\le \frac{\operatorname{KL}(Q\Vert\pi_\tau)+\log(K\,\xi(n)/\alpha)}{n}.
\]

Here \(\operatorname{kl}\) is binary relative entropy, \(K\) counts the candidate prior scales, \(\xi(n)\) is the Seeger–Maurer moment factor and \(\alpha\) is the fold's PAC failure budget. The Gaussian KL measures how much the certification data moved or concentrated the scale distribution. Mapping the inverse-kl result back to loss units gives the bound \(B_Q\). Convexity of negative log transfers an upper bound on the expected component loss to the loss of the mixture.

**Certify the stored mixture.** Prediction uses \(M\) fresh draws from the selected \(Q\). Conditional on the fit, the component risks are independent and bounded. With storage failure budget \(\alpha_s\), Hoeffding's inequality gives the fold bound

\[
B_M=\min\!\left(h,\ B_Q+(h-l)\sqrt{\frac{\log(1/\alpha_s)}{2M}}\right).
\]

### Algorithm 2

~~~text
Input: pilot fit, independent certification cases, protocol grids and failure budgets
1. Construct candidate Gaussian hyperposteriors over the pilot axis scales.
2. Select a candidate using estimated PAC bounds on the declared grids.
3. Use fresh draws to upper-bound its empirical expected loss; add the PAC complexity term
   through the selected inequality to obtain B_Q.
4. Draw and store M fresh scale vectors. Compute B_M for their finite mixture.
5. With cross-fitting, swap the case subsets and repeat both algorithms.
6. Return the equal mixture of fold predictives and the average of their bounds.
~~~

## What the certificate guarantees

With probability at least one minus the combined PAC, empirical Monte Carlo and storage failure budgets, the expected floor-contaminated log loss on a new independent case is at most the reported bound. A value below \(\log(R/\beta)\) improves on the loss ceiling available before fitting. The certificate concerns population log risk. Pointwise interval coverage remains a separate empirical diagnostic.

For propagation, select a fold and stored scale vector, then draw one parameter vector and its offset from that ellipsoid. Use that same draw at every input of the downstream calculation.

## Numerical considerations

- **Feature geometry.** Compute squared widths from the baseline and low-rank factors. In the certification stage, cache \(b_k(\mathbf v_k^\mathsf T\mathbf z)^2\) so each candidate only rescales and sums those terms.
- **Small eigenvalues.** A relative eigenvalue floor stabilizes the pilot axis parameterization. The separate output floor \(\delta\) bounds the peak predictive density even where the projected features vanish.
- **Small samples.** The complexity term scales with the number of independent cases. Adding correlated rows to one case does not increase \(n\).
- **Sampling budgets.** More draws for evaluating \(Q\) tighten the empirical Monte Carlo correction. More stored draws reduce the finite-mixture correction. Neither operation adds independent training cases.

[Python worked example](../implementations/python/pac-ellipse.md) · [Protocol and estimator options](../implementations/python/ellipse.md) · [Sim2Science paper](https://openreview.net/forum?id=gD3LoosP0w)
