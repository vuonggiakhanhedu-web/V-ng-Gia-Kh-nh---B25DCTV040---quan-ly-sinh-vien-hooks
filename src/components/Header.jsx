import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ totalCount, onOpenApiConfig }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon">🎓</div>
        <div>
          <h1 className="header-title">Quản lý sinh viên (Hooks)</h1>
          <p className="header-subtitle">
            Học viện Công nghệ Bưu chính Viễn thông · LTW Bài 9
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="stats-badge">
          Tổng số sinh viên: <strong>{totalCount}</strong>
        </div>

        <button 
          className="btn-api-config" 
          onClick={onOpenApiConfig}
          title="Cấu hình MockAPI URL"
        >
          ⚙️ Cấu hình API
        </button>

        <button
          className="btn-theme-toggle"
          onClick={toggle}
          title={`Chuyển sang chế độ ${theme === 'light' ? 'Tối' : 'Sáng'}`}
        >
          {theme === 'light' ? '🌙 Chế độ Tối' : '☀️ Chế độ Sáng'}
        </button>
      </div>
    </header>
  );
}
