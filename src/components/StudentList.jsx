import React from 'react';

export default function StudentList({
  students,
  loading,
  error,
  onRemove,
  onRetry,
}) {
  // Hàm xếp loại học lực dựa trên GPA hệ 4
  const getGpaBadge = (gpa) => {
    const score = parseFloat(gpa);
    if (isNaN(score)) return null;

    if (score >= 3.6) {
      return <span className="badge badge-excellent">Xuất sắc ({score.toFixed(2)})</span>;
    } else if (score >= 3.2) {
      return <span className="badge badge-good">Giỏi ({score.toFixed(2)})</span>;
    } else if (score >= 2.5) {
      return <span className="badge badge-fair">Khá ({score.toFixed(2)})</span>;
    } else {
      return <span className="badge badge-average">Trung bình ({score.toFixed(2)})</span>;
    }
  };

  // Xác nhận xóa sinh viên theo yêu cầu bài tập Buổi 8
  const handleDelete = (id, name) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa sinh viên "${name}" không?`);
    if (isConfirmed) {
      onRemove(id);
    }
  };

  // 1. Trạng thái Đang tải (Loading) - Tiêu chí slide 41
  if (loading) {
    return (
      <div className="card list-card">
        <div className="status-container loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu từ MockAPI...</p>
        </div>
      </div>
    );
  }

  // 2. Trạng thái Báo lỗi (Error) - Tiêu chí slide 41
  if (error) {
    return (
      <div className="card list-card">
        <div className="status-container error-state">
          <div className="error-icon">⚠️</div>
          <h3>Không thể tải dữ liệu!</h3>
          <p className="error-text">{error}</p>
          {onRetry && (
            <button className="btn-retry" onClick={onRetry}>
              🔄 Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. Trạng thái Danh sách rỗng - Theo slide 40 Buổi 8
  if (!students || students.length === 0) {
    return (
      <div className="card list-card">
        <div className="status-container empty-state">
          <div className="empty-icon">📂</div>
          <p className="empty-message">Chưa có sinh viên nào trong danh sách</p>
        </div>
      </div>
    );
  }

  // 4. Trạng thái Hiển thị danh sách thành công
  return (
    <div className="card list-card">
      <div className="card-header">
        <h2>📋 Danh sách sinh viên ({students.length})</h2>
      </div>

      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>STT</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Ngành</th>
              <th>GPA</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((sv, index) => (
              <tr key={sv.id} className="student-row">
                <td className="cell-center">{index + 1}</td>
                <td className="cell-name">
                  <strong>{sv.name}</strong>
                </td>
                <td className="cell-email">{sv.email}</td>
                <td>
                  <span className={`major-tag major-${sv.major?.toLowerCase()}`}>
                    {sv.major}
                  </span>
                </td>
                <td>{getGpaBadge(sv.gpa)}</td>
                <td className="cell-center">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(sv.id, sv.name)}
                    title="Xóa sinh viên"
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
