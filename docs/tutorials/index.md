# When more data cannot fix the model

Suppose a simulator gives the same answer every time you run it at a given input. You fit a straight line to its outputs. If the simulator traces a curve, even infinitely many runs cannot turn that line into the curve. The mismatch is **model misspecification**.

## Fit the line

Start with the curved target and eight observations. The dots are exact simulator outputs. The dashed curve shows the simulator between observations, information you would usually have to pay to obtain. The solid line is the least-squares fit. Switch to the linear target and watch what happens to the residuals.

<div class="pops-lab" id="pops-lab">
  <div class="lab-controls">
    <label>Simulator target <select id="lab-target"><option value="curved">Curved</option><option value="linear">Linear</option></select></label>
    <label>Observations <select id="lab-count"><option>4</option><option selected>8</option><option>16</option><option>32</option><option>64</option></select></label>
    <label>Shaded region <select id="lab-band"><option value="ensemble">POPS ensemble range</option><option value="mean">Fitted mean ± 2 SE</option></select></label>
    <label>Inspect observation <output id="lab-index"></output><input id="lab-point" type="range" min="1" max="8" value="3"></label>
  </div>
  <canvas id="lab-chart" width="760" height="340" aria-label="Simulator, fitted line, selected pointwise fit and selected uncertainty region. Numerical results follow."></canvas>
  <p class="lab-key"><span>┄ Simulator</span><span>━ Least squares</span><span>◆ Selected point and its fit</span></p>
  <p id="lab-results" role="status"></p>
  <noscript>Enable JavaScript to run the experiment. The derivation and interpretation below also work on paper.</noscript>
</div>

## Diagnose the residual

Choose **Curved** and **Fitted mean ± 2 SE**. Compare 8 and 64 observations. The shaded region estimates uncertainty in the fitted mean under a working model that treats the residuals as independent noise. With more observations the line becomes well determined, yet the curve still bends away from it. The root-mean-square error (RMSE) measures this remaining discrepancy in units of the output.

This separates three questions. **Epistemic uncertainty** asks how well finite data determine the fitted parameters. **Aleatoric uncertainty** concerns variation between repeated observations at the same input. Here repeats have zero variation. **Model-form error** concerns what the family of straight lines can represent.

## Fit one point exactly

Choose **POPS ensemble range**. Move **Inspect observation** from the middle to an endpoint. The highlighted line passes through that observation and minimizes total squared error subject to that constraint. Each observation generally asks for a different slope and intercept. The shaded region spans the predictions of all those lines at each input.

For a design matrix \(X\) with rows \(z_i^T=(1,x_i)\), let \(w\) be the least-squares coefficients, \(C=(X^TX)^{-1}\), and \(e_i=y_i-z_i^Tw\). The selected coefficients are

\[
w_i=w+\frac{e_i C z_i}{z_i^T C z_i}.
\]

Multiplying by \(z_i^T\) recovers \(y_i\). When the simulator is linear, the original fit already meets every constraint and the lines coincide. The experiment uses the raw pointwise ensemble. The [hypercube construction](../method/hypercube.md) builds a distribution from the parameter vectors for propagation.

## Test between observations

The lab checks the selected region against the simulator at 200 equally spaced cell midpoints across the plotted domain. Try four observations on the curved target. Each training point lies inside the ensemble range by construction. Does the range contain the curve everywhere between them? Coverage on this grid is an empirical diagnostic. Neither the ensemble range nor its extrema specify a 95% prediction interval.

For a downstream calculation, carry each pair of coefficients together. For example, the difference between outputs at two inputs depends on the slope of a single line. Choosing unrelated upper or lower values at the two inputs can produce a difference that no sampled model predicts.

## Continue the experiment

Compare additional regression methods in [James Kermode’s interactive regression demo](https://kermodegroup.github.io/demos/regression-demo.html). For a package example, try the [Python polynomial regression notebook and walkthrough](https://pops-uq.github.io/popsregression/example/). Julia users can go directly to the standalone [POPSRegression.jl documentation](https://pops-uq.github.io/POPSRegression.jl/).

The [research guide](../citation.md#follow-the-research) traces these steps from the low-noise construction to tungsten properties and finite-data risk bounds.
