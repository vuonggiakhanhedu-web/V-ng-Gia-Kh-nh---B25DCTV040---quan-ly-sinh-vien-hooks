import React, { useState } from 'react';

export default function ApiConfigModal({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  onResetDefault,
}) {
  const [urlInput, setUrlInput] = useState(currentUrl);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUrl(urlInput.trim());
    onClose();
  };

  const handleReset = () => {
    onResetDefault();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚙️ Cấu hình MockAPI URL</h3>
          <button className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="modal-description">
              Bạn có thể nhập URL MockAPI cá nhân của bạn (tạo từ{' '}
              <a href="https://mockapi.io" target="_blank" rel="noreferrer">
                mockapi.io
              </a>
              ) để thực hiện lưu trữ trực tuyến:
            </p>

            <div className="form-group">
              <label htmlFor="mockapiUrl">Đường dẫn MockAPI Endpoint:</label>
              <input
                id="mockapiUrl"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://65xxxxxx.mockapi.io/api/v1/students"
                required
              />
            </div>

            <div className="modal-tips">
              💡 <strong>Lưu ý:</strong> API cần hỗ trợ các phương thức GET, POST, DELETE cho đối tượng sinh viên gồm: <code>name</code>, <code>email</code>, <code>major</code>, <code>gpa</code>.
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
            >
              Dùng API mẫu mặc định
            </button>
            <div className="modal-action-right">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
              >
                Hủy
              </button>
              <button type="submit" className="btn-save">
                Lưu cấu hình
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
