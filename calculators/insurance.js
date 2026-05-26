/* National insurance & health tax calculation */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  // Generic two-tier contribution calculator (floor + ceiling + two rates)
  function tiered(income, cfg) {
    if (income <= 0) return { total: 0, lower: 0, upper: 0, effectiveRate: 0 };

    const effective = Math.min(income, cfg.ceiling);
    let lower = 0;
    let upper = 0;

    if (effective <= cfg.lowerThreshold) {
      lower = effective * cfg.lowerRate;
    } else {
      lower = cfg.lowerThreshold * cfg.lowerRate;
      upper = (effective - cfg.lowerThreshold) * cfg.upperRate;
    }

    const total = lower + upper;
    return {
      total:         Math.round(total),
      lower:         Math.round(lower),
      upper:         Math.round(upper),
      effectiveRate: income > 0 ? total / income : 0
    };
  }

  window.SalaryCalc.Insurance = {

    /** Employee national insurance (ביטוח לאומי עובד) */
    calculateNI: function (gross, niConfig) {
      return tiered(gross, niConfig.employee);
    },

    /** Employee health tax (מס בריאות עובד) */
    calculateHealth: function (gross, healthConfig) {
      return tiered(gross, healthConfig.employee);
    },

    /** Employer national insurance (ביטוח לאומי מעסיק) */
    calculateEmployerNI: function (gross, niConfig) {
      return tiered(gross, niConfig.employer);
    }
  };
})();
