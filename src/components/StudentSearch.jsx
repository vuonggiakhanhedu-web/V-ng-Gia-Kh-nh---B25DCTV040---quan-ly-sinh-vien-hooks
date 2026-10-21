import React, { useState, useEffect } from 'react';

export default function StudentSearch({ onSearchChange, onFilterMajorChange, selectedMajor }) {
  const [keyword, setKeyword] = useState('');

  // Kỹ thuật debounce với useEffect theo đúng slide 29 Buổi 9
  // Chờ 350ms sau khi người dùng ngừng gõ mới thực hiện tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(keyword.trim());
    }, 350);

    // Dọn dẹp timer khi người dùng gõ tiếp
    return () => clearTimeout(timer);
  }, [keyword, onSearchChange]);

  return (
    <div className="search-filter-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm sinh viên theo tên hoặc email..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button 
            type="button" 
            className="btn-clear-search" 
            onClick={() => setKeyword('')}
            title="Xóa tìm kiếm"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-wrapper">
        <label htmlFor="filter-major">Lọc ngành:</label>
        <select
          id="filter-major"
          value={selectedMajor}
          onChange={(e) => onFilterMajorChange(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">Tất cả ngành</option>
          <option value="CNTT">CNTT</option>
          <option value="ATTT">ATTT</option>
          <option value="DTVT">DTVT</option>
          <option value="HTTT">HTTT</option>
          <option value="KHMT">KHMT</option>
          <option value="QTKD">QTKD</option>
        </select>
      </div>
    </div>
  );
}
