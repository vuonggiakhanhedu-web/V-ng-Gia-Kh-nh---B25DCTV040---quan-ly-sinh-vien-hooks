import React, { createContext, useState, useEffect, useContext } from 'react';

// Tạo Context cho Theme (sáng / tối)
export const ThemeContext = createContext({
  theme: 'light',
  toggle: () => {},
});

export function ThemeProvider({ children }) {
  // Khởi tạo state từ localStorage nếu đã lưu, mặc định là 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app_theme');
    return savedTheme ? savedTheme : 'light';
  });

  // Hàm chuyển đổi giữa sáng và tối
  const toggle = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Đồng bộ theme lên thuộc tính HTML và lưu localStorage khi theme thay đổi
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook tiện ích để dùng ThemeContext
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong ThemeProvider');
  }
  return context;
}
