// components/ThemeSwitcher.js
import React from 'react';

const ThemeSwitcher = ({ theme, toggleTheme }) => {
  return (
    <div className="theme-switcher">
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
};

export default ThemeSwitcher;