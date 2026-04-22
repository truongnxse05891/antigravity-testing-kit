# Breadcrumb

As a ShopBase merchant, I want to show breadcrumbs on my website, so that buyer can easily navigate the web pages easier.

## Resources

* [Wireframes](https://www.figma.com/file/PtzakmSYnhFOeL0mMGwPh4/Web-Builder-Wireframe?type=design&node-id=50693%3A125712&mode=design&t=nt8uWIr722q5hPG0-1)
* [Design](https://www.figma.com/file/9J11n3j1lG01kkCASUhmjc/%5B-WB-%5D-Blocks?type=design&node-id=64365-126657&mode=design&t=2oYuM3KaprbDn2CO-11)

## Context (optional)

## Flows, Scenarios (optional)

### Main Flows

### Other Flows, Cases

## Acceptance Criteria

* Seller có thể insert breadcrumb ở tất cả các page
  * Khi merchant insert breadcrumb vào page nào thì show router mặc định của page đó ở webfront. VD insert vào product page thì sẽ hiện router dạng: Home > All > Product name
  * Default settings & styles khi merchant insert block (xem trên design))
* Rule hiển thị breadcrumb ở các trang
  * Product detail, blog post thì tùy vào paths mà buyer truy cập thì breadcrumb cũng sẽ thay đổi theo (\*)
    * Vào trực tiếp product detail / blog post từ Home thì breadcrumb là: Home / All / Product name
    * Vào trực tiếp product detail / blog post từ collection X thì breadcrumb là Home / X / Product name.
  * Ở trang Home thì chỉ hiển thị Home
  * Khi insert vào các trang khác, bao gồm cả các pages merchant tạo mới thì breadcrumb sẽ có dạng Home / {{Page name}}. Danh sách các page [xem tại đây](https://docs.ocg.to/books/shopbase-specs/page/website-builder---manage-shop-themes/13644)
    * Collection hoặc blog thì breadcrumb sẽ là: Home / {{Collection/Blog name}}
    * All products: Home / All
    * All collections:  Home / All collections
    * Thank you: Home / Thank you
    * ....
  * Các link phải dùng thẻ <a> để mở được ở tab mới.
* Content
  * Ẩn / hiện link tới Home trên breadcrumb.
  * Ẩn / hiện title của page hiện tại.
  * ==Option để thay link tới page "All products" trong breadcrumb thành link tới First relevant chứa sản phẩm đó (do 1 product có thể thuộc nhiều collection).==
    * ==First relevant collection là collection ~~đầu tiên chứa sản phẩm theo~~== [~~==thứ tự sort trong admin==~~](https://kb.ocg.to/doc/dashboard-collections-create-new-collection-dfl6ydjjb7/edit)~~==.==~~ ==mới nhất mà product được add vào (**logic tạm thời)**.==
    * ==Nếu sản phẩm không có collection thì vẫn giữ link tới "All products"==
  * ==Seller có thể add prefix text trước breadcrumb.==
* Seller có thể chỉnh sửa design của block (chi tiết xem design)
  * Chọn separator icon giữa các item trong breadcrumb
  * Sửa được màu chữ.
  * Font styles của item sẽ ăn theo web / page style
  * Seller có thể chỉnh sửa các [common settings](https://docs.ocg.to/books/shopbase-specs/page/website-builder---block-setting/12571) của 1 block: alignment, width, height, border, background,...
* Tất cả các thay đổi bên về styles, settings sẽ được thể hiện tương ứng bên webfront preview trong vòng 0.3s.
* Resize
* Webfront interaction.
  * Buyer hover vào item đang chưa selected thì cần highlight item đó.
  * Buyer click vào item nào thì mở page tương ứng, có thể mở ở tab mới.
* Merchant không thể thực hiện các interaction với webfront ở webfront preview trong web builder do sẽ bị conflict với action chọn block.

## Note (optional)

* Viết thêm note để làm rõ thêm về user story.
* Cho biết những việc cần làm, những mục nào thuộc phạm vi user story và những mục nào không.
* Đưa thêm các resource link hoặc file liên quan (Plact, ERD, Mindmap)

## Ideas for next updates

Bổ sung thêm các ideas chưa triển khai được ngay tại thời điểm hiện tại để team có thể nhìn thấy hướng phát triển tiếp theo và có cách cấu trúc phù hợp.

* List thêm các ý tưởng và hướng phát triển tiếp theo của feature
  * Nên list các phần idea đã clear (chỉ chưa triển khai đc vì constraints về thời gian, nguồn lực, dependencies...), không nên list quá nhiều dễ gây nhiễu loạn thông tin
* Link đến wireframe hoặc demo để dễ tưởng tượng hơn (nếu có)

## Technical Note

* Viết dạng free form hoặc link tới các doc chưa technical design, note.
* Dev team cần chủ động plan và update phần này để các member khác maintain feature có thể dễ hiểu hơn về user story.