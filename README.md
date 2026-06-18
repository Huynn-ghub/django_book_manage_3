# Django Book Manage API (Bài tập)

Ứng dụng quản lý sách tích hợp React Frontend và Django REST Framework Backend, có chức năng phân trang, bộ lọc tùy chỉnh và xác thực JWT.

## Cài đặt & Chạy dự án
1. **Cài đặt thư viện:**
   * Backend: `pip install -r requirements.txt` (trong thư mục `be`)
   * Frontend: `npm install` (trong thư mục `fe`)
2. **Cấu hình database:** Tạo tệp `.env` trong thư mục `be` (copy từ `.env.example`).
3. **Chạy lệnh migrate:** `python manage.py migrate` (trong thư mục `be`)
4. **Chạy backend:** `python manage.py runserver` (trong thư mục `be`)
5. **Chạy frontend:** `npm run dev` (trong thư mục `fe`)

## Các API chính
* **Đăng nhập:** `POST /api/token/`
* **Đăng xuất:** `POST /api/logout/` (vô hiệu hóa refresh token)
* **Danh sách sách (Phân trang & Lọc):** `GET /api/books/`
  * Phân trang: `?page_size=20` (mặc định 20, tối đa 100).
  * Bộ lọc: `?title=...`, `?author=...`, `?min_price=...&max_price=...`, `?min_quantity=...&max_quantity=...`.
* **Thêm sách:** `POST /api/books/` *(Yêu cầu Bearer Token)*
* **Chi tiết sách:** `GET /api/books/<id>/`
* **Sửa sách:** `PUT/PATCH /api/books/<id>/` *(Yêu cầu Bearer Token)*
* **Xóa sách:** `DELETE /api/books/<id>/` *(Yêu cầu Bearer Token)*