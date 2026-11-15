# CLB Nghệ thuật THPT Bảo Lộc | Sitewide Comic Mode v2.0 DEMO

## Đây là gì?

Bản demo **toàn bộ website CLB** có công tắc `CHẾ ĐỘ ZZZ` ở header. Đây không còn
là Poster Mode chỉ ở khu vực triển lãm. Hệ thống gồm hai trải nghiệm:

- **Classic** (mặc định): trang CLB vốn có, giữ nguyên các CSS/JS và nội dung cũ.
- **ZZZ**: ấn bản comic màu tím của **toàn trang**, với minh họa nhân vật, các
  trường cảnh tranh, typography lớn, thông tin dạng editorial và hiệu ứng
  chuyển cảnh có mục đích. Hình ảnh thật của thành viên vẫn được giữ nguyên.

Ảnh minh họa nhân vật/trường lớp/megaphone/vinyl trong `assets/zzz-v2/` là artwork
concept riêng cho bản demo, **không phải tác phẩm thật của học sinh**. Khi chọn
phương án cuối cùng có thể thay các ảnh concept bằng artwork chuẩn do CLB duyệt.
Không sao chép nhân vật, logo hay assets từ trò chơi Zenless Zone Zero.

## Xem demo trên GitHub Pages

Giải nén ZIP rồi chép **nội dung ở bên trong thư mục** lên gốc repository GitHub
Pages CLB, tốt nhất trên nhánh riêng. Không tạo thêm một lớp thư mục bọc bên ngoài.

- Giao diện gốc: `https://namcchet-cloud.github.io/CLB/`
- Bật ZZZ toàn trang: `https://namcchet-cloud.github.io/CLB/?mode=zzz`
- Quay về gốc: `https://namcchet-cloud.github.io/CLB/?mode=classic`
- Có thể bật/tắt bằng công tắc **CHẾ ĐỘ ZZZ** ngay trên header.
- Lựa chọn được ghi nhớ theo trình duyệt.

Cũng có thể chạy cục bộ tại thư mục đã giải nén:

```bash
python -m http.server 8000
```

Sau đó mở `http://localhost:8000/?mode=zzz`. Không cần npm, framework hoặc
backend. Không mở `index.html` trực tiếp bằng `file://` vì các ES modules của
website gốc cần một web server.

## Thay đổi trong bản này

1. `index.html`: **chỉ thêm 3 thẻ nạp file** (boot JS, CSS, JS) sau những file
   hiện có, không bỏ các thẻ nguồn cũ.
2. `js/core/sitewide-zzz-boot.js`: bộ chọn chế độ rất nhỏ, nạp sớm nhằm tránh
   chớp giao diện và **tuân thủ Content Security Policy** (không dùng inline JS).
3. `css/sitewide-zzz.css`: style có phạm vi toàn trang khi
   `html[data-clb-mode="zzz"]` (không thay các token CSS hệ thống cũ).
4. `js/features/sitewide-zzz.js`: công tắc, lưu chế độ, đổi query URL,
   illustrator props, chỉ mục chương và tương tác trong chế độ mới.
5. `assets/zzz-v2/`: những artwork concept độc lập, bao gồm 4 tranh object
   illustration SVG sạch, có outline rõ và cel-shading chọn lọc.

Toàn bộ CSS/JS hoạt ảnh cũ, script âm nhạc, mascot, gallery, nội dung hội họa,
PWA service worker và assets trước đó **không bị sửa**. Bản gallery cũ và Poster
Mode cục bộ vẫn được giữ trong Classic; khi bật ZZZ toàn trang, khu vực tác phẩm
được định dạng theo gallery ảnh thật và bộ lọc hiện có.

## Hệ chuyển động mới (chỉ khi ZZZ bật)

- **Đổi chế độ:** ink-swipe 2 nhịp (màn hình lật trang), không phủ nhiều layer ngẫu nhiên.
- **Cuộn trang:** các chương và thẻ vào theo hướng từ dưới, ngắn và có nhịp.
- **Cover:** minh họa dịch cực nhẹ theo vị trí con trỏ desktop.
- **Trưng bày:** card tác phẩm nhấc lên một nhịp; tranh không bị chỉnh sửa.
- **Hoạt động:** minh họa vật thể có chuyển động tinh tế khi hover.
- **Giảm chuyển động:** tôn trọng hệ điều hành và lựa chọn quiet/off của website gốc.

## Chất lượng và giới hạn demo

Đã kiểm tra qua Chrome headless **inline preview fixture** tại các viewport
1440×900, 800×1000 và 390×844. Kiểm tra CSS, tràn ngang, script khởi tạo,
nút bật/tắt, mode scoped và lỗi JavaScript. Đã kiểm tra ảnh từng section.
Do chính sách điều hướng của môi trường kiểm thử, **chưa thực hiện được một lượt
kiểm thử end-to-end qua HTTP tới website đầy đủ**. Trước khi thay main, cần
kiểm tra thêm công cụ nghe nhạc, overlay mascot, bộ lọc tác giả, modal và PWA
trên GitHub Pages thật.

Không có thay đổi nào được đẩy tự động lên repository.
