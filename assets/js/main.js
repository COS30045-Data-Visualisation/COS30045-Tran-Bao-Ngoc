// Chạy trên cả 3 trang: cập nhật năm ở footer + accordion cho FAQ

document.addEventListener("DOMContentLoaded", function () {
  // 1. Năm hiện tại trong footer
  var year = new Date().getFullYear();
  document.querySelectorAll(".current-year").forEach(function (el) {
    el.textContent = year;
  });

  // 2. Accordion FAQ (mặc định ẩn, bấm để mở/đóng)
  document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
      var answer = document.getElementById(button.getAttribute("aria-controls"));
      var isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      answer.hidden = isOpen;
    });
  });
});