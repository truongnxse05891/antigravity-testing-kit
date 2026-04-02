# 📋 Hướng Dẫn Nhanh: Sử Dụng AI-RBT 6 Bước

## Workflow & Prompt cho từng bước

| Bước | Tên | Prompt gửi Antigravity | Chờ User? |
|------|-----|------------------------|-----------|
| **1** | Context & Role-play | Copy `plan/manual/01.../prompt.txt` + điền `[...]` | ✅ Chờ xác nhận |
| **2** | Analysis & QnA | Copy `plan/manual/02.../prompt.txt` | ✅ **Chờ trả lời Q&A** |
| **3** | Decomposition | Copy `plan/manual/03.../prompt.txt` | Review nhanh |
| **4** | Traceability | Copy `plan/manual/04.../prompt.txt` | ✅ **Chờ review scenarios** |
| **5** | RBT & TC Generation | Copy `plan/manual/05.../prompt.txt` | Review kết quả |
| **6** | Template Mapping | Copy `plan/manual/06.../prompt.txt` | Copy bảng → Excel |

---

## Cách Sử Dụng

### Luồng thực hiện:

```
[Bước 1] Gửi prompt + tài liệu requirements
    ↓  AI xác nhận hiểu → User xác nhận OK
[Bước 2] Gửi prompt phân tích
    ↓  AI đặt câu hỏi → ⏸️ User trả lời từng câu
[Bước 3] Gửi prompt phân rã
    ↓  AI sinh Module list → User review nhanh
[Bước 4] Gửi prompt traceability
    ↓  AI sinh scenarios → ⏸️ User review + bổ sung
[Bước 5] Gửi prompt sinh TC
    ↓  AI sinh test cases chi tiết → User review
[Bước 6] Gửi prompt chuẩn hóa
    ↓  AI sinh bảng Markdown → Copy vào Excel/Jira ✅
```

### Prompt nhanh cho mỗi bước:

**Bước 1 (bắt đầu):**
```
/generate_manual_testcases_rbt

Dự án: [Tên dự án]
Tính năng: [Tên tính năng]
Mục tiêu: [Mô tả ngắn]

[Dán requirements/user stories vào đây]
```

**Bước 2 → 6 (tiếp tục):**
```
Tiếp tục sang Bước [X]: [Tên bước]
[Hoặc copy nội dung prompt.txt tương ứng]
```

---

## Mẹo Tối Ưu

1. **Bước 2 là quan trọng nhất** — Đừng vội, trả lời kỹ từng câu hỏi AI đặt ra
2. **Chia module khi nhiều** — Ở Bước 5, nếu có >5 modules, yêu cầu AI sinh từng module
3. **Review trước khi format** — Ở Bước 5, review test cases trước khi sang Bước 6
4. **Dùng cùng conversation** — Chạy tất cả 6 bước trong **cùng 1 conversation** để AI giữ context
