import React, { useState, useRef, useEffect } from 'react';

export default function StudentForm({ onAdd, isSubmitting }) {
  // Quản lý state của Form theo slide 25 Buổi 9
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: 'CNTT',
    gpa: '',
  });

  const [errors, setErrors] = useState({});

  // Dùng useRef để tham chiếu ô Họ tên (focus tự động theo slide 30 Buổi 9)
  const nameInputRef = useRef(null);

  useEffect(() => {
    // Focus vào ô họ tên khi trang vừa tải
    nameInputRef.current?.focus();
  }, []);

  // Xử lý thay đổi dữ liệu trong controlled form (slide 25, 44)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa thông báo lỗi của trường đó khi người dùng đang gõ lại
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Hàm validate form theo slide 37 Buổi 8
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'Họ tên phải có tối thiểu 3 ký tự';
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email không hợp lệ (ví dụ: an@ptit.edu.vn)';
    }

    if (formData.gpa === '' || isNaN(formData.gpa)) {
      newErrors.gpa = 'Điểm GPA không được để trống và phải là số';
    } else {
      const gpaNum = parseFloat(formData.gpa);
      if (gpaNum < 0 || gpaNum > 4.0) {
        newErrors.gpa = 'Điểm GPA phải nằm trong khoảng từ 0.0 đến 4.0';
      }
    }

    return newErrors;
  };

  // Xử lý khi nhấn nút Thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    // Nếu có lỗi thì dừng lại
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const newStudent = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      major: formData.major,
      gpa: parseFloat(formData.gpa).toFixed(2),
    };

    const success = await onAdd(newStudent);

    // Nếu thêm thành công thì reset form và focus lại ô Họ tên
    if (success !== false) {
      setFormData({
        name: '',
        email: '',
        major: 'CNTT',
        gpa: '',
      });
      setErrors({});
      nameInputRef.current?.focus();
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>➕ Thêm sinh viên mới</h2>
      </div>

      <form onSubmit={handleSubmit} className="student-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">
            Họ và tên <span className="required">*</span>
          </label>
          <input
            id="name"
            ref={nameInputRef}
            type="text"
            name="name"
            placeholder="Ví dụ: Nguyễn Văn An"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Ví dụ: an.nv@ptit.edu.vn"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="major">Ngành học</label>
            <select
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
            >
              <option value="CNTT">Công nghệ thông tin (CNTT)</option>
              <option value="ATTT">An toàn thông tin (ATTT)</option>
              <option value="DTVT">Điện tử viễn thông (DTVT)</option>
              <option value="HTTT">Hệ thống thông tin (HTTT)</option>
              <option value="KHMT">Khoa học máy tính (KHMT)</option>
              <option value="QTKD">Quản trị kinh doanh (QTKD)</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label htmlFor="gpa">
              Điểm GPA (thang 4) <span className="required">*</span>
            </label>
            <input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4.0"
              name="gpa"
              placeholder="0.0 - 4.0"
              value={formData.gpa}
              onChange={handleChange}
              className={errors.gpa ? 'input-error' : ''}
            />
            {errors.gpa && <p className="error-message">{errors.gpa}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang thêm...' : 'Thêm sinh viên'}
        </button>
      </form>
    </div>
  );
}
