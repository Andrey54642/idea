document.querySelectorAll("[data-tab-group]").forEach(function (group) {
  const tabs = group.querySelectorAll(".iw-tab");
  const panels = group.querySelectorAll(".iw-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const target = tab.getAttribute("data-tab-target");
      tabs.forEach(function (item) {
        item.classList.remove("is-active");
      });
      panels.forEach(function (panel) {
        panel.classList.remove("is-active");
      });

      tab.classList.add("is-active");
      const active = group.querySelector("#" + CSS.escape(target));
      if (active) {
        active.classList.add("is-active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".single-wine-sctn").forEach(function (section) {
    const bio = section.querySelector("[data-winemaker-bio]");
    const toggle = section.querySelector("[data-winemaker-toggle]");

    if (!bio || !toggle) return;

    const paragraphs = Array.from(bio.querySelectorAll("p")).filter(
      (p) => p.textContent.trim() !== "",
    );

    if (paragraphs.length <= 3) {
      toggle.hidden = true;
      toggle.style.display = "none"; // подстраховка
      return;
    }

    paragraphs.slice(3).forEach((p) => (p.hidden = true));

    toggle.hidden = false;
    toggle.style.display = ""; // вернуть как было

    toggle.addEventListener("click", function () {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      paragraphs.slice(3).forEach(function (p) {
        p.hidden = isExpanded;
      });

      toggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      toggle.textContent = isExpanded ? "Показать больше" : "Скрыть";
    });
  });
});
