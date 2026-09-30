// Appliance Energy Calculator - vanilla JavaScript, không dùng thư viện

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("energy-form");
  var modelSelect = document.getElementById("model");
  var fields = {
    watts: document.getElementById("watts"),
    hours: document.getElementById("hours"),
    price: document.getElementById("price")
  };
  var output = {
    message: document.getElementById("results-message"),
    daily: document.getElementById("res-daily"),
    monthly: document.getElementById("res-monthly"),
    yearly: document.getElementById("res-yearly"),
    costMonthly: document.getElementById("res-cost-monthly"),
    costYearly: document.getElementById("res-cost-yearly")
  };

  var DAYS_PER_MONTH = 30;
  var DAYS_PER_YEAR = 365;

  // Đọc và kiểm tra một ô nhập. Trả về số hợp lệ hoặc null.
  function readField(name, label, min, max) {
    var input = fields[name];
    var errorEl = document.getElementById(name + "-error");
    var raw = input.value.trim();
    var message = "";
    var value = Number(raw);

    if (raw === "") {
      message = "Please enter " + label + ".";
    } else if (isNaN(value)) {
      message = label + " must be a number.";
    } else if (value < min) {
      message = label + " must be at least " + min + ".";
    } else if (value > max) {
      message = label + " must be no more than " + max + ".";
    }

    errorEl.textContent = message;
    input.classList.toggle("invalid", message !== "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");

    return message === "" ? value : null;
  }

  function clearResults() {
    output.daily.textContent = "-";
    output.monthly.textContent = "-";
    output.yearly.textContent = "-";
    output.costMonthly.textContent = "-";
    output.costYearly.textContent = "-";
  }

  function calculate() {
    var watts = readField("watts", "the power usage", 0.1, 10000);
    var hours = readField("hours", "the hours per day", 0, 24);
    var price = readField("price", "the electricity price", 0, 500);

    if (watts === null || hours === null || price === null) {
      clearResults();
      output.message.textContent = "Fix the highlighted inputs to see your results.";
      output.message.classList.add("error");
      return;
    }

    var dailyKwh = (watts * hours) / 1000;
    var monthlyKwh = dailyKwh * DAYS_PER_MONTH;
    var yearlyKwh = dailyKwh * DAYS_PER_YEAR;
    var monthlyCost = (monthlyKwh * price) / 100; // cent -> dollar
    var yearlyCost = (yearlyKwh * price) / 100;

    // Cập nhật phần tử có sẵn (không tạo thêm bản sao)
    output.daily.textContent = dailyKwh.toFixed(2) + " kWh";
    output.monthly.textContent = monthlyKwh.toFixed(1) + " kWh";
    output.yearly.textContent = yearlyKwh.toFixed(0) + " kWh";
    output.costMonthly.textContent = "$" + monthlyCost.toFixed(2);
    output.costYearly.textContent = "$" + yearlyCost.toFixed(2);

    output.message.textContent =
      "Running this appliance " + hours + " h/day at " + price + " c/kWh.";
    output.message.classList.remove("error");
  }

  // Chọn model -> tự điền watts
  modelSelect.addEventListener("change", function () {
    if (modelSelect.value !== "") {
      fields.watts.value = modelSelect.value;
    }
    calculate();
  });

  // Sửa watts tay -> chuyển dropdown về Custom
  fields.watts.addEventListener("input", function () {
    if (modelSelect.value !== fields.watts.value) {
      modelSelect.value = "";
    }
  });

  // Tính lại khi đổi input hoặc bấm nút
  Object.keys(fields).forEach(function (name) {
    fields[name].addEventListener("input", calculate);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    calculate();
  });

  // Tính ngay khi tải trang để kết quả luôn hiện sau khi refresh
  calculate();
});