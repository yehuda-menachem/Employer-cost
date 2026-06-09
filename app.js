/* ============================================================
   Israeli Salary Calculator — Main Application Controller
   v2.0 — Multi-year (2025/2026), pension toggle, fixed NI threshold
   ============================================================ */
(function () {
  'use strict';

  // ── Embedded fallback (identical to JSON files, used if fetch fails) ────
  const FALLBACK = {
    taxBrackets: {
      '2025': {
        brackets: [
          { upTo: 7010,  rate: 0.10, label: 'מדרגה 1' },
          { upTo: 10060, rate: 0.14, label: 'מדרגה 2' },
          { upTo: 16150, rate: 0.20, label: 'מדרגה 3' },
          { upTo: 22440, rate: 0.31, label: 'מדרגה 4' },
          { upTo: 46690, rate: 0.35, label: 'מדרגה 5' },
          { upTo: 60130, rate: 0.47, label: 'מדרגה 6' },
          { upTo: null,  rate: 0.50, label: 'מדרגה 7' }
        ]
      },
      '2026': {
        brackets: [
          { upTo: 7010,  rate: 0.10, label: 'מדרגה 1' },
          { upTo: 10060, rate: 0.14, label: 'מדרגה 2' },
          { upTo: 19000, rate: 0.20, label: 'מדרגה 3' },
          { upTo: 25100, rate: 0.31, label: 'מדרגה 4' },
          { upTo: 46690, rate: 0.35, label: 'מדרגה 5' },
          { upTo: 60130, rate: 0.47, label: 'מדרגה 6' },
          { upTo: null,  rate: 0.50, label: 'מדרגה 7' }
        ]
      }
    },
    nationalInsurance: {
      '2025': {
        employee: { minimumBase: 6247.67, lowerThreshold: 7522, ceiling: 50695, lowerRate: 0.0104, upperRate: 0.07  },
        employer: { minimumBase: 6247.67, lowerThreshold: 7522, ceiling: 50695, lowerRate: 0.0451, upperRate: 0.076 }
      },
      '2026': {
        employee: { minimumBase: 6400,    lowerThreshold: 7703, ceiling: 51910, lowerRate: 0.0104, upperRate: 0.07  },
        employer: { minimumBase: 6400,    lowerThreshold: 7703, ceiling: 51910, lowerRate: 0.0451, upperRate: 0.076 }
      }
    },
    healthTax: {
      '2025': { employee: { minimumBase: 6247.67, lowerThreshold: 7522, ceiling: 50695, lowerRate: 0.0323, upperRate: 0.0517 } },
      '2026': { employee: { minimumBase: 6400,    lowerThreshold: 7703, ceiling: 51910, lowerRate: 0.0323, upperRate: 0.0517 } }
    },
    creditPoints: {
      '2025': {
        monthlyValue: 242, annualValue: 2904,
        base: { male: 2.25, female: 2.75 },
        singleParent: { points: 0.5 },
        children: {
          age0:      { mother: 2.5,  father: 2.5 },
          age1:      { mother: 4.5,  father: 4.5 },
          age2:      { mother: 4.5,  father: 4.5 },
          age3:      { mother: 3.5,  father: 3.5 },
          age4to5:   { mother: 2.5,  father: 2.5 },
          age6to12:  { mother: 2.0,  father: 1.0 },
          age13to17: { mother: 2.0,  father: 1.0 },
          age18:     { mother: 1.0,  father: 0.0 }
        },
        newImmigrant: { year1: 3.0, year2: 2.0, year3: 1.0, year4: 1.0 },
        releasedSoldier: { points: 2.0, maxMonths: 36 },
        qualifyingSettlement: { points: 0.5 },
        reserveDuty: {
          brackets: [
            { minDays: 30, maxDays: 39, points: 0.5 },
            { minDays: 40, maxDays: 49, points: 0.75 },
            { minDays: 50, maxDays: 54, points: 1.0 },
            { minDays: 55, maxDays: 59, points: 1.25 },
            { minDays: 60, maxDays: 64, points: 1.5 },
            { minDays: 65, maxDays: 69, points: 1.75 },
            { minDays: 70, maxDays: 74, points: 2.0 },
            { minDays: 75, maxDays: 79, points: 2.25 },
            { minDays: 80, maxDays: 84, points: 2.5 },
            { minDays: 85, maxDays: 89, points: 2.75 },
            { minDays: 90, maxDays: 94, points: 3.0 },
            { minDays: 95, maxDays: 99, points: 3.25 },
            { minDays: 100, maxDays: 104, points: 3.5 },
            { minDays: 105, maxDays: 109, points: 3.75 },
            { minDays: 110, maxDays: 365, points: 4.0 }
          ]
        }
      },
      '2026': {
        monthlyValue: 242, annualValue: 2904,
        base: { male: 2.25, female: 2.75 },
        singleParent: { points: 0.5 },
        children: {
          age0:      { mother: 2.5,  father: 2.5 },
          age1:      { mother: 4.5,  father: 4.5 },
          age2:      { mother: 4.5,  father: 4.5 },
          age3:      { mother: 3.5,  father: 3.5 },
          age4to5:   { mother: 2.5,  father: 2.5 },
          age6to12:  { mother: 2.0,  father: 1.0 },
          age13to17: { mother: 2.0,  father: 1.0 },
          age18:     { mother: 1.0,  father: 0.0 }
        },
        newImmigrant: { year1: 3.0, year2: 2.0, year3: 1.0, year4: 1.0 },
        releasedSoldier: { points: 2.0, maxMonths: 36 },
        qualifyingSettlement: { points: 0.5 },
        reserveDuty: {
          brackets: [
            { minDays: 30, maxDays: 39, points: 0.5 },
            { minDays: 40, maxDays: 49, points: 0.75 },
            { minDays: 50, maxDays: 54, points: 1.0 },
            { minDays: 55, maxDays: 59, points: 1.25 },
            { minDays: 60, maxDays: 64, points: 1.5 },
            { minDays: 65, maxDays: 69, points: 1.75 },
            { minDays: 70, maxDays: 74, points: 2.0 },
            { minDays: 75, maxDays: 79, points: 2.25 },
            { minDays: 80, maxDays: 84, points: 2.5 },
            { minDays: 85, maxDays: 89, points: 2.75 },
            { minDays: 90, maxDays: 94, points: 3.0 },
            { minDays: 95, maxDays: 99, points: 3.25 },
            { minDays: 100, maxDays: 104, points: 3.5 },
            { minDays: 105, maxDays: 109, points: 3.75 },
            { minDays: 110, maxDays: 365, points: 4.0 }
          ]
        }
      }
    },
    qualifyingSettlements: {
      '2025': [
        { id: 0,  label: 'ללא הנחת יישוב',                          percent: 0,  monthlyCeiling: 0 },
        { id: 1,  label: '5% עד ₪14,860 בחודש',                     percent: 5,  monthlyCeiling: 14860 },
        { id: 2,  label: '7% עד ₪12,220 בחודש',                     percent: 7,  monthlyCeiling: 12220 },
        { id: 5,  label: '10% עד ₪15,000 בחודש',                    percent: 10, monthlyCeiling: 15000 },
        { id: 29, label: '12% עד ₪15,500 בחודש',                    percent: 12, monthlyCeiling: 15500 },
        { id: 6,  label: '12% עד ₪15,550 בחודש',                    percent: 12, monthlyCeiling: 15550 },
        { id: 8,  label: '12% עד ₪17,770 בחודש',                    percent: 12, monthlyCeiling: 17770 },
        { id: 10, label: '12% עד ₪18,880 בחודש',                    percent: 12, monthlyCeiling: 18880 },
        { id: 9,  label: '14% עד ₪18,330 בחודש',                    percent: 14, monthlyCeiling: 18330 },
        { id: 13, label: '14% עד ₪21,660 בחודש',                    percent: 14, monthlyCeiling: 21660 },
        { id: 11, label: '16% עד ₪18,880 בחודש',                    percent: 16, monthlyCeiling: 18880 },
        { id: 12, label: '18% עד ₪20,450 בחודש',                    percent: 18, monthlyCeiling: 20450 },
        { id: 14, label: '18% עד ₪21,660 בחודש',                    percent: 18, monthlyCeiling: 21660 },
        { id: 15, label: '20% עד ₪21,660 בחודש',                    percent: 20, monthlyCeiling: 21660 },
        { id: 16, label: '20% עד ₪22,320 בחודש',                    percent: 20, monthlyCeiling: 22320 },
        { id: 88, label: 'אילת — 10% עד ₪22,380 (אזור סחר חופשי)',   percent: 10, monthlyCeiling: 22380 },
        { id: 99, label: 'מיוחד חברי קיבוץ מלכיה — 7% עד ₪16,500',   percent: 7,  monthlyCeiling: 16500 }
      ],
      '2026': [
        { id: 0,  label: 'ללא הנחת יישוב',                          percent: 0,  monthlyCeiling: 0 },
        { id: 1,  label: '5% עד ₪14,860 בחודש',                     percent: 5,  monthlyCeiling: 14860 },
        { id: 2,  label: '7% עד ₪12,220 בחודש',                     percent: 7,  monthlyCeiling: 12220 },
        { id: 5,  label: '10% עד ₪15,000 בחודש',                    percent: 10, monthlyCeiling: 15000 },
        { id: 29, label: '12% עד ₪15,500 בחודש',                    percent: 12, monthlyCeiling: 15500 },
        { id: 6,  label: '12% עד ₪15,550 בחודש',                    percent: 12, monthlyCeiling: 15550 },
        { id: 8,  label: '12% עד ₪17,770 בחודש',                    percent: 12, monthlyCeiling: 17770 },
        { id: 10, label: '12% עד ₪18,880 בחודש',                    percent: 12, monthlyCeiling: 18880 },
        { id: 17, label: '14% עד ₪15,000 בחודש',                    percent: 14, monthlyCeiling: 15000 },
        { id: 18, label: '14% עד ₪17,770 בחודש',                    percent: 14, monthlyCeiling: 17770 },
        { id: 9,  label: '14% עד ₪18,330 בחודש',                    percent: 14, monthlyCeiling: 18330 },
        { id: 13, label: '14% עד ₪21,660 בחודש',                    percent: 14, monthlyCeiling: 21660 },
        { id: 11, label: '16% עד ₪18,880 בחודש',                    percent: 16, monthlyCeiling: 18880 },
        { id: 12, label: '18% עד ₪20,450 בחודש',                    percent: 18, monthlyCeiling: 20450 },
        { id: 14, label: '18% עד ₪21,660 בחודש',                    percent: 18, monthlyCeiling: 21660 },
        { id: 15, label: '20% עד ₪21,660 בחודש',                    percent: 20, monthlyCeiling: 21660 },
        { id: 16, label: '20% עד ₪22,320 בחודש',                    percent: 20, monthlyCeiling: 22320 },
        { id: 88, label: 'אילת — 10% עד ₪22,380 (אזור סחר חופשי)',   percent: 10, monthlyCeiling: 22380 }
      ]
    },
    taxParameters: {
      '2025': {
        averageWage:          12536,
        maxRecognizedSavings: 9700,
        trainingFundCeiling:  15712,
        pensionCeiling:       33290,
        severanceCeiling:     13750
      },
      '2026': {
        averageWage:          13769,
        maxRecognizedSavings: 9700,
        trainingFundCeiling:  15712,
        pensionCeiling:       34423,
        severanceCeiling:     45600
      }
    }
  };

  // ── Application state ────────────────────────────────────────
  const state = {
    allTaxData:    null,         // all years loaded from JSON
    taxData:       null,         // active year slice
    selectedYear:  '2026',       // default year
    calcMode:      'grossToNet',
    currentStep:   1,
    results:       null,
    pensionEnabled: true,
    savedPensionValues: null,    // stored when pension is toggled off
    usingFallback: false
  };

  let debounceTimer = null;

  // ── DOM helpers ──────────────────────────────────────────────
  function $(id)  { return document.getElementById(id); }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  function setHTML(id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
  }

  // ── Year extraction helper ───────────────────────────────────
  function extractYear(allData, year) {
    const y = year in allData.taxBrackets ? year : '2025';
    const qs = allData.qualifyingSettlements || FALLBACK.qualifyingSettlements;
    const tp = allData.taxParameters         || FALLBACK.taxParameters;
    return {
      taxBrackets:           allData.taxBrackets[y],
      nationalInsurance:     allData.nationalInsurance[y],
      healthTax:             allData.healthTax[y],
      creditPoints:          allData.creditPoints[y],
      qualifyingSettlements: qs[y] || qs['2025'],
      taxParameters:         tp[y] || tp['2025']
    };
  }

  // ── Data loading ─────────────────────────────────────────────
  async function loadTaxData() {
    try {
      const [tb, ni, ht, cp, qs, tp] = await Promise.all([
        fetch('data/tax-brackets.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        fetch('data/national-insurance.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        fetch('data/health-tax.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        fetch('data/credit-points.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        fetch('data/qualifying-settlements.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('data/tax-parameters.json').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);
      state.allTaxData = {
        taxBrackets: tb,
        nationalInsurance: ni,
        healthTax: ht,
        creditPoints: cp,
        qualifyingSettlements: qs || FALLBACK.qualifyingSettlements,
        taxParameters:         tp || FALLBACK.taxParameters
      };
    } catch (e) {
      state.usingFallback = true;
      state.allTaxData = FALLBACK;
      console.info('Using embedded fallback tax data (run via HTTP server to load external JSON files).');
    }
    state.taxData = extractYear(state.allTaxData, state.selectedYear);
  }

  // ── Year switching ────────────────────────────────────────────
  function switchYear(year) {
    state.selectedYear = year;
    state.taxData = extractYear(state.allTaxData || FALLBACK, year);

    // Update year buttons
    document.querySelectorAll('.yr-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.year === year);
    });

    // Update header badge text
    const badge = document.querySelector('.badge-year');
    if (badge) badge.textContent = 'נתוני ' + year;

    populateSettlementDropdown();
    saveToStorage();
    updateCreditPreview();
    triggerLiveUpdate();
  }

  // ── Populate qualifying-settlement dropdown ──────────────────
  function populateSettlementDropdown() {
    const sel = $('settlementSelect');
    if (!sel || !state.taxData || !state.taxData.qualifyingSettlements) return;

    const previous = sel.value;
    sel.innerHTML = '';
    state.taxData.qualifyingSettlements.forEach(function (s) {
      const opt = document.createElement('option');
      opt.value = String(s.id);
      opt.textContent = s.label;
      sel.appendChild(opt);
    });

    // Restore prior selection if it still exists in the new year
    if (previous && [...sel.options].some(o => o.value === previous)) {
      sel.value = previous;
    }
    updateSettlementInfo();
  }

  // Show inline info text under the dropdown
  function updateSettlementInfo() {
    const sel    = $('settlementSelect');
    const info   = $('settlementInfo');
    if (!sel || !info || !state.taxData) return;
    const id = parseInt(sel.value, 10) || 0;
    const s  = (state.taxData.qualifyingSettlements || []).find(x => x.id === id);
    if (s && s.percent > 0) {
      info.style.display = 'block';
      info.textContent = 'הנחת ' + s.percent + '% מההכנסה החייבת (עד ₪'
        + SalaryCalc.Fmt.number(s.monthlyCeiling) + ' בחודש) — תנוכה מהמס לאחר נקודות הזיכוי.';
    } else {
      info.style.display = 'none';
    }
  }

  // ── Read employee data from step 1 ──────────────────────────
  function readEmployeeData() {
    const isResident   = document.querySelector('input[name="isResident"]:checked')?.value === 'true';
    const gender       = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    const marital      = $('maritalStatus')?.value || 'single';
    const isSingleParent = (marital === 'divorced' || marital === 'widowed');
    const childCount   = parseInt($('childCount')?.value) || 0;

    const children = [];
    for (let i = 0; i < childCount; i++) {
      const sel = $('child-age-' + i);
      if (sel) children.push({ ageGroup: sel.value });
    }

    return {
      isResident,
      gender,
      maritalStatus:        marital,
      isSingleParent,
      children,
      isReleasedSoldier:    document.querySelector('input[name="isSoldier"]:checked')?.value === 'true',
      monthsSinceDischarge: parseFloat($('soldierMonths')?.value) || 0,
      isNewImmigrant:       document.querySelector('input[name="isImmigrant"]:checked')?.value === 'true',
      yearsInIsrael:        parseFloat($('yearsInIsrael')?.value) || 1,
      isReserve:            document.querySelector('input[name="isReserve"]:checked')?.value === 'true',
      reserveDays:          parseFloat($('reserveDays')?.value) || 0,
      settlementId:         parseInt($('settlementSelect')?.value, 10) || 0,
      workPercentage:       parseFloat($('workPct')?.value) || 100,
      additionalPoints:     parseFloat($('extraPoints')?.value) || 0
    };
  }

  // Find settlement object from the loaded data by id
  function getSelectedSettlement(empData, taxData) {
    if (!taxData || !taxData.qualifyingSettlements) return null;
    if (!empData.settlementId) return null;
    return taxData.qualifyingSettlements.find(function (s) {
      return s.id === empData.settlementId;
    }) || null;
  }

  // ── Read salary data from step 2 ────────────────────────────
  function readSalaryData() {
    const v = SalaryCalc.Validators.safe;
    return {
      baseSalary:     v($('baseSalary')?.value, 0),
      overtime:       v($('overtime')?.value,   0),
      bonus:          v($('bonus')?.value,       0),
      companyCar:     v($('companyCar')?.value,  0),
      benefits:       v($('benefits')?.value,    0),
      pensionEmpRate: v($('pensionEmp')?.value,  6)    / 100,
      pensionErRate:  v($('pensionEr')?.value,   7.5)  / 100,
      severanceRate:  v($('severance')?.value,   8.33) / 100,
      trainEmpRate:   v($('trainEmp')?.value,    2.5)  / 100,
      trainErRate:    v($('trainEr')?.value,     7.5)  / 100
    };
  }

  // Calculate training-fund employer contribution excess above tax-exempt ceiling.
  // For salary above ₪15,712 (monthly), employer contributions above that base
  // are taxable income for the employee.
  function trainingFundTaxableExcess(gross, employerTrainRate, taxParams) {
    const ceiling = (taxParams && taxParams.trainingFundCeiling) || 15712;
    if (gross <= ceiling) return 0;
    return Math.round((gross - ceiling) * employerTrainRate);
  }

  // ── Core: compute net from gross ─────────────────────────────
  function computeNet(gross, credits, salaryData, taxData, settlement) {
    if (gross <= 0) return 0;

    // Section 47 — DEDUCTION from taxable income (up to 7% of gross)
    const deductibleRate  = Math.min(salaryData.pensionEmpRate, 0.07);
    const pensionDeduct   = gross * deductibleRate;

    // Training-fund excess (employer contribution above ceiling becomes taxable income)
    const trainExcess     = trainingFundTaxableExcess(gross, salaryData.trainErRate, taxData.taxParameters);

    const taxableIncome   = Math.max(0, gross - pensionDeduct + trainExcess);

    // Tax brackets + credit-point deduction
    const taxRes    = SalaryCalc.IncomeTax.calculate(
      taxableIncome, credits.total, taxData.creditPoints.monthlyValue, taxData.taxBrackets.brackets
    );

    // Section 45A — 35% CREDIT on employee pension contribution (up to 5% of recognized income)
    const pensionAmt = gross * salaryData.pensionEmpRate;
    const maxRec     = (taxData.taxParameters && taxData.taxParameters.maxRecognizedSavings) || 9700;
    const sec45a     = SalaryCalc.PensionTaxCredit.calculate(gross, pensionAmt, maxRec);
    const afterSec45a = Math.max(0, taxRes.netTax - sec45a.credit);

    // Section 11 — qualifying settlement discount
    const settle    = SalaryCalc.QualifyingSettlement.apply(taxableIncome, afterSec45a, settlement);
    const finalTax  = settle.finalTax;

    const niRes     = SalaryCalc.Insurance.calculateNI(gross, taxData.nationalInsurance);
    const healthRes = SalaryCalc.Insurance.calculateHealth(gross, taxData.healthTax);

    const pensionEmp = Math.round(gross * salaryData.pensionEmpRate);
    const trainEmp   = Math.round(gross * salaryData.trainEmpRate);

    return Math.round(gross - finalTax - niRes.total - healthRes.total - pensionEmp - trainEmp);
  }

  // ── Full calculation engine ──────────────────────────────────
  function runCalculation() {
    const taxData  = state.taxData;
    const empData  = readEmployeeData();
    const salData  = readSalaryData();

    const credits   = SalaryCalc.Credits.calculate(empData, taxData.creditPoints);
    const settlement = getSelectedSettlement(empData, taxData);

    let gross, convergenceInfo = null;

    if (state.calcMode === 'grossToNet') {
      gross = salData.baseSalary + salData.overtime + salData.bonus + salData.companyCar + salData.benefits;
    } else {
      const targetNet = salData.baseSalary;
      const result = SalaryCalc.GrossFromNet.calculate(
        targetNet,
        function (g) { return computeNet(g, credits, salData, taxData, settlement); }
      );
      gross = result.gross;
      convergenceInfo = result;
    }

    if (gross <= 0) return null;

    const deductibleRate = Math.min(salData.pensionEmpRate, 0.07);
    const pensionDeduct  = Math.round(gross * deductibleRate);

    // Training-fund excess (employer contribution above ceiling = taxable income)
    const trainExcess    = trainingFundTaxableExcess(gross, salData.trainErRate, taxData.taxParameters);

    const taxableIncome  = Math.max(0, gross - pensionDeduct + trainExcess);

    const taxRes    = SalaryCalc.IncomeTax.calculate(
      taxableIncome, credits.total, taxData.creditPoints.monthlyValue, taxData.taxBrackets.brackets
    );

    // Section 45A — pension tax credit (35% on up to 5% of recognized income)
    const pensionAmt   = Math.round(gross * salData.pensionEmpRate);
    const maxRec       = (taxData.taxParameters && taxData.taxParameters.maxRecognizedSavings) || 9700;
    const sec45aRes    = SalaryCalc.PensionTaxCredit.calculate(gross, pensionAmt, maxRec);
    const afterSec45a  = Math.max(0, taxRes.netTax - sec45aRes.credit);

    // Section 11 — qualifying settlement discount
    const settleRes = SalaryCalc.QualifyingSettlement.apply(taxableIncome, afterSec45a, settlement);
    const finalTax  = settleRes.finalTax;

    const niRes     = SalaryCalc.Insurance.calculateNI(gross, taxData.nationalInsurance);
    const healthRes = SalaryCalc.Insurance.calculateHealth(gross, taxData.healthTax);
    const empNIRes  = SalaryCalc.Insurance.calculateEmployerNI(gross, taxData.nationalInsurance);

    const pensionData = SalaryCalc.Pension.calculate(gross, salData.pensionEmpRate, salData.pensionErRate, salData.severanceRate);
    const trainData   = SalaryCalc.Pension.calculateTrainingFund(gross, salData.trainEmpRate, salData.trainErRate);

    const totalDeductions = finalTax + niRes.total + healthRes.total
      + pensionData.employeeContribution + trainData.employeeContribution;
    const netPay = Math.max(0, gross - totalDeductions);

    const employerCost = SalaryCalc.EmployerCost.calculate(gross, empNIRes, pensionData, trainData);

    return {
      gross, netPay, totalDeductions,
      taxRes, niRes, healthRes, empNIRes,
      pensionData, trainData, employerCost,
      credits, convergenceInfo,
      pensionDeduct, taxableIncome,
      trainingFundExcess: trainExcess,
      settlement, settlementDiscount: settleRes.discount,
      pensionCredit: sec45aRes.credit, pensionCreditBase: sec45aRes.creditBase,
      finalIncomeTax: finalTax,
      year: state.selectedYear
    };
  }

  // ── Credit points preview (step 1) ──────────────────────────
  function updateCreditPreview() {
    if (!state.taxData) return;
    const empData = readEmployeeData();
    const credits = SalaryCalc.Credits.calculate(empData, state.taxData.creditPoints);
    const fmt     = SalaryCalc.Fmt;

    setText('cpTotal', fmt.number(credits.total));
    setText('cpSaving', 'חיסכון: ' + fmt.currency(credits.monthlyTaxSaving) + '/חודש');

    const listEl = $('cpBreakdown');
    if (!listEl) return;
    let html = '';
    credits.breakdown.forEach(function (item) {
      html += '<div class="credit-item">'
            + '<span>' + escapeHtml(item.label) + '</span>'
            + '<span class="credit-item-pts">+' + item.points + '</span>'
            + '</div>';
    });
    listEl.innerHTML = html;
  }

  // ── Live preview (step 2) ────────────────────────────────────
  function updateLivePreview() {
    if (!state.taxData) return;
    const res = runCalculation();
    if (!res) { $('livePreview').style.display = 'none'; return; }

    const fmt = SalaryCalc.Fmt;
    $('livePreview').style.display = 'flex';
    setText('lp-gross',    fmt.currency(res.gross));
    setText('lp-tax',      fmt.currency(res.finalIncomeTax));
    setText('lp-deduct',   fmt.currency(res.totalDeductions));
    setText('lp-net',      fmt.currency(res.netPay));
    setText('lp-employer', fmt.currency(res.employerCost.totalCost));
  }

  // ── Breakdown row builders ────────────────────────────────────
  function bdRow(label, value, cls, prefix) {
    return '<div class="bd-row">'
         + '<span class="bd-label">' + escapeHtml(label) + '</span>'
         + '<span class="bd-val ' + (cls || 'clr-neutral') + '">' + (prefix || '') + SalaryCalc.Fmt.currency(value) + '</span>'
         + '</div>';
  }
  function bdRowTotal(label, value, cls, prefix) {
    return '<div class="bd-row total">'
         + '<span class="bd-label">' + escapeHtml(label) + '</span>'
         + '<span class="bd-val ' + (cls || 'clr-neutral') + '">' + (prefix || '') + SalaryCalc.Fmt.currency(value) + '</span>'
         + '</div>';
  }
  function bdRowNet(label, value, cls, boxClass) {
    return '<div class="bd-row ' + (boxClass || 'net-row') + '">'
         + '<span class="bd-label" style="font-weight:700">' + escapeHtml(label) + '</span>'
         + '<span class="bd-val ' + (cls || 'clr-positive') + '" style="font-size:1.1rem">' + SalaryCalc.Fmt.currency(value) + '</span>'
         + '</div>';
  }

  // ── Render full results (step 3) ─────────────────────────────
  function renderResults(res) {
    const fmt = SalaryCalc.Fmt;
    state.results = res;

    // Metric cards
    setText('r-gross',    fmt.currency(res.gross));
    setText('r-net',      fmt.currency(res.netPay));
    setText('r-employer', fmt.currency(res.employerCost.totalCost));
    setText('r-tax',      fmt.currency(res.finalIncomeTax));

    const netPct = res.gross > 0 ? ((res.netPay / res.gross) * 100).toFixed(1) : 0;
    const taxPct = res.gross > 0 ? ((res.finalIncomeTax / res.gross) * 100).toFixed(1) : 0;
    const erMul  = res.gross > 0 ? (res.employerCost.totalCost / res.gross).toFixed(2) : 1;

    setText('r-gross-sub',    'שנת מס ' + res.year);
    setText('r-net-sub',      netPct + '% מהברוטו');
    setText('r-employer-sub', '×' + erMul + ' מהברוטו');
    setText('r-tax-sub',      'שיעור אפקטיבי: ' + taxPct + '%');

    // Employee breakdown
    let empHtml = ''
      + bdRow('שכר ברוטו',           res.gross,                                'clr-primary')
      + bdRow('מס הכנסה',             res.finalIncomeTax,                       'clr-negative', '-');
    if (res.settlementDiscount > 0) {
      empHtml += '<div class="bd-row" style="background:var(--clr-success-lt);margin:0 -4px;padding:8px 4px;border-radius:4px">'
              +  '<span class="bd-label" style="color:var(--clr-success)">↳ כולל הנחת יישוב מזכה (' + (res.settlement.percent) + '%)</span>'
              +  '<span class="bd-val clr-positive">-' + fmt.currency(res.settlementDiscount) + '</span>'
              +  '</div>';
    }
    empHtml += ''
      + bdRow('ביטוח לאומי (עובד)',   res.niRes.total,                          'clr-negative', '-')
      + bdRow('מס בריאות',            res.healthRes.total,                      'clr-negative', '-')
      + bdRow('פנסיה (עובד)',          res.pensionData.employeeContribution,     'clr-negative', '-')
      + bdRow('קרן השתלמות (עובד)',    res.trainData.employeeContribution,       'clr-negative', '-')
      + bdRowTotal('סה"כ ניכויים',    res.totalDeductions,                      'clr-negative', '-')
      + bdRowNet('נטו לתשלום',         res.netPay,                              'clr-positive', 'net-row');
    setHTML('emp-breakdown', empHtml);

    // Employer breakdown
    let erHtml = ''
      + bdRow('שכר ברוטו',              res.gross,                                  'clr-primary')
      + bdRow('ביטוח לאומי (מעסיק)',     res.empNIRes.total,                         'clr-negative', '+')
      + bdRow('פנסיה (מעסיק)',           res.pensionData.employerContribution,        'clr-negative', '+')
      + bdRow('פיצויים',                res.pensionData.severancePay,                'clr-negative', '+')
      + bdRow('קרן השתלמות (מעסיק)',     res.trainData.employerContribution,          'clr-negative', '+')
      + bdRowNet('עלות כוללת למעסיק',    res.employerCost.totalCost,                 'clr-highlight', 'emp-total');
    setHTML('er-breakdown', erHtml);

    // Tax details
    setText('d-cp-total',  res.credits.total);
    setText('d-cp-value',  fmt.currency(res.credits.monthlyTaxSaving));
    setText('d-gross-tax', fmt.currency(res.taxRes.grossTax));
    setText('d-eff-rate',  (res.taxRes.effectiveRate * 100).toFixed(1) + '%');

    // Training-fund taxable excess notice (if any)
    let tableHtml = '';
    if (res.trainingFundExcess > 0) {
      tableHtml += '<tr style="background:var(--clr-warning-lt)">'
        + '<td colspan="4" style="color:var(--clr-warning);font-weight:700">'
        + 'תוספת לשכר חייב — קרן השתלמות מעסיק מעל תקרה (₪'
        + SalaryCalc.Fmt.number((state.taxData.taxParameters && state.taxData.taxParameters.trainingFundCeiling) || 15712)
        + '/חודש)</td>'
        + '<td style="color:var(--clr-warning);font-weight:700">+' + fmt.currency(res.trainingFundExcess) + '</td>'
        + '</tr>';
    }
    res.taxRes.breakdown.forEach(function (b) {
      const toStr = b.to !== null ? fmt.currency(b.to) : 'ומעלה';
      tableHtml += '<tr>'
        + '<td>' + escapeHtml(b.label || '') + '</td>'
        + '<td>' + fmt.currency(b.from) + ' – ' + toStr + '</td>'
        + '<td><span class="rate-pill">' + (b.rate * 100).toFixed(0) + '%</span></td>'
        + '<td>' + fmt.currency(b.amount) + '</td>'
        + '<td>' + fmt.currency(b.tax) + '</td>'
        + '</tr>';
    });
    if (res.taxRes.creditDeduction > 0) {
      tableHtml += '<tr style="background:var(--clr-success-lt)">'
        + '<td colspan="4" style="color:var(--clr-success);font-weight:700">זיכוי נקודות ('
        + res.credits.total + ' × ₪' + state.taxData.creditPoints.monthlyValue + ')</td>'
        + '<td style="color:var(--clr-success);font-weight:700">-' + fmt.currency(res.taxRes.creditDeduction) + '</td>'
        + '</tr>';
    }
    if (res.pensionCredit > 0) {
      tableHtml += '<tr style="background:var(--clr-success-lt)">'
        + '<td colspan="4" style="color:var(--clr-success);font-weight:700">זיכוי סעיף 45א — 35% × ₪'
        + fmt.number(res.pensionCreditBase) + ' (פנסיה)</td>'
        + '<td style="color:var(--clr-success);font-weight:700">-' + fmt.currency(res.pensionCredit) + '</td>'
        + '</tr>';
    }
    if (res.settlementDiscount > 0) {
      tableHtml += '<tr style="background:var(--clr-success-lt)">'
        + '<td colspan="4" style="color:var(--clr-success);font-weight:700">הנחת יישוב מזכה ('
        + res.settlement.percent + '% עד ₪' + fmt.number(res.settlement.monthlyCeiling) + ')</td>'
        + '<td style="color:var(--clr-success);font-weight:700">-' + fmt.currency(res.settlementDiscount) + '</td>'
        + '</tr>';
    }
    tableHtml += '<tr style="font-weight:800">'
      + '<td colspan="4">מס הכנסה לתשלום</td>'
      + '<td style="color:var(--clr-danger)">' + fmt.currency(res.finalIncomeTax) + '</td>'
      + '</tr>';
    setHTML('tax-table-body', tableHtml);

    // Annual summary
    setText('a-gross',    fmt.currency(res.gross    * 12));
    setText('a-net',      fmt.currency(res.netPay   * 12));
    setText('a-tax',      fmt.currency(res.finalIncomeTax * 12));
    setText('a-ni',       fmt.currency(res.niRes.total   * 12));
    setText('a-employer', fmt.currency(res.employerCost.totalCost * 12));
    setText('a-pension',  fmt.currency(res.pensionData.employeeContribution * 12));

    // NI threshold notice
    const niThreshold = state.taxData.nationalInsurance.employee.lowerThreshold;
    const noticeEl = $('niThresholdNotice');
    if (noticeEl) {
      noticeEl.textContent = 'סף ביטוח לאומי ' + state.selectedYear + ': ₪' + SalaryCalc.Fmt.number(niThreshold) + ' — שכר עד הסף: 0.4% ב.ל + 3.1% בריאות | מעל הסף: 7% + 5%';
    }

    // Convergence alert
    const alertEl = $('convergenceAlert');
    if (res.convergenceInfo) {
      alertEl.style.display = 'flex';
      setText('iterCount', res.convergenceInfo.iterations);
    } else {
      alertEl.style.display = 'none';
    }
  }

  // ── Pension toggle ───────────────────────────────────────────
  const PENSION_FIELDS = ['pensionEmp', 'pensionEr', 'severance', 'trainEmp', 'trainEr'];

  function togglePension() {
    state.pensionEnabled = !state.pensionEnabled;
    const btn     = $('pensionToggle');
    const icon    = $('pensionToggleIcon');
    const label   = $('pensionToggleLabel');

    if (!state.pensionEnabled) {
      // Save current values, then zero them out
      state.savedPensionValues = {};
      PENSION_FIELDS.forEach(function (id) {
        const el = $(id);
        if (!el) return;
        state.savedPensionValues[id] = el.value;
        el.value = 0;
        el.disabled = true;
        el.classList.add('pension-disabled');
      });
      if (btn)   btn.classList.add('disabled-state');
      if (icon)  icon.textContent = '▶';
      if (label) label.textContent = 'הפעל פנסיה וקרן השתלמות';
    } else {
      // Restore saved values
      PENSION_FIELDS.forEach(function (id) {
        const el = $(id);
        if (!el) return;
        el.value = state.savedPensionValues ? (state.savedPensionValues[id] || 0) : 0;
        el.disabled = false;
        el.classList.remove('pension-disabled');
      });
      state.savedPensionValues = null;
      if (btn)   btn.classList.remove('disabled-state');
      if (icon)  icon.textContent = '⏹';
      if (label) label.textContent = 'כבה פנסיה וקרן השתלמות';
    }

    triggerLiveUpdate();
  }

  // ── Step navigation ──────────────────────────────────────────
  function goToStep(n) {
    [1, 2, 3].forEach(function (i) {
      const sec = $('step' + i);
      const ind = $('ind-step' + i);
      if (!sec || !ind) return;

      if (i === n) {
        sec.classList.remove('hidden');
        sec.classList.add('anim-in');
        ind.classList.add('active');
      } else {
        sec.classList.add('hidden');
        sec.classList.remove('anim-in');
        if (i < n) {
          ind.classList.remove('active');
          ind.classList.add('done');
          ind.querySelector('.step-circle').textContent = '✓';
        } else {
          ind.classList.remove('active', 'done');
          ind.querySelector('.step-circle').textContent = i;
        }
      }
    });

    const c12 = $('conn-1-2');
    const c23 = $('conn-2-3');
    if (c12) c12.classList.toggle('done', n >= 2);
    if (c23) c23.classList.toggle('done', n >= 3);

    state.currentStep = n;
    saveToStorage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Children age inputs ──────────────────────────────────────
  function getChildPointsForDisplay(ageKey) {
    if (!state.taxData || !state.taxData.creditPoints) return '';
    var entry = state.taxData.creditPoints.children[ageKey];
    if (!entry) return '';
    var gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    var role = gender === 'female' ? 'mother' : 'father';
    // Support both new {mother,father} and legacy flat format
    var pts = (typeof entry === 'object' && entry !== null) ? (entry[role] || 0) : entry;
    return ' (' + pts + ' נק\')';
  }

  function renderChildrenInputs() {
    const count   = parseInt($('childCount')?.value) || 0;
    const section = $('childrenSection');
    const list    = $('childrenList');
    if (!section || !list) return;

    if (count === 0) { section.style.display = 'none'; list.innerHTML = ''; return; }

    section.style.display = 'block';
    let html = '';
    for (let i = 0; i < count; i++) {
      html += '<div class="form-group">'
            + '<label class="form-label" for="child-age-' + i + '">ילד ' + (i + 1) + '</label>'
            + '<select class="form-select" id="child-age-' + i + '">'
            + '<option value="age0">שנת לידה' + getChildPointsForDisplay('age0') + '</option>'
            + '<option value="age1">גיל 1' + getChildPointsForDisplay('age1') + '</option>'
            + '<option value="age2" selected>גיל 2' + getChildPointsForDisplay('age2') + '</option>'
            + '<option value="age3">גיל 3' + getChildPointsForDisplay('age3') + '</option>'
            + '<option value="age4to5">גיל 4–5' + getChildPointsForDisplay('age4to5') + '</option>'
            + '<option value="age6to12">גיל 6–12' + getChildPointsForDisplay('age6to12') + '</option>'
            + '<option value="age13to17">גיל 13–17' + getChildPointsForDisplay('age13to17') + '</option>'
            + '<option value="age18">גיל 18' + getChildPointsForDisplay('age18') + '</option>'
            + '</select></div>';
    }
    list.innerHTML = html;
    list.querySelectorAll('select').forEach(function (sel) {
      sel.addEventListener('change', updateCreditPreview);
    });
  }

  // ── Conditional field visibility ─────────────────────────────
  function updateConditionalFields() {
    const isSoldier   = document.querySelector('input[name="isSoldier"]:checked')?.value === 'true';
    const isImmigrant = document.querySelector('input[name="isImmigrant"]:checked')?.value === 'true';
    const isReserve   = document.querySelector('input[name="isReserve"]:checked')?.value === 'true';
    const solGroup = $('soldierMonthsGroup');
    const immGroup = $('immigrantYearsGroup');
    const resGroup = $('reserveDaysGroup');
    if (solGroup) solGroup.style.display = isSoldier   ? 'flex' : 'none';
    if (immGroup) immGroup.style.display = isImmigrant ? 'flex' : 'none';
    if (resGroup) resGroup.style.display = isReserve   ? 'flex' : 'none';
  }

  // ── Calculation mode toggle ──────────────────────────────────
  function setCalcMode(mode) {
    state.calcMode = mode;
    const lblBase = $('lbl-base');
    const tipBase = $('tip-base');

    if (mode === 'netToGross') {
      $('modeGrossNet').classList.remove('active');
      $('modeNetGross').classList.add('active');
      if (lblBase) lblBase.firstChild.textContent = 'שכר נטו רצוי ';
      if (tipBase) tipBase.textContent = 'הזן את שכר הנטו שאתה מעוניין לקבל. המחשבון ימצא את הברוטו הנדרש.';
    } else {
      $('modeGrossNet').classList.add('active');
      $('modeNetGross').classList.remove('active');
      if (lblBase) lblBase.firstChild.textContent = 'שכר בסיס (ברוטו) ';
      if (tipBase) tipBase.textContent = 'שכר בסיס חודשי לפני כל תוספות.';
    }
    triggerLiveUpdate();
  }

  // ── Debounced update ─────────────────────────────────────────
  function triggerLiveUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      if (state.currentStep === 1) updateCreditPreview();
      if (state.currentStep === 2) updateLivePreview();
    }, 150);
  }

  // ── Step 2 validation ─────────────────────────────────────────
  function validateStep2() {
    const salary = parseFloat($('baseSalary')?.value) || 0;
    const errEl  = $('err-salary');
    if (salary <= 0) {
      if (errEl) { errEl.textContent = 'נא להזין שכר גדול מאפס'; errEl.classList.add('visible'); }
      return false;
    }
    if (errEl) errEl.classList.remove('visible');
    return true;
  }

  // ── localStorage persistence ─────────────────────────────────
  function saveToStorage() {
    try {
      const data = {
        step: state.currentStep,
        calcMode: state.calcMode,
        selectedYear: state.selectedYear,
        pensionEnabled: state.pensionEnabled,
        employee: {
          isResident:    document.querySelector('input[name="isResident"]:checked')?.value,
          gender:        document.querySelector('input[name="gender"]:checked')?.value,
          maritalStatus: $('maritalStatus')?.value,
          childCount:    $('childCount')?.value,
          workPct:       $('workPct')?.value,
          extraPoints:   $('extraPoints')?.value,
          isSoldier:     document.querySelector('input[name="isSoldier"]:checked')?.value,
          soldierMonths: $('soldierMonths')?.value,
          isImmigrant:   document.querySelector('input[name="isImmigrant"]:checked')?.value,
          yearsInIsrael: $('yearsInIsrael')?.value,
          isReserve:     document.querySelector('input[name="isReserve"]:checked')?.value,
          reserveDays:   $('reserveDays')?.value,
          settlementId:  $('settlementSelect')?.value
        },
        salary: {
          baseSalary: $('baseSalary')?.value,
          overtime:   $('overtime')?.value,
          bonus:      $('bonus')?.value,
          companyCar: $('companyCar')?.value,
          benefits:   $('benefits')?.value,
          pensionEmp: state.pensionEnabled ? $('pensionEmp')?.value : (state.savedPensionValues?.pensionEmp || 6),
          pensionEr:  state.pensionEnabled ? $('pensionEr')?.value  : (state.savedPensionValues?.pensionEr  || 7.5),
          severance:  state.pensionEnabled ? $('severance')?.value  : (state.savedPensionValues?.severance  || 8.33),
          trainEmp:   state.pensionEnabled ? $('trainEmp')?.value   : (state.savedPensionValues?.trainEmp   || 2.5),
          trainEr:    state.pensionEnabled ? $('trainEr')?.value    : (state.savedPensionValues?.trainEr    || 7.5)
        }
      };
      localStorage.setItem('salaryCalc_v2', JSON.stringify(data));
    } catch (e) { /* localStorage unavailable */ }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem('salaryCalc_v2');
      if (!raw) return;
      const data = JSON.parse(raw);

      // Year
      if (data.selectedYear) switchYear(data.selectedYear);

      // Employee fields
      const emp = data.employee || {};
      setRadio('isResident',  emp.isResident);
      setRadio('gender',      emp.gender);
      setRadio('isSoldier',   emp.isSoldier);
      setRadio('isImmigrant', emp.isImmigrant);
      setRadio('isReserve',   emp.isReserve);
      setIfExists('maritalStatus', emp.maritalStatus);
      setIfExists('childCount',    emp.childCount);
      setIfExists('workPct',       emp.workPct);
      setIfExists('extraPoints',   emp.extraPoints);
      setIfExists('soldierMonths', emp.soldierMonths);
      setIfExists('yearsInIsrael', emp.yearsInIsrael);
      setIfExists('reserveDays',   emp.reserveDays);
      setIfExists('settlementSelect', emp.settlementId);

      // Salary fields
      const sal = data.salary || {};
      ['baseSalary','overtime','bonus','companyCar','benefits','pensionEmp','pensionEr','severance','trainEmp','trainEr'].forEach(function (f) {
        setIfExists(f, sal[f]);
      });

      // Calc mode
      if (data.calcMode) setCalcMode(data.calcMode);

      // Pension toggle
      if (data.pensionEnabled === false) {
        // Re-apply toggle state
        state.pensionEnabled = true; // will be flipped by togglePension
        togglePension();
      }

      renderChildrenInputs();
      updateConditionalFields();
    } catch (e) { /* ignore corrupt data */ }
  }

  function setIfExists(id, value) {
    if (value != null && $(id)) $(id).value = value;
  }

  function setRadio(name, value) {
    if (value == null) return;
    const el = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (el) el.checked = true;
  }

  // ── XSS-safe HTML escape ─────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // ── Feedback email ────────────────────────────────────────────
  const FEEDBACK_EMAIL   = 'ym.cpa1@gmail.com';
  const FEEDBACK_SUBJECT = 'דיווח / הצעת שיפור — מחשבון שכר';

  // Build the message body. When `includeCurrentCalc` is true and a calculation
  // exists in state, the current results are pre-filled.
  function buildFeedbackBody(includeCurrentCalc) {
    const fmt = SalaryCalc.Fmt;
    const r   = state.results;

    let body =
      'שלום,\n\n' +
      'אני משתמש/ת במחשבון השכר ורציתי לדווח על:\n' +
      '☐ אי-דיוק בחישוב\n' +
      '☐ הצעת שיפור / פיצ\'ר חדש\n' +
      '☐ שאלה / הערה\n\n' +
      '----------------------------------------\n' +
      'תיאור הבעיה / ההצעה:\n' +
      '(כתוב כאן את הפירוט)\n\n' +
      '----------------------------------------\n';

    if (includeCurrentCalc && r) {
      body +=
        'פרטי החישוב הנוכחי (לעזרה באבחון):\n' +
        '• שנת מס:               ' + r.year + '\n' +
        '• שכר ברוטו:            ' + fmt.currency(r.gross) + '\n' +
        '• מס הכנסה (מחשבון):    ' + fmt.currency(r.finalIncomeTax) + '\n' +
        '• ב.ל. עובד (מחשבון):  '  + fmt.currency(r.niRes.total) + '\n' +
        '• מס בריאות (מחשבון):   ' + fmt.currency(r.healthRes.total) + '\n' +
        '• פנסיה עובד:           ' + fmt.currency(r.pensionData.employeeContribution) + '\n' +
        '• קרן השתלמות עובד:     ' + fmt.currency(r.trainData.employeeContribution) + '\n' +
        '• שכר נטו (מחשבון):     ' + fmt.currency(r.netPay) + '\n' +
        '• עלות מעביד (מחשבון):  ' + fmt.currency(r.employerCost.totalCost) + '\n' +
        '• נקודות זיכוי:          ' + r.credits.total + '\n\n' +
        'נתונים מתוכנת השכר שלי לאותו ברוטו (להשוואה):\n' +
        '• מס הכנסה:              ___\n' +
        '• ב.ל. עובד:            ___\n' +
        '• מס בריאות:             ___\n' +
        '• שכר נטו:               ___\n' +
        '• עלות מעביד:            ___\n\n';
    } else {
      body +=
        '(אופציונלי) נתוני חישוב להשוואה:\n' +
        '• שנת מס:        ___\n' +
        '• ברוטו:         ___\n' +
        '• נטו:           ___\n' +
        '• עלות מעביד:    ___\n\n';
    }

    return body + '----------------------------------------\nתודה!\n';
  }

  // Show the modal — populate textarea and wire up the three send options
  function openFeedbackMail(includeCurrentCalc) {
    const body  = buildFeedbackBody(includeCurrentCalc);
    const modal = $('feedbackModal');
    const ta    = $('modalText');
    const status = $('modalCopyStatus');
    if (!modal || !ta) return;

    ta.value = body;
    if (status) status.textContent = '';
    modal.style.display = 'flex';

    // Option 1 — Gmail web compose (opens in new tab, works in Chrome)
    $('modalGmail').onclick = function () {
      const currentBody = ta.value;
      const url = 'https://mail.google.com/mail/?view=cm&fs=1'
                + '&to=' + encodeURIComponent(FEEDBACK_EMAIL)
                + '&su=' + encodeURIComponent(FEEDBACK_SUBJECT)
                + '&body=' + encodeURIComponent(currentBody);
      window.open(url, '_blank', 'noopener');
      closeFeedbackModal();
    };

    // Option 2 — Default mail client (mailto:)
    $('modalMailto').onclick = function () {
      const currentBody = ta.value;
      const a = document.createElement('a');
      a.href = 'mailto:' + FEEDBACK_EMAIL
             + '?subject=' + encodeURIComponent(FEEDBACK_SUBJECT)
             + '&body='    + encodeURIComponent(currentBody);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // Option 3 — Copy to clipboard (modern Clipboard API only)
    $('modalCopy').onclick = function () {
      const currentBody = ta.value;
      const fullText = 'אל: ' + FEEDBACK_EMAIL
                     + '\nנושא: ' + FEEDBACK_SUBJECT
                     + '\n\n' + currentBody;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(function () {
          if (status) {
            status.style.color = 'var(--clr-success)';
            status.textContent = '✓ הועתק ללוח — הדבק (Ctrl+V) בכל מקום שתרצה';
          }
        }).catch(function () {
          fallbackSelectForCopy(ta, status);
        });
      } else {
        fallbackSelectForCopy(ta, status);
      }
    };
  }

  // For very old browsers — just select the text and tell user to copy manually
  function fallbackSelectForCopy(textarea, statusEl) {
    textarea.focus();
    textarea.select();
    if (statusEl) {
      statusEl.style.color = 'var(--clr-warning)';
      statusEl.textContent = 'הטקסט נבחר — הקש Ctrl+C להעתקה ידנית';
    }
  }

  function closeFeedbackModal() {
    const modal = $('feedbackModal');
    if (modal) modal.style.display = 'none';
  }

  // ── Dark mode ─────────────────────────────────────────────────
  function initDarkMode() {
    const stored = localStorage.getItem('theme');
    // Default to light mode (white) if no theme preference is stored
    const isDark = stored === 'dark';
    
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    updateDarkIcon(isDark);
  }

  function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateDarkIcon(isDark);
  }

  function updateDarkIcon(isDark) {
    const btn = $('darkToggle');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
  }

  // ── Event listeners ──────────────────────────────────────────
  function attachListeners() {
    $('darkToggle')?.addEventListener('click', toggleDarkMode);

    // Year selector
    document.querySelectorAll('.yr-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { switchYear(btn.dataset.year); });
    });

    // Pension toggle
    $('pensionToggle')?.addEventListener('click', togglePension);

    // Step navigation
    $('step1Next')?.addEventListener('click', function () { goToStep(2); updateLivePreview(); });
    $('step2Back')?.addEventListener('click', function () { goToStep(1); });
    $('step2Calc')?.addEventListener('click', function () {
      if (!validateStep2()) return;
      const res = runCalculation();
      if (res) { renderResults(res); goToStep(3); }
    });
    $('editCalc')?.addEventListener('click', function () { goToStep(2); });
    $('newCalc')?.addEventListener('click',  function () { goToStep(1); });
    $('printBtn')?.addEventListener('click', function () { window.print(); });
    $('clearStorage')?.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('salaryCalc_v2');
      alert('הנתונים השמורים נמחקו.');
    });

    // Feedback — open the modal with three send options
    $('reportResultBtn')?.addEventListener('click', function (e) {
      e.preventDefault();
      openFeedbackMail(true);
    });
    $('generalFeedbackBtn')?.addEventListener('click', function (e) {
      e.preventDefault();
      openFeedbackMail(false);
    });

    // Close modal — X button, click-outside, and Escape key
    $('modalClose')?.addEventListener('click', closeFeedbackModal);
    $('feedbackModal')?.addEventListener('click', function (e) {
      if (e.target === this) closeFeedbackModal();   // click on overlay (not content)
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('feedbackModal')?.style.display === 'flex') {
        closeFeedbackModal();
      }
    });

    // Calc mode
    $('modeGrossNet')?.addEventListener('click', function () { setCalcMode('grossToNet'); });
    $('modeNetGross')?.addEventListener('click', function () { setCalcMode('netToGross'); });

    // Children
    $('childCount')?.addEventListener('input', function () {
      renderChildrenInputs();
      triggerLiveUpdate();
    });

    // Conditional fields - explicit listeners for each radio group
    ['isSoldier', 'isImmigrant', 'isReserve'].forEach(function (name) {
      document.querySelectorAll('input[name="' + name + '"]').forEach(function (el) {
        el.addEventListener('change', function () {
          updateConditionalFields();
          triggerLiveUpdate();
        });
      });
    });

    // Gender change — re-render children so displayed point values update
    document.querySelectorAll('input[name="gender"]').forEach(function (el) {
      el.addEventListener('change', function () { renderChildrenInputs(); triggerLiveUpdate(); });
    });

    // Qualifying-settlement dropdown — update info text and recalc
    $('settlementSelect')?.addEventListener('change', function () {
      updateSettlementInfo();
      triggerLiveUpdate();
    });

    // Auto-update on any input in step 1 or 2
    ['step1', 'step2'].forEach(function (sid) {
      const sec = $(sid);
      if (sec) {
        sec.addEventListener('input',  triggerLiveUpdate);
        sec.addEventListener('change', triggerLiveUpdate);
      }
    });

    document.addEventListener('input',  saveToStorage);
    document.addEventListener('change', saveToStorage);
  }

  // ── Init ─────────────────────────────────────────────────────
  async function init() {
    initDarkMode();
    await loadTaxData();
    populateSettlementDropdown();
    loadFromStorage();
    attachListeners();
    updateConditionalFields();
    updateSettlementInfo();
    updateCreditPreview();

    if (state.usingFallback) {
      console.info('%c מחשבון שכר %c נתוני מס מוטמעים (הרץ עם שרת HTTP לטעינת JSON חיצוני)',
        'background:#2563eb;color:#fff;padding:2px 6px;border-radius:4px', 'color:#888');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
