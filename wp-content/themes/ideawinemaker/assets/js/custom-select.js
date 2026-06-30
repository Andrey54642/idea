document.querySelectorAll(".custom-select").forEach(function (select) {
  var trigger = select.querySelector(".custom-select__trigger");
  var valueEl = select.querySelector(".custom-select__value");
  var options = select.querySelectorAll(".custom-select__option");

  trigger.addEventListener("click", function (e) {
    e.stopPropagation();
    var isOpen = select.classList.contains("is-open");
    document.querySelectorAll(".custom-select.is-open").forEach(function (s) {
      s.classList.remove("is-open");
    });
    if (!isOpen) {
      select.classList.add("is-open");
    }
  });

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      options.forEach(function (o) {
        o.classList.remove("is-selected");
      });
      option.classList.add("is-selected");
      valueEl.textContent = option.textContent;
      select.classList.remove("is-open");
    });
  });
});

document.addEventListener("click", function () {
  document.querySelectorAll(".custom-select.is-open").forEach(function (s) {
    s.classList.remove("is-open");
  });
});
// Исправленный пример в вашем JS
function getSelectedWineCode() {
  return {
    harvest_year: document.getElementById('filter-year')?.value || '',   // <-- Имя как в URL
    terroir_id: document.getElementById('filter-terroir')?.value || '',  // <-- Имя как в URL
    winemaker_id: document.getElementById('filter-winemaker')?.value || '', // <-- Имя как в URL
    method: document.getElementById('filter-method')?.value || ''
  };
}