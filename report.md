# Báo cáo Thực thi Kịch bản Kiểm thử Checkout (Turbo Mode)

| Tính năng | Checkout & Post Purchase Upsell |
| :--- | :--- |
| **Store** | plb-hyper-prod.onshopbase.com |
| **Tester** | Antigravity AI Agent |
| **Môi trường** | UI Automation (Browser Subagent) |
| **Chế độ chạy** | Extreme Turbo Mode (No-verify, Cache enabled) |

---

## 1. Kết quả - Scenario 1: `# SKIP_PPC`
* **Mục tiêu:** Thực hiện luồng thanh toán tiêu chuẩn, bỏ qua mọi đề xuất mua kèm (Upsell).
* **Order ID thu thập:** `#plb10677209_1143`
* **Hành vi xử lý Upsell:** Đã chèn click vào `No thanks, I'll pass`.
* **Thời gian hoàn tất:** 141 giây (Thực thi trong 1 phiên duy nhất xuyên suốt 2 kịch bản)
* **Trạng thái:** **PASSED** ✅

## 2. Kết quả - Scenario 2: `# ADD_PPC`
* **Mục tiêu:** Thực hiện luồng thanh toán và đồng ý mua kèm 1 mặt hàng Upsell bật lên sau checkout.
* **Order ID thu thập:** `#plb10677209_1144`
* **Hành vi xử lý Upsell:** Đã chèn click vào mút cam `Add to order` cho sản phẩm *Shower Drain Hair Catcher Mesh Stickers ($3.99)*.
* **Tổng giá trị hoá đơn ghi nhận:** $130.73
* **Thời gian hoàn tất:** 261 giây (Bao gồm thời gian xử lý UI nhảy nhầm Payment Method và đợi reload Iframe)
* **Trạng thái:** **PASSED** ✅

---
*Ghi chú: Cả hai luồng đều được chạy liên tục trong cùng phiên trình duyệt để tối ưu hoá việc đọc Cache điền tự động đối với form Shipping.*
