# Website Builder - Block - Divider

As a user (website editor/admin), I want to separate some objects and sections so that make my web to be more airy

## Resources

[https://www.figma.com/file/PtzakmSYnhFOeL0mMGwPh4/DP-Dashboard-Wireframe?node-id=5462%3A131770](https://www.figma.com/file/PtzakmSYnhFOeL0mMGwPh4/DP-Dashboard-Wireframe?node-id=5462%3A131770)

 ![image-1662957098990.png](https://docs-files.bgroupltd.com/uploads/images/gallery/2022-09/scaled-1680-/1yLoGIDNrWzIpwku-image-1662957098990.png)

* [Design](https://www.figma.com/file/9J11n3j1lG01kkCASUhmjc/%5B-WB-%5D-Blocks?type=design&node-id=64354-210546&mode=design&t=2oYuM3KaprbDn2CO-11)

## Context

* User insert block divider để ngăn cách nội dung giữa các phần.
* Cần đọc specs [block setting](https://docs.ocg.to/books/shopbase-specs/page/website-builder---block-setting/12571) để hiểu structure chung của block và common setting (width, height, padding,...)

## Acceptance Criteria

**SETTING**

 ![image-1658465858090.png](https://docs-files.bgroupltd.com/uploads/images/gallery/2022-07/scaled-1680-/boxfTtKyZuCa6wqr-image-1658465858090.png)

* User điều chỉnh độ dày của Divider bằng cách tăng chiều cao (H) của Block.
* Setting width, height của divider không có unit = auto.


**DEFAULT STATE KHI THÊM MỚI**

* Những settings mặc định khi thêm mới Block:
  * Content Source: None
  * Width = 50%
  * Height = 2px
  * Background = Màu \[5\]
  * Border = none
  * Opacity = 100%
  * Radius = 0px
  * Shadow = none
  * Padding = 0
  * Margin: Top = 30px ; Bottom = 30px
  * Z-Index = 0
  * Position = on hoặc off do User thả từ Inser Panel vào Webfront