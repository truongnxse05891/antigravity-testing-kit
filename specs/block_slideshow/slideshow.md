# Slideshow

As a merchant, I want to display content as slideshow, so I can diversify and optimize the displayed content beside grid layout

## Resource

[WF](https://www.figma.com/file/PtzakmSYnhFOeL0mMGwPh4/DP-Dashboard-%26-Web-Builder-Wireframe?node-id=26638%3A327276&t=kBHzraZijOWhF475-4)

[Design](https://www.figma.com/file/9J11n3j1lG01kkCASUhmjc/%5B-WB-%5D-Blocks?type=design&node-id=64379-272218&mode=design&t=2oYuM3KaprbDn2CO-11)

## Context

Tạo ra một block là slideshow với các layout tạo sẵn, user có thể thay đổi settings để customize theo ý muốn

Cần hiểu về cơ chế add background ([spec](https://docs.ocg.to/books/shopbase-specs/page/12581/edit))

## Acceptance Criteria

* Merchant có thể lựa chọn 1 trong 2  loại layout phổ biến của block slideshow:
  * Layout 1: Full - Background (image hoặc video) + Content
  * Layout 2: Split - Background's width = 1/2 slide, Content's width = 1/2 slide
* Các dạng layout apply cho tất cả các slide trong block slideshow
* Phần content trong layout bao gồm: Sub heading, Heading, Description, Primary button, Secondary button
  * User config cho thành phần nào thì content của slideshow hiển thị phần đó. Ví dụ user điền label text cho Secondary button thì slideshow đó có secondary button
  * Default: hiển thị tất cả những thành phần có thể có trong phần content
* ==User có thể upload image/insert video url (youtube/vimeo) hoặc select image từ gallery để hiển thị media cho từng slide==
  * ==Default: Ảnh/video slide được sync giữa các device==
  * ==User có thể thay thế ảnh/video được sync đó bằng ảnh riêng trên mobile. Ảnh thay thế này vẫn có những setting config như background size, background position, overlay== 
* User có thể chuyển đổi giữa các dạng layout
  * Ghi nhớ những thành phần chung của layout mà user đã config liền trước đó để apply vào layout vừa được switch
* User có thể:
  * Sắp xếp vị trí giữa các slide
  * Dupliacte slide được chọn (ngay bên dưới slide chọn để duplicate)
  * Remove slide được chọn
  * Add slide: Tạo ra 1 slide mới với các settings default theo layout được chọn
  * Edit slide
    * Mỗi loại layout sẽ có các settings tương ứng để edit
      * Layout 1:
        * User có thể show một phần item (slide) phía trước và phía sau của item chính (slide nhìn thấy toàn bộ) bằng bật Show items partially. Defaut: OFF
        * User có thể add background color cho riêng phần content
      * Layout 2:
        * User có thể Flip content, tức là content sẽ đổi vị trí cho background image/video. Default: OFF
* User có thể bật autoplay cho slideshow cho tất cả các layout
  * Nếu Autoplay = ON thì user có thể config thêm các thông số:
    * Loop (quay lại slide đầu tiên sau khi chạy hết đến slide cuối cùng)
    * Delay duration for 1 slide
      * default = 3 giây
      * min = 1 giây, max= 20 giây
    * Khi hover vào slide thì tự động dừng auto play, không hover nữa thì chạy tiếp slideshow
* User có thể bật tắt việc hiển thị navigation (arrow dùng để control việc move slide left and move slide right)
  * Default: ON
* User có thể bật tắt việc Slide Nav (dùng để dùng để control việc move slide left and move slide right)
  * Default: ON
* User có thể bật tắt auto rewind:
  * Auto rewind = ON: tự động tua lại slide đầu tiên khi click đến slide cuối cùng, vẫn xuất hiện arrow để next tiếp
  * Auto rewind = OFF: Loại bỏ arrow của slide cuối cùng để không tự động chuyển về slide đầu tiên
* Merchant có thể migrate [data của slideshow section của theme ver2](https://monosnap.com/file/84SvD3YPhVc6ix6PQfTJHyxM30l8vy) sang block sideshow của theme ver3 trong WB bằng cách:
  * Click vào CTA "Import now" trong tab content của block slideshow trong WB để migrate những setup của menu trong Navigation dashboard