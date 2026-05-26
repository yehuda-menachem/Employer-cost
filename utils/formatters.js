/* Israeli locale number and currency formatters */
(function () {
  'use strict';

  const ILS = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  const NUM = new Intl.NumberFormat('he-IL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  const PCT = new Intl.NumberFormat('he-IL', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  });

  window.SalaryCalc = window.SalaryCalc || {};
  window.SalaryCalc.Fmt = {

    currency: function (amount) {
      if (!isFinite(amount) || amount == null) return '₪0';
      return ILS.format(Math.round(amount));
    },

    number: function (num) {
      if (!isFinite(num) || num == null) return '0';
      return NUM.format(num);
    },

    percent: function (decimal) {
      if (!isFinite(decimal)) return '0%';
      return PCT.format(decimal);
    },

    percentFromValue: function (value) {
      return (value * 100).toFixed(1) + '%';
    },

    // Parse user-typed number (handles commas, spaces, etc.)
    parse: function (str) {
      if (typeof str === 'number') return isFinite(str) ? str : 0;
      const cleaned = String(str).replace(/[^\d.-]/g, '');
      const val = parseFloat(cleaned);
      return isFinite(val) ? val : 0;
    }
  };
})();
