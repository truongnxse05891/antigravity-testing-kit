# Quy Tắc Figma UI Comparison

> Áp dụng khi thực hiện workflow `/compare_figma_with_ui` hoặc dùng skill `figma_ui_comparator`.

---

## 1. Figma API — KHÔNG dùng Browser

- **BẮT BUỘC** dùng **Figma REST API** để lấy design data — KHÔNG mở browser để xem Figma.
- Browser sẽ bị chặn bởi Figma login wall nếu không có session.
- Token đọc từ `~/.gemini/antigravity/mcp_config.json` → key `FIGMA_PERSONAL_ACCESS_TOKEN`.

```bash
# Kiểm tra token hợp lệ
curl -s -H "X-Figma-Token: {TOKEN}" "https://api.figma.com/v1/me"

# Lấy node data
curl -s --max-time 30 -H "X-Figma-Token: {TOKEN}" \
  "https://api.figma.com/v1/files/{fileKey}/nodes?ids={nodeId}&depth=4" \
  -o /tmp/figma_node.json

# Export ảnh render
curl -s --max-time 30 -H "X-Figma-Token: {TOKEN}" \
  "https://api.figma.com/v1/images/{fileKey}?ids={nodeId}&format=png&scale=1"
```

---

## 2. Parse Figma URL

Từ URL dạng:
```
https://www.figma.com/design/{fileKey}/Title?node-id={nodeId}&m=dev
```

Extract:
- `fileKey`: segment sau `/design/` và trước tên file
- `nodeId`: giá trị `node-id` parameter (**không** URL-encode dấu `-`)
- Khi gọi API: `ids=XXXX-YYYY` (dùng dấu `-`, không dùng `%3A`)

---

## 3. Xử lý Màu Sắc từ Figma

Figma trả về màu dạng `rgba(0-1)`. Bắt buộc convert về HEX trước khi so sánh:

```python
def rgba_to_hex(color):
    r = int(color.get('r', 0) * 255)
    g = int(color.get('g', 0) * 255)
    b = int(color.get('b', 0) * 255)
    return '#{:02X}{:02X}{:02X}'.format(r, g, b)
```

So sánh với CSS: Browser trả về `rgb(255, 255, 255)` → cũng convert về hex để so sánh.

---

## 4. Browser Subagent — Quy trình bắt buộc

```
navigate → resize(1920×1080) → login_if_needed → navigate_to_section → screenshot → inspect_dom → close
```

- **LUÔN** resize `1920x1080` ngay sau navigate
- **KHÔNG** chụp screenshot tràn lan — chỉ chụp section liên quan đến Figma node
- **BẮT BUỘC** đóng browser sau khi hoàn thành

---

## 5. Lưu Báo Cáo — Subfolder per Section

**Mỗi lần compare tạo 1 subfolder riêng.**

**Cấu trúc bắt buộc:**
```
report-compare-figma/ui-comparison/
└── {section-name}_{nodeId}_{YYYYMMDD}/          ← 1 folder = 1 section
    ├── screenshots/
    │   ├── figma_design.png
    │   ├── live_ui_full.png
    │   └── live_ui_{section}.png
    └── report.md
```

**Quy tắc đặt tên subfolder:**
- `{section-name}`: tên Figma node — lowercase, dấu cách → `-`
- Không đặt file thẳng vào `ui-comparison/` — bắt buộc có subfolder
- Screenshot embed trong `report.md` dùng path tương đối: `./screenshots/file.png`

**Lệnh khởi tạo:**
```bash
SECTION_NAME=$(echo "{node-name}" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
mkdir -p "report-compare-figma/ui-comparison/${SECTION_NAME}_{nodeId}_{YYYYMMDD}/screenshots"
```

---

## 6. Song song hóa

Để tăng tốc, agent **NÊN** thực hiện song song:
- Figma API calls (lấy node JSON + export image)
- Browser Subagent (chụp live UI)

Chỉ cần đợi cả 2 xong mới tiến hành so sánh và sinh báo cáo.

---

## 7. Severity Matrix

| Level | Định nghĩa | Ví dụ |
|-------|-----------|-------|
| 🔴 Critical | Sai branding / element bị thiếu hoàn toàn | Logo sai, CTA không hiển thị |
| ⚠️ Major | Sai màu chính / layout bị vỡ / text duplicate | Tiêu đề lặp đôi, màu primary sai |
| ⚡ Minor | Sai spacing nhỏ / icon alignment lệch | Padding sai ±4px, icon size khác |
| ℹ️ Info | Nằm ngoài scope Figma node được chọn | Feature chưa trong design |

---

## 8. Anti-Patterns

| Không làm | Thay bằng |
|-----------|----------|
| Mở Figma qua browser | Dùng REST API với token |
| Chụp screenshot toàn bộ app | Chụp đúng section cần so sánh |
| Lưu báo cáo chỉ trong brain dir | Copy vào `report-compare-figma/ui-comparison/` |
| So sánh bằng mắt thường vague | So sánh cụ thể từng giá trị hex/px |
| Bỏ qua lỗi "out of scope" | Ghi là Info, không bỏ qua |

---

## 9. Figma Token Scopes Yêu cầu

| Scope | Mục đích |
|-------|---------|
| `current_user:read` | Xác thực token |
| `file_content:read` | Đọc nội dung nodes, fills, styles |
| `file_metadata:read` | Đọc metadata file |

Token cấu hình tại: `~/.gemini/antigravity/mcp_config.json`
