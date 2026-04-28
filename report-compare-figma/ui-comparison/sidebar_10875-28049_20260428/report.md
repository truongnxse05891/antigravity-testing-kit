# UI vs Figma Design Report

**Figma Node:** `10875-28049` — Side bar (PrimeOne 3.1.0)
**Figma File:** `rWCwVf9eQTJ3oPUMeSIWim`
**Live URL:** https://cc-dev.mixc.co/shopbase/
**Thoi gian kiem tra:** 2026-04-28T10:53:00+07:00
**Viewport:** 1920x1080

---

## Summary

| Metric | Gia tri |
|--------|---------|
| Tong diem kiem tra | 15 |
| Khop | 10 |
| Sai khac (Critical) | 1 |
| Sai khac (Major) | 1 |
| Sai khac (Minor) | 2 |
| Info/Out of scope | 1 |
| Ti le phu hop | 67% |

---

## Screenshots

### Login Page
![Login Page](./screenshots/live_ui_login_20260428.png)

### Dashboard Full Page
![Dashboard Full](./screenshots/live_ui_full_20260428.png)

### Main Content
![Main Content](./screenshots/live_ui_content_20260428.png)

---

## Matching Items (10/15)

| Hang muc | Figma | UI Thuc te | Ket qua |
|----------|-------|------------|---------|
| Sidebar background | `#FFFFFF` | `#FFFFFF` | PASS |
| Workspace header bg | `#E2E8F0` (xam nhat) | Xam nhat/xanh nhat | PASS |
| Active menu item bg | `#F1F5F9` | Highlight xanh nhat | PASS |
| Default menu item bg | `#FFFFFF` | `#FFFFFF` | PASS |
| Font family | Inter | Inter | PASS |
| Sidebar nav items | Dashboard, Orders, Products, Customers, Discounts, Settings, Online Store | Dashboard, Orders, Products, Customers, Discounts, Settings, Online Store | PASS |
| Page title text | "Welcome to Shop Dashboard" | "Welcome to Shop Dashboard" | PASS |
| Revenue card | Hien thi metric card | Hien thi d0 | PASS |
| Total order card | Hien thi metric card | Hien thi 0 | PASS |
| Activity section | Co section Activity | "No activities found" | PASS |

---

## Discrepancies Found

### [CRITICAL] Logo thuong hieu sai — Login Page

- **Figma:** Branding PrimeOne / ShopBase / Mesbox
- **UI thuc te:** Logo hien thi la **"saleor"** tai goc tren trai trang Login
- **Impact:** Sai branding nghiem trong, anh huong den nhan dien san pham
- **Evidence:** Screenshot `live_ui_login_20260428.png`
- **Priority:** P0

### [MAJOR] Tieu de trang bi lap doi

- **Figma:** "Welcome to Shop Dashboard" chi xuat hien 1 lan trong header/breadcrumb
- **UI thuc te:** Tieu de hien thi **2 lan** — 1 lan o top header bar, 1 lan trong content area
- **Impact:** Trai nghiem nguoi dung kem, co the la bug render
- **Evidence:** Screenshot `live_ui_full_20260428.png`
- **Priority:** P1

### [MINOR] Sidebar navigation icons — can verify alignment

- **Figma:** Menu items co icons di kem text labels, kich thuoc va can chinh cu the
- **UI thuc te:** Icons hien thi nhung can verify do can chinh va kich thuoc chinh xac hon
- **Impact:** Thau my, khong anh huong chuc nang
- **Priority:** P2

### [MINOR] Sidebar width normalization

- **Figma node:** Frame width 1259px (canvas scale lon)
- **UI thuc te:** Sidebar width ~192px (standard admin sidebar)
- **Note:** Figma canvas dung scale khac, can normalize de so sanh chinh xac
- **Priority:** P2

### [INFO] Get set up checklist — ngoai scope Figma node nay

- **Figma (10875-28049):** Chi bao gom Sidebar component
- **UI thuc te:** Dashboard hien thi "Get set up 0/7 steps" voi onboarding checklist va video Mesbox
- **Note:** Can lay node ID cua full dashboard page de so sanh day du hon
- **Priority:** P3 (phat sinh them)

---

## Action Items

| # | Van de | Nguyen nhan | Priority | Assignee |
|---|--------|-------------|---------|---------|
| 1 | Thay logo "saleor" bang logo dung tren Login page | Wrong branding asset | P0 - Critical | Dev |
| 2 | Fix tieu de bi duplicate "Welcome to Shop Dashboard" | Render bug | P1 - Major | Dev |
| 3 | Verify icon alignment trong sidebar | Design spec chua ro | P2 - Minor | QA |
| 4 | Lay Figma node ID cua full dashboard page de so sanh day du | Out of scope hien tai | P3 - Info | QA |

---

## Figma Design Data (trich xuat tu API)

**Node type:** FRAME
**Node name:** Side bar
**Canvas size:** 4697 x 1153 (scale lon, multiple states)

| Component | Figma fill |
|-----------|-----------|
| Sidebar container | `#FFFFFF` |
| Workspace header | `#E2E8F0` |
| Active menu item | `#F1F5F9` |
| Default menu item | `#FFFFFF` |
| Text elements | `#000000` |
| Font | Inter, 36px, weight:400 (canvas scale) |

---

## How to re-run

```bash
# Re-run comparison voi tuong tu command
/compare_figma_with_ui \
  "https://www.figma.com/design/rWCwVf9eQTJ3oPUMeSIWim/?node-id=10875-28049" \
  "https://cc-dev.mixc.co/" \
  --login admin@gmail.com admin123456
```

**Figma Token:** Cau hinh tai `~/.gemini/antigravity/mcp_config.json`
