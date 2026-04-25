---
description: Quy trình triển khai và chạy automation test trên CI GitHub Actions (Không bao gồm bước sinh script)
---

# 🚀 Quy trình Triển khai & Chạy Test CI

Workflow này hướng dẫn bạn cách cấu hình và tự động hóa việc chạy các kịch bản automation đã có trên GitHub Actions CI để đảm bảo tính ổn định của hệ thống.

## 🛠 Bước 1: Khởi tạo File Cấu hình GitHub Actions

Nếu dự án chưa có file CI, hãy yêu cầu Agent tạo file workflow tại đường dẫn `.github/workflows/playwright_ci.yml` với nội dung sau:

```yaml
name: Playwright Turbo CI

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 18
    - name: Install dependencies
      working-directory: ./automation-suite
      run: npm ci || npm install
    - name: Install Playwright & Browsers
      working-directory: ./automation-suite
      run: npx playwright install --with-deps chromium
    - name: Run Playwright Tests
      working-directory: ./automation-suite
      run: npx playwright test --project=chromium
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: automation-suite/playwright-report/
        retention-days: 7
```

## 🛠 Bước 2: Đẩy Code và Kích hoạt CI

1. **Commit & Push:** Đảm bảo tất cả các file script (`.spec.ts`) và Page Objects đã được push lên nhánh `main` hoặc `master`.
2. **Kiểm tra Tab Actions:** Truy cập vào repository trên GitHub, chọn tab **Actions** để theo dõi quá trình chạy test tự động.
3. **Chạy thủ công:** Bạn có thể sử dụng tính năng **Workflow Dispatch** để chạy test bất cứ lúc nào mà không cần push code mới.

## 🛠 Bước 3: Xem Báo cáo (Artifacts)

Sau khi CI hoàn thành, bạn có thể tải file `playwright-report` từ phần **Artifacts** của mỗi lần chạy (Run) để xem chi tiết kết quả test (Success/Failure, Screenshots, Videos).

---
**💡 Mẹo:** Để tối ưu tốc độ trên CI, hãy đảm bảo các test case đã được tối ưu bằng **Turbo Mode Prompt** trước khi triển khai.
