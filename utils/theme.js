// Theme management functionality
class ThemeManager {
  constructor() {
    this.darkClass = 'dark-theme';
    this.initializeTheme();
  }

  initializeTheme() {
    const style = document.createElement('style');
    style.textContent = `
      .dark-theme {
        filter: invert(90%) hue-rotate(180deg);
      }
      .dark-theme img {
        filter: invert(100%) hue-rotate(180deg);
      }
    `;
    document.head.appendChild(style);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add(this.darkClass);
    }
  }

  toggle() {
    const body = document.body;
    const isDark = body.classList.contains(this.darkClass);
    
    if (isDark) {
      body.classList.remove(this.darkClass);
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add(this.darkClass);
      localStorage.setItem('theme', 'dark');
    }
  }
}

window.themeManager = new ThemeManager();