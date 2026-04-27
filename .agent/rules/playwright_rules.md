# Quy Tắc Dành Riêng Cho Playwright

> Áp dụng khi thiết lập và chạy automation với Playwright (TypeScript hoặc Java).

## 1. Thiết Lập Browser (BẮT BUỘC)

- **Viewport debug:** Mọi quá trình debug UI bắt buộc chạy với viewport desktop: **`1920x1080`**.
- **Playwright MCP — Resize bắt buộc:** Khi sử dụng Playwright MCP để debug UI, **LUÔN LUÔN** gọi `browser_resize(width=1920, height=1080)` **ngay sau khi mở browser** (sau lệnh `browser_navigate` đầu tiên). Đây là bước bắt buộc, không được bỏ qua.
  ```
  Thứ tự bắt buộc:
  1. browser_navigate(url) → mở trang
  2. browser_resize(width=1920, height=1080) → set viewport
  3. browser_snapshot() hoặc browser_take_screenshot() → bắt đầu inspect
  4. browser_close() hoặc tab_close() → đóng tab sau khi hoàn thành (BẮT BUỘC)
  ```
- **Headed mode:** Bắt buộc mở browser có hiển thị (headed) trong quá trình thiết lập và debug test.
- **Headless mode:** Chỉ được phép sử dụng khi:
  - Test đã debug PASS 100% trên headed mode
  - Hoặc trong CI/CD pipeline mặc định

## 2. Workflow Phát Triển & Tìm Element

- Ưu tiên sử dụng **Playwright MCP** để mở browser và tương tác với trang đích.
- **Inspect DOM thực tế:** Verify và capture selector trực tiếp từ browser DOM.
- **TUYỆT ĐỐI KHÔNG:**
  - Suy đoán locator
  - Copy locator mù quáng từ code cũ mà không verify
  - Dựa trên URL / tài liệu mà không xác nhận sự tồn tại trên UI thật

## 3. Thứ Tự Ưu Tiên Locator Playwright

Playwright cung cấp bộ locator semantic hướng người dùng. Ưu tiên sử dụng thay vì CSS/XPath:

| Ưu tiên | Locator | Khi nào dùng |
|---------|---------|-------------|
| 1 | `getByRole()` | Semantic elements: button, link, heading, checkbox, listitem... |
| 2 | `getByLabel()` | Form fields có label liên kết |
| 3 | `getByPlaceholder()` | Input có placeholder, không có label |
| 4 | `getByText()` | Non-interactive elements: div, span, p (dùng exact/regex khi cần) |
| 5 | `getByAltText()` | Image/area elements có thuộc tính `alt` |
| 6 | `getByTitle()` | Elements có thuộc tính `title` |
| 7 | `getByTestId()` | Elements có `data-testid` (hoặc custom attribute đã config) |
| 8 | `locator('css=...')` | Fallback CSS — không có lựa chọn tốt hơn |
| 9 | `locator('xpath=...')` | Fallback XPath cuối cùng — xem Section 8 |

```typescript
// ✅ Đúng — Semantic locators
page.getByRole('button', { name: 'Đăng nhập' })
page.getByRole('button', { name: /submit/i })      // Regex case-insensitive
page.getByLabel('Email')
page.getByPlaceholder('Nhập mật khẩu')
page.getByAltText('playwright logo')               // Cho <img>
page.getByTitle('Issues count')                    // Cho title attribute
page.getByText('Welcome, John', { exact: true })   // Exact match
page.getByText(/welcome, [A-Za-z]+$/i)             // Regex match

// ❌ Sai — CSS/XPath thô khi có semantic thay thế
page.locator('//button[@class="btn-login"]')
page.locator('.form-input:nth-child(2)')
```

> **Lưu ý `getByText()`:** Chỉ dùng cho non-interactive elements (div, span, p). Với button/input/link → dùng `getByRole()`. Text matching tự động normalize whitespace.

### Custom testIdAttribute (Cấu Hình Dự Án)

