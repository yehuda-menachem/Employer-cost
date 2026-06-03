/* Credit points calculation — based on ITA (רשות המסים) guidelines */
(function () {
  'use strict';

  window.SalaryCalc = window.SalaryCalc || {};

  window.SalaryCalc.Credits = {

    /**
     * Calculate total credit points and monthly tax saving.
     * @param {Object} data  - Employee data from step 1
     * @param {Object} cfg   - Credit points config loaded from JSON
     * @returns {{ total, breakdown, monthlyValue, monthlyTaxSaving }}
     */
    calculate: function (data, cfg) {
      const breakdown = [];
      let total = 0;

      function add(label, points) {
        const p = Math.round(points * 100) / 100;
        if (p === 0) return;
        breakdown.push({ label: label, points: p });
        total += p;
      }

      // Base resident points (gender-based) — only granted to Israeli residents
      if (data.isResident) {
        const base = data.gender === 'female' ? cfg.base.female : cfg.base.male;
        add(data.gender === 'female' ? 'בסיס תושב ישראל (אישה)' : 'בסיס תושב ישראל (גבר)', base);
      } else {
        // Non-residents lose almost all credit points. Only specific Israeli-source
        // income credits may apply (rare cases — handled via "additional points" field).
        breakdown.push({ label: 'לא תושב ישראל — אין נקודות בסיס', points: 0 });
      }

      // Single parent and child credits also require Israeli residency
      if (!data.isResident) {
        // Skip residency-dependent credits entirely
        const extra = parseFloat(data.additionalPoints) || 0;
        if (extra > 0) add('נקודות זיכוי נוספות (ידניות)', extra);

        total = Math.round(total * 100) / 100;
        return {
          total: total,
          breakdown: breakdown,
          monthlyValue: cfg.monthlyValue,
          monthlyTaxSaving: Math.round(total * cfg.monthlyValue)
        };
      }

      // Single parent (גרוש/ה, אלמן/ה)
      if (data.isSingleParent) {
        add('הורה יחיד', cfg.singleParent.points);
      }

      // Children — collect from age groups
      const children = data.children || [];
      children.forEach(function (child, i) {
        const n = i + 1;
        if (child.ageGroup === 'under1')   add('ילד ' + n + ' (מתחת לשנה)', cfg.children.under1);
        else if (child.ageGroup === 'age1to5')  add('ילד ' + n + ' (גיל 1–5)', cfg.children.age1to5);
        else if (child.ageGroup === 'age6to17') add('ילד ' + n + ' (גיל 6–17)', cfg.children.age6to17);
      });

      // New immigrant
      if (data.isNewImmigrant) {
        const pts = this._immigrantPoints(data.yearsInIsrael, cfg.newImmigrant);
        if (pts > 0) add('עולה חדש (שנה ' + Math.ceil(data.yearsInIsrael || 1) + ')', pts);
      }

      // Released soldier
      if (data.isReleasedSoldier) {
        const months = data.monthsSinceDischarge || 0;
        if (months <= cfg.releasedSoldier.maxMonths) {
          add('חייל משוחרר', cfg.releasedSoldier.points);
        }
      }

      // NOTE: Qualifying settlement (יישוב מזכה) is NOT a credit point.
      // It is a percentage discount on income tax under Section 11 of the
      // Income Tax Ordinance, handled separately by QualifyingSettlement.apply().

      // Manual additional points
      const extra = parseFloat(data.additionalPoints) || 0;
      if (extra > 0) add('נקודות זיכוי נוספות (ידניות)', extra);

      total = Math.round(total * 100) / 100;

      return {
        total: total,
        breakdown: breakdown,
        monthlyValue: cfg.monthlyValue,
        monthlyTaxSaving: Math.round(total * cfg.monthlyValue)
      };
    },

    _immigrantPoints: function (years, cfg) {
      const y = parseFloat(years) || 1;
      if (y <= 1) return cfg.year1;
      if (y <= 2) return cfg.year2;
      if (y <= 4) return cfg.year3;
      return 0;
    }
  };
})();
