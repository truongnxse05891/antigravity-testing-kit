---
description: Sinh manual test cases từ bản thiết kế Figma thông qua Figma MCP (Shift-Left Testing)
---

# Workflow: Generate Test Cases from Figma

Workflow này kết hợp **Figma MCP** và kỹ năng **RBT Manual Testing** để tự động phân tích bản thiết kế (Mockup/UI Design) và sinh ra các kịch bản kiểm thử (Test Cases) ngay cả khi ứng dụng chưa được lập trình. Đây là phương pháp cốt lõi để thực hiện **Shift-Left Testing**.

## 🔄 Trình Tự Thực Thi Bắt Buộc

Khi User gọi workflow này, Agent phải thực hiện tuần tự các bước sau:

### Bước 1: Trích xuất Dữ liệu Thiết kế (Figma MCP)
- Dùng công cụ của Figma MCP (ví dụ: `figma_get_file`, `figma_get_node`...) để đọc trực tiếp nội dung từ URL hoặc File Key do User cung cấp.
- **Dữ liệu cần thu thập:** 
  - Các phần tử tương tác: Buttons, Inputs, Checkboxes, Dropdowns.
  - Các trạng thái UI: Hover, Active, Disabled, Error states.
  - Text, Placeholder, cấu trúc Layout, và tên của các Layer/Components.

### Bước 2: Phân tích Yêu Cầu (Requirements Extraction)
- Dịch các thành phần UI vừa lấy được thành Yêu cầu chức năng (Functional) và Yêu cầu giao diện (Non-functional/Visual).
- *Ví dụ: "Form có input email và nút Submit bị disabled ban đầu" -> Yêu cầu: "Nút Submit chỉ được enable khi input email hợp lệ".*

### Bước 3: Sinh Test Cases (Áp dụng `rbt_manual_testing`)
- Sử dụng format của `rbt_manual_testing` (QUICK mode) để viết Test Cases.
- **Phạm vi cover bắt buộc:**
  - **UI/Visual Testing:** Kiểm tra text, layout, trạng thái component theo chuẩn Figma.
  - **Functional Testing:** Kịch bản thao tác dự kiến của người dùng.

### Bước 4: Đề xuất Locator (Locator Strategy Blueprint)
- Từ tên của các Layer hoặc Component trong Figma (ví dụ: "Login Modal / Submit Button").
- Sinh ra danh sách khuyến nghị các thuộc tính `data-testid` (ví dụ: `data-testid="login-modal-submit-btn"`).
- Mục đích: Yêu cầu Developer gắn ngay các ID này vào code thực tế, giúp quá trình viết Automation Test sau này dễ dàng và ổn định (tránh Flaky).

---

## 🚀 Cách Sử Dụng
Người dùng gọi lệnh sau trong chat:
`/generate_testcases_from_figma [Figma_URL_hoặc_Node_ID]`