Mặc định `getByTestId()` tìm theo `data-testid`. Nếu dự án dùng attribute khác (ví dụ `data-pw`, `data-cy`), cấu hình trong `playwright.config.ts`:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    testIdAttribute: 'data-pw', // hoặc 'data-cy', 'data-qa'...
  },
});
// Sau đó dùng bình thường:
// page.getByTestId('submit-btn') → tìm [data-pw="submit-btn"]
```

## 4. Chiến Lược Chờ Đợi (Wait Strategy)

**NGHIÊM CẤM:**
- `page.waitForTimeout()` — hard sleep
- `await new Promise(r => setTimeout(r, N))` — tự tạo delay
- Bất kỳ cách nào cố định thời gian chờ

**SỬ DỤNG:**
- Tận dụng auto-waiting mặc định của Playwright
- Web-First Assertions:
  ```typescript
  await expect(locator).toBeVisible();
  await expect(locator).toBeEnabled();
  await expect(locator).toHaveText('Thành công');
  await expect(page).toHaveURL(/dashboard/);
  ```
- Chỉ dùng `waitForSelector()` khi `expect()` không đáp ứng được yêu cầu đặc biệt

## 5. Cấu Trúc Test

```typescript
test.describe('Tên Module', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: navigate, login...
  });

  test('mô tả hành vi cần test', async ({ page }) => {
    // Arrange: khởi tạo page objects, data
    // Act: thực hiện hành động
    // Assert: kiểm tra kết quả
  });
});
```

- Mỗi test block phải có **assertion rõ ràng**
- Sử dụng `test.describe` để nhóm test theo module
- Sử dụng `beforeEach` / `afterEach` để setup / teardown

## 6. Cấu Trúc Thư Mục & Import (BẮT BUỘC)

- **Test Files:** Phải nằm trong thư mục con tương ứng của `tests/`. Ví dụ: `tests/breadcrumb/breadcrumb_actions.spec.ts`.
- **Import POM:** Khi test nằm trong subfolder, đường dẫn import POM thường là `../../pages/XxxPage`. Tuyệt đối kiểm chứng đường dẫn thực tế trước khi hoàn thiện.
- **Root config:** Luôn đảm bảo `playwright.config.ts` trỏ đúng vào thư mục gốc `tests/` để có thể quét được toàn bộ subfolders.

## 7. Quy chuẩn Gọi Data theo Environment (BẮT BUỘC)

- **Mapping với `.json`:** Trong các spec, khai báo và nạp data trực tiếp từ file json cùng tên nằm đồng cấp bằng cách đọc biến môi trường `TEST_ENV`.
- **Cú pháp chuẩn:**
  ```typescript
  import testData from './<filename>.json';
  const env = process.env.TEST_ENV || 'dev';
  const conf = testData.env[env];
  // Sử dụng config: const cases = conf.cases['CASE_ID'];
  ```

---

## 8. XPath Fallback Trong Playwright (Khi Không Có Lựa Chọn Tốt Hơn)

> Playwright hỗ trợ XPath nhưng ưu tiên thấp nhất. Chỉ dùng khi các locator semantic (Section 3) **đều thất bại**.

### Cú Pháp XPath Trong Playwright

```typescript
// Cú pháp chuẩn — dùng prefix 'xpath='
page.locator('xpath=//button[@data-testid="submit"]')

// Playwright cũng chấp nhận '//' trực tiếp (auto-detect XPath)
page.locator('//button[@data-testid="submit"]')

// ✅ Thống nhất dùng prefix 'xpath=' để code rõ ý định hơn
```

### XPath Được Phép Trong Playwright:

```typescript
// 1. Dựa trên attribute ngữ nghĩa
page.locator('xpath=//button[@data-testid="submit-btn"]')

// 2. Text cố định với normalize-space
page.locator('xpath=//button[normalize-space()="Lưu lại"]')

// 3. Relative path từ điểm neo rõ ràng
page.locator('xpath=//div[@id="login-form"]//button[@type="submit"]')

// 4. following-sibling khi cần locate qua label
page.locator('xpath=//label[text()="Email"]/following-sibling::input')
```

### XPath Cấm Trong Playwright (giống locator_strategy.md Section 5):

```typescript
// ❌ Tuyệt đối không dùng
page.locator('xpath=//div[3]/div[2]/form/button')      // Vị trí tuyệt đối
page.locator('xpath=(//button)[4]')                    // Index tuyệt đối
page.locator('xpath=//div[@class="css-1x2y3z"]')       // Class hash
```

---

## 9. Scoping, Chaining & Dynamic List

### 9.1 Scoping Locator Trong Container

Khi có nhiều element cùng loại trên trang (ví dụ: nhiều nút "Xóa", nhiều "Chỉnh sửa"), **bắt buộc scope locator vào container** trước:

```typescript
// ✅ Đúng — Scope vào row/container trước
const row = page.locator('tr', { hasText: 'John Doe' });
await row.getByRole('button', { name: 'Chỉnh sửa' }).click();

// ✅ Chaining vào modal — tránh match sai nếu có nhiều modal
await page.locator('.modal-dialog').getByRole('button', { name: 'Xác nhận' }).click();

