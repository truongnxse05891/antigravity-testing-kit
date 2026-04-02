# Antigravity Testing Kit 🚀

👋Chào mừng bạn đến với **Antigravity Testing Kit**!

Đây là bộ Kit được xây dựng và phát triển bởi **Anh Tester**, dành riêng cho **cộng đồng Tester**. Mục tiêu của repo này là cung cấp sẵn các thiết lập, quy tắc hành vi (Rules), kỹ năng (Skills), và quy trình (Workflows) chuẩn theo docs của Antigravity để hỗ trợ sử dụng AI Agent trên phần mềm **Antigravity**.

Thông qua bộ công cụ này, việc triển khai Test Automation với sự hỗ trợ của AI sẽ trở nên dễ dàng, hiệu quả, giữ được tính ổn định và tuân thủ các best practices trong ngành kiểm thử phần mềm.

---

## 🌟 Tính Năng Nổi Bật

- **Tối ưu cho QA/Tester:** Tất cả các prompt, rule và workflow đều được tinh chỉnh dựa trên tư duy và quy trình làm việc thực tế của Automation Engineer.
- **Hỗ trợ Đa Nền Tảng:** Tương thích với các framework phổ biến như Web (Playwright, Selenium), Mobile (Appium), và API (Playwright, REST Assured).
- **Tuân thủ Tiêu Chuẩn Cao (Strict Rules):** Đảm bảo AI luôn đi theo cấu trúc Page Object Model (POM), viết code rõ ràng, không đoán bừa locator và tự động sửa lỗi (Self-fix).
- **Giao Tiếp Bằng Tiếng Việt:** AI được cấu hình để trao đổi, giải thích và báo cáo hoàn toàn bằng Tiếng Việt, thân thiện với người dùng Việt Nam.

---

## 📂 Cấu Trúc Thư Mục Chính

```
antigravity-testing-kit/
├── .agent/
│   ├── rules/           # Quy tắc bắt buộc AI phải tuân theo
│   ├── skills/          # Kỹ năng chuyên biệt cho AI
│   └── workflows/       # Kịch bản thực thi step-by-step (slash commands)
├── plan/
│   ├── manual/          # Quy trình 6 bước sinh Manual Test Cases (AI-RBT)
│   └── automation/      # Quy trình 6 bước sinh Automation Scripts
├── prompt_template/     # Prompt mẫu dùng nhanh (copy → paste → gửi)
├── requirements/        # Lưu trữ requirements đã sinh
├── GEMINI.md            # Rule chung cho AI Agent
└── TIPS_QUOTA.md        # Cẩm nang tối ưu quota token
```

### `.agent/` — Bộ não của AI Agent

| Thư mục | Vai trò |
|---------|--------|
| `rules/` | Quy tắc bắt buộc: POM, locator strategy, smart waits, Playwright/Selenium/Appium rules |
| `skills/` | 8 kỹ năng chuyên biệt: automation engineer, manual testing, UI debug, locator healer, test data generator... |
| `workflows/` | 13 slash commands: `/generate_automation_from_testcases`, `/generate_manual_testcases_rbt`, `/analyze_flaky_tests`... |

---

### `plan/` — Quy Trình 6 Bước Chuyên Sâu

Dành cho các tác vụ phức tạp, cần thực hiện **tuần tự trong cùng 1 conversation**.

| Plan | Mô tả | Bắt đầu nhanh |
|------|-------|---------------|
| `plan/manual/` | Sinh Manual Test Cases theo quy trình **AI-RBT 6 bước** (Risk-Based Testing) | Xem `plan/manual/QUICK_START.md` |
| `plan/automation/` | Sinh Automation Scripts theo **6 bước** từ context → review | Xem `plan/automation/QUICK_START.md` |

**Cách dùng:** Mở `QUICK_START.md` → Làm theo từng bước → Gửi prompt mỗi bước vào Antigravity.

### `prompt_template/` — Prompt Mẫu Dùng Nhanh

Dành cho tác vụ **đơn lẻ**, chỉ cần copy → thay `[...]` bằng dữ liệu thực → paste → gửi.

| # | Prompt | Mục đích |
|---|--------|----------|
| 01 | `prompt_01_generate_requirements.txt` | Phân tích website sinh Requirements |
| 02 | `prompt_02_create_test_cases.txt` | Sinh test cases từ requirements |
| 03 | `prompt_03_create_framework_playwright.txt` | Dựng framework Playwright TS |
| 03 | `prompt_03_create_framework_selenium.txt` | Dựng framework Selenium Java |
| 04 | `prompt_04_create_script_playwright.txt` | Viết test script Playwright TS |
| 04 | `prompt_04_create_script_selenium.txt` | Viết test script Selenium Java |
| 05 | `prompt_05_convert_manual_to_automation.txt` | Chuyển manual TC sang automation |
| 06 | `prompt_06_review_automation_code.txt` | Review code automation |
| 07 | `prompt_07_generate_test_data.txt` | Sinh test data có cấu trúc |
| 08 | `prompt_08_analyze_flaky_tests.txt` | Phân tích test không ổn định |
| 09 | `prompt_09_create_api_tests.txt` | Viết test API từ Swagger |

> 💡 Thư mục `prompt_template/prompt_workflow_template/` chứa phiên bản prompt ngắn gọn hơn, tối ưu cho workflow.

---

## ✳️ Hướng Dẫn Sử Dụng Trong Antigravity

1. **Clone Repo này về máy:**
   Hoặc bạn có thể copy trực tiếp thư mục `.agent` từ repo này.
   
2. **Tích hợp vào dự án của bạn:**
   Copy thư mục `.agent` vào thư mục gốc (root directory) của dự án Automation hoặc Manual Test mà bạn đang làm việc.

3. **Bắt đầu trò chuyện với AI trên Antigravity:**
   Khi mở dự án lên Antigravity, AI tự động nhận diện thư mục `.agent` và sẽ áp dụng ngay các Rule, Skill, Workflow của **Anh Tester** đã thiết lập sẵn.

4. **(Tùy chọn) Sử dụng Plan hoặc Prompt Template:**
   - Tác vụ phức tạp → Mở `plan/manual/QUICK_START.md` hoặc `plan/automation/QUICK_START.md`
   - Tác vụ nhanh → Copy prompt từ `prompt_template/` → paste vào chat

---

## 🤝 Hỗ Trợ & Đóng Góp

- Nếu bạn gặp khó khăn trong quá trình sử dụng hoặc muốn đóng góp để bộ công cụ này hoàn thiện hơn, đừng ngần ngại tạo **Issue** hoặc **Pull Request**.
- Tham gia cộng đồng **Anh Tester** để cùng trao đổi, học hỏi thêm nhiều kiến thức bổ ích về Automation Testing!
  - 📘 **Fanpage Facebook:** [Anh Tester](https://www.facebook.com/anhtester)
  - 👥 **Group Facebook Automation:** [Cộng đồng Automation Testing](https://www.facebook.com/groups/automationtest)
  - 👥 **Group Facebook Manual:** [Cộng đồng Manual Testing](https://www.facebook.com/groups/manualtest)
  - ✈️ **Telegram Automation:** [Cộng đồng Automation Testing](https://t.me/+kSUGJ3pVvxkyZWU1)
  - ✈️ **Telegram Manual:** [Cộng đồng Manual Testing](https://t.me/+8eChRz7OVqliZWRl)

---

## 📄 License

Dự án này được phân phối dưới giấy phép nguồn mở **[MIT License](LICENSE)**.

---
Anh Tester Automation Testing 🎯
https://anhtester.com