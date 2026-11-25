# Polynomial regression under model misspecification

Fit a degree-four polynomial to the deterministic response \(f(x)=\sin(2\pi x)+0.3x^2\) on \([-1,1]\). The polynomial has five coefficients. Increasing the number of simulator runs determines those coefficients more precisely, but the family of quartics cannot reproduce two full oscillations on this interval.

## Fit a polynomial surrogate

Start with 16 equally spaced observations. Compare the dashed simulator response with the solid least-squares fit. Increase the polynomial degree at fixed sample size, then increase the sample size at fixed degree. Which change reduces the systematic residual? Switch to the quadratic reference target, \(f(x)=0.3+x-0.6x^2\), to check the same procedure on a model that can be specified exactly.

<div class="pops-lab" id="pops-lab">
  <div class="lab-controls">
    <label>Simulator target <select id="lab-target"><option value="sine">Sinusoid + quadratic trend</option><option value="quadratic">Quadratic reference</option></select></label>
    <label>Polynomial degree <select id="lab-degree"><option>1</option><option>2</option><option selected>4</option><option>6</option></select></label>
    <label>Observations <select id="lab-count"><option>8</option><option selected>16</option><option>32</option><option>64</option></select></label>
    <label>Shaded region <select id="lab-band"><option value="ensemble">POPS ensemble range</option><option value="mean">Fitted mean ± 2 SE</option></select></label>
    <label>Inspect observation <output id="lab-index"></output><input id="lab-point" type="range" min="1" max="8" value="3"></label>
  </div>
  <canvas id="lab-chart" width="760" height="340" aria-label="Simulator, fitted polynomial, selected pointwise fit and selected uncertainty region. Numerical results follow."></canvas>
  <p class="lab-key"><span>┄ Simulator</span><span>━ Least squares</span><span>◆ Selected point and its fit</span></p>
  <p id="lab-results" role="status"></p>
  <p id="lab-propagation" role="status"></p>
  <noscript>Enable JavaScript to run the experiment. The derivation and interpretation below also work on paper.</noscript>
</div>

## Diagnose the residual

Choose **Sinusoid + quadratic trend** and **Fitted mean ± 2 SE**. Compare 8 and 64 observations. The shaded region estimates uncertainty in the fitted mean under a working model that treats the residuals as independent noise. With more observations the polynomial coefficients become well determined, yet the sinusoidal residual persists. The root-mean-square error (RMSE) measures this remaining discrepancy in units of the output.

This separates three questions. **Epistemic uncertainty** asks how well finite data determine the fitted parameters. **Aleatoric uncertainty** concerns variation between repeated observations at the same input. Here repeats have zero variation. **Model-form error** concerns what the chosen polynomial degree can represent.

## Fit one point exactly

Choose **POPS ensemble range**. Move **Inspect observation** from the middle to an endpoint. The highlighted polynomial passes through that observation and minimizes total squared error subject to that constraint. Each observation generally asks for different coefficients. The shaded region spans the predictions of all constrained polynomials at each input.

For a design matrix \(X\) with rows \(z_i^T=(1,x_i,\ldots,x_i^d)\), let \(w\) be the least-squares coefficients, \(C=(X^TX)^{-1}\), and \(e_i=y_i-z_i^Tw\). The selected coefficients are

\[
w_i=w+\frac{e_i C z_i}{z_i^T C z_i}.
\]

Multiplying by \(z_i^T\) recovers \(y_i\). For the quadratic reference with degree two or higher, the original fit already meets every constraint and the fitted curves coincide. The experiment uses the raw pointwise ensemble. The [hypercube construction](../method/hypercube.md) builds a distribution from the parameter vectors for propagation.

## Test between observations

The lab checks the selected region against the simulator at 200 equally spaced cell midpoints across the plotted domain. Try eight observations with a degree-six fit to the sinusoidal target. Each training point lies inside the ensemble range by construction. Does the range contain the curve everywhere between them? Coverage on this grid is an empirical diagnostic. Neither the ensemble range nor its extrema specify a 95% prediction interval.

## Propagate uncertainty to a response difference

The lab also reports the response change from \(x=-0.4\) to \(x=0.6\). Each ensemble member supplies both predictions, so the spread in their difference preserves correlations induced by the coefficients. Compare the ensemble range for this quantity with the known simulator difference as you vary the degree.

## Continue the experiment

Compare additional regression methods in [James Kermode’s interactive regression demo](https://kermodegroup.github.io/demos/regression-demo.html). For a package example, try the [Python polynomial regression notebook and walkthrough](https://pops-uq.github.io/popsregression/example/). Julia users can go directly to the standalone [POPSRegression.jl documentation](https://pops-uq.github.io/POPSRegression.jl/).

The [research guide](../citation.md#follow-the-research) traces these steps from the low-noise construction to tungsten properties and finite-data risk bounds.
