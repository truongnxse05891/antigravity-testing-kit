---
name: Figma UI Comparator
description: Skill so sánh bản thiết kế Figma với UI thực tế trên trình duyệt, sử dụng Figma REST API và Browser Subagent để phát hiện visual bugs và design inconsistencies.
---

# Figma UI Comparator Skill

## Mô tả

Skill này hỗ trợ agent thực hiện quy trình **Figma Design ↔ Live UI comparison** một cách tự động và hiệu quả. Kết hợp giữa **Figma REST API** để trích xuất design tokens và **Browser Subagent** để chụp UI thực tế, sau đó sinh báo cáo sai khác có cấu trúc.

---

## Khi nào dùng Skill này

- Khi cần kiểm tra UI thực tế có khớp với bản thiết kế Figma không
- Khi bàn giao feature mới, cần visual QA
- Khi dev hoàn thành implementation và cần sign-off
- Khi cần tạo báo cáo UI bugs từ Figma comparison

---

## Yêu cầu trước khi chạy

### Bắt buộc
- `FIGMA_PERSONAL_ACCESS_TOKEN` đã cấu hình trong `~/.gemini/antigravity/mcp_config.json`
- Token cần có scopes: `current_user:read`, `file_content:read`, `file_metadata:read`
- URL Figma hợp lệ có chứa `fileKey` và `node-id`

### Tùy chọn
- Credentials để đăng nhập vào ứng dụng cần so sánh

---

## Quy trình thực thi (4 bước)

### Bước 1: Parse Figma URL

Từ URL Figma do user cung cấp, extract:
```
https://www.figma.com/design/{fileKey}/...?node-id={nodeId}
```

- `fileKey`: chuỗi sau `/design/` và trước `/`
- `nodeId`: giá trị param `node-id` (dạng `XXXX-YYYY`)
- Lưu vào biến để dùng cho API calls

### Bước 2: Lấy Design Data từ Figma REST API

**KHÔNG** dùng browser để xem Figma (sẽ bị chặn login). Dùng trực tiếp `curl` với token:

```bash
# Lấy node structure
curl -s --max-time 30 \
  -H "X-Figma-Token: {TOKEN}" \
  "https://api.figma.com/v1/files/{fileKey}/nodes?ids={nodeId}&depth=4" \
  -o /tmp/figma_node.json

# Lấy render image của node
curl -s --max-time 30 \
  -H "X-Figma-Token: {TOKEN}" \
  "https://api.figma.com/v1/images/{fileKey}?ids={nodeId}&format=png&scale=1" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(list(d.get('images', {}).values())[0])"
```

**Thông tin thu thập từ JSON:**
- `fills[].color` → màu nền (convert rgba 0-1 sang hex)
- `style.fontFamily`, `style.fontSize`, `style.fontWeight` → typography
- `paddingLeft/Right/Top/Bottom` → spacing
- `cornerRadius` → border radius
- `itemSpacing` → gap
- `absoluteBoundingBox.width/height` → kích thước
- `children[].name` → tên elements
- `children[].fills[].color` → màu từng child element

**Hàm convert màu:**
```python
def rgba_to_hex(color):
    r = int(color.get('r', 0) * 255)
    g = int(color.get('g', 0) * 255)
    b = int(color.get('b', 0) * 255)
    return '#{:02X}{:02X}{:02X}'.format(r, g, b)
```

### Bước 3: Chụp UI Thực tế (Browser Subagent)

Giao nhiệm vụ cho Browser Subagent với các yêu cầu sau:

```
1. Navigate đến [LIVE_URL]
2. Resize viewport: 1920x1080 (BẮT BUỘC)
3. Đăng nhập nếu cần: [EMAIL] / [PASSWORD]
4. Navigate đến page/section cần so sánh
5. Chụp screenshot:
   - Full page: capture toàn bộ màn hình
   - Sidebar: crop vùng sidebar/navigation
   - Header: crop vùng header
   - Main content: crop vùng nội dung chính
6. Inspect DOM và thu thập CSS computed values:
   - background-color, color của các element chính
   - font-family, font-size, font-weight của text chính
   - padding, margin, gap của containers
   - border-radius của cards, buttons
7. Đóng browser sau khi hoàn thành
```

**Lưu screenshots vào:** `report-compare-figma/ui-comparison/screenshots/`

### Bước 4: So sánh và Sinh Báo cáo

Đối chiếu từng thuộc tính và sinh báo cáo theo format chuẩn:

