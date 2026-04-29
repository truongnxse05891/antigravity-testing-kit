# Heading & Paragraph

As a user (website editor/admin), I want to edit text decorations so that make my web more attractive and good reading.

## Resources

Wireframe Block: [Link](https://www.figma.com/file/PtzakmSYnhFOeL0mMGwPh4/DP-Dashboard-Wireframe?node-id=4713%3A156378) Wireframe Insert Variable: [Link](https://www.figma.com/file/PtzakmSYnhFOeL0mMGwPh4/DP-Dashboard-Wireframe?node-id=14750%3A200310)

[Design](https://www.figma.com/file/9J11n3j1lG01kkCASUhmjc/%5B-WB-%5D-Blocks?type=design&node-id=64351-189058&mode=design&t=3ostMYRfxy7xTZrW-11)

## Context

* User insert block text để làm nội dung cho website.
* Cần đọc specs [block setting](https://docs.ocg.to/books/shopbase-specs/page/website-builder---block-setting/12571) để hiểu structure chung của block và common setting (width, height, padding,...)
* Cần nắm được feature Variable Input: [Link](https://docs.ocg.to/books/shopbase-specs/page/sb---variable-input/13335)

## Acceptance Criteria

* Website Builder có 2 Block để User add thêm/xử lý text là:
  * Block Heading
  * Block Paragraph
* User kéo 1 trong 2 Block vào Web-front, Block được DnD thêm mới vào có setting mặc định:
  * Block Heading:
    * Font-Style = H1
    * Tag = <h1>
  * Block Paragraph
    * Font-Style = P1
    * Tag = <p>
* W/H của Block tự động tăng giảm theo chiều rộng & số dòng thực tế của đoạn văn bản được nhập liệu vào.
* Block Heading & Paragraph có setting mặc định về line-height và paragraph-spacing: -> [Logic](https://www.figma.com/file/R1BQoafo2EJJq5koITiKzk/Storefront-kit?node-id=2666%3A11173)
* User có thể double click hoặc ấn vào button "Edit content" trên Quick bar setting để sửa đổi nội dung text. Khi user sửa nội dung text thì resize handle và padding line, margin line sẽ ẩn đi.

**PHƯƠNG THỨC NHẬP LIỆU**

* Gõ trực tiếp vào box text
* Dán nội dung từ clipboard
  * Khi dán từ clipboard ra -> Không nhận/dán ảnh; Nếu có bullet thì tự động chuyển sang bullet mặc định
  * Apply theo setting của block text hiện tại (font style, decorations, color...)
* Click vào block -> hiển thị ra setting (cả quick bar và side bar) và vùng chọn của block
* Double click enable edit text & bôi đen toàn bộ text
* Double click vào 1 chữ thì bôi đen chữ đó
* Triple click vào vùng trống trong block hoặc cạnh (đường viền) của block thì bôi đen toàn bộ text.
* Apply Setting Logic:
  * Các setting: Style, Tag, Align: áp dụng cho toàn bộ Block
  * Các setting: Decoration, Link, Bullet: áp dụng cho vùng bôi đen

**THAO TÁC USER ĐIỀU CHỈNH SIZE**

 ![image-1659085464111.png](https://docs-files.bgroupltd.com/uploads/images/gallery/2022-07/scaled-1680-/4B8f2mcm5nsD137b-image-1659085464111.png)

* Thao tác của User chỉ kéo được chiều ngang của Block Text:
  * Khi border của Block chạm vào chữ thì chữ sẽ xuống dòng theo từng từ.
  * Chiều cao của Block tăng theo dòng mới tạo do chữ drop xuống
  * Chiều cao của parent chứa Block cũng tăng theo
  * Cho phép User thu hẹp tối đa khi 2 cạnh bên của blocks trùng nhau

**BLOCK SETTING:**

 ![image-1658465051502.png](https://docs-files.bgroupltd.com/uploads/images/gallery/2022-07/scaled-1680-/1WagQEigOqt7xuzF-image-1658465051502.png)

Các thuộc tính của Block Heading & Paragraph:

|    |    |
|----|----|
| **Font styles** | -   User lựa chọn 1 trong 2 loại Block Text là: Heading hoặc Paragraph để DnD vào section:\n-   **Block Heading**\n    -   Hiển thị nội dung mặc định: "Edit your title here"\n    -   Style được quy định theo Website/Page Style\n    -   Style mặc định Heading 1 - User có thể chọn option: Heading 1 -> Paragraph 3\n-   **Block Paragraph**\n    -   Hiển thị nội dung mặc định: "Edit your paragraph here"\n    -   Style mặc định Paragraph 1 - User có thể option: Heading 1 -> Paragraph 3\n-   User có thể hiệu chỉnh Style các Heading và Paragraph trong [Website/Page Style](https://docs.ocg.to/books/shopbase-specs/page/website-builder---style---dong-bo-webpage-style-voi-block-setting/12942)\n-   Khi merchant đổi font style trên desktop thì đồng thời sẽ đổi tag. Logic mapping font style và tag\n    -   Heading 1 --> h1\n    -   Heading 2 --> h2\n    -   Heading 3 --> h3\n    -   Heading 4 --> h4\n    -   paragraph 1, paragraph 2, paragraph 3 --> <p>\n-   Khi merchant đổi font style trên mobile thì tag sẽ không đổi. |
| **Text Align** | -   Mặc định text-align: left & middle (of box contain)\n-   Setting:\n    -   Title: left, center, right, justify (later)\n    -   Paragraph: left, center, right, justify (laster)\n-   Khi user bôi đen 1 đoạn văn bản và điều chỉnh align thì sẽ áp dụng cho toàn bộ paragraph chứa đoạn văn bản được bôi đen đó. |
| **Text Decorations** | -   Mặc định theo font styles\n-   Các loại decorations có thể multiselect:\n    -   Bold\n    -   Italic\n    -   Underline\n    -   Strikethrought\n-   Khi User click chọn Block thì thuộc tính này áp dụng cho toàn bộ Block\n-   Khi User chỉ bôi đen 1 đoạn văn bản thì chỉ áp dụng với đoạn văn bản đó |
| **Auto listing** | -   Có 2 option bullet:\n    -   Dạng Number\n    -   Dạng Dot\n-   Tự động thêm/nhảy số khi User enter xuống dòng\n-   Cho phép ấn tab để thụt lề, không ảnh hưởng gì đến value của bullet\n-   Áp dụng cho toàn bộ block hoặc khi User chỉ bôi đen 1 đoạn văn bản thì chỉ áp dụng với đoạn văn bản đó |
| **Color** | -   Màu mặc định theo bộ màu của Website/Page Style\n-   Bộ chỉnh màu gồm các phần:\n    -   Hiển thị preset bộ màu sẵn của Web/Page Style để quick select\n    -   Pallet màu\n    -   Nhập mã màu HEX\n-   Cho phép user bôi đen 1 phần text và đổi màu riêng vùng được bôi đen\n-   Con trỏ đang trỏ ở text có màu nào thì icon màu có màu tương ứng\n-   Link http:// hoặc text được gán hyperlink -> tự động chuyển thành blue & enable underline. Nếu user chỉnh lại màu thì theo màu user chọn |
| **Hyperlink** | -   User click vào icon link để thêm liên kết cho text:\n    -   Open a link: gắn 1 đường link bất kỳ\n    -   Go to page: dẫn đến 1 page bất kỳ trong store\n    -   Make a call: "tel:"\n    -   Send email to: "mailto:"\n-   Khi chọn block -> Hyperlink toàn bộ text\n-   Khi select 1 vùng text nhất định -> Hyperlink riêng vùng text được chọn\n-   User dán link vào trường input\n-   User có thể xóa hyperlink bằng cách ấn button X\n-   Hiển thị state cho text được gắn link: underline, màu số 3 của color palette |
| **Tag** | -   Mục đích phục vụ chuẩn SEO theo nhu cầu của User khi tạo Page\n-   User có thể gán thẻ <h> từ <h1> đến <h6> và <p>.\n-   Mặc định tag sẽ ăn theo logic map với font style (xem ở phần font style bên trên).\n    \n-   Merchant đổi tag sẽ apply cả trên desktop và mobile. Việc đổi tag sẽ không làm đổi font style. |

[https://www.figma.com/file/iWtDIFZS6GIi3OS95CIZxV/Dashboard-Shopbase-Creator?node-id=5206%3A181171](https://www.figma.com/file/iWtDIFZS6GIi3OS95CIZxV/Dashboard-Shopbase-Creator?node-id=5206%3A181171)

* Editor có thể hỗ trợ được các định dạng sau:
  * Plain Text & Styling: các text với value được merchant nhập trực tiếp trên text editor
  * Variable Text: các text với value được hiển thị dynamically tùy theo từng store, merchant chỉ cần nhập tên biên trên text editor
* Khi edit block text trong web builder, merchant có thể:
  * Sử dụng quick bar settings để add thêm variable từ droplist
    * Sau khi merchant chọn biến từ drop list, variable sẽ được add ngay lập tức vào vị trí hiện tại của con trỏ chuột
  * Trigger khi merchant gõ ký tự {{ trong text editor
    * Merchant có thể sử dụng các phím mũi tên lên/xuống để lựa chọn nhanh variable từ dropslist & nhấn enter để add vào text editor
* Merchant có thể customize style của variable giống như đang thao tác với text bình thường
  * Giá trị của variable trên storefront sau khi được render value sẽ được áp dụng chính xác theo style merchant cấu hình trong web builder
* Merchant có thể lựa chọn được các variable sau từ danh sách ShopBase cung cấp:

|    |    |
|----|----|
| **Loại biến** | **Cú pháp** |
| Tên của Store | {{shop.name}} |
| Địa chỉ Email | {{shop.email}} |
| Số điện thoại | {{shop.phone}} |
| Địa chỉ | {{shop.address}} |
| URL Homepage | {{shop.domain}} |

**DEFAULT STATE KHI THÊM MỚI**

* Những settings mặc định khi thêm mới Block:
  * Content Source: default place holder: "Edit your title here"
  * Width = 100%
  * Height = Auto
  * Background = none
  * Border = none
  * Opacity = 100%
  * Radius = 0px
  * Shadow = none
  * Padding = 0
  * Margin = 0
  * Z-Index = 0
  * Position = on hoặc off do User thả từ Inser Panel vào Webfront