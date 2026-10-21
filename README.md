# Quản Lý Sinh Viên (React Hooks)

> **Học phần:** Lập trình Web (LTW) - Học viện Công nghệ Bưu chính Viễn thông (PTIT / RIPT)  
> **Bài 9:** Function Component & React Hooks (Mã lớp: RIPT1306-20261-07)

---

## 📌 Yêu Cầu Đề Bài & Mức Độ Đáp Ứng

| Yêu cầu đề bài | Cách triển khai trong dự án | Trạng thái |
| :--- | :--- | :---: |
| **1. Viết lại bài Buổi 8 bằng Hooks** | 100% không còn Class Component. Chuyển đổi toàn bộ sang Function Component kết hợp `useState`, `useEffect`, `useRef`. | ✅ Hoàn thành |
| **2. Dữ liệu lấy từ MockAPI qua `useFetch`** | Viết custom hook `useFetch(url)` theo slide 33, quản lý đủ 3 trạng thái: `loading` (đang tải), `error` (báo lỗi), `data` (dữ liệu thành công). | ✅ Hoàn thành |
| **3. Thêm ThemeContext sáng/tối** | Triển khai `ThemeContext` & `ThemeProvider` theo slide 32, lưu cấu hình vào `localStorage`, có nút chuyển đổi giao diện sáng/tối tức thì. | ✅ Hoàn thành |
| **4. Các tính năng mở rộng từ Buổi 8** | Controlled form với validation đầy đủ (Họ tên ≥ 3 ký tự, Email đúng định dạng, GPA từ 0.0 đến 4.0), tìm kiếm sinh viên với kỹ thuật debounce (slide 29), xác nhận trước khi xóa (`window.confirm`). | ✅ Hoàn thành |

---

## 🏗️ Cấu Trúc Thư Mục Dự Án

```
d:/THHH/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Tiêu đề, số lượng sinh viên, nút đổi Theme & cấu hình API
│   │   ├── StudentForm.jsx      # Form thêm sinh viên (Controlled component, validate, useRef focus)
│   │   ├── StudentSearch.jsx    # Ô tìm kiếm (áp dụng debounce useEffect 350ms) & bộ lọc ngành
│   │   ├── StudentList.jsx      # Bảng danh sách sinh viên (3 trạng thái loading, error, empty/data)
│   │   └── ApiConfigModal.jsx   # Hộp thoại cho phép dán MockAPI URL riêng
│   ├── context/
│   │   └── ThemeContext.jsx     # Context chia sẻ theme sáng / tối toàn ứng dụng
│   ├── hooks/
│   │   └── useFetch.js          # Custom Hook gọi API với loading, error, data, refetch
│   ├── App.jsx                  # Component gốc kết nối logic, gọi useFetch, POST & DELETE
│   ├── App.css                  # CSS cho toàn bộ giao diện và components
│   ├── index.css                # Biến CSS (CSS Variables) cho Dark Mode / Light Mode
│   └── main.jsx                 # Bọc App bên trong <ThemeProvider>
├── vite.config.js               # Cấu hình Vite & Mock API REST Server tích hợp
├── package.json
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Chạy máy chủ phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại địa chỉ hiển thị (thường là `http://localhost:5173`).

---

## 🌐 Hướng Dẫn Kết Nối MockAPI Cá Nhân (mockapi.io)

Mặc định dự án đã tích hợp sẵn một REST API endpoint cục bộ tại `/api/v1/students`. Để dùng link [mockapi.io](https://mockapi.io) cá nhân của bạn:

1. Đăng nhập vào [mockapi.io](https://mockapi.io), tạo project mới và tạo resource `students` với các trường:
   - `id`: (tự sinh)
   - `name`: String
   - `email`: String
   - `major`: String
   - `gpa`: Number / String
2. Sao chép Endpoint (ví dụ: `https://67xxxxxx.mockapi.io/api/v1/students`).
3. Trên giao diện ứng dụng, bấm nút **⚙️ Cấu hình API** ở góc phải thanh tiêu đề.
4. Dán đường dẫn vào ô và bấm **Lưu cấu hình**. Dữ liệu sẽ lập tức được tải trực tiếp từ MockAPI của bạn!

---

## 🧠 So Sánh Class Component (Buổi 8) vs Function Component + Hooks (Buổi 9)

| Tiêu chí | Class Component (Buổi 8) | Function Component + Hooks (Buổi 9) |
| :--- | :--- | :--- |
| **Cú pháp** | Dùng `class`, `constructor`, kế thừa `Component`, hàm `render()` | Hàm JavaScript thuần trả về trực tiếp JSX |
| **Quản lý State** | `this.state` và `this.setState` (tự động gộp shallow merge) | `useState()` độc lập, linh hoạt |
| **Từ khóa `this`** | Phải bind `this` hoặc dùng arrow function, rất dễ gặp lỗi `undefined` | Hoàn toàn không cần dùng `this` |
| **Vòng đời & Side Effects** | Bị chia cắt ở `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` | Gom gọn theo từng tính năng nhờ `useEffect` (kèm cleanup function) |
| **Tái sử dụng logic** | Phức tạp, phải dùng HOC (Higher-Order Components) hoặc Render Props | Cực kỳ đơn giản bằng **Custom Hook** (ví dụ: `useFetch`) |
| **Chia sẻ dữ liệu** | `Context.Consumer` rườm rà | `useContext(ThemeContext)` ngắn gọn, trực quan |
