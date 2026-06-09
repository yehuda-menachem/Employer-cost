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
      // Determine parent role: female = mother (receives child benefit), male = father
      const parentRole = data.gender === 'female' ? 'mother' : 'father';
      const children = data.children || [];
      children.forEach(function (child, i) {
        const n = i + 1;
        var points = this._getChildPoints(child.ageGroup, parentRole, cfg.children);
        var label = this._getChildLabel(child.ageGroup, n);
        add(label, points);
      }.bind(this));

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

    /**
     * Get child credit points for a specific age group and parent role.
     * Supports both new format (mother/father objects) and legacy format (flat numbers).
     */
    _getChildPoints: function (ageGroup, parentRole, childrenCfg) {
      var entry = childrenCfg[ageGroup];
      if (!entry) return 0;
      // New format: { mother: X, father: Y }
      if (typeof entry === 'object' && entry !== null) {
        return entry[parentRole] || 0;
      }
      // Legacy flat format: just a number
      return entry;
    },

    /**
     * Get display label for child age group.
     */
    _getChildLabel: function (ageGroup, childNumber) {
      var labels = {
        'age0':      'שנת לידה',
        'age1':      'גיל 1',
        'age2':      'גיל 2',
        'age3':      'גיל 3',
        'age4to5':   'גיל 4–5',
        'age6to12':  'גיל 6–12',
        'age13to17': 'גיל 13–17',
        'age18':     'גיל 18',
        // Legacy labels
        'under1':    'מתחת לשנה',
        'age1to5':   'גיל 1–5',
        'age6to17':  'גיל 6–17'
      };
      return 'ילד ' + childNumber + ' (' + (labels[ageGroup] || ageGroup) + ')';
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
