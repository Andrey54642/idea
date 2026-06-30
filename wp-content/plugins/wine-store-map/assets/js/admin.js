(function ($) {
  "use strict";

  let mediaFrame;

  function setPreview(url) {
    const preview = $("#wsm-brand-logo-preview");
    if (url) {
      preview.html('<img src="' + url + '" style="max-width:120px;height:auto;">');
      $(".wsm-remove-logo").show();
    } else {
      preview.html("");
      $(".wsm-remove-logo").hide();
    }
  }

  $(document).on("click", ".wsm-upload-logo", function (e) {
    e.preventDefault();

    if (mediaFrame) {
      mediaFrame.open();
      return;
    }

    mediaFrame = wp.media({
      title: "Выберите логотип бренда",
      button: { text: "Использовать логотип" },
      multiple: false,
    });

    mediaFrame.on("select", function () {
      const attachment = mediaFrame.state().get("selection").first().toJSON();
      $("#wsm_brand_logo_id").val(attachment.id);
      setPreview(attachment.sizes?.thumbnail?.url || attachment.url);
    });

    mediaFrame.open();
  });

  $(document).on("click", ".wsm-remove-logo", function (e) {
    e.preventDefault();
    $("#wsm_brand_logo_id").val("");
    setPreview("");
  });
})(jQuery);
