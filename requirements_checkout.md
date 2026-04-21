# Tài liệu Đặc tả Yêu cầu - Module: Checkout Page

## 1. Tổng quan
Tài liệu mô tả chi tiết yêu cầu nghiệp vụ và các thành phần giao diện cho trang Checkout của hệ thống ShopBase. Trang này cho phép người dùng nhập thông tin liên hệ, địa chỉ nhận hàng và phương thức thanh toán để hoàn tất quá trình đặt hàng.
Đường dẫn khảo sát: https://plb-importreview-prod.onshopbase.com/checkouts/bcb34a99877c4ffe8f31dc7f907ad857

## 2. Yêu cầu chức năng
- Chức năng điền thông tin đơn hàng và thanh toán:
  - Mô tả: Là một người mua hàng, tôi muốn điền thông tin liên lạc, địa chỉ giao hàng và tài khoản thanh toán để có thể đặt hàng thành công.
  - Tiêu chí chấp nhận:
    + Hệ thống cho phép người dùng điền đầy đủ các thông tin cá nhân cơ bản và địa chỉ cư trú.
    + Hệ thống nhận diện các trường bắt buộc và từ chối xử lý, kèm thông báo lỗi cụ thể nếu thông tin bị thiếu hoặc sai định dạng.
    + Thống kê phí vận chuyển, thuế và tổng tiền được cập nhật rõ ràng ở phần bên phải màn hình.
    + Hệ thống xử lý thông tin thẻ và điều hướng sang trang hoàn tất mua hàng khi gọi thanh toán thành công.

## 3. Quy tắc trường dữ liệu

| Tên trường (Label/Placeholder) | Loại (UI Type) | Bắt buộc | Mặc định | Báo lỗi thao tác (Validation Message/Notes) |
| --- | --- | --- | --- | --- |
| Email | Text / Email input | Có | Trống | Please enter an email. (Kiểm tra đúng định dạng email chuẩn) |
| Keep me up to date on news and exclusive offers | Checkbox | Không | Không chọn | Ghi danh nhận tin thông báo. Nằm trong phần Contact Information. |
| First name (optional) | Text input | Không | Trống | Cho phép bỏ trống. Nằm trong khu vực Shipping address. |
| Last name | Text input | Có | Trống | Please enter a last name. |
| Address | Text input | Có | Trống | Please enter an address. |
| Apartment, suite, etc. (optional) | Text input | Không | Trống | Cho phép bỏ trống. Bổ sung chi tiết địa chỉ. |
| Company name (optional) | Text input | Không | Trống | Cho phép bỏ trống. |
| Zip Code | Text input | Có | Trống | Please enter a zip. |
| City | Text input | Có | Trống | Please enter a city. |
| Country | Select dropdown | Có | United States | Cung cấp danh sách các quốc gia hỗ trợ giao hàng. |
| State | Select dropdown | Có | Trống | Please select a state / province. |
| Phone number (optional) | Tel input | Không | Trống | Please enter a valid phone number. (Chỉ báo lỗi nếu nhập sai định dạng sđt) |
| Also used for Billing address | Checkbox | Không | Đã chọn (Checked) | Sử dụng luôn địa chỉ giao hàng làm địa chỉ thanh toán thẻ. |
| Tùy chọn: Debit or Credit cards | Radio button | Có | Đã chọn | Invalid card number. Please re-check and try again. You also try again with another card. (Hiển thị form nhập thẻ) |
| Payment field: Card number | Text / Iframe | Có | Trống | Chỉ báo lỗi khi nhấn thanh toán với dữ liệu rỗng hoặc sai chuẩn luhn thẻ. |
| Payment field: MM/YY | Text / Iframe | Có | Trống | Kiểm tra tháng năm hạn thẻ hợp lệ. |
| Payment field: CVV | Text / Iframe | Có | Trống | Thường có 3-4 ký tự số. |
| Tùy chọn: PayPal | Radio button | Có | Không chọn | Điều hướng qua cổng PayPal. |
| Tùy chọn: Afterpay | Radio button | Có | Không chọn | Trả góp theo Afterpay. |
| Tùy chọn: Klarna | Radio button | Có | Không chọn | Mua trước trả sau với Klarna. |
| Discount code | Text input | Không | Trống | Nơi điền mã giảm giá. |

## 4. Luồng xử lý
- Luồng 1: Ràng buộc vị trí địa lý (Country - State):
  Khi người dùng thay đổi lựa chọn trong danh sách Country, danh sách xổ xuống của mục State (hoặc Province) sẽ lập tức làm mới để hiển thị các vùng trực thuộc quốc gia vừa chọn.
- Luồng 2: Xác thực dữ liệu khi nhấn dặt hàng:
  - Hành động: Người dùng nhấn nút 'Place your order' khi các thông tin bắt buộc chưa được điền.
  - Kết quả: Hệ thống chặn tiến trình thanh toán, viền đỏ những trường thiếu thông tin và điền dòng thông báo đỏ ngay phía dưới tương ứng (Vd: Please enter a city, Please enter a zip). Đồng thời hiển thị báo lỗi thanh toán tổng quát phía trên phần thẻ tín dụng.
- Luồng 3: Áp dụng mã giảm giá gốc:
  Trường hợp điền mã giảm giá vào ổ 'Discount code' và nhấn nút Apply, hệ thống sẽ kết nối đến máy chủ để xác minh mã. Lỗi sai mã sẽ hiển thị thông báo ngay phía dưới input box.
- Luồng 4: Tách rời địa chỉ thẻ thanh toán:
  Nếu người dùng bỏ chọn hộp kiểm 'Also used for Billing address', một khung lưới nhập thông tin tương tự khu vực Shipping address sẽ được thả xuống ngay bên dưới để phục vụ khách điền địa chỉ riêng để ngân hàng đối soát.
- Luồng 5: Thay đổi kênh thanh toán:
  Việc bấm lựa chọn vào các Radio payment (như PayPal hay Klarna) sẽ ẩn form điền thông tin Credit Card đi, đồng thời mở rộng khung để giải thích hoặc báo điều hướng ngoài.
