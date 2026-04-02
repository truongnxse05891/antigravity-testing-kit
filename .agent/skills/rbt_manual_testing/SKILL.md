---
name: RBT Manual Testing
description: Skill hướng dẫn agent thực hiện quy trình AI-RBT (AI-Driven Risk-Based Testing) 6 bước để sinh manual test cases chất lượng cao từ requirements.
---

# RBT Manual Testing

## Description

Skill này cung cấp framework **AI-RBT (AI-Driven Risk-Based Testing)** — quy trình 6 bước tuần tự để agent chuyển đổi tài liệu yêu cầu (Requirements, User Stories, Figma) thành bộ Manual Test Cases chất lượng cao, có đánh giá rủi ro, sẵn sàng import vào Jira/TestRail/Excel.

**Nguyên tắc cốt lõi:**
- **Human Strategy:** Con người xác định chiến lược, mức độ rủi ro và tiêu chuẩn
- **AI Execution:** AI thực hiện phân tích, viết TCs và rà soát lỗ hổng
- **Human Verification:** Con người kiểm tra lại kết quả trước khi chốt

---

## When to Use

Sử dụng skill này khi:

- Sinh manual test cases từ requirements / user stories
- Phân tích requirements để phát hiện ambiguity
- Phân rã hệ thống thành modules / features
- Xây dựng traceability matrix
- Áp dụng Risk-Based Testing (đánh giá rủi ro cho test cases)
- Chuẩn hóa test cases sang bảng Markdown (Jira/Excel format)

**KHÔNG** sử dụng skill này khi:

- Cần sinh automation code → dùng `qa_automation_engineer`
- Cần inspect DOM / sinh locator → dùng `ui_debug_agent` / `smart_locator_agent`
- Chỉ cần sinh test data → dùng `test_data_generator`

---

## Quy Trình AI-RBT: 6 Bước Tuần Tự

> ⚠️ **QUAN TRỌNG:** Quy trình này **BẮT BUỘC chạy tuần tự** từng bước. KHÔNG được gộp nhiều bước chạy 1 lần. Mỗi bước phải hoàn thành và được user xác nhận trước khi sang bước tiếp.

### Bước 1: Context & Role-play (Khởi tạo ngữ cảnh)

**Mục đích:** Thiết lập vai trò Senior QA Engineer và nạp bối cảnh dự án.

**Agent phải:**
1. Đọc prompt template tại `plan/manual/01_context_and_roleplay/prompt.txt`
2. Yêu cầu user cung cấp:
   - Tên dự án / tính năng
   - Mô tả hệ thống hiện tại
   - Mục tiêu kiểm thử MVP
   - Tài liệu yêu cầu (Requirements, User Stories, Figma link, PDF...)
3. Đọc kỹ tài liệu và xác nhận đã hiểu bối cảnh
4. **Chờ user xác nhận** trước khi sang Bước 2

**Output:** Xác nhận hiểu bối cảnh + tóm tắt scope kiểm thử.

---

### Bước 2: Analysis & QnA (Phân tích yêu cầu)

**Mục đích:** Phân tích tài liệu để phát hiện điểm mờ, thiếu sót, mâu thuẫn.

**Agent phải:**
1. Đọc prompt template tại `plan/manual/02_analysis_and_qna/prompt.txt`
2. Xác định các luồng:
   - Happy Path (luồng chính)
   - Alternate Paths (luồng rẽ nhánh)
   - Exception Paths (luồng ngoại lệ)
3. Phát hiện Ambiguities:
   - Yêu cầu thiếu sót (không quy định độ dài textbox, timeout...)
   - Yêu cầu mâu thuẫn
   - Yêu cầu chưa rõ ràng
4. Đặt câu hỏi Q&A có đánh số thứ tự cho user/PO/BA giải đáp
5. **DỪNG LẠI — Chờ user trả lời** các câu hỏi trước khi tiếp tục

**Output:** Danh sách luồng + Ambiguities + Câu hỏi Q&A.

> [!IMPORTANT]
> **Đây là điểm nghẽn quan trọng nhất.** Nếu agent bỏ qua bước này và tự đoán logic, test cases sẽ sai nghiêm trọng. Agent PHẢI dừng lại và đợi user phản hồi.

---

### Bước 3: Decomposition (Phân rã hệ thống)

**Mục đích:** Chia tính năng phức tạp thành các Module / Sub-module nhỏ, dễ quản lý.

**Agent phải:**
1. Đọc prompt template tại `plan/manual/03_decomposition/prompt.txt`
2. Phân rã theo 1 trong 2 cách:
   - **Theo UI:** Header, Data Table, Form popup, Sidebar...
   - **Theo luồng:** Flow tạo mới, Flow chỉnh sửa, Flow xóa...
3. Mô tả ngắn gọn chức năng từng Module
4. Chỉ ra Dependencies giữa các Module

**Output:** Danh sách Modules/Sub-modules + Dependencies.

---

### Bước 4: Traceability (Đảm bảo độ bao phủ)

**Mục đích:** Thiết lập ma trận truy vết để đảm bảo 100% requirements được phủ test scenarios.

