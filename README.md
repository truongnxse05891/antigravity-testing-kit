

## 🌟 Tính Năng Nổi Bật

- **🔁 Quy Trình AI Hoàn Thiện (End-to-End):** Được xây dựng thành một quy trình ứng dụng AI khép kín — từ phân tích yêu cầu (Requirements), thiết kế test cases (Manual), đến viết script tự động (Automation), tích hợp CI/CD và báo cáo kết quả — tất cả đều có AI hỗ trợ.
- **📋 Hỗ Trợ Cả Manual & Automation Testing:** Không chỉ dừng lại ở Automation, Kit còn trang bị đầy đủ quy trình, skill và prompt cho **Manual Tester** — bao gồm phân tích rủi ro (RBT), thiết kế test cases chất lượng cao và quản lý kết quả kiểm thử.
- **🧠 Tối ưu cho QA/Tester:** Tất cả các prompt, rule và workflow đều được tinh chỉnh dựa trên tư duy và quy trình làm việc thực tế của cả **Manual Tester** lẫn **Automation Engineer**.
- **🌐 Hỗ trợ Đa Nền Tảng:** Tương thích với Web (Playwright) và API (Playwright, REST Assured).
- **🛡️ Tuân thủ Tiêu Chuẩn Cao (Strict Rules):** Đảm bảo AI luôn đi theo cấu trúc Page Object Model (POM), viết code rõ ràng, không đoán bừa locator và tự động sửa lỗi (Self-fix).
- **🇻🇳 Giao Tiếp Bằng Tiếng Việt:** AI được cấu hình để trao đổi, giải thích và báo cáo hoàn toàn bằng Tiếng Việt, thân thiện với người dùng Việt Nam.

---

## 📂 Cấu Trúc Thư Mục Chính

```
antigravity-testing-kit/
├── .agent/              # Bộ não của AI (Rules, Skills, Workflows)
├── automation-suite/    # Mã nguồn Automation (Playwright, POM, Tests)
├── plans/               # Quy trình thực thi AI 6 bước chuyên sâu
│   ├── manual/          # Quy trình sinh Manual Test Cases (AI-RBT)
│   └── automation/      # Quy trình sinh Automation Scripts
├── prompt_templates/    # Thư viện Prompt mẫu tối ưu
├── requirements/        # Nơi lưu trữ tập trung các tài liệu Yêu cầu (.md)
├── scripts/             # Công cụ bổ trợ và tích hợp
├── test_cases/          # Nơi lưu trữ tập trung các file Test Case (.md, .csv)
├── GEMINI.md            # Nguyên tắc hoạt động cốt lõi của AI Agent
└── TIPS_QUOTA.md        # Bí kíp tối ưu hóa sử dụng token
```

### 🤖 `.agent/` — Cấu hình AI Agent

| Thư mục | Vai trò |
|---------|--------|
| `rules/` | Quy tắc bắt buộc: POM, locator strategy, smart waits, Playwright rules |
| `skills/` | 7+ kỹ năng chuyên biệt: automation engineer, manual testing, UI debug, test data generator... |
| `workflows/` | 14+ slash commands: `/generate_automation_from_testcases`, `/generate_turbo_automation_ci`... |

### 🚀 `automation-suite/` — Playwright Automation

Nơi chứa toàn bộ mã nguồn automation được quản lý theo mô hình **Page Object Model (POM)**:
- `pages/`: Định nghĩa các Page Classes và Locators.
- `tests/`: Chứa các script kiểm thử (Checkout, Hybrid Turbo...).
- `playwright.config.ts`: Cấu hình môi trường chạy test.

### 📝 `plans/` — Quy Trình 6 Bước Chuyên Sâu

Dành cho các tác vụ phức tạp, cần thực hiện **tuần tự trong cùng 1 conversation**.

| Plan | Mô tả | Bắt đầu nhanh |
|------|-------|---------------|
| `plans/manual/` | Sinh Manual Test Cases theo quy trình **AI-RBT 6 bước** | Xem `plans/manual/QUICK_START.md` |
| `plans/automation/` | Sinh Automation Scripts theo **6 bước** từ context → review | Xem `plans/automation/QUICK_START.md` |

### ⚡ `prompt_templates/` — Thư viện Prompt Mẫu

Sao chép và tùy chỉnh dữ liệu trong `[...]` để sử dụng ngay.

| # | Prompt | Mục đích |
|---|--------|----------|
| 01 | `prompt_01_generate_requirements.txt` | Phân tích website sinh Requirements |
| 02 | `prompt_02_create_test_cases.txt` | Sinh test cases từ requirements |
| 03 | `prompt_03_create_framework_playwright.txt` | Dựng framework Playwright TS |
| 04 | `prompt_04_create_script_playwright.txt` | Viết test script Playwright TS |
| 05 | `prompt_05_convert_manual_to_automation.txt` | Chuyển manual TC sang automation |
| 06 | `prompt_06_review_automation_code.txt` | Review code automation |
| 07 | `prompt_07_generate_test_data.txt` | Sinh test data có cấu trúc |
| 08 | `prompt_08_analyze_flaky_tests.txt` | Phân tích test không ổn định |
| 09 | `prompt_09_create_api_tests.txt` | Viết test API từ Swagger |
| 10 | `prompt_10_turbo_mode.txt` | Tối ưu script chạy tốc độ cao (Turbo) |
| 11 | `prompt_11_hyper_extreme_mode.txt` | Script siêu tốc độ, bỏ qua các bước chờ |
| 12 | `prompt_12_convert_rbt_to_technical_script.txt` | Chuyển đổi bảng RBT sang danh sách các bước |

---

## ✳️ Hướng Dẫn Sử Dụng Trong Antigravity

1. **Clone Repo này về máy:**
   Hoặc bạn có thể copy trực tiếp thư mục `.agent` từ repo này.
   
2. **Tích hợp vào dự án của bạn:**
   Copy thư mục `.agent` vào thư mục gốc (root directory) của dự án mà bạn đang làm việc.

3. **Bắt đầu trò chuyện với AI trên Antigravity:**
   Khi mở dự án, AI sẽ tự động nhận diện thư mục `.agent` và áp dụng cấu hình của **Anh Tester**.

4. **Sử dụng Plan hoặc Prompt Template:**
   - Tác vụ phức tạp → Mở `plans/manual/QUICK_START.md` hoặc `plans/automation/QUICK_START.md`
   - Tác vụ nhanh → Copy prompt từ `prompt_templates/` → paste vào chat

---

