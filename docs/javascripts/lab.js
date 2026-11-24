(() => {
  const panel = document.getElementById("pops-lab");
  if (!panel) return;
  const field = name => document.getElementById("lab-" + name);
  const chart = field("chart");
  const ctx = chart.getContext("2d");
  function render() {
    const n = Number(field("count").value);
    const curved = field("target").value === "curved";
    const truth = x => 0.25 + 0.6 * x + (curved ? 0.65 * Math.cos(Math.PI * x) : 0);
    const xs = Array.from({length: n}, (_, i) => -1 + 2 * i / (n - 1));
    const sum = values => values.reduce((a, b) => a + b, 0);
    // The symmetric design makes the intercept and slope columns orthogonal.
    const xx = sum(xs.map(x => x * x));
    const intercept = sum(xs.map(truth)) / n;
    const slope = sum(xs.map(x => x * truth(x))) / xx;
    const mean = x => intercept + slope * x;
    const residual = xs.map(x => truth(x) - mean(x));
    const ss = sum(residual.map(e => e * e));
    const members = xs.map((xi, i) => {
      const scale = residual[i] / (1 / n + xi * xi / xx);
      return x => mean(x) + scale * (1 / n + xi * x / xx);
    });
    const point = field("point");
    point.max = n;
    const index = Number(point.value) - 1;
    field("index").textContent = point.value + " of " + n;
    function bounds(x) {
      if (field("band").value === "mean") {
        const width = 2 * Math.sqrt(ss / (n - 2) * (1 / n + x * x / xx));
        return [mean(x) - width, mean(x) + width];
      }
      const ys = members.map(f => f(x));
      return [Math.min(...ys), Math.max(...ys)];
    }
    const grid = Array.from({length: 201}, (_, i) => -1 + i / 100);
    const bands = grid.map(bounds);
    const values = grid.flatMap((x, i) => [...bands[i], truth(x), members[index](x)]);
    const bottom = Math.floor(Math.min(...values) * 2) / 2 - 0.1;
    const top = Math.ceil(Math.max(...values) * 2) / 2 + 0.1;
    const width = Math.max(280, Math.round(chart.getBoundingClientRect().width));
    const height = 300, ratio = window.devicePixelRatio || 1;
    chart.width = Math.round(width * ratio);
    chart.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const px = x => 48 + (x + 1) / 2 * (width - 64);
    const py = y => 16 + (top - y) / (top - bottom) * (height - 60);
    ctx.fillStyle = "#fbfdff";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "14px sans-serif";
    for (let y = Math.ceil(bottom); y <= top; y++) {
      ctx.fillStyle = "#d7e3ed";
      ctx.fillRect(px(-1), py(y), px(1) - px(-1), 1);
      ctx.fillStyle = "#34495c";
      ctx.fillText(y, 24, py(y) + 5);
    }
    ctx.fillText("y", 8, 20);
    for (const x of [-1, 0, 1]) ctx.fillText(x, px(x) - 4, height - 25);
    ctx.fillText("input x", width / 2 - 10, height - 5);
    ctx.beginPath();
    grid.forEach((x, i) => i ? ctx.lineTo(px(x), py(bands[i][1])) : ctx.moveTo(px(x), py(bands[i][1])));
    for (let i = grid.length - 1; i >= 0; i--) ctx.lineTo(px(grid[i]), py(bands[i][0]));
    ctx.closePath();
    ctx.fillStyle = "#bedbe1";
    ctx.fill();
    function line(f, color, dash) {
      ctx.beginPath();
      grid.forEach((x, i) => i ? ctx.lineTo(px(x), py(f(x))) : ctx.moveTo(px(x), py(f(x))));
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.setLineDash(dash);
      ctx.stroke();
    }
    line(members[index], "#a94a13", []);
    line(mean, "#006677", []);
    line(truth, "#263752", [6, 4]);
    xs.forEach((x, i) => {
      ctx.beginPath();
      ctx.arc(px(x), py(truth(x)), i === index ? 6 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = i === index ? "#a94a13" : "#263752";
      ctx.fill();
    });
    let inside = 0;
    for (let i = 0; i < 200; i++) {
      const x = -1 + (i + 0.5) / 100;
      const [low, high] = bounds(x);
      if (truth(x) >= low - 1e-12 && truth(x) <= high + 1e-12) inside++;
    }
    field("results").textContent = "Training RMSE " + Math.sqrt(ss / n).toFixed(3)
      + " · Grid coverage " + inside + "/200 · Selected point at x = " + xs[index].toFixed(2)
      + " has residual " + residual[index].toFixed(3) + ".";
  }
  panel.addEventListener("input", render);
  window.addEventListener("resize", render);
  render();
})();
