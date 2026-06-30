const wineSliderElement = document.querySelector("#wine-slider");

if (wineSliderElement && typeof Splide !== "undefined") {
  new Splide(wineSliderElement, {
    perPage: 4,
    gap: "20px",
    arrows: true,
    pagination: false,
    breakpoints: {
      1024: {
        perPage: 2,
      },
      640: {
        perPage: 1,
      },
    },
  }).mount();
}
