---
description: Sinh manual test cases chất lượng cao theo quy trình AI-RBT 6 bước (Risk-Based Testing) từ requirements.
skills:
  - rbt_manual_testing
  - requirements_analyzer
---

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`rbt_manual_testing`** (tại `.agent/skills/rbt_manual_testing/SKILL.md`) trước khi bắt đầu thực hiện tác vụ này. Ngoài ra, tham khảo thêm skill **`requirements_analyzer`** để hiểu cách phân tích giao diện nếu cần.

# Workflow: Sinh Manual Test Cases theo AI-RBT Framework

Workflow này hướng dẫn agent thực hiện quy trình **AI-RBT (AI-Driven Risk-Based Testing)** gồm 6 bước tuần tự để sinh manual test cases từ tài liệu yêu cầu.

## ⚠️ Nguyên tắc thực thi

- **BẮT BUỘC chạy tuần tự** từng bước, KHÔNG gộp nhiều bước.
- **PHẢI dừng lại** chờ user phản hồi tại Bước 2 (Q&A) và Bước 4 (Review Scenarios).
- Nếu user chưa cung cấp requirements, hỏi user cung cấp trước khi bắt đầu.
- Tất cả output bằng **Tiếng Việt**.

## Các bước thực hiện

### Bước 1: Khởi tạo ngữ cảnh (Context & Role-play)
1. Đọc prompt template: `plan/manual/01_context_and_roleplay/prompt.txt`
2. Yêu cầu user cung cấp: tên dự án, mô tả hệ thống, mục tiêu MVP, tài liệu yêu cầu
3. Đọc kỹ tài liệu, xác nhận hiểu bối cảnh
4. **Chờ user xác nhận** → sang Bước 2

### Bước 2: Phân tích yêu cầu (Analysis & QnA)
1. Đọc prompt template: `plan/manual/02_analysis_and_qna/prompt.txt`
2. Xác định Happy Path, Alternate Paths, Exception Paths
3. Phát hiện Ambiguities (thiếu sót, mâu thuẫn, chưa rõ ràng)
4. Đặt câu hỏi Q&A có đánh số cho user/PO/BA
5. **DỪNG LẠI — Chờ user trả lời câu hỏi** → sang Bước 3

### Bước 3: Phân rã hệ thống (Decomposition)
1. Đọc prompt template: `plan/manual/03_decomposition/prompt.txt`
2. Chia tính năng thành Modules / Sub-modules
3. Mô tả chức năng từng Module + Dependencies giữa chúng

### Bước 4: Đảm bảo độ bao phủ (Traceability)
1. Đọc prompt template: `plan/manual/04_traceability/prompt.txt`
2. Map Module → mã Yêu cầu (REQ-01, REQ-02...)
3. Cross-check thiếu sót, liệt kê High-Level Scenarios
4. **Chờ user review** scenarios → sang Bước 5

### Bước 5: Sinh Test Case chi tiết (RBT & TC Generation)
1. Đọc prompt template: `plan/manual/05_rbt_and_tc_generation/prompt.txt`
2. Đánh giá Risk Level (High/Medium/Low) cho mỗi Module
3. Sinh test cases đầy đủ: Title, Pre-condition, Steps, Expected, Test Data, Priority
4. Test Data phải cụ thể (không placeholder chung)
5. Nếu quá nhiều → sinh từng Module, hỏi user để tiếp tục

### Bước 6: Chuẩn hóa Format (Template Mapping)
1. Đọc prompt template: `plan/manual/06_template_mapping/prompt.txt`
2. Đóng gói toàn bộ test cases vào bảng Markdown chuẩn:
   `| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |`
3. Không được bỏ sót test case nào
4. Xuất dưới dạng Artifact nếu dài

## Output

- Bảng Test Cases Markdown hoàn chỉnh, sẵn sàng copy sang Excel/Jira/TestRail
- Traceability Matrix
- Danh sách Ambiguities đã giải quyết
