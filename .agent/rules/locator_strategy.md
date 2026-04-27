# Chiến Lược Chọn Locator (Áp Dụng Mọi Framework)

> Độ ổn định và khả năng đọc hiểu của locator quyết định sức khỏe của một automation framework.
> Nguyên tắc cốt lõi: KHÔNG BAO GIỜ chọn element dựa trên cấu trúc DOM gắn với styling. Hãy xây dựng locator dựa trên thuộc tính có ngữ nghĩa.

## 1. Bản Đồ Ưu Tiên (Master Priority Map)

Thứ tự ưu tiên từ cao đến thấp:

1. Thuộc tính Accessibility / Aria (semantic, hỗ trợ screen reader)
2. Thuộc tính test chuyên dụng (`data-testid`, `data-test`, `data-qa`)
3. Thuộc tính định danh chính (`id`, `resource-id`, `name`)
4. Hàm semantic riêng framework (Playwright: `getByRole`, `getByLabel`...)
5. CSS Selector
6. XPath (lựa chọn cuối cùng)

## 2. Quy Tắc Ổn Định (Stability Rules)

Mọi locator phải đảm bảo:
- Chỉ match **đúng 1 element** duy nhất trên trang (unique in scope).
- Sống sót qua thay đổi giao diện — không bị ảnh hưởng khi DOM thay đổi layout (thêm/bớt div wrapper, đổi flexbox).

**NGHIÊM CẤM sử dụng:**
- CSS class name động / hash tạm thời (ví dụ: `css-1n2xyz-btn`)
- Chuỗi `nth-child`, `nth-of-type` khi có lựa chọn tốt hơn
- ID tự sinh bởi framework (auto-generated IDs)
- XPath tuyệt đối dựa trên vị trí (ví dụ: `//div[3]/div[2]/form/button`)

## 3. Quy Trình Xác Minh Locator

Trước khi đưa locator vào code, phải kiểm tra:

1. Locator có match **đúng 1 element** trong DOM không?
2. Element match có phải là thành phần người dùng tương tác được không? (không phải shadow DOM overlay)
3. Reload / navigate lại trang — locator có còn đúng không?
4. Thử trên nhiều trạng thái trang (loading, loaded, có data, không data) — locator có ổn định không?

## 4. Locator Theo Framework

Chi tiết locator cho từng framework xem tại:
- Playwright: `.agent/rules/playwright_rules.md` (Section 3)
- Selenium: `.agent/rules/selenium_rules.md` (Section 1)
- Appium: `.agent/rules/appium_rules.md` (Section 1)

---

## 5. Quy Tắc Viết XPath (Khi Bắt Buộc Phải Dùng)

> XPath chỉ được dùng khi **không có bất kỳ lựa chọn nào tốt hơn** ở các tầng ưu tiên 1–5.
> Khi đã buộc phải dùng XPath, phải tuân theo các quy tắc sau để đảm bảo độ ổn định.

### ❌ TUYỆT ĐỐI KHÔNG:
- XPath tuyệt đối theo vị trí: `/html/body/div[3]/span[1]/button`
- Dựa trên class động / hash: `//div[@class='css-1x2y3z']`
- Chuỗi vị trí không có ngữ nghĩa: `(//button)[4]`
- Nhiều cấp `parent::` / `ancestor::` lồng nhau (dễ gãy khi DOM thay đổi)

### ✅ ĐƯỢC PHÉP (theo thứ tự ưu tiên):

| Ưu tiên | Kỹ thuật XPath | Ví dụ |
|---------|---------------|-------|
| 1 | Attribute ngữ nghĩa cố định | `//button[@data-testid='submit-btn']` |
| 2 | Text cố định (dùng `normalize-space`) | `//button[normalize-space()='Lưu lại']` |
| 3 | Relative + `following-sibling` / `preceding-sibling` | `//label[text()='Email']/following-sibling::input` |
| 4 | `contains()` với class **cố định** (không phải hash) | `//span[contains(@class,'btn-primary')]` |
| 5 | Kết hợp nhiều attribute stable | `//input[@name='username' and @type='text']` |
| 6 | `ancestor` / `descendant` có điểm neo ngữ nghĩa | `//div[@id='login-form']//button[@type='submit']` |

### 📋 Checklist XPath An Toàn (Bắt Buộc Verify Trước Khi Commit):
- [ ] Không chứa vị trí số tuyệt đối (`div[3]`, `span[1]`)
- [ ] Không chứa class hash tạm (`css-xxx`, `sc-xxx`)
- [ ] Có dùng `normalize-space()` khi match text (tránh lỗi whitespace)
- [ ] Là relative XPath (`//`) — không phải absolute (`/html/...`)
- [ ] Match đúng **1 element duy nhất** — verify bằng browser console: `$x('...')`
- [ ] Đã thử reload trang để xác nhận locator ổn định

---

## 6. Xử Lý Shadow DOM & iframe

> Hai trường hợp đặc biệt mà XPath thông thường **không hoạt động** được.

### Shadow DOM
- **XPath KHÔNG xuyên qua Shadow DOM** — bắt buộc dùng CSS piercing hoặc API riêng của framework.
- **Playwright:** Tự động xuyên Shadow DOM với `locator()`. Nếu cần explicit:
  ```typescript
  // Playwright tự handle — không cần cú pháp đặc biệt
  page.locator('my-component').locator('button.submit')
  ```
- **Selenium:** Phải dùng JavaScript executor:
  ```java
  WebElement shadowHost = driver.findElement(By.cssSelector("my-component"));
  SearchContext shadowRoot = shadowHost.getShadowRoot();
  shadowRoot.findElement(By.cssSelector("button.submit"));
  ```
- **KHÔNG dùng XPath** để locate element trong Shadow DOM.

### iframe
- Phải **switch context** trước khi locate element bên trong iframe.
- **Playwright:**
  ```typescript
  // Ưu tiên frameLocator — không cần switch/switch-back thủ công
  const frame = page.frameLocator('iframe#payment-frame');
  await frame.getByLabel('Card Number').fill('4111111111111111');
  ```
- **Selenium:**
  ```java
  driver.switchTo().frame(driver.findElement(By.id("payment-frame")));
  // ... thao tác bên trong iframe ...
  driver.switchTo().defaultContent(); // Nhớ switch back
  ```
- **Quy tắc:** Luôn switch back về default content sau khi xong với iframe (Selenium).