**Agent phải:**
1. Đọc prompt template tại `plan/manual/04_traceability/prompt.txt`
2. Map mỗi Module/Rule với mã Yêu cầu (REQ-01, REQ-02...)
3. Cross-check xem có yêu cầu nào bị thiếu trong danh sách phân rã
4. Liệt kê High-Level Test Scenarios cho từng Module, tập trung:
   - Security / phân quyền
   - UI Validation
   - Business Logic
5. **Chờ user review** danh sách scenarios trước khi sinh test case chi tiết

**Output:** Traceability Matrix + High-Level Test Scenarios.

> [!WARNING]
> **Human Checkpoint:** User cần review danh sách scenarios để bổ sung các trường hợp đặc thù mà AI có thể bỏ sót. Đây là bước đánh giá rủi ro do con người thực hiện.

---

### Bước 5: RBT & TC Generation (Sinh Test Case chi tiết)

**Mục đích:** Sinh test cases chi tiết theo chiến lược Risk-Based Testing.

**Agent phải:**
1. Đọc prompt template tại `plan/manual/05_rbt_and_tc_generation/prompt.txt`
2. Đánh giá Risk Level cho mỗi Module:
   - **High Risk:** Test kỹ, nhiều cases (nghiệp vụ quan trọng, liên quan tiền, bảo mật)
   - **Medium Risk:** Test vừa phải
   - **Low Risk:** Test cơ bản, happy path
3. Sinh test case với đầy đủ fields:
   - Module / Sub-module
   - Test Case Title
   - Pre-conditions
   - Test Steps (đánh số)
   - Expected Results (đánh số tương ứng)
   - Test Data (**phải cụ thể**, không dùng placeholder chung chung)
   - Priority
4. Bao phủ đa dạng:
   - Happy Path
   - Negative Path (giá trị biên, vượt ký tự)
   - Edge Cases (timeout, mất kết nối...)
5. Áp dụng **kỹ thuật thiết kế test case** phù hợp:
   - **Equivalence Partitioning:** Chia input thành nhóm tương đương, test đại diện mỗi nhóm
   - **Boundary Value Analysis (BVA):** Test giá trị tại ranh giới (min, min+1, max-1, max)
   - **Decision Table:** Liệt kê tổ hợp điều kiện → kết quả (cho logic nhiều điều kiện)
   - **State Transition:** Test chuyển đổi trạng thái hợp lệ + không hợp lệ (cho workflow)
6. Nếu scenarios quá nhiều → sinh từng Module một, hỏi user để tiếp tục

**Test Data phải cụ thể:**
```
❌ Sai: "Nhập mã số hợp lệ"
✅ Đúng: "Nhập mã: KH-2026-0012"

❌ Sai: "Nhập email hợp lệ"
✅ Đúng: "Nhập email: test_khachhang_01@domain.com"
```

**Output:** Danh sách Test Cases chi tiết có Risk Level.

---

### Bước 6: Template Mapping (Chuẩn hóa Format)

**Mục đích:** Đóng gói test cases thành bảng Markdown chuẩn, sẵn sàng copy sang Excel/Jira.

**Agent phải:**
1. Đọc prompt template tại `plan/manual/06_template_mapping/prompt.txt`
2. Chuẩn hóa toàn bộ test cases vào bảng Markdown:

```
| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
```

3. Quy tắc bảng:
   - TC ID theo format thống nhất (ví dụ: `CRM_CUST_TC_001`)
   - Test Steps và Expected Result đánh số, dùng `<br>` xuống dòng trong cell
   - **TUYỆT ĐỐI không được bỏ sót** bất kỳ test case nào đã sinh ở Bước 5
   - Nếu quá dài → chia thành Part 1, Part 2... và hỏi user để tiếp tục
4. Xuất output dưới dạng Artifact (`test_cases_<module>.md`)

**Output:** Bảng Test Cases Markdown hoàn chỉnh.

---

## Anti-Patterns (NGHIÊM CẤM)

- ❌ Gộp nhiều bước chạy 1 lần (PHẢI tuần tự)
- ❌ Tự đoán business logic khi chưa hỏi user (Bước 2)
- ❌ Bỏ qua bước phân tích Ambiguity
- ❌ Sinh test data chung chung / placeholder
- ❌ Rút gọn hoặc bỏ sót test case khi mapping sang bảng
- ❌ Sinh tất cả test cases 1 lần cho hệ thống lớn (phải chia module)

---

## Prompt Templates

Các prompt template mẫu cho từng bước nằm tại:

```
plan/manual/
├── 01_context_and_roleplay/prompt.txt
├── 02_analysis_and_qna/prompt.txt
├── 03_decomposition/prompt.txt
├── 04_traceability/prompt.txt
├── 05_rbt_and_tc_generation/prompt.txt
└── 06_template_mapping/prompt.txt
```

Agent cần đọc prompt template tương ứng **trước khi** thực hiện mỗi bước.

---

## Output Format

Tùy theo bước, agent xuất ra:

| Bước | Output |
|------|--------|
| 1 | Xác nhận bối cảnh |
| 2 | Luồng + Ambiguities + Câu hỏi Q&A |
| 3 | Module Decomposition + Dependencies |
| 4 | Traceability Matrix + High-Level Scenarios |
| 5 | Test Cases chi tiết (Risk Level + Test Data) |
| 6 | Bảng Markdown chuẩn (Jira/Excel ready) |

Tất cả output phải bằng **Tiếng Việt**, format **Markdown**, sử dụng **Artifact** nếu nội dung dài.
