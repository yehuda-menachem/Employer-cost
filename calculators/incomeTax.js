/* Income tax calculation — progressive brackets (מדרגות מס) */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  window.SalaryCalc.IncomeTax = {

    /**
     * Calculate monthly income tax after credit points.
     * @param {number} taxableIncome  - Monthly taxable income (gross minus deductible pension)
     * @param {number} creditPoints   - Total credit points
     * @param {number} pointValue     - Monthly value per credit point (₪)
     * @param {Array}  brackets       - Tax brackets from JSON
     * @returns {{ grossTax, creditDeduction, netTax, effectiveRate, breakdown }}
     */
    calculate: function (taxableIncome, creditPoints, pointValue, brackets) {
      if (taxableIncome <= 0) {
        return { grossTax: 0, creditDeduction: 0, netTax: 0, effectiveRate: 0, breakdown: [] };
      }

      let remaining = taxableIncome;
      let grossTax   = 0;
      let prevLimit  = 0;
      const breakdown = [];

      for (let i = 0; i < brackets.length; i++) {
        if (remaining <= 0) break;
        const bracket   = brackets[i];
        const upperLimit = bracket.upTo !== null ? bracket.upTo : Infinity;
        const span       = upperLimit - prevLimit;
        const chunk      = Math.min(remaining, span);

        if (chunk <= 0) {
          prevLimit = upperLimit;
          continue;
        }

        const taxInBracket = chunk * bracket.rate;
        grossTax += taxInBracket;

        breakdown.push({
          label:  bracket.label || ('מדרגה ' + (i + 1)),
          from:   prevLimit,
          to:     bracket.upTo,
          rate:   bracket.rate,
          amount: Math.round(chunk),
          tax:    Math.round(taxInBracket)
        });

        remaining -= chunk;
        prevLimit = upperLimit;
      }

      const creditDeduction = Math.min(creditPoints * pointValue, grossTax);
      const netTax = Math.max(0, grossTax - creditDeduction);

      return {
        grossTax:        Math.round(grossTax),
        creditDeduction: Math.round(creditDeduction),
        netTax:          Math.round(netTax),
        effectiveRate:   taxableIncome > 0 ? netTax / taxableIncome : 0,
        breakdown:       breakdown
      };
    }
  };
})();
