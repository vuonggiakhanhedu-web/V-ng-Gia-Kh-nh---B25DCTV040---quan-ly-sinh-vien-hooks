import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Mock API plugin cung cấp endpoint RESTful mô phỏng mockapi.io
 * Phục vụ chạy thử nghiệm lập tức mà không cần mạng hoặc tài khoản mockapi.io
 */
function mockApiPlugin() {
  let students = [
    { id: '1', name: 'Nguyễn Văn An', email: 'an.nv@ptit.edu.vn', major: 'CNTT', gpa: '3.65' },
    { id: '2', name: 'Trần Thị Bình', email: 'binh.tt@ptit.edu.vn', major: 'ATTT', gpa: '3.40' },
    { id: '3', name: 'Lê Văn Cường', email: 'cuong.lv@ptit.edu.vn', major: 'CNTT', gpa: '2.85' },
    { id: '4', name: 'Phạm Minh Đức', email: 'duc.pm@ptit.edu.vn', major: 'DTVT', gpa: '3.75' },
    { id: '5', name: 'Hoàng Mai Hương', email: 'huong.hm@ptit.edu.vn', major: 'QTKD', gpa: '3.10' },
  ];

  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');

        // GET & POST /api/v1/students
        if (url.pathname === '/api/v1/students') {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(students));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const newSv = JSON.parse(body);
                newSv.id = String(Date.now());
                students.push(newSv);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 201;
                return res.end(JSON.stringify(newSv));
              } catch {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Dữ liệu không hợp lệ' }));
              }
            });
            return;
          }
        }

        // DELETE /api/v1/students/:id
        if (url.pathname.startsWith('/api/v1/students/') && req.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          const existed = students.some((s) => String(s.id) === String(id));
          if (existed) {
            students = students.filter((s) => String(s.id) !== String(id));
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true, id }));
          } else {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Không tìm thấy sinh viên' }));
          }
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
});
