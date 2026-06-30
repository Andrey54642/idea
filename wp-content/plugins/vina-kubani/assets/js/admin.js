/**
 * Admin JS — Вина Кубани
 *
 * @package Vina_Kubani
 */

/* global jQuery, vkAdmin, wp */

(function ($) {
	'use strict';

	$(document).ready(function () {

		// ===== Image Upload =====
		$(document).on('click', '.vk-image-upload-btn', function (e) {
			e.preventDefault();
			var $container = $(this).closest('.vk-image-field');
			var frame = wp.media({
				title: vkAdmin.i18n.selectImage || 'Выберите изображение',
				button: { text: 'Выбрать' },
				multiple: false
			});
			frame.on('select', function () {
				var attachment = frame.state().get('selection').first().toJSON();
				$container.find('.vk-image-field__id').val(attachment.id);
				$container.find('.vk-image-field__preview').attr('data-attachment-id', attachment.id)
					.html('<img src="' + attachment.sizes.thumbnail.url + '" alt="" style="max-width:150px;max-height:150px;" />');
			});
			frame.open();
		});

		$(document).on('click', '.vk-image-remove-btn', function (e) {
			e.preventDefault();
			var $container = $(this).closest('.vk-image-field');
			$container.find('.vk-image-field__id').val('');
			$container.find('.vk-image-field__preview').attr('data-attachment-id', '')
				.html('<span class="vk-image-field__placeholder">' + (vkAdmin.i18n.noImage || 'Нет изображения') + '</span>');
		});

		// ===== Gallery =====
		$(document).on('click', '.vk-gallery-add-btn', function (e) {
			e.preventDefault();
			var $container = $(this).closest('.vk-gallery-field');
			var frame = wp.media({
				title: 'Выберите изображения',
				button: { text: 'Добавить' },
				multiple: true
			});
			frame.on('select', function () {
				var attachments = frame.state().get('selection').toJSON();
				var ids = [];
				var existing = $container.find('.vk-gallery-field__ids').val();
				if (existing) {
					try { ids = JSON.parse(existing); } catch (err) { ids = []; }
				}
				attachments.forEach(function (att) {
					ids.push(att.id);
					$container.find('.vk-gallery-preview').append(
						'<div class="vk-gallery-item" data-id="' + att.id + '">' +
						'<img src="' + (att.sizes && att.sizes.thumbnail ? att.sizes.thumbnail.url : att.url) + '" alt="" />' +
						'</div>'
					);
				});
				$container.find('.vk-gallery-field__ids').val(JSON.stringify(ids));
			});
			frame.open();
		});

		// ===== Repeater =====
		$(document).on('click', '.vk-repeater-add-row', function (e) {
			e.preventDefault();
			var $container = $(this).closest('.vk-repeater-field');
			var $rows = $container.find('.vk-repeater-rows');
			var index = $rows.find('.vk-repeater-row').length;
			var config = $container.find('.vk-repeater-config').val();
			var subFields = [];
			try { subFields = JSON.parse(config); } catch (err) { }
			var rowHtml = '<div class="vk-repeater-row" data-index="' + index + '">';
			rowHtml += '<button type="button" class="vk-repeater-remove-row button">&times;</button>';
			subFields.forEach(function (sub) {
				var name = $container.data('slug');
				rowHtml += '<div class="vk-repeater-subfield">';
				rowHtml += '<label>' + (sub.label || '') + '</label>';
				rowHtml += '<input type="text" name="vk_cf[' + name + '][' + index + '][' + (sub.slug || '') + ']" value="" />';
				rowHtml += '</div>';
			});
			rowHtml += '</div>';
			$rows.append(rowHtml);
		});

		$(document).on('click', '.vk-repeater-remove-row', function () {
			$(this).closest('.vk-repeater-row').remove();
		});

		// ===== Relation / Post Selector =====
		$(document).on('click', '.vk-relation-select-btn', function (e) {
			e.preventDefault();
			var $container = $(this).closest('.vk-relation-field');
			var postType = $(this).data('post-type') || 'post';
			var postId = prompt('Введите ID записи (' + postType + '):');
			if (postId && parseInt(postId) > 0) {
				$container.find('.vk-relation-id').val(parseInt(postId));
				$container.find('.vk-relation-select-btn').text('Обновить (ID: ' + postId + ')');
			}
		});

		$(document).on('click', '.vk-relation-remove', function (e) {
			e.preventDefault();
			var $container = $(this).closest('.vk-relation-field');
			$container.find('.vk-relation-id').val('');
			$container.find('.vk-relation-selected').remove();
			$container.find('.vk-relation-select-btn').show();
		});

	});

})(jQuery);
