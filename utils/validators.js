/* Input validation utilities */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};
  window.SalaryCalc.Validators = {

    salary: function (value, fieldName) {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) return (fieldName || 'שכר') + ' חייב להיות מספר חיובי';
      if (num > 2000000) return (fieldName || 'שכר') + ' גבוה מדי';
      return null;
    },

    percentage: function (value, fieldName, min, max) {
      const num = parseFloat(value);
      const lo = min != null ? min : 0;
      const hi = max != null ? max : 100;
      if (isNaN(num) || num < lo || num > hi) {
        return (fieldName || 'ערך') + ' חייב להיות בין ' + lo + ' ל-' + hi;
      }
      return null;
    },

    workPercentage: function (value) {
      const num = parseFloat(value);
      if (isNaN(num) || num < 1 || num > 100) return 'אחוז משרה חייב להיות בין 1 ל-100';
      return null;
    },

    positiveInt: function (value, fieldName) {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) return (fieldName || 'ערך') + ' חייב להיות מספר שלם חיובי';
      return null;
    },

    // Returns sanitized safe number — never NaN or Infinity
    safe: function (value, fallback) {
      const num = Number(value);
      return isFinite(num) ? num : (fallback != null ? fallback : 0);
    }
  };
})();
