/* Qualifying settlement (יישוב מזכה) tax reduction — Section 11 of the Israeli
   Income Tax Ordinance.
   The reduction is a PERCENTAGE of taxable income (capped at a monthly ceiling),
   applied as a discount on income tax AFTER credit points. */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  window.SalaryCalc.QualifyingSettlement = {

    /**
     * Apply the qualifying-settlement reduction.
     * @param {number} taxableIncome - Monthly taxable income (after pension deduction)
     * @param {number} taxAfterCredits - Income tax after credit points
     * @param {Object} settlement - { percent, monthlyCeiling } from JSON
     * @returns {{ discount, finalTax }}
     */
    apply: function (taxableIncome, taxAfterCredits, settlement) {
      // No settlement / no benefit
      if (!settlement || !settlement.percent || settlement.percent === 0) {
        return { discount: 0, finalTax: taxAfterCredits };
      }

      // Reduction = percent × min(taxableIncome, ceiling), capped at the tax itself
      const cappedIncome = Math.min(taxableIncome, settlement.monthlyCeiling);
      const rawDiscount  = cappedIncome * (settlement.percent / 100);
      const discount     = Math.min(rawDiscount, taxAfterCredits);

      return {
        discount: Math.round(discount),
        finalTax: Math.max(0, Math.round(taxAfterCredits - discount))
      };
    }
  };
})();
