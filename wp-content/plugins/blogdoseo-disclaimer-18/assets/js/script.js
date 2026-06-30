jQuery(document).ready(function($) {
    var cookieName  = blogdoseoDisclaimerSettings.cookieName;
    var expiresDays = blogdoseoDisclaimerSettings.expiresDays;

    function setCookie(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    function getCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Apply theme
    if (blogdoseoDisclaimerSettings.theme === 'light') {
        $('#blogdoseo-disclaimer-overlay').addClass('light-theme');
    }

    // Apply custom colors via CSS variables
    var root = document.documentElement;
    root.style.setProperty('--blogdoseo-yes-color', blogdoseoDisclaimerSettings.yesButtonColor);
    root.style.setProperty('--blogdoseo-no-color',  blogdoseoDisclaimerSettings.noButtonColor);
    root.style.setProperty('--blogdoseo-modal-bg',  blogdoseoDisclaimerSettings.modalBackgroundColor);
    root.style.setProperty('--blogdoseo-text-color', blogdoseoDisclaimerSettings.textColor);

    // Apply background image if set
    if (blogdoseoDisclaimerSettings.backgroundImage) {
        $('#blogdoseo-disclaimer-overlay').css({
            'background-image'   : 'url(' + blogdoseoDisclaimerSettings.backgroundImage + ')',
            'background-size'    : 'cover',
            'background-position': 'center'
        });
    }

    // Fill dynamic texts
    $('#blogdoseo-disclaimer-title').text(blogdoseoDisclaimerSettings.title);
    $('#blogdoseo-disclaimer-description').text(blogdoseoDisclaimerSettings.description);
    $('#blogdoseo-disclaimer-yes').text(blogdoseoDisclaimerSettings.yesText);
    $('#blogdoseo-disclaimer-no').text(blogdoseoDisclaimerSettings.noText);
    $('#blogdoseo-disclaimer-regret-title').text(blogdoseoDisclaimerSettings.regretTitle);
    $('#blogdoseo-disclaimer-regret-description').text(blogdoseoDisclaimerSettings.regretDescription);
    $('#blogdoseo-disclaimer-back').text(blogdoseoDisclaimerSettings.backText);

    // Add logo if set
    if (blogdoseoDisclaimerSettings.logoUrl) {
        var logoHtml = '<img src="' + blogdoseoDisclaimerSettings.logoUrl + '" alt="Logo" style="width:' + blogdoseoDisclaimerSettings.logoWidth + '%;opacity:' + (blogdoseoDisclaimerSettings.logoOpacity / 100) + ';">';
        $('#blogdoseo-logo-container').html(logoHtml);
    }

    // Show modal if no cookie
    if (getCookie(cookieName) !== 'yes') {
        $('#blogdoseo-disclaimer-overlay').css('display', 'flex');
        $('body').css('overflow', 'hidden');
    }

    // YES button
    $('#blogdoseo-disclaimer-yes').on('click', function() {
        setCookie(cookieName, 'yes', expiresDays);
        $('#blogdoseo-disclaimer-overlay').fadeOut();
        $('body').css('overflow', '');
    });

    // NO button
    $('#blogdoseo-disclaimer-no').on('click', function() {
        $('.blogdoseo-disclaimer-content').hide();
        $('.blogdoseo-disclaimer-regret').fadeIn();
    });

    // Back button
    $('#blogdoseo-disclaimer-back').on('click', function() {
        if (blogdoseoDisclaimerSettings.noRedirectUrl) {
            window.location.href = blogdoseoDisclaimerSettings.noRedirectUrl;
        } else {
            $('.blogdoseo-disclaimer-regret').hide();
            $('.blogdoseo-disclaimer-content').fadeIn();
        }
    });
});
