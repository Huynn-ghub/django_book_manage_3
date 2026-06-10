# Django Book Manage API (Bài tập)

Ứng dụng quản lý sách các chức năng phân trang, bộ lọc tùy chỉnh và xác thực công khai.

## Cài đặt & Chạy dự án
1. Cài đặt thư viện: `pip install -r requirements.txt`
2. Cấu hình database trong tệp `.env` (copy từ `.env.example`).
3. Chạy lệnh migrate: `python manage.py migrate`
4. Chạy server: `python manage.py runserver`

## Các API chính
* **Danh sách sách (Phân trang & Lọc)**: `GET /api/books/`
  * Phân trang: `?page_size=20` (mặc định 20, tối đa 100).
  * Bộ lọc: `?title=...`, `?author=...`, `?min_price=...&max_price=...`, `?min_quantity=...&max_quantity=...`.
* **Thêm sách**: `POST /api/books/`
* **Chi tiết sách**: `GET /api/books/<id>/`
* **Sửa sách**: `PUT/PATCH /api/books/<id>/`
* **Xóa sách**: `DELETE /api/books/<id>/`