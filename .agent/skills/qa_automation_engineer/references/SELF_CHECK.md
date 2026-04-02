# Self Check

Checklist bắt buộc mà agent phải kiểm tra **trước khi hoàn thành** bất kỳ tác vụ nào.

---

## Code Quality

- [ ] Code tuân thủ Page Object Model (POM)
- [ ] Tách biệt rõ: Page objects / Test classes / Utils / Test data
- [ ] Không có hard-coded values (URLs, credentials, test data)
- [ ] Naming convention nhất quán và dễ đọc
- [ ] Không có code thừa, commented code, hoặc debug logs

## Locator Quality

- [ ] Locator được inspect từ DOM thực tế (không đoán)
- [ ] Ưu tiên stable locators theo priority list (id > data-testid > name > css > xpath)
- [ ] Không sử dụng fragile locators (auto-generated classes, positional xpath)
- [ ] Playwright: ưu tiên semantic locators (getByRole, getByLabel, getByPlaceholder)

## Wait Strategy

- [ ] Không sử dụng hard sleep (Thread.sleep, waitForTimeout, fixed delay)
- [ ] Sử dụng smart waits (WebDriverWait, expect(), auto-waiting)
- [ ] Timeout values hợp lý (không quá ngắn gây flaky, không quá dài gây chậm)

## Test Execution

- [ ] Test đã được chạy và PASS ổn định
- [ ] Test có assertions rõ ràng, validate đúng expected behavior
- [ ] Test data sử dụng random values có prefix + timestamp (traceable)
- [ ] Mỗi test case độc lập, không phụ thuộc test khác

## Test Data

- [ ] Unique fields (email, username, code) sử dụng random data
- [ ] Random data có thể truy ngược (deterministic: test name + timestamp + prefix)
- [ ] Không có sensitive data (mật khẩu thật, PII) trong code

## Documentation

- [ ] Test case có mô tả rõ ràng (precondition, steps, expected result)
- [ ] Code comments chỉ cho logic phức tạp (không comment hiển nhiên)
- [ ] README hoặc hướng dẫn chạy test nếu cần

## CI/CD Ready

- [ ] Test có thể chạy headless mode
- [ ] Không depend vào môi trường local cụ thể
- [ ] TestNG XML / Playwright config đã setup đúng
