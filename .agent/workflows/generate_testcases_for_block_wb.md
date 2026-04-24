---
description: Sinh Test Cases cho Web Builder Block từ Source Code bằng cách phân tích logic code và trích xuất thành Markdown.
skills:
  - generate-test-cases-for-block-wb
---

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`generate-test-cases-for-block-wb`** (tại `.agent/skills/generate-test-cases-for-block-wb/SKILL.md`) trước khi bắt đầu thực hiện tác vụ này.

# Workflow: Sinh Test Cases cho Web Builder Block từ Source Code

Workflow này sử dụng skill `generate-test-cases-for-block-wb` để báo cho AI biết cách đọc mã code của các khối Web Builder (ví dụ: `BreadCrumb.tsx`) và sinh ra bộ test cases RBT có bao hàm các luồng config content, design, rules. 

> [!NOTE]
> Workflow này dành cho bot Antigravity khi dùng qua lệnh (slash command). 
> Nếu khách hàng/QA/QC muốn dùng ChatGPT/Claude để tự làm bằng tay thì họ có thể sử dụng Prompt tại thư mục `prompt_templates/prompt_13_generate_testcases_for_block_wb.txt`.

## ⚠️ Nguyên tắc thực thi

- **Đọc toàn bộ file**: Bắt buộc đọc file gốc (Block file) và các resources (import utils/hooks/constants/types) quan trọng của nó nếu có rẽ nhánh logic phức tạp.
- **Tuân thủ Format Markdown**: Các test case phải xuất đúng chuẩn Bảng 9 cột của QAs (TC ID, Module, Risk Level, Test Title, Pre-Condition, Test Steps, Expected Result, Priority, Test Data), có kèm theo Bảng tóm tắt Risk Assessment.
- **Lưu file test.md**: Toàn bộ nội dung xuất test cases sẽ lưu vào `/home/ocg/sbase-ai/antigravity-testing-kit/test_cases/sc_test_cases_[tên_block].md` (với prefix `sc_` đại diện cho Source Code).

## Các bước thực hiện

Quy trình chi tiết:

### Bước 1: Tiếp nhận code & Quét dữ liệu
1. User cung cấp tên block cần test hoặc đường dẫn file `.tsx`, `.vue` (ví dụ: `/storefront/src/components/builder/blocks/BreadCrumb.tsx`).
2. AI tự động đọc file component.
3. Nếu component import nhiều dependencies nội bộ quyết định đến logic hiển thị hay rẽ nhánh config (ví dụ constants, configs), AI cũng phải đọc các file phụ thuộc đó để có context.

### Bước 2: Phân tích & Trích xuất (Logic Analytics)
1. Nhận diện các Prop Input (config, settings, designs).
2. Nhận diện các Conditional Rendering (Hiển thị UI theo Device Mobile/Desktop, theo Preview/Storefront).
3. Nhận diện Business Behavior (Click, Input, Scroll, postMessage).

### Bước 3: Lên khung Risk Assessment
1. Phân nhóm rủi ro (Module M1, M2, M3,...).
2. Viết bảng Tổng hợp Risk Level + Số Test Cases tương ứng.

### Bước 4: Khởi tạo dữ liệu Test
1. Tạo kịch bản Test chi tiết theo từng module.
2. Các step phải ghi rõ cụ thể ("Bật toggle Hide Homepage") dựa trên mã code thật. Không mơ hồ.

### Bước 5: Lưu kết quả
1. Gọi tool lưu file `.md` vào `/home/ocg/sbase-ai/antigravity-testing-kit/test_cases/`.
2. Trình bày tổng thể thành quả cho User.
