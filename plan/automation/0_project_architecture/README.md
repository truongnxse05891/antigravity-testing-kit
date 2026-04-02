# Master Framework for E2E Automation (Generalized)

**Workflow:** `/generate_automation_from_testcases` hoặc `/generate_automation_from_ui_flow`
**Skill:** `qa_automation_engineer`

---

## Mục tiêu

Xây dựng hệ thống Automation có khả năng mở rộng, dễ bảo trì và báo cáo chuyên nghiệp. Thay vì "viết test đơn lẻ", chúng ta xây dựng **Framework gốc** vững chãi từ đầu.

## Kiến trúc chuẩn

### TypeScript / Playwright

```text
Project/
├── tests/           # Test Runner (Spec files)
├── pages/           # Page Objects (UI Logic & Locators)
├── utils/           # Core Utilities (Data Helpers, File Generators)
├── test_data/       # Dữ liệu kịch bản (JSON) & Templates
├── temp/            # File sinh ra khi chạy test (tự động dọn dẹp)
├── temp_reports/    # Kết quả trung gian
└── reports/         # Báo cáo cuối (HTML, Trace, Evidence)
```

### Java / Selenium / TestNG

```text
Project/
├── src/main/java/
│   ├── pages/       # Page Objects
│   └── utils/       # Utilities, Helpers, DataProviders
├── src/test/java/
│   └── tests/       # Test classes
├── src/test/resources/
│   └── test_data/   # JSON/Excel data files
├── reports/         # Allure/ExtentReport output
└── pom.xml          # Maven dependencies
```

### Java / Appium

```text
Project/
├── src/main/java/
│   ├── screens/     # Screen Objects (tương đương Page Objects)
│   └── utils/       # Utilities, Appium Helpers
├── src/test/java/
│   └── tests/       # Test classes
├── src/test/resources/
│   ├── apps/        # APK/IPA files
│   └── test_data/   # Test data
└── pom.xml
```

## Cách sử dụng

Cung cấp kiến trúc phù hợp cho AI **ở Bước 1** để AI biết nơi chứa file mã nguồn.
