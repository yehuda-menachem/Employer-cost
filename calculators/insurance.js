/* National insurance & health tax calculation */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  // Generic two-tier contribution calculator (lower threshold + ceiling + two rates).
  // NOTE: The "minimum NI base" (₪6,247.67) is NOT auto-applied — it only applies to
  // full-month, full-time employees earning below minimum wage, and the actual NI
  // is paid on the higher of (actual gross, minimum base). For partial payments,
  // part-time, or one-time payments, NI is calculated on the actual gross — which
  // is the common case and is what most payroll software does by default.
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
