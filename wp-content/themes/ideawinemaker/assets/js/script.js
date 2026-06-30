s = sel => document.querySelector(sel);
ss = sel => document.querySelectorAll(sel);

document.addEventListener('click', (e) => {
    let t = e.target;
});

document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('contact-popup');
    const privacyPolicyUrl = window.iwThemeData && window.iwThemeData.privacyPolicyUrl
        ? window.iwThemeData.privacyPolicyUrl
        : '/privacy-policy/';

    if (!popup) {
        return;
    }

    const body = document.body;
    const dialog = popup.querySelector('.contact-popup__dialog');
    const closeTriggers = popup.querySelectorAll('[data-contact-popup-close]');
    const successBox = popup.querySelector('.contact-popup__success');
    const popupForm = popup.querySelector('.contact-popup__form');
    const subjectInput = popup.querySelector('input[name="your-subject"]');
    const messageInput = popup.querySelector('textarea[name="your-message"]');
    const acceptanceText = popup.querySelector('.wpcf7-acceptance .wpcf7-list-item-label');
    const openSelectors = [
        'a[href="#contact-popup"]',
        'a[href$="#contact-popup"]'
    ];
    let closeTimer = null;

    const phoneSelectors = [
        'input[name="your-phone"]',
        'input[name^="number-"]'
    ];

    const phoneInputs = popup.querySelectorAll(phoneSelectors.join(','));

    const formatPhoneValue = (input) => {
        if (!input) {
            return;
        }

        let digits = input.value.replace(/\D/g, '');

        if (!digits.length) {
            input.value = '';
            return;
        }

        if (digits[0] === '8') {
            digits = '7' + digits.slice(1);
        } else if (digits[0] !== '7') {
            digits = '7' + digits;
        }

        digits = digits.slice(0, 11);

        let formatted = '+7';

        if (digits.length > 1) {
            formatted += ' (' + digits.slice(1, 4);
        }

        if (digits.length >= 4) {
            formatted += ') ' + digits.slice(4, 7);
        }

        if (digits.length >= 7) {
            formatted += '-' + digits.slice(7, 9);
        }

        if (digits.length >= 9) {
            formatted += '-' + digits.slice(9, 11);
        }

        input.value = formatted;
    };

    phoneInputs.forEach((input) => {
        input.setAttribute('inputmode', 'tel');
        input.setAttribute('maxlength', '18');
        input.setAttribute('placeholder', '+7 (___) ___-__-__');

        input.addEventListener('focus', () => {
            if (!input.value.trim()) {
                input.value = '+7';
            }
        });

        input.addEventListener('input', () => {
            formatPhoneValue(input);
        });

        input.addEventListener('paste', () => {
            setTimeout(() => formatPhoneValue(input), 0);
        });

        input.addEventListener('blur', () => {
            if (input.value === '+7') {
                input.value = '';
            }
        });
    });

    if (subjectInput && !subjectInput.value.trim()) {
        subjectInput.value = 'Заявка с формы обратной связи';
    }

    if (messageInput && !messageInput.value.trim()) {
        messageInput.value = 'Клиент ожидает обратной связи.';
    }

    if (acceptanceText) {
        acceptanceText.innerHTML = `Даю согласие на <a href="${privacyPolicyUrl}">обработку персональных данных</a>`;
    }

    const resetSuccessState = () => {
        if (successBox) {
            successBox.textContent = '';
            successBox.classList.remove('is-visible');
        }

        if (popupForm) {
            popupForm.classList.remove('is-hidden');
        }

        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
    };

    const openPopup = () => {
        resetSuccessState();
        popup.classList.add('is-open');
        popup.setAttribute('aria-hidden', 'false');
        body.classList.add('contact-popup-open');
    };

    const closePopup = () => {
        resetSuccessState();
        popup.classList.remove('is-open');
        popup.setAttribute('aria-hidden', 'true');
        body.classList.remove('contact-popup-open');
    };

    document.querySelectorAll(openSelectors.join(',')).forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            openPopup();
        });
    });

    closeTriggers.forEach((trigger) => {
        trigger.addEventListener('click', closePopup);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && popup.classList.contains('is-open')) {
            closePopup();
        }
    });

    if (dialog) {
        dialog.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    document.addEventListener('wpcf7mailsent', (event) => {
        if (!popup.contains(event.target)) {
            return;
        }

        if (popupForm) {
            popupForm.classList.add('is-hidden');
        }

        if (successBox) {
            successBox.textContent = 'Спасибо! Ваша заявка успешно отправлена. Мы скоро свяжемся с вами.';
            successBox.classList.add('is-visible');
        }

        closeTimer = setTimeout(() => {
            closePopup();
        }, 2500);
    });
});

function setCursorPosition(pos, elem) {
    elem.focus();
    if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
        let range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    };
};

function mask(event) {
    let matrix = '+7 (___) ___-__-__',
        i = 0,
        def = matrix.replace(/\D/g, ''),
        val = this.value.replace(/\D/g, '');
    if (def.length >= val.length) val = def;
    this.value = matrix.replace(/./g, function(a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a
    });
    if (event.type == 'blur') {
        if (this.value.length == 2) this.value = ''
    } else setCursorPosition(this.value.length, this);
};
//ss('#phone').forEach(item => {
//    var maskOptions = {
//        mask: '+7 (000) 000-00-00',
//        lazy: false
//    }
//    var mask = new IMask(item, maskOptions);
//});

