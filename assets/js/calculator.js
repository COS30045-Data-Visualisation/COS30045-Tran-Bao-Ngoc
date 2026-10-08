/* ==========================================================
   Appliance Energy Consumption Website
   Vanilla JavaScript only. Each feature checks that its
   elements exist, so one script can be shared by all pages.
   ========================================================== */
(function () {
  'use strict';

  var currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

  function formatKwh(value) {
    return value.toLocaleString('en-AU', { maximumFractionDigits: 1 }) + ' kWh';
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var year = new Date().getFullYear();
    document.querySelectorAll('.js-year').forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ---------- FAQ accordion (hidden by default, one open at a time) ---------- */
  function initAccordion() {
    var buttons = document.querySelectorAll('.faq__button');
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var wasOpen = button.getAttribute('aria-expanded') === 'true';

        // close every item first
        buttons.forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          document.getElementById(other.getAttribute('aria-controls')).hidden = true;
        });

        // reopen the clicked one unless it was already open
        if (!wasOpen) {
          button.setAttribute('aria-expanded', 'true');
          document.getElementById(button.getAttribute('aria-controls')).hidden = false;
        }
      });
    });
  }

  /* ---------- Input validation shared by both price fields ---------- */
  function readNumber(input, rule) {
    var raw = input.value.trim();
    if (raw === '') {
      return { error: 'Enter ' + rule.label + '.' };
    }
    var value = Number(raw);
    if (!isFinite(value)) {
      return { error: 'Enter a number, for example ' + rule.example + '.' };
    }
    if (value < rule.min || value > rule.max) {
      return { error: rule.label.charAt(0).toUpperCase() + rule.label.slice(1) +
        ' must be between ' + rule.min + ' and ' + rule.max + '.' };
    }
    return { value: value };
  }

  function showFieldError(input, message) {
    var errorEl = document.getElementById(input.id + '-error');
    if (errorEl) errorEl.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  var RULES = {
    watts: { label: 'the power usage in watts', example: '100', min: 1, max: 10000 },
    hours: { label: 'the hours of use per day', example: '5', min: 0, max: 24 },
    price: { label: 'the electricity price in cents per kWh', example: '30', min: 0.01, max: 200 }
  };

  /* ---------- Appliance energy calculator (Home page) ---------- */
  function calculate(watts, hours, priceCents) {
    var kwhPerDay = (watts * hours) / 1000;
    var kwhPerYear = kwhPerDay * 365;
    var kwhPerMonth = kwhPerYear / 12;
    var costPerYear = (kwhPerYear * priceCents) / 100;
    var costPerMonth = costPerYear / 12;
    return {
      kwhPerDay: kwhPerDay,
      kwhPerMonth: kwhPerMonth,
      kwhPerYear: kwhPerYear,
      costPerMonth: costPerMonth,
      costPerYear: costPerYear
    };
  }

  function initCalculator() {
    var form = document.getElementById('energy-form');
    if (!form) return;

    var applianceSelect = document.getElementById('appliance');
    var wattsInput = document.getElementById('watts');
    var hoursInput = document.getElementById('hours');
    var priceInput = document.getElementById('price');

    var message = document.getElementById('results-message');
    var values = document.getElementById('results-values');
    var out = {
      costYear: document.getElementById('out-cost-year'),
      costMonth: document.getElementById('out-cost-month'),
      kwhDay: document.getElementById('out-kwh-day'),
      kwhMonth: document.getElementById('out-kwh-month'),
      kwhYear: document.getElementById('out-kwh-year')
    };

    function update() {
      var watts = readNumber(wattsInput, RULES.watts);
      var hours = readNumber(hoursInput, RULES.hours);
      var price = readNumber(priceInput, RULES.price);

      showFieldError(wattsInput, watts.error);
      showFieldError(hoursInput, hours.error);
      showFieldError(priceInput, price.error);

      if (watts.error || hours.error || price.error) {
        message.textContent = 'Fix the highlighted fields to see your results.';
        message.hidden = false;
        values.hidden = true;
        return;
      }

      var result = calculate(watts.value, hours.value, price.value);
      message.hidden = true;
      values.hidden = false;

      // existing elements are updated, never duplicated
      out.costYear.textContent = currency.format(result.costPerYear);
      out.costMonth.textContent = currency.format(result.costPerMonth);
      out.kwhDay.textContent = formatKwh(result.kwhPerDay);
      out.kwhMonth.textContent = formatKwh(result.kwhPerMonth);
      out.kwhYear.textContent = formatKwh(result.kwhPerYear);
    }

    // choosing an appliance fills in its wattage
    applianceSelect.addEventListener('change', function () {
      if (applianceSelect.value !== 'custom') {
        wattsInput.value = applianceSelect.value;
      } else {
        wattsInput.focus();
      }
      update();
    });

    // typing your own wattage switches the menu to "my own appliance"
    wattsInput.addEventListener('input', function () {
      var matches = false;
      Array.prototype.forEach.call(applianceSelect.options, function (option) {
        if (option.value !== 'custom' && Number(option.value) === Number(wattsInput.value)) {
          applianceSelect.value = option.value;
          matches = true;
        }
      });
      if (!matches) applianceSelect.value = 'custom';
    });

    form.addEventListener('input', update);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      update();
    });

    update(); // show results for the starting values, also after a refresh
  }

  /* ---------- Television cost per year (Televisions page) ---------- */
  function initTvCosts() {
    var priceInput = document.getElementById('tv-price');
    if (!priceInput) return;

    var rows = document.querySelectorAll('.meter__row');

    function update() {
      var price = readNumber(priceInput, RULES.price);
      showFieldError(priceInput, price.error);

      rows.forEach(function (row) {
        var cost = row.querySelector('.js-cost');
        if (price.error) {
          cost.textContent = '\u2013';
        } else {
          var kwh = Number(row.getAttribute('data-kwh'));
          cost.textContent = currency.format((kwh * price.value) / 100);
        }
      });
    }

    priceInput.addEventListener('input', update);
    update();
  }

  /* ---------- Chart image fallback ---------- */
  function showMissing(img) {
    var note = document.createElement('div');
    note.className = 'chart__missing';
    note.textContent = 'Chart image not found. Export it from KNIME and save it as ' +
      img.getAttribute('src') + '.';
    img.replaceWith(note);
  }

  function initChartImages() {
    document.querySelectorAll('.js-chart-img').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) {
        showMissing(img);
      } else {
        img.addEventListener('error', function () { showMissing(img); });
      }
    });
  }

  initYear();
  initAccordion();
  initCalculator();
  initTvCosts();
  initChartImages();
})();
