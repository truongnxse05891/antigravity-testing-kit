# Tổng Quan Kiến Trúc Agent (Agent Architecture Overview)

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc, các thành phần cốt lõi và luồng hoạt động của **AI Agent (Antigravity)** trong dự án `antigravity-testing-kit`. Kiến trúc được thiết kế theo hướng module hóa (modular), giúp Agent có khả năng thực hiện toàn bộ vòng đời kiểm thử từ phân tích yêu cầu, viết Test Case thủ công đến phát triển Test Automation và CI/CD.

---

## 1. Thành Phần Cốt Lõi (Core Agent Components)

"Bộ não" của Agent được đặt hoàn toàn trong thư mục `.agent/`. Đây là nơi định nghĩa cách Agent suy nghĩ, tuân thủ quy tắc và thực thi các nhiệm vụ.

### 1.1. Rules (`.agent/rules/`)
Đây là tập hợp các **quy tắc bắt buộc (Mandatory Rules)** mà Agent phải tuân thủ trong quá trình tạo mã và kiểm thử.
- **Quy tắc chung (`automation_rules.md`)**: Yêu cầu sử dụng Page Object Model (POM), không hardcode test data, quy định về assertion.
- **Chiến lược Locator (`locator_strategy.md`)**: Hướng dẫn thứ tự ưu tiên khi chọn locator (ưu tiên data-testid, role, text...).
- **Quy tắc Framework-specific**: 
  - `playwright_rules.md`: Bắt buộc viewport 1920x1080, thứ tự debug (navigate -> resize -> wait), chụp ảnh khi fail, không dùng sleep cứng.

### 1.2. Skills (`.agent/skills/`)
Skills là các "kỹ năng" chuyên biệt được nạp vào Agent để thực hiện các nghiệp vụ cụ thể. Mỗi skill đóng vai trò như một chuyên gia:
- **`qa_automation_engineer`**: Kỹ năng điều phối tổng thể các tác vụ automation.
- **`rbt_manual_testing`**: Kỹ năng viết Manual Test Cases (áp dụng RBT - Risk-Based Testing).
- **`requirements_analyzer`**: Kỹ năng đọc hiểu và trích xuất yêu cầu hệ thống.
- **`ui_debug_agent`**: Kỹ năng tương tác trực tiếp với trình duyệt để tìm locator chính xác.
- **`locator_healer_agent` & `smart_locator_agent`**: Xử lý, phục hồi và sinh locator bền vững.
- **`test_data_generator`**: Sinh dữ liệu test độc nhất và có thể truy vết (traceable).
- **`flaky_test_analyzer`**: Phân tích và sửa chữa các test case chạy chập chờn.

### 1.3. Workflows (`.agent/workflows/`)
Workflows định nghĩa các **luồng công việc tự động hóa** được kích hoạt bằng Slash Commands (ví dụ: `/generate_automation_from_testcases`). Các workflow này kết hợp nhiều skills và rules để hoàn thành một nhiệm vụ lớn (như thiết kế framework, phân tích web, chạy kiểm thử API, v.v.).

---

## 2. Luồng Thực Thi & Cấu Trúc Dự Án (Execution Flows & Project Structure)

Ngoài cấu hình Agent, kiến trúc còn bao gồm các thư mục làm việc (Workspace) nơi Agent đọc input và ghi output.

### 2.1. Lập Kế Hoạch & Prompt (`plans/` & `prompt_templates/`)
- **`plans/`**: Định nghĩa quy trình chuẩn (Standard Operating Procedures). Bao gồm quy trình 6 bước chuyên sâu cho **Manual Testing** (phân tích RBT) và **Automation** (từ context đến code).
- **`prompt_templates/`**: Chứa hơn 12 mẫu câu lệnh (prompts) được thiết kế tối ưu, giúp người dùng giao tiếp nhanh chóng với Agent cho từng mục đích cụ thể (tạo script, phân tích yêu cầu, turbo mode...).

### 2.2. Không Gian Làm Việc (Workspace Directories)
- **`requirements/`**: Nơi Agent đọc tài liệu đầu vào (Input) để hiểu hệ thống.
- **`test_cases/`**: Nơi Agent xuất ra các kịch bản kiểm thử thủ công dưới dạng Markdown hoặc CSV.
- **`automation-suite/`**: Thư mục chứa mã nguồn Automation (chủ yếu là Playwright TypeScript/Java). Được tuân thủ nghiêm ngặt theo mô hình **Page Object Model (POM)** gồm `pages/` (Locators) và `tests/` (Scripts).
- **`test_reports/`**: Nơi lưu trữ các báo cáo thực thi (TOML files), kết quả chạy test và ảnh chụp màn hình (screenshots/snapshots) phục vụ debug.
- **`scripts/`**: Chứa các script hỗ trợ cấu hình hoặc CI/CD pipeline.

---

## 3. Cơ Chế Hoạt Động (Operational Mechanism)

Khi có một yêu cầu từ người dùng, Agent hoạt động theo vòng lặp sau:

1. **Recon (Nhận thức & Điều tra):** 
   - Agent đọc `GEMINI.md` để hiểu Scope và Definition of Done.
   - Nạp các Rules và Skills tương ứng từ `.agent/`.
   - Nếu tương tác với UI, Agent sử dụng `ui_debug_agent` để mở trình duyệt, điều hướng, và phân tích DOM thực tế.
2. **Implementation (Thực thi):** 
   - Dựa vào Input (Requirements/Test Cases) và Workflows, Agent sinh ra output (ví dụ: Code POM Playwright, Test Data tự động).
3. **Execution & Self-fix (Chạy và Tự sửa lỗi):** 
   - Mã vừa sinh sẽ được chạy thử. Nếu Fail, Agent dùng `flaky_test_analyzer` hoặc `locator_healer_agent` để phân tích log, thay đổi code và chạy lại tới khi PASS ổn định (ít nhất 2 lần).
4. **Cleanup & Delivery (Dọn dẹp và Bàn giao):** 
   - Trước khi bàn giao, Agent rà soát và xóa bỏ debug logs (`console.log`), locators thừa, hard sleeps (`waitForTimeout`), đảm bảo mã nguồn gọn gàng.
   - Báo cáo kết quả ra định dạng `TOML` trong `test_reports/`.

## 4. Tổng Kết

Kiến trúc AI Agent trong dự án này không chỉ đơn thuần là bộ nhắc lệnh (prompt generator), mà là một **Hệ sinh thái tự trị có kiểm soát**. Bằng cách phân tách **Luật (Rules) - Kỹ năng (Skills) - Luồng việc (Workflows)** và kết nối chặt chẽ với **Cấu trúc dữ liệu dự án**, hệ thống đảm bảo mọi mã nguồn và kịch bản test do AI sinh ra luôn đạt chuẩn kỹ thuật cao nhất (POM, không flaky, dễ bảo trì).
