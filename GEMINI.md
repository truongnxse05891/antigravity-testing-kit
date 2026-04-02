# GEMINI AI - GLOBAL AUTOMATION AGENT RULES

> **Scope:** Áp dụng cho mọi tác vụ Test Automation do Gemini (Antigravity) hoạt động trong dự án này.
> **Mục tiêu:** Sinh ra test scripts hiệu quả, ổn định – dễ debug – dễ scale – CI friendly.

## 1. Ngôn Ngữ & Giao Tiếp

- Luôn giao tiếp, giải thích ý tưởng và báo cáo bằng **Tiếng Việt**.
- Diễn giải **ngắn gọn, rõ ràng, dễ hiểu**.
- Tránh suy đoán lập trình hoặc giải thích mơ hồ về lỗi mà cần có căn cứ trực tiếp.

## 2. Quy Trình Làm Việc (Workflow)

- **Recon (Điều tra):** Luôn inspect giao diện thực tế hoặc DOM/HTML/XML trước khi viết automation. Tuyệt đối KHÔNG ĐOÁN locator.
- **Implementation:** Giữ vững mô hình **Page Object Model (POM)**. Phân tách rõ Page objects, Test execution và Utils/Test data.
- **Execution & Self-fix:** Chạy test ngay sau khi code xong. Nếu test FAIL → tự đọc log → phân tích root cause → sửa code → chạy lại → đến khi PASS ổn định. Chỉ hỏi User khi gặp business rule mâu thuẫn.
- **Cleanup:** Gỡ bỏ debug logs, code thừa, locator không dùng trước khi deliver.

## 3. Tech Stack Hỗ Trợ

| Loại | Công nghệ |
|------|-----------|
| Ngôn ngữ | Java, TypeScript |
| Web Automation | Playwright (TS/Java), Selenium WebDriver (Java) |
| Mobile Automation | Appium (Java) |
| API Automation | REST Assured |
| Test Framework | TestNG, Playwright Test |
| Build Tool | Maven, npm |

## 4. Tham Chiếu Rules Chi Tiết

Agent phải tham chiếu quy tắc chi tiết trong `.agent/rules/`:

- [Quy tắc chung Automation](.agent/rules/automation_rules.md) — POM, Test Data, Naming, Assertions
- [Chiến lược chọn Locator](.agent/rules/locator_strategy.md) — Thứ tự ưu tiên locator
- [Quy tắc Playwright](.agent/rules/playwright_rules.md) — Browser setup, locator semantic, wait strategy
- [Quy tắc Selenium](.agent/rules/selenium_rules.md) — WebDriverWait, TestNG structure
- [Quy tắc Appium](.agent/rules/appium_rules.md) — Mobile locator, scroll, permission

## 5. Tham Chiếu Skills

Agent sử dụng skills trong `.agent/skills/` tùy theo nhiệm vụ:

| Skill | Vai trò |
|-------|---------|
| `qa_automation_engineer` | Master skill cho automation — điều phối toàn bộ quy trình |
| `rbt_manual_testing` | Master skill cho manual testing — quy trình AI-RBT 6 bước |
| `requirements_analyzer` | Phân tích requirements từ website/tài liệu |
| `ui_debug_agent` | Inspect UI/DOM, thu thập locators |
| `smart_locator_agent` | Sinh locator mới ổn định |
| `locator_healer_agent` | Sửa locator hỏng |
| `test_data_generator` | Sinh test data unique, traceable |
| `flaky_test_analyzer` | Phân tích và khắc phục flaky tests |

## 6. Kế Hoạch Kiểm Thử (Plan Templates)

Các bộ prompt template sẵn dùng trong `plan/`:

- **`plan/manual/`** — Quy trình 6 bước sinh Manual Test Cases (AI-RBT)
  - Xem `plan/manual/QUICK_START.md` để bắt đầu nhanh
  - Workflow: `/generate_manual_testcases_rbt`

- **`plan/automation/`** — Quy trình 6 bước sinh Automation Scripts
  - Xem `plan/automation/QUICK_START.md` để bắt đầu nhanh
  - One-click: Copy `plan/automation/prompt_automation.txt`
  - Workflow: `/generate_automation_from_testcases`
