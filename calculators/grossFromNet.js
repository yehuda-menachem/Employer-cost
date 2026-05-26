/* Iterative gross-from-net calculation using binary search */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  window.SalaryCalc.GrossFromNet = {

    /**
     * Find the gross salary that results in a specific net salary.
     * Uses binary search (convergence guaranteed for monotone net(gross)).
     *
     * @param {number}   targetNet      - Desired net salary
     * @param {Function} computeNet     - Function(gross) => net
     * @param {number}   tolerance      - Acceptable ₪ difference (default 1)
     * @param {number}   maxIterations  - Safety limit (default 120)
     * @returns {{ gross, net, iterations, converged }}
     */
    calculate: function (targetNet, computeNet, tolerance, maxIterations) {
      tolerance     = tolerance     != null ? tolerance     : 1;
      maxIterations = maxIterations != null ? maxIterations : 120;

      if (targetNet <= 0) return { gross: 0, net: 0, iterations: 0, converged: true };

      // Establish upper bound by doubling until net exceeds target
      let low  = targetNet * 0.8;
      let high = targetNet * 2;
      let safety = 0;

      while (computeNet(high) < targetNet && safety < 30) {
        high *= 1.5;
        safety++;
      }

      let gross = 0;
      let net   = 0;

      for (let i = 0; i < maxIterations; i++) {
        gross = (low + high) / 2;
        net   = computeNet(gross);

        if (Math.abs(net - targetNet) <= tolerance) {
          return {
            gross:      Math.round(gross),
            net:        Math.round(net),
            iterations: i,
            converged:  true
          };
        }

        if (net < targetNet) {
          low = gross;
        } else {
          high = gross;
        }
      }

      // Reached max iterations — return best approximation
      return {
        gross:      Math.round(gross),
        net:        Math.round(net),
        iterations: maxIterations,
        converged:  false
      };
    }
  };
})();
