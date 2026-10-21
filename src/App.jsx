import React, { useState, useMemo } from 'react';
import { useTheme } from './context/ThemeContext';
import useFetch from './hooks/useFetch';
import Header from './components/Header';
import StudentForm from './components/StudentForm';
import StudentSearch from './components/StudentSearch';
import StudentList from './components/StudentList';
import ApiConfigModal from './components/ApiConfigModal';
import './App.css';

const DEFAULT_API_URL = '/api/v1/students';

export default function App() {
  const { theme } = useTheme();

  // URL API MockAPI (lưu trong localStorage để nhớ khi tải lại trang)
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('student_api_url') || DEFAULT_API_URL;
  });

  // Gọi Custom Hook useFetch theo yêu cầu slide Buổi 9
  const { data: students, setData: setStudents, loading, error, refetch } = useFetch(apiUrl);

  // Quản lý trạng thái tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('ALL');

  // Trạng thái modal và thông báo
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  // Hàm hiển thị thông báo tạm thời
  const showAlert = (message, type = 'success') => {
    setAlertInfo({ message, type });
    setTimeout(() => {
      setAlertInfo(null);
    }, 4000);
  };

  // 1. Thêm sinh viên (Gửi POST tới API)
  const handleAddStudent = async (studentData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error(`Thêm thất bại: HTTP ${response.status}`);
      }

      const createdStudent = await response.json();
      
      // Cập nhật state danh sách theo đúng chuẩn React (tạo mảng mới với spread)
      setStudents((prev) => [...prev, createdStudent]);
      showAlert(`Đã thêm thành công sinh viên "${studentData.name}"!`, 'success');
      return true;
    } catch (err) {
      console.error('Lỗi khi thêm sinh viên:', err);
      // Nếu API từ xa lỗi hoặc mất mạng, ta vẫn hỗ trợ thêm tạm vào state local
      const fallbackStudent = {
        ...studentData,
        id: String(Date.now()),
      };
      setStudents((prev) => [...prev, fallbackStudent]);
      showAlert(`Không kết nối được server, đã lưu tạm vào bộ nhớ (${err.message})`, 'warning');
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Xóa sinh viên (Gửi DELETE tới API)
  const handleRemoveStudent = async (id) => {
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.warn('API xóa trả về mã:', response.status);
      }

      // Luôn loại bỏ khỏi state giao diện
      setStudents((prev) => prev.filter((s) => String(s.id) !== String(id)));
      showAlert('Đã xóa sinh viên khỏi danh sách!', 'info');
    } catch (err) {
      console.error('Lỗi khi xóa sinh viên:', err);
      setStudents((prev) => prev.filter((s) => String(s.id) !== String(id)));
      showAlert('Đã xóa khỏi giao diện cục bộ (Lỗi kết nối API server)', 'warning');
    }
  };

  // 3. Cập nhật URL MockAPI
  const handleSaveApiUrl = (newUrl) => {
    setApiUrl(newUrl);
    localStorage.setItem('student_api_url', newUrl);
    showAlert(`Đã cập nhật API: ${newUrl}`, 'info');
  };

  const handleResetDefaultApi = () => {
    setApiUrl(DEFAULT_API_URL);
    localStorage.removeItem('student_api_url');
    showAlert('Đã chuyển về MockAPI mặc định cục bộ!', 'info');
  };

  // 4. Lọc danh sách sinh viên theo từ khóa tìm kiếm và ngành
  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];

    return students.filter((sv) => {
      const matchSearch =
        !searchTerm ||
        sv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sv.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMajor = selectedMajor === 'ALL' || sv.major === selectedMajor;

      return matchSearch && matchMajor;
    });
  }, [students, searchTerm, selectedMajor]);

  return (
    <div className={`app-container theme-${theme}`}>
      <Header
        totalCount={students?.length || 0}
        onOpenApiConfig={() => setIsApiModalOpen(true)}
      />

      <main className="main-content">
        {alertInfo && (
          <div className={`alert-toast alert-${alertInfo.type}`}>
            <span>{alertInfo.message}</span>
            <button onClick={() => setAlertInfo(null)} className="alert-close">
              ✕
            </button>
          </div>
        )}

        <div className="current-api-bar">
          <span className="api-label">📡 Nguồn dữ liệu (MockAPI):</span>
          <code className="api-url">{apiUrl}</code>
          <button className="btn-refresh" onClick={refetch} title="Tải lại dữ liệu">
            🔄 Làm mới
          </button>
        </div>

        <div className="layout-grid">
          <section className="form-column">
            <StudentForm
              onAdd={handleAddStudent}
              isSubmitting={isSubmitting}
            />
          </section>

          <section className="list-column">
            <StudentSearch
              onSearchChange={setSearchTerm}
              onFilterMajorChange={setSelectedMajor}
              selectedMajor={selectedMajor}
            />

            <StudentList
              students={filteredStudents}
              loading={loading}
              error={error}
              onRemove={handleRemoveStudent}
              onRetry={refetch}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Bài tập LTW số 9 · Áp dụng Function Component, useState, useEffect, useContext, useRef, Custom Hook useFetch
        </p>
      </footer>

      <ApiConfigModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        currentUrl={apiUrl}
        onSaveUrl={handleSaveApiUrl}
        onResetDefault={handleResetDefaultApi}
      />
    </div>
  );
}
