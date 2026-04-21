# Tài liệu Đặc tả Yêu cầu - Module: Platform Ecommerce (Quản lý Sản phẩm)

## 1. Tổng quan
Tài liệu mô tả chi tiết yêu cầu nghiệp vụ và các thành phần giao diện cho phân hệ Quản lý sản phẩm (Products) của hệ thống quản trị nội dung. Trang này cho phép quản trị viên xem danh sách các sản phẩm đang có, tìm kiếm, lọc và quan trọng nhất là chức năng thiết lập thông tin để tạo mới một sản phẩm.
Đường dẫn khảo sát: https://cc-dev.mixc.co/shopbase/products/?

## 2. Yêu cầu chức năng
- Chức năng Liệt kê và Quản lý:
  - Mô tả: Là một quản trị viên, tôi muốn xem danh sách các sản phẩm dưới dạng bảng để dễ dàng kiểm soát và chọn lọc.
  - Tiêu chí chấp nhận:
    + Cung cấp công cụ tìm kiếm sản phẩm theo tên (Search product).
    + Có các bộ lọc nâng cao (Filters) như lọc theo Category, Brand.
    + Cho phép thao tác xuất/nhập tệp (Export/Import file) và nút Add product.
- Chức năng Tạo mới sản phẩm:
  - Mô tả: Là quản trị viên, tôi muốn bấm Add product để nhập thông tin nhằm lưu trữ một sản phẩm mới lên gian hàng.
  - Tiêu chí chấp nhận:
    + Giao diện tạo mới cần tổ chức thành nhiểu thẻ luồng thông tin (Thông tin cơ bản, Phương tiện truyền thông, Tổ chức, Vận chuyển, Giá, Kho hàng).
    + Tính năng kéo thả ảnh tiện lợi ở mục tải lên phương tiện.
    + Xác thực các trường dữ liệu quan trọng như Tên sản phẩm, không cho lưu nếu bỏ trống.

## 3. Quy tắc trường dữ liệu tại Giao diện Tạo sản phẩm

| Tên trường (Label/Placeholder) | Loại (UI Type) | Bắt buộc | Mặc định | Báo lỗi thao tác (Validation Message/Notes) |
| --- | --- | --- | --- | --- |
| Title | Text input | Có | Trống | Báo viền đỏ và từ chối lưu khi gửi form rỗng. Lời nhắc placeholder: Enter product title. |
| Hide product name when printing | Checkbox | Không | Không chọn | Dùng cấu hình tùy chọn không in tên. |
| SKU (Stock keeping unit) | Text input | Không | Trống | Lời nhắc: Enter product sku. Cấu hình tự động sinh SKU nếu bị bỏ trống. |
| Description | Rich Text Editor | Không | Trống | Hỗ trợ soạn thảo nâng cao với các thẻ gắn link, in nghiêng, in đậm, danh sách,... |
| Media / Drag your images here | File upload | Không | Trống | Ràng buộc kích thước file tối đa 2MB. Hỗ trợ thao tác kéo thả hoặc Add image from URL. |
| Category | Select dropdown | Không | Select category | Danh sách các danh mục hàng hóa từ hệ thống. |
| Brand | Datalist / Combobox | Không | Search or add new brand | Cho phép tìm kiếm hoặc thêm thương hiệu mới. |
| Weight | Number input | Không | 0 | Đơn vị mặc định là kg. Thuộc mục Shipping. |
| Price | Number input | Có | Trống | Đơn vị tiền tệ (đ). Yêu cầu nhập giá bán. |
| Cost price | Number input | Không | Trống | Đơn vị tiền tệ. Dùng cho mục đích sổ sách. |
| Track inventory | Checkbox | Không | Không chọn | Thuộc mục Inventory. Nút gạt kịch bản kho hàng. |
| Quantity | Number input | Có (nếu thao tác kho) | Trống | Chỉ hiển thị nếu chọn Track inventory. |
| Continue selling when out of stock | Checkbox | Không | Không chọn | Chỉ hiển thị nếu chọn Track inventory. Cho phép mua quá định lượng. |

## 4. Luồng xử lý
- Luồng 1: Xử lý tìm kiếm và bộ lọc tại danh sách:
  - Trang Products ban đầu hiển thị dạng bảng (hoặc báo No products added yet). Quản trị viên nhập từ khóa vào ô tìm kiếm hoặc chọn qua danh mục (Category) hay nhãn hiệu (Brand), hệ thống sẽ làm mới dữ liệu để hiển thị kết quả tương ứng.
- Luồng 2: Xác thực thông tin khởi tạo:
  - Khi thao tác tại màn hình Create Product, nếu quản trị viên nhấn Save product mà cố tình bỏ qua trường Title, hệ thống sẽ chặn tiến trình, không tạo mã gọi API và viền đỏ trường Title yêu cầu bổ sung.
- Luồng 3: Tự động mã hóa định danh:
  - Trường hợp quản trị viên không quan tâm mã SKU, hệ thống sẽ thực thi quy trình nền, chạy khối chức năng sinh mã độc bản (unique identifier) ngay sau khi tiếp nhận lưu thành công toàn bộ form.
- Luồng 4: Tương tác động ở quản lý kho hàng:
  - Khi hộp kiểm Track inventory chưa được tích, khu vực quản lý kho bị ẩn. Khi người dùng đánh dấu chọn vào hộp kiểm này, hệ thống sử dụng thuật toán kết xuất DOM để gọi ngay ra hai trường thành phần điều khiển là Quantity và lựa chọn Continue selling when out of stock. Sự xuất hiện động này không cần tải lại trang.
