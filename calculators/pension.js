/* Pension and training fund (קרן השתלמות) calculation */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  window.SalaryCalc.Pension = {

    /**
     * Calculate pension contributions (פנסיה + פיצויים).
     * @param {number} gross           - Gross salary
     * @param {number} employeeRate    - Employee rate as decimal (e.g. 0.06)
     * @param {number} employerRate    - Employer rate as decimal (e.g. 0.075)
     * @param {number} severanceRate   - Severance rate as decimal (e.g. 0.0833)
     * @returns {{ employeeContribution, employerContribution, severancePay, totalEmployerBurden }}
     */
    calculate: function (gross, employeeRate, employerRate, severanceRate) {
      const empContrib  = Math.round(gross * employeeRate);
      const erContrib   = Math.round(gross * employerRate);
      const severance   = Math.round(gross * severanceRate);

      return {
        employeeContribution: empContrib,
        employerContribution: erContrib,
        severancePay:         severance,
        totalEmployerBurden:  erContrib + severance
      };
    },

    /**
     * Calculate training fund (קרן השתלמות).
     * @param {number} gross        - Gross salary
     * @param {number} employeeRate - Employee rate as decimal
     * @param {number} employerRate - Employer rate as decimal
     * @returns {{ employeeContribution, employerContribution }}
     */
    calculateTrainingFund: function (gross, employeeRate, employerRate) {
      return {
        employeeContribution: Math.round(gross * employeeRate),
        employerContribution: Math.round(gross * employerRate)
      };
    }
  };
})();
