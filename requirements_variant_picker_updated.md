# Tài liệu Yêu cầu Cập nhật (Updated Acceptance Criteria)
## Tính năng: Block Variant Picker 

*Tài liệu này đã được gộp từ Requirement gốc và bổ sung các nghiệp vụ hiển thị/tương tác bị miss (phát hiện từ việc rà soát bộ Test Case cũ).*

---

### 1. Storefront Interactions (Luồng tương tác của Buyer) ⚠️ *Phần được bổ sung*
- **Đồng bộ Dữ liệu Sản phẩm (Real-time Sync):** Khi người mua chọn vào một Option ở block Variant Picker (nhấn vào màu hoặc bấm dropdown), nền tảng phải đồng bộ:
  - Cập nhật **Product Image Gallery** chạy tới đúng bức ảnh của biến thể đó.
  - Cập nhật số tiền ở **Block Product Price** thành giá tiền tương ứng của biến thể đó.
- **Trạng thái UI "Hết Hàng / Sold Out":** Nếu variant hết hàng (Inventory = 0) hoặc một tổ hợp Option chéo không tồn tại trong Admin, giao diện của cục Button Variant/Dropdown đó phải biểu hiện rõ ràng trạng thái vô hiệu hóa (Gạch chéo / Làm mờ / Disabled), đồng thời nút `Add to cart` và `Buy now` chuyển sang không thể ấn (Disabled).
- **Validation Form (Xử lý lỗi):** Nếu user cố tình chưa chọn đủ các Required options (VD: chọn màu mà chưa chọn Size) nhưng vẫn bấm "Add to Cart", hệ thống phải có cơ chế hiển thị tin nhắn Error (VD: *"Please select Size"*).

### 2. Editor & Builder Configurations (Cấu hình Block trên Dashboard)
- **Insert & Auto-map:** Block có thể được kéo vào từ insert panel. Nó chỉ nhận nguồn là biến số `Product variant`. Nếu trang/section đang lấy nguồn từ 1 Product đặc thù, block sẽ tự động map với list options của product đó.
- **Thứ tự (Ordering):** Tuân thủ tuyệt đối thứ tự trên bảng Admin Product Detail.
- **Personalization Button:** Nếu tính năng Personalization preview trên Dashboard được bật VÀ sản phẩm đó có dùng Custom option, thì dưới cụm variant phải đẻ ra nút `Preview your design`.
- **Thiết lập Styles (Tab Design):** 
  - Đổi màu nhãn tuỳ chọn (`Option label color`).
  - **Tùy biến Text/Font (Typography):** Cho phép Merchant chỉnh sửa linh hoạt Font size, Font family, Style của text hiển thị trong Block ⚠️ *(Phần được bổ sung)*.
  - Chuyển đổi Layout (`Dropdown` list hoặc `Button` UI).
  - Tích chọn Preview: Ưu tiên `Color preview` (load mã màu) trước `Image preview` (chuẩn bị ảnh cho từng option, chỉ load ảnh khi setting này được bật đúng).
  - Thanh trượt chỉnh `Spacing` giữa các options lớn, và giữa các value của cùng 1 option với nhau.
  - Có thể config các thông số Block chuẩn: width, background, radius, opacity, shadow, border, padding, margin.
  - **Default Design:** Khi vừa Add 1 block vào trong trang mới trống, Block Variant Picker phải mang theo thông số Padding/Margin mặc định chuẩn Figma của đội Design ⚠️ *(Phần được bổ sung)*.
- **Sizing Bounds:** Chỉ có thể resize Width, không được vỡ Minimum-Width mặc định. Chiều dọc Height bắt buộc sử dụng chế độ "Auto hug content" (Tự co giãn tuỳ theo lượng option value bên trong).

### 3. Logic Size Chart (Phân luồng đa nền tảng)
Block Variant Picker là nơi đính kèm nút "Size Chart". Logic hiển thị tùy theo định chế từng nền tảng:
- **ShopBase (SB):** Size chart chỉ xuất hiện **khi và chỉ khi** sản phẩm có option cụ thể tên là `Size` + Merchant đã Enable size chart. Không có option `Size` = Không hiển thị.
- **PrintBase (PB):** Nguồn kéo từ Hive-pbase. Chỉ cần Cấu hình bật hiển thị (config PB) thì nút Size chart sẽ luôn hiện ra dù sản phẩm có hay không có Option mang tiêu đề đính chữ "Size" đi chăng nữa. Click vào mở Modal ra. Phải có công tắc convert qua lại Unit: `inch <-> cm`.
- **PlusBase (PLB):** Nguồn kéo từ Shop template. Cơ chế ngặt nghèo tương đối giống PB: Dựa theo config tuỳ nền option được set, không bắt buộc tên option làm key. Chỉ cần config được Enable là show. Có nút tính toán `inch <-> cm`.

### 4. Custom Option Upload Logic
- Đi qua store hệ in ấn **PrintBase / PrintHub:** Khi bấm upload qua Variant Picker -> Phải mở Popup bắt chẹt user CROP IMAGE vì thiết kế POD có tỷ lệ in ấn (Ratio).
- Đi qua store thuần **ShopBase:** Mọi upload từ form đi thẳng lên máy chủ, bỏ qua và không mở Popup Crop image.

---
*End of Document*
