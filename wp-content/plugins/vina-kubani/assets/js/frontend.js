/**
 * Frontend JS — Вина Кубани
 *
 * @package Vina_Kubani
 */

/* global jQuery, vkFrontend, L */

(function ($) {
	'use strict';

	$(document).ready(function () {

		// ===== Wine Search =====
		var searchTimeout;
		var currentPage = 1;

		$('#vk-search-input').on('input', function () {
			clearTimeout(searchTimeout);
			var query = $(this).val().trim();

			if (query.length < 2) {
				$('#vk-search-results').html('');
				$('#vk-search-status').text('');
				return;
			}

			$('#vk-search-status').text(vkFrontend.i18n.searching);

			searchTimeout = setTimeout(function () {
				searchWines(query, 1);
			}, 400);
		});

		$('#vk-search-btn').on('click', function () {
			var query = $('#vk-search-input').val().trim();
			if (query.length >= 2) {
				searchWines(query, 1);
			}
		});

		// Search via Enter key.
		$('#vk-search-input').on('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				$('#vk-search-btn').click();
			}
		});

		/**
		 * AJAX поиск вин.
		 */
		function searchWines(query, page) {
			$.ajax({
				url: vkFrontend.ajaxUrl,
				type: 'POST',
				data: {
					action: 'vk_search_wines',
					nonce: vkFrontend.nonce,
					query: query,
					page: page
				},
				beforeSend: function () {
					$('#vk-search-status').text(vkFrontend.i18n.searching);
				},
				success: function (res) {
					if (res.success && res.data.results && res.data.results.length > 0) {
						renderSearchResults(res.data.results);
						$('#vk-search-status').text(
							'Найдено: ' + res.data.total + ' | Страница ' + res.data.page + ' из ' + res.data.pages
						);
						currentPage = res.data.page;
					} else {
						$('#vk-search-results').html('');
						$('#vk-search-status').text(vkFrontend.i18n.noResults);
					}
				},
				error: function () {
					$('#vk-search-results').html('');
					$('#vk-search-status').text('Ошибка поиска');
				}
			});
		}

		/**
		 * Рендер результатов поиска.
		 */
		function renderSearchResults(results) {
			var html = '<div class="vk-wines-grid">';

			results.forEach(function (wine) {
				html += '<div class="vk-wine-card">';

				if (wine.thumbnail) {
					html += '<div class="vk-wine-card__image">';
					html += '<a href="' + wine.permalink + '"><img src="' + wine.thumbnail + '" alt="' + escapeHtml(wine.title) + '" /></a>';
					html += '</div>';
				}

				html += '<div class="vk-wine-card__content">';
				html += '<h3 class="vk-wine-card__title"><a href="' + wine.permalink + '">' + escapeHtml(wine.title) + '</a></h3>';

				if (wine.display_code) {
					html += '<div class="vk-wine-card__code"><code>' + escapeHtml(wine.display_code) + '</code></div>';
				}

				if (wine.harvest_year) {
					html += '<div class="vk-wine-card__meta">';
					html += '<span class="vk-wine-card__year">' + escapeHtml(wine.harvest_year) + '</span>';
					if (wine.terroir) html += '<span class="vk-wine-card__terroir">' + escapeHtml(wine.terroir.name) + '</span>';
					if (wine.winemaker) html += '<span class="vk-wine-card__winemaker">' + escapeHtml(wine.winemaker.name) + '</span>';
					html += '</div>';
				}

				html += '<a href="' + wine.permalink + '" class="vk-btn vk-btn--small">Подробнее</a>';
				html += '</div></div>';
			});

			html += '</div>';
			$('#vk-search-results').html(html);
		}

		// ===== Frontend Map =====
		initFrontendMaps();

	});

	/**
	 * Инициализация карт на фронте (только для просмотра).
	 */
	function initFrontendMaps() {
		if (typeof L === 'undefined') {
			return;
		}

		$('.vk-map-container').each(function () {
			var $container = $(this);
			var mapId = $container.attr('id');
			var isEditable = $container.data('editable') === '1';

			// На фронте не редактируем.
			if (isEditable) return;

			var defaultLat = $container.data('default-lat') || 45.0;
			var defaultLng = $container.data('default-lng') || 37.5;
			var defaultZoom = $container.data('default-zoom') || 8;
			var polygonData = $container.data('polygon') || [];

			var strokeColor = $container.data('stroke-color') || '#FF5722';
			var strokeWeight = $container.data('stroke-weight') || 2;
			var strokeOpacity = $container.data('stroke-opacity') || 0.8;
			var fillColor = $container.data('fill-color') || '#FF5722';
			var fillOpacity = $container.data('fill-opacity') || 0.35;

			var terroirId = $container.data('terroir-id');

			var map = L.map(mapId).setView([defaultLat, defaultLng], defaultZoom);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom: 18
			}).addTo(map);

			if (polygonData && polygonData.length >= 3) {
				var polygon = L.polygon(polygonData, {
					color: strokeColor,
					weight: strokeWeight,
					opacity: strokeOpacity,
					fillColor: fillColor,
					fillOpacity: fillOpacity
				}).addTo(map);

				var bounds = L.latLngBounds(polygonData);
				map.fitBounds(bounds, { padding: [20, 20] });

				// Popup с названием терруара.
				var terroirName = $container.closest('.vk-terroir-single').find('h1').text() || 'Терруар';
				polygon.bindPopup('<strong>' + escapeHtml(terroirName) + '</strong>');
			}

			$container.data('leaflet-map', map);
		});
	}

	/**
	 * Экранирование HTML.
	 */
	function escapeHtml(text) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(text));
		return div.innerHTML;
	}

})(jQuery);
