document.addEventListener("DOMContentLoaded", function () {
  var burgerBtn = document.querySelector(".burger-btn");
  var mobileMenu = document.getElementById("mobileMenu");

  if (!burgerBtn || !mobileMenu) {
    return;
  }

  var closeTargets = mobileMenu.querySelectorAll("[data-mobile-menu-close]");
  var menuLinks = mobileMenu.querySelectorAll(".mobile-menu__nav a");

  function openMenu() {
    document.body.classList.add("mobile-menu-open");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    document.body.classList.remove("mobile-menu-open");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  burgerBtn.addEventListener("click", function () {
    if (document.body.classList.contains("mobile-menu-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeTargets.forEach(function (item) {
    item.addEventListener("click", closeMenu);
  });

  menuLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
});
