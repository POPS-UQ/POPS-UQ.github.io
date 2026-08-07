window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    ignoreHtmlClass: "\\b(?:ns|no)-mathjax\\b",
    processHtmlClass: "\\barithmatex\\b"
  }
};

document$.subscribe(() => {
  MathJax.typesetPromise();
});

