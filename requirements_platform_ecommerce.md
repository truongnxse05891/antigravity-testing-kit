# Tài liệu Đặc tả Yêu cầu - Module: Platform Ecommerce (Đăng nhập và Tổng quan)

## 1. Tổng quan
Tài liệu mô tả chi tiết yêu cầu nghiệp vụ và giao diện cho phân hệ Đăng nhập và Màn hình tổng quan (Dashboard) của nền tảng quản lý Ecommerce (Giao diện chuẩn Saleor). Phân hệ này là cửa ngõ để quản trị viên truy cập vào không gian làm việc và xem thông số cửa hàng.
Đường dẫn khảo sát: https://cc-dev.mixc.co/

## 2. Yêu cầu chức năng
- Chức năng Đăng nhập hệ thống:
  - Mô tả: Là một quản trị viên, tôi muốn điền email và mật khẩu để đăng nhập vào trang quản trị nhằm quản lý dữ liệu bán hàng và thông số cửa hàng.
  - Tiêu chí chấp nhận:
    + Giao diện cung cấp biểu mẫu nhập thông tin chuẩn xác và biểu tượng hỗ trợ đi kèm thiết kế tinh gọn.
    + Có khả năng nhận diện trường trống và từ chối yêu cầu gửi nếu định dạng email sai chuẩn.
    + Nếu dữ liệu cung cấp không trùng khớp với cơ sở dữ liệu hệ thống (sai email hoặc mật khẩu), hệ thống phải từ chối đăng nhập và thông báo lỗi.
    + Cấp quyền đăng nhập thành công nếu tài khoản hợp lệ, tự động chuyển hướng sang giao diện tổng quan các nghiệp vụ.

## 3. Quy tắc trường dữ liệu

| Tên trường (Label/Placeholder) | Loại (UI Type) | Bắt buộc | Mặc định | Báo lỗi thao tác (Validation Message/Notes) |
| --- | --- | --- | --- | --- |
| Email address | Text / Email input | Có | Trống | Please fill out this field (khi để trống). Bắt trình duyệt báo lỗi định dạng nếu văn bản thiếu ký tự còng. |
| Password | Password input | Có | Trống | Please fill out this field (khi để trống). Có đính kèm một biểu tượng hình con mắt ở bên phải để hỗ trợ hiển thị hoặc ẩn mật khẩu lúc thao tác nhập. |
| Sign up | Link URL | Không | N/A | Liên kết chuyển hướng người dùng sang giao diện quy trình tạo tài khoản. |
| Forgot password? | Link URL | Không | N/A | Link chuyển hướng sang trang điền thư điện tử để thiết lập lại mật khẩu. |
| Sign In | Nút bấm (Button) | N/A | N/A | Nút gửi biểu mẫu dữ liệu đăng nhập cơ bản lên máy chủ. Nếu thông tin tài khoản khai báo sai lệch, hệ thống sẽ hiện hộp đỏ kèm thông báo lỗi: Your username and/or password are incorrect. Please try again. |

## 4. Luồng xử lý
- Luồng 1: Ràng buộc phía Client (Client-side validation):
  - Người dùng bấm nút Sign In trong trường hợp chưa nhập đủ dữ liệu vào cả hai ô hoặc cung cấp email sai cấu trúc (thiếu dấu còng), hệ thống tự động chặn gửi và gọi thông báo tooltip cảnh báo ngay tại vị trí ô nhập liệu tương ứng.
- Luồng 2: Xác thực bảo mật máy chủ (Server-side authorization):
  - Quản trị viên nhập dữ liệu vào cả hai ô đúng định dạng nhưng gõ lệch mật khẩu, hệ thống kết nối máy chủ và ngay sau đó gọi xuống một thông báo nền đỏ phía trên khung biểu mẫu nhằm thông báo tài khoản sai, tránh thất thoát thông tin.
- Luồng 3: Đăng nhập thành công và tiếp cận tài nguyên:
  - Hành động: Quản trị viên sử dụng đúng bộ tài khoản hệ thống cho phép (như admin@gmail.com kèm mật khẩu admin123456) rồi kích hoạt đăng nhập.
  - Kết quả: Hệ thống duyệt phiên làm việc và gọi URL điều hướng trực tiếp sang trang cấu hình quản lý. Tại màn hình Dashboard mới xuất hiện, hệ thống bày ra thanh điều hướng bên trái cung cấp menu quản lý (Orders, Products, Customers, v.v) cùng các biểu đồ đồ thị thống kê tại khoảng không gian trắng chính. Mọi thao tác quản lý mới sẽ được kích hoạt từ luồng này.
