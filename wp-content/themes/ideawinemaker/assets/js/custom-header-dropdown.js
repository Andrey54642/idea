const socialsLink = document.querySelector('.socials__link');
const socialsDropdown = document.querySelector('.socials__dropdown');

socialsLink.addEventListener('mouseenter', () => {
  socialsDropdown.style.display = 'block';
});

socialsLink.addEventListener('mouseleave', () => {
  socialsDropdown.style.display = 'none';
});