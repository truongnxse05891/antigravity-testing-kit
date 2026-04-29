---
description: Quy trình sinh script siêu tốc (Turbo Mode) và triển khai viết automation Playwright script
---

# 🚀 Quy trình Sinh Script Turbo & Triển khai CI

Workflow này hướng dẫn bạn cách kết hợp sức mạnh của AI (Sub-browser Agent) để sinh code automation tốc độ cao và tự động hóa việc chạy test trên CI.

## 🛠 Bước 1: Sinh Script Tùy Biến bằng Sub-browser Agent

Quy trình này cho phép bạn sử dụng bất kỳ Prompt và Test Case nào để sinh script tự động.

1. **Chuẩn bị đầu vào:** 
   - Chọn một file Prompt tùy ý (ví dụ trong thư mục `prompt_templates/`).
   - Chọn một file kịch bản Test Case (định dạng `.md` hoặc `.txt`).
2. **Gửi yêu cầu linh hoạt cho Agent:**
   Sử dụng cấu trúc câu lệnh sau để Agent tự động xử lý:
   > "Hãy dùng **Sub-browser Agent** thực hiện kịch bản trong `[TÊN_FILE_TEST_CASE]` theo chỉ dẫn của `[TÊN_FILE_PROMPT]`. 
   > 
   > Sau khi hoàn thành, hãy viết code Playwright vào thư mục `automation-suite/tests/` với tên file là `[tên_test_case].spec.ts`."

3. **Cơ chế hoạt động của Agent:**
   - **Phân tích UI:** Agent mở trình duyệt con để thực hiện từng bước trong kịch bản bạn cung cấp.
   - **Tùy biến Output:** Agent sẽ tự động lấy tên file Test Case của bạn để đặt tên cho file spec (Ví dụ: `requirements_checkout.md` ➔ `automation-suite/tests/requirements_checkout.spec.ts`).
   - **Đảm bảo cấu trúc:** Code sẽ luôn tuân thủ mô hình POM và các Rule đã định nghĩa trong dự án.

---
**💡 Mẹo:** Bạn có thể yêu cầu Agent sửa đổi code cho một module cụ thể bằng cách cung cấp thêm các file Page Object liên quan trong câu lệnh để AI có thêm ngữ cảnh.