// ❌ Sai — Lấy button không scope, có thể click sai element
await page.getByRole('button', { name: 'Chỉnh sửa' }).click(); // Ambiguous!
```

### 9.2 Dynamic List — Dùng `filter()` Thay Vì `nth()`

Khi danh sách render động, thứ tự item có thể thay đổi — **đừng tin vào index**:

```typescript
// ✅ Đúng — Dùng filter() với hasText
const targetItem = page.getByRole('listitem').filter({ hasText: 'Sản phẩm A' });
await targetItem.getByRole('button', { name: 'Xóa' }).click();

// ✅ filter() với locator con
const activeRow = page.locator('tr').filter({ has: page.locator('span.status-active') });

// ❌ Sai — nth() bị vỡ khi order thay đổi
await page.getByRole('listitem').nth(2).click(); // FRAGILE!
```

### 9.3 `has` và `hasText` — Tìm Container Chứa Nội Dung Cụ Thể

```typescript
// Tìm ô form chứa label 'Email'
page.locator('.form-group', { hasText: 'Email' })

// Tìm row có chứa badge 'Active'
page.locator('tr', { has: page.getByRole('button', { name: 'Active' }) })
```

### 9.4 Negative Filter — Lọc Bằng Cách Loại Trừ

```typescript
// hasNotText — loại bỏ item chứa text
await expect(
  page.getByRole('listitem').filter({ hasNotText: 'Out of stock' })
).toHaveCount(5); // Chỉ còn 5 item in-stock

// hasNot — loại bỏ item chứa locator con
await expect(
  page.getByRole('listitem').filter({ hasNot: page.getByText('Product 2') })
).toHaveCount(1);
```

### 9.5 Chaining Filters — Lọc Nhiều Tầng

Khi cần pinpoint chính xác trong danh sách phức tạp (nhiều điều kiện):

```typescript
// Tìm row của 'Mary' VÀ có button 'Say goodbye'
const rowLocator = page.getByRole('listitem');
await rowLocator
  .filter({ hasText: 'Mary' })
  .filter({ has: page.getByRole('button', { name: 'Say goodbye' }) })
  .click();
```

### 9.6 Iterate List — Duyệt Qua Nhiều Elements

```typescript
// Duyệt bằng .all() — trả về mảng Locator đã resolve
for (const row of await page.getByRole('listitem').all()) {
  console.log(await row.textContent());
}

// Assert tất cả text trong list
await expect(page.getByRole('listitem'))
  .toHaveText(['apple', 'banana', 'orange']);

// Assert số lượng items
await expect(page.getByRole('listitem')).toHaveCount(3);
```

---

## 10. Strictness & Locator Operators

### 10.1 Strictness — Quy Tắc "Chỉ 1 Element"

> **Playwright locator là strict by design**: Nếu locator match >1 element → action sẽ **throw error** ngay lập tức.

```typescript
// ❌ Throw error nếu có nhiều button trên trang
await page.getByRole('button').click(); // Strict mode violation!

// ✅ Phải scope/filter để còn đúng 1 element
await page.locator('.login-form').getByRole('button').click();

// ✅ Các method aggregate KHÔNG bị strict (cho phép nhiều elements)
await page.getByRole('button').count();
await page.getByRole('listitem').all();
```

### 10.2 `filter({ visible: true })` — Chỉ Match Element Visible

Khi có element hidden và visible cùng selector:

```typescript
// ❌ Match cả hidden lẫn visible → throw strict error
await page.locator('button').click();

// ✅ Chỉ match visible element
await page.locator('button').filter({ visible: true }).click();
```

### 10.3 `locator.and()` — Match Cả Hai Điều Kiện Cùng Lúc

Dùng khi cần xác định element thỏa mãn **đồng thời** nhiều locator:

```typescript
// Tìm button vừa có role='button' vừa có title='Subscribe'
const button = page.getByRole('button').and(page.getByTitle('Subscribe'));
await button.click();

// Tìm element vừa match role vừa match text
const el = page.getByRole('listitem').and(page.getByText('Active'));
```

### 10.4 `locator.or()` — Xử Lý UI Không Chắc Chắn

Dùng khi UI có thể hiển thị một trong hai trạng thái (dialog bất ngờ, A/B test...):

```typescript
// Xử lý dialog security có thể xuất hiện trước khi click 'New email'
const newEmail = page.getByRole('button', { name: 'New' });
const securityDialog = page.getByText('Confirm security settings');

// Chờ một trong hai hiện ra
await expect(newEmail.or(securityDialog).first()).toBeVisible();

// Xử lý điều kiện
if (await securityDialog.isVisible()) {
  await page.getByRole('button', { name: 'Dismiss' }).click();
}
await newEmail.click();
```

> **Lưu ý:** Nếu cả hai element đều visible cùng lúc, `or()` có thể throw strict error. Dùng `.first()` để an toàn.
