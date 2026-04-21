---
description: Quy trình sinh script siêu tốc (Turbo Mode) và triển khai lên CI GitHub Actions
---

# 🚀 Quy trình Sinh Script Turbo & Triển khai CI

Workflow này hướng dẫn bạn cách kết hợp sức mạnh của AI (Sub-browser Agent) để sinh code automation tốc độ cao và tự động hóa việc chạy test trên CI.

## 🛠 Bước 1: Sinh Script Turbo bằng Sub-browser Agent

1. Mở file `prompt_templates/prompt_10_turbo_mode.txt` và sao chép nội dung.
2. Mở file `test_case.md` để lấy nội dung kịch bản cần thực thi.
3. Gửi yêu cầu cho Agent trong khung chat theo cấu trúc:
   > "Hãy sử dụng **Sub-browser Agent** để thực hiện kịch bản trong `test_case.md` theo hướng dẫn của `prompt_10_turbo_mode.txt`. Sau khi hoàn thành, hãy cập nhật code Playwright vào file `automation-suite/tests/hybrid_turbo.spec.ts`."
4. **Agent sẽ:**
   - Tự động mở trình duyệt con.
   - Thao tác trực tiếp trên giao diện để verify các bước.
   - Tự động sinh code Playwright tối ưu (Turbo Mode) vào file spec.

---
**💡 Mẹo:** Bước này giúp bạn có được kịch bản test đã được AI xác thực trực tiếp trên giao diện, đảm bảo độ tin cậy cao của locator trước khi sử dụng.
