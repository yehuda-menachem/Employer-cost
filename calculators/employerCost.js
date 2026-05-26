/* Total employer cost calculation (עלות מעביד) */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  window.SalaryCalc.EmployerCost = {

    /**
     * Aggregate all employer-side costs.
     * @param {number} gross      - Gross salary
     * @param {Object} niResult   - From Insurance.calculateEmployerNI()
     * @param {Object} pension    - From Pension.calculate()
     * @param {Object} training   - From Pension.calculateTrainingFund()
     * @returns {{ grossSalary, nationalInsurance, pensionContrib, severancePay, trainingFund, totalCost }}
     */
    calculate: function (gross, niResult, pension, training) {
      const totalCost = gross
        + niResult.total
        + pension.employerContribution
        + pension.severancePay
        + training.employerContribution;

      return {
        grossSalary:        gross,
        nationalInsurance:  niResult.total,
        pensionContrib:     pension.employerContribution,
        severancePay:       pension.severancePay,
        trainingFund:       training.employerContribution,
        totalCost:          Math.round(totalCost)
      };
    }
  };
})();
