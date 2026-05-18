const themeToggle = document.querySelector('#changeTheme');

const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

const applyTheme = (isDark) => {
  document.body.classList.toggle(THEMES.DARK, isDark);
  themeToggle.checked = isDark;
  
  localStorage.setItem('StyleTheme', isDark ? THEMES.DARK : THEMES.LIGHT);
};

const savedTheme = localStorage.getItem('StyleTheme');
const isInitiallyDark = savedTheme === THEMES.DARK;
applyTheme(isInitiallyDark);

themeToggle.addEventListener('change', () => {
  applyTheme(themeToggle.checked);
});