---
name: generate-test-cases-for-block-wb
description: Guide to analyze source code of components and blocks to generate test cases for Web Builder.
---

# Generate Test Cases Guide

## 🎯 Goal
Hướng dẫn tự động hóa quá trình phân tích và đọc source code (React/Qwik/Vue) của các component/block trong repository, từ đó hiểu nghiệp vụ và sinh ra Test Cases chi tiết định dạng Markdown, phục vụ mục đích test hệ thống (VD: ShopBase Web Builder) theo phương pháp Risk-Based Testing (RBT).

## 📊 0️⃣ Bước 0: Process Flow (BẮT BUỘC)
Trước khi output ra test cases, AI cần thực hiện các bước sau:

1. **Nhận Đường Dẫn Code**:
   - Dựa vào yêu cầu của User (VD: "Generate test case cho `storefront/src/components/builder/blocks/BreadCrumb.tsx`").
2. **Đọc và Khảo Sát File Gốc & File Liên Quan**:
   - Dùng tool `view_file` hoặc tương đương để lấy nội dung file chính.
   - Quét qua các phần tử import quan trọng (types, configs, utils, hooks) và dùng `view_file` đọc chúng để nắm toàn bộ bối cảnh (Context). Cụ thể như xem prop `config` truyền vào có những thuộc tính `settings` hoặc `designs` nào.
3. **Phân Tích Logic Bóc Tách Theo Các Hướng**:
   - **Content & Design Settings:** Các thuộc tính hiển thị (VD: Hide/Show element, Dropdown Types, Alignment, Colors, Background). Tìm trong code các đoạn gán class, inline styles, và các conditional rendering.
   - **Business Rules & Routing:** Phân tích các hàm tạo link, xác định logic rẽ nhánh cho từng loại Page (VD: Home page, Checkout page, Product Detail page).
   - **Interaction & Behaviors:** Phân tích các event listener (VD: `onClick$`, `onScroll$`), check sự khác biệt về behavior giữa lúc Preview trong Web Builder (`isPreview = true`) so với môi trường thực tế Storefront.
4. **Phân Loại Risk (Risk Assessment)**:
   - Phân tích và nhóm các rủi ro theo từng module của Block (VD: M1 - Insert Block; M2 - Content Settings; M3 - Design Settings; M4 - Display Rules; ...).
   - Đánh giá từng module thuộc High, Medium hay Low risk.
5. **Tiến Hành Generate Xuyên Suốt**:
   - AI chỉ tiến hành tạo Test Case sau khi đã đọc và hiểu đầy đủ luồng đi của code. Cấm tự động đoán testcase mà thiếu bằng chứng từ mã nguồn.

## 📝 1️⃣ Cấu Trúc Output Test Case
- **Lưu file test.md**: Toàn bộ nội dung xuất test cases sẽ lưu vào `/home/ocg/sbase-ai/antigravity-testing-kit/test_cases/sc_test_cases_[tên_block].md` (với prefix `sc_` đại diện cho Source Code).

Hãy chia nhỏ file bằng định dạng chuẩn:

### Headers
```md
# Test Cases — Block [Tên Block]

> **Dự án:** [Tên Dự án, VD: ShopBase Web Builder]
> **Module:** Block [Tên Block]
> **Phương pháp:** AI-RBT (Risk-Based Testing) - Source Code Analysis
> **Skill:** generate-test-cases-for-block-wb
> **Ngày tạo:** YYYY-MM-DD
```

### Risk Assessment Thống Kê
Tạo 1 bảng Tóm tắt Risk Assessment:
```md
| Module | Risk Level | Lý do | Số TC |
|--------|-----------|-------|-------|
| M1: Tên Module | High/Medium/Low | Yếu tố logic, nghiệp vụ nằm ở đây... | Tổng TC |
```

### Chi Tiết Bảng Test Case Theo Module
Mỗi phần sẽ là một title của module (`### M1: Tên Module`), đi kèm theo là một Markdown Table theo đúng 9 cột dưới đây:

```md
### M1: Tên Module

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|-----------|------------|---------------|------------|-----------------|----------|-----------|
| TC_001 | M1 - Tên | Medium | [Title tóm tắt] | Điều kiện ban đầu | 1. Bước 1<br>2. Bước 2 | 1. Expect 1<br>2. Expect 2 | High | Dữ liệu mẫu |
```

**Lưu ý khi tạo bước (Test Steps) & kết quả đợi (Expected Result):**
- Ánh xạ rõ từ code. Nếu code có check `config.settings.hide_home_page`, test step nên ghi rõ Bật/Tắt toggle "Hide Home page" và Expectation phải nêu rõ "Page Home bị ẩn / hiển thị phụ thuộc vào toggle".
- Cần có TC kiểm tra các giá trị Default (được khởi tạo trong file hoặc state).
- Nêu rõ các hành vi ở Preview Web Builder và Storefront trong test.

## ✅ Verification Checklist 
- [ ] Đã quét 100% các file phụ thuộc (import liên quan đến state, UI, API).
- [ ] Logic routing, hiển thị khác nhau giữa các loại Pages đã bao phủ.
- [ ] Thuộc tính style/design (config.designs) đã có TC đối ứ́ng.
- [ ] Các actions click/hover đã được bao quát đầy đủ.
- [ ] Toàn bộ Output đúng theo chuẩn Bảng TC (9 cột) của QA.
