---
description: So sánh bản thiết kế Figma với UI hiện tại trên trình duyệt, phát hiện UI bugs và visual inconsistencies.
---

# Workflow: Compare Figma Design vs Live UI

// turbo-all

Workflow này kết hợp **Figma REST API** và **Browser Subagent** để tự động trích xuất thiết kế từ Figma, chụp ảnh UI thực tế, sau đó so sánh và sinh báo cáo sai khác có cấu trúc.

**Skill sử dụng:** `figma_ui_comparator` — đọc SKILL.md trước khi thực thi.
**Rules áp dụng:** `.agent/rules/figma_comparison_rules.md`

---

## Input yêu cầu

```
/compare_figma_with_ui [FIGMA_URL] [LIVE_URL] --login [email] [password]
```

**Ví dụ:**
```
/compare_figma_with_ui \
  https://www.figma.com/design/rWCwVf9eQTJ3oPUMeSIWim/?node-id=10875-28049 \
  https://cc-dev.mixc.co/ \
  --login admin@gmail.com admin123456
```

---

## Chuẩn bị (Bước 0 — tự động)

Đọc Figma token từ config:
```bash
cat ~/.gemini/antigravity/mcp_config.json | python3 -c \
  "import json,sys; print(json.load(sys.stdin)['mcpServers']['figma']['env']['FIGMA_PERSONAL_ACCESS_TOKEN'])"
```

Parse URL để lấy `fileKey` và `nodeId`:
- `fileKey`: segment sau `/design/` trước tên file
- `nodeId`: giá trị `node-id` param (dùng dấu `-`, không encode)

Tạo thư mục output:
```bash
mkdir -p {project_root}/report-compare-figma/ui-comparison/screenshots
```

---

## Bước 1 + 2 (Song song) — Figma API & Live UI

### 1A: Lấy Figma design data [SONG SONG với 1B]

```bash
# Lấy node JSON
curl -s --max-time 30 \
  -H "X-Figma-Token: {TOKEN}" \
  "https://api.figma.com/v1/files/{fileKey}/nodes?ids={nodeId}&depth=4" \
  -o /tmp/figma_node.json

# Lấy render image URL
curl -s --max-time 30 \
  -H "X-Figma-Token: {TOKEN}" \
  "https://api.figma.com/v1/images/{fileKey}?ids={nodeId}&format=png&scale=1"
```

Extract từ JSON:
```python
import json

def rgba_to_hex(c):
    return '#{:02X}{:02X}{:02X}'.format(int(c['r']*255), int(c['g']*255), int(c['b']*255))

data = json.load(open('/tmp/figma_node.json'))
# Duyệt qua nodes, lấy fills, style, padding, cornerRadius, children
```

### 1B: Browser Subagent chụp Live UI [SONG SONG với 1A]

```
Task: 
1. Navigate [LIVE_URL] → Resize 1920x1080
2. Login nếu cần: [EMAIL] / [PASSWORD] 
3. Navigate đến section cần so sánh
4. Chụp:
   - Full page screenshot
   - Sidebar/navigation screenshot
   - Header screenshot
   - Main content screenshot
5. Inspect DOM: lấy CSS computed values (background-color, font, padding, border-radius)
6. Đóng browser
```

---

## Bước 3: So sánh

Đối chiếu từng thuộc tính theo bảng:

| Thuộc tính | Lấy từ Figma | Lấy từ UI (CSS) | Khớp? |
|-----------|-------------|-----------------|-------|
| Background color | `fills[0].color` → HEX | `background-color` → HEX | ✅/❌ |
| Font family | `style.fontFamily` | `font-family` | ✅/❌ |
| Font size | `style.fontSize` px | `font-size` px | ✅/❌ |
| Font weight | `style.fontWeight` | `font-weight` | ✅/❌ |
| Padding | `paddingLeft/Right/Top/Bottom` | `padding` px | ✅/❌ |
| Gap/Spacing | `itemSpacing` | `gap` px | ✅/❌ |
| Border radius | `cornerRadius` | `border-radius` | ✅/❌ |
| Text content | text node content | DOM text | ✅/❌ |
| Element visibility | `visible` flag | visible in DOM | ✅/❌ |
| Branding/Logo | Component name | Rendered logo/text | ✅/❌ |

---

## Bước 4: Sinh và Lưu Báo cáo

**Tên file:** `ui_comparison_{nodeId}_{YYYYMMDD_HHMMSS}.md`

**Lưu vào:** `{project_root}/report-compare-figma/ui-comparison/`

**Screenshots:** Copy từ brain dir vào `report-compare-figma/ui-comparison/screenshots/`

**Template báo cáo:**
```markdown
# UI vs Figma Design Report
**Node:** {nodeId} — {nodeName}
**File:** {fileKey}  
**Live URL:** {liveUrl}
**Timestamp:** {ISO8601}

## Summary
| Total | Pass | Fail | Rate |
|-------|------|------|------|
| N     | N    | N    | X%   |

## Screenshots [embed]

## ✅ Matching
[list]

## ❌ Discrepancies
### {Severity} | {Element}
- Figma: {value}
- UI: {value}

## Action Items (ưu tiên)
| # | Issue | Priority |
|---|-------|---------|
```

---

## Quy tắc áp dụng

- **BẮT BUỘC đọc** `.agent/rules/figma_comparison_rules.md` trước khi thực thi
- Token lấy từ `~/.gemini/antigravity/mcp_config.json` — **KHÔNG** mở Figma qua browser
- Báo cáo phải lưu vào **project directory**, không chỉ trong brain
- Screenshot files phải có `timestamp` trong tên để phân biệt các lần chạy
- Severity: Critical > Major > Minor > Info

---

## Output chuẩn — Subfolder per section

**Mỗi lần compare tạo 1 subfolder riêng:**

```
report-compare-figma/ui-comparison/
└── {section-name}_{nodeId}_{YYYYMMDD}/          ← 1 section = 1 folder
    ├── screenshots/
    │   ├── figma_design.png                     ← render từ Figma API
    │   ├── live_ui_full.png                     ← full page
    │   └── live_ui_{section}.png                ← zoomed section
    └── report.md                                ← báo cáo
```

**Lệnh khởi tạo (chạy ở Bước 0):**
```bash
SECTION_NAME=$(echo "{node-name}" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
SECTION_DIR="report-compare-figma/ui-comparison/${SECTION_NAME}_{nodeId}_{YYYYMMDD}"
mkdir -p "$SECTION_DIR/screenshots"
```

**Ví dụ:**
```
report-compare-figma/ui-comparison/
├── sidebar_10875-28049_20260428/
├── login-page_10875-11111_20260428/
└── product-card_10875-22222_20260429/
```

> Screenshot và report được lưu cùng vị trí trong subfolder — không có file nằm nước ngoài subfolder.
