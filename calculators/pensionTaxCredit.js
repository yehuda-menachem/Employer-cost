/* Section 45A income-tax CREDIT on employee pension/insurance contribution.
   35% credit on the lesser of:
     (a) the employee's pension contribution
     (b) 5% of recognized monthly income (capped at "חסכון מירבי" = ₪9,700)
   This is granted IN ADDITION TO the Section 47 deduction (which already
   reduces taxable income by up to 7% of pension contribution). */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  window.SalaryCalc.PensionTaxCredit = {

    /**
     * @param {number} gross                  - Monthly gross salary
     * @param {number} employeePensionAmount  - Employee's monthly pension contribution (₪)
     * @param {number} maxRecognizedIncome    - חסכון מירבי (₪9,700 by default)
     * @returns {{ creditBase, credit, qualifyingIncome }}
     */
    calculate: function (gross, employeePensionAmount, maxRecognizedIncome) {
      maxRecognizedIncome = maxRecognizedIncome || 9700;

      if (gross <= 0 || employeePensionAmount <= 0) {
        return { creditBase: 0, credit: 0, qualifyingIncome: 0 };
      }

      const qualifyingIncome     = Math.min(gross, maxRecognizedIncome);
      const fivePercentOfIncome  = qualifyingIncome * 0.05;
      const creditBase           = Math.min(employeePensionAmount, fivePercentOfIncome);
      const credit               = creditBase * 0.35;

      return {
        creditBase:       Math.round(creditBase),
        credit:           Math.round(credit),
        qualifyingIncome: Math.round(qualifyingIncome)
      };
    }
  };
})();