```markdown
# UI vs Figma Comparison Report
**Node:** {nodeId} — {nodeName}
**Figma File:** {fileKey}
**Live URL:** {liveUrl}
**Timestamp:** {ISO8601}
**Viewport:** 1920×1080

## Summary
| Metric | Value |
|--------|-------|
| Total checks | N |
| Passed | N |
| Discrepancies | N |
| Match rate | X% |

## Screenshots
[embed screenshots]

## Matching Items ✅
[list]

## Discrepancies ❌
### {Severity} | {Element} | {Property}
- **Figma:** {value}
- **UI:** {value}
- **Impact:** {description}

## Action Items
[prioritized list]
```

**Lưu báo cáo vào:**
```
report-compare-figma/ui-comparison/ui_comparison_{nodeId}_{YYYYMMDD_HHMMSS}.md
```

---

## Severity Levels

| Level | Khi nào dùng |
|-------|-------------|
| 🔴 **Critical** | Sai branding, text sai, element bị thiếu |
| ⚠️ **Major** | Sai màu chính, tiêu đề duplicate, layout bị vỡ |
| ⚡ **Minor** | Sai spacing ≤ 4px, sai border-radius nhỏ |
| ℹ️ **Info** | Out of scope, cần kiểm tra thêm |

---

## Output Format Chuẩn

Mỗi lần so sánh tạo **1 subfolder riêng** theo section/node được compare:

```
report-compare-figma/ui-comparison/
└── {section-name}_{nodeId}_{YYYYMMDD}/          ← 1 folder = 1 lần compare
    ├── screenshots/
    │   ├── figma_design.png                     ← ảnh render từ Figma API
    │   ├── live_ui_full.png                     ← full page screenshot
    │   ├── live_ui_{section}.png                ← zoomed section
    │   └── live_ui_{section2}.png               ← thêm nếu cần
    └── report.md                                ← báo cáo so sánh
```

**Quy tắc đặt tên subfolder:**
- `{section-name}`: tên Figma node (lowercase, dấu cách → gạch ngang), ví dụ `sidebar`, `login-page`, `product-card`
- `{nodeId}`: Figma node ID, ví dụ `10875-28049`
- `{YYYYMMDD}`: ngày chạy, ví dụ `20260428`

**Ví dụ thực tế:**
```
report-compare-figma/ui-comparison/
├── sidebar_10875-28049_20260428/
│   ├── screenshots/
│   │   ├── figma_design.png
│   │   ├── live_ui_full.png
│   │   └── live_ui_sidebar.png
│   └── report.md
├── login-page_10875-11111_20260428/
│   ├── screenshots/
│   │   ├── figma_design.png
│   │   └── live_ui_login.png
│   └── report.md
└── product-card_10875-22222_20260429/
    ├── screenshots/
    └── report.md
```

Lệnh tạo subfolder:
```bash
SECTION_DIR="report-compare-figma/ui-comparison/{section-name}_{nodeId}_{YYYYMMDD}"
mkdir -p "$SECTION_DIR/screenshots"
```

---

## Tips Tối Ưu Tốc Độ

1. **Song song hóa**: Chạy Figma API call và Browser Subagent cùng lúc
2. **Giới hạn depth**: Dùng `depth=4` hoặc `depth=3` thay vì không giới hạn  
3. **Cache token**: Token đọc từ `mcp_config.json` 1 lần, tái sử dụng
4. **Targeted screenshots**: Chỉ chụp sections liên quan đến Figma node, không chụp toàn bộ app
5. **Figma image export**: Dùng API `/images` để lấy ảnh render thay vì mở browser xem Figma

---

## Lỗi Thường Gặp & Cách Xử Lý

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `ECONNREFUSED 127.0.0.1:3845` | Figma Desktop không chạy | Dùng REST API trực tiếp (không cần Desktop) |
| `{"err": "Invalid token"}` | Token sai hoặc hết hạn | Tạo token mới tại figma.com/settings |
| `curl` empty response | File quá lớn, timeout | Dùng `--max-time 30`, tách sang node con |
| Figma URL bị chặn login | Browser không có session | Luôn dùng REST API, không dùng browser để xem Figma |
| Token thiếu scope | Chỉ có `current_user:read` | Thêm `file_content:read`, `file_metadata:read` |

---

## Tham chiếu Rules

- `.agent/rules/figma_comparison_rules.md` — Quy tắc chi tiết cho Figma comparison
- `.agent/rules/automation_rules.md` — Quy tắc chung automation
- `.agent/rules/playwright_rules.md` — Browser subagent rules
