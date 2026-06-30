(function () {
  "use strict";

  function toNumber(value) {
    const num = parseFloat(value);
    return Number.isFinite(num) ? num : null;
  }

  function parseBrandIds(value) {
    if (!value) return [];
    return value
      .split(",")
      .map(function (v) {
        return parseInt(v, 10);
      })
      .filter(function (v) {
        return !Number.isNaN(v);
      });
  }

  function initMap() {
    if (typeof ymaps === "undefined" || typeof WSM_STORE_DATA === "undefined") {
      return;
    }

    var mapElement = document.getElementById("wsm-map");
    var list = document.getElementById("wsm-store-list");
    var cityFilter = document.getElementById("wsm-city-filter");
    var brandButtons = document.querySelectorAll(".wsm-brand-card");

    if (!mapElement || !list) {
      return;
    }

    var map = new ymaps.Map("wsm-map", {
      center: [WSM_STORE_DATA.defaultLat, WSM_STORE_DATA.defaultLng],
      zoom: WSM_STORE_DATA.defaultZoom,
      controls: ["zoomControl", "fullscreenControl"],
    });

    var markers = {};
    var cards = Array.prototype.slice.call(
      list.querySelectorAll(".wsm-store-card")
    );
    var collection = new ymaps.GeoObjectCollection();
    map.geoObjects.add(collection);

    cards.forEach(function (card) {
      var lat = toNumber(card.dataset.lat);
      var lng = toNumber(card.dataset.lng);
      var title =
        (card.querySelector("h4") && card.querySelector("h4").textContent) ||
        "";
      var address =
        (card.querySelector("p") && card.querySelector("p").textContent) || "";

      if (lat === null || lng === null) {
        return;
      }

      var placemark = new ymaps.Placemark(
        [lat, lng],
        {
          balloonContentHeader: title,
          balloonContentBody: address,
        },
        {
          preset: "islands#redIcon",
        }
      );

      collection.add(placemark);
      markers[card.dataset.storeId] = placemark;

      card.addEventListener("click", function () {
        map.setCenter([lat, lng], 14);
        placemark.balloon.open();
        cards.forEach(function (c) {
          c.classList.remove("active");
        });
        card.classList.add("active");
      });
    });

    if (collection.getLength() > 0) {
      map.setBounds(collection.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 40,
      });
    }

    var selectedBrandId = null;

    function applyFilters() {
      var selectedCity = cityFilter ? cityFilter.value : "";
      collection.removeAll();
      var anyVisible = false;

      cards.forEach(function (card) {
        var cardCity = card.dataset.city || "";
        var brandIds = parseBrandIds(card.dataset.brandIds || "");

        var matchCity = !selectedCity || cardCity === selectedCity;
        var matchBrand =
          !selectedBrandId || brandIds.indexOf(selectedBrandId) !== -1;

        var isVisible = matchCity && matchBrand;
        card.style.display = isVisible ? "grid" : "none";

        var marker = markers[card.dataset.storeId];
        if (marker) {
          if (isVisible) {
            collection.add(marker);
            anyVisible = true;
          }
        }
      });

      if (anyVisible) {
        map.setBounds(collection.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 40,
        });
      }
    }

    if (cityFilter) {
      cityFilter.addEventListener("change", applyFilters);
    }

    if (brandButtons.length) {
      Array.prototype.forEach.call(brandButtons, function (button) {
        button.addEventListener("click", function () {
          var id = parseInt(button.dataset.brandId, 10);
          if (selectedBrandId === id) {
            selectedBrandId = null;
            button.classList.remove("active");
          } else {
            selectedBrandId = id;
            Array.prototype.forEach.call(brandButtons, function (b) {
              b.classList.remove("active");
            });
            button.classList.add("active");
          }
          applyFilters();
        });
      });
    }

    applyFilters();
  }

  if (typeof ymaps !== "undefined" && typeof ymaps.ready === "function") {
    ymaps.ready(initMap);
  }
})();
