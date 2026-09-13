# CarePass Dermatology SaaS

CarePass là ứng dụng MVP B2B2C hỗ trợ theo dõi và tuân thủ phác đồ phục hồi da sau khám da liễu. Ứng dụng mô phỏng luồng làm việc giữa phòng khám, bác sĩ và bệnh nhân thông qua một mã CarePass.

> Đây là bản demo frontend sử dụng dữ liệu mock trong bộ nhớ, chưa kết nối backend hoặc cơ sở dữ liệu thực tế.

## Tính năng chính

### Bác sĩ / Phòng khám

- Xem bảng điều khiển các CarePass đang hoạt động.
- Tạo phác đồ mới cho bệnh nhân từ các mẫu có sẵn.
- Theo dõi tỷ lệ tuân thủ và tiến trình chăm sóc.
- Nhận cảnh báo sự cố kích ứng mức độ 2/3.
- Theo dõi SLA phản hồi và xử lý sự cố bệnh nhân.

### Bệnh nhân / Khách hàng

- Xem phác đồ chăm sóc theo buổi sáng và tối.
- Check-in từng bước trong routine.
- Theo dõi tỷ lệ tuân thủ và điểm thưởng.
- Nhận hướng dẫn thời gian chờ giữa các sản phẩm.
- Báo cáo triệu chứng và vùng da bị ảnh hưởng.
- Kiểm tra tương kỵ giữa các hoạt chất chăm sóc da.

### Kiến trúc IT & Specs

- Xem luồng nghiệp vụ và kiến trúc hệ thống ở mức MVP.
- Minh họa các thành phần liên quan đến CarePass, routine, cảnh báo và xử lý sự cố.

## Kịch bản UAT nhanh

Thanh điều khiển phía trên ứng dụng có 5 kịch bản mẫu:

1. Tạo phác đồ mới ở màn hình Bác sĩ.
2. Chuyển sang hồ sơ bệnh nhân `CP-1024`.
3. Kiểm tra giãn cách 15 phút và check-in routine.
4. Tạo cảnh báo SOS và kiểm tra SLA 30 phút.
5. Mở bộ quét tương kỵ hoạt chất.

## Công nghệ

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- `lucide-react` cho icon
- Web Audio API cho âm thanh thông báo trong demo

## Yêu cầu môi trường

- Node.js 18 trở lên
- npm hoặc Yarn

## Cài đặt và chạy

### Với Yarn

```bash
yarn install
yarn dev
```

### Với npm

```bash
npm install
npm run dev
```

Trên Windows nếu PowerShell chặn `npm.ps1`, dùng:

```powershell
npm.cmd install
npm.cmd run dev
```

Vite thường chạy tại `http://localhost:5173`. Nếu cổng này đang được sử dụng, Vite sẽ chọn một cổng khác và hiển thị URL trong terminal.

## Build production

```bash
npm run build
```

Hoặc:

```bash
yarn build
```

Xem bản build bằng preview server:

```bash
npm run preview
```

## Cấu trúc thư mục

```text
src/
├── App.tsx                    # Layout chính và thanh kịch bản UAT
├── main.tsx                   # Entry point React
├── index.html                 # HTML entry của Vite
├── index.css                  # Tailwind CSS entry
├── vite.config.ts             # Cấu hình React và Tailwind Vite plugin
├── types.ts                   # Kiểu dữ liệu CarePass, routine, incident
├── context/
│   └── CarePassContext.tsx    # State và nghiệp vụ dùng chung
├── components/
│   ├── Navbar.tsx             # Điều hướng vai trò và chọn hồ sơ
│   ├── doctor/
│   │   └── ClinicPortal.tsx   # Giao diện bác sĩ / phòng khám
│   ├── patient/
│   │   └── PatientApp.tsx     # Giao diện bệnh nhân
│   └── specs/
│       └── ItSpecsExplainer.tsx # Màn hình IT specs
├── data/
│   └── mockData.ts            # Phòng khám, CarePass và phác đồ mẫu
└── utils/
    └── audio.ts               # Âm thanh check-in và cảnh báo
```

## Trạng thái dữ liệu

State hiện được quản lý bởi `CarePassContext` và khởi tạo từ `data/mockData.ts`. Khi reload trang, các thay đổi trong demo sẽ được reset về dữ liệu ban đầu.

Các nghiệp vụ chính gồm:

- Tạo và chọn CarePass.
- Check-in hoặc bỏ check-in từng routine item.
- Tính lại tỷ lệ tuân thủ và điểm thưởng.
- Tạo, đếm SLA và xử lý incident.
- Chuyển đổi giữa ba vai trò giao diện.

## Lưu ý y khoa và kỹ thuật

- Nội dung phác đồ chỉ phục vụ mục đích trình diễn sản phẩm.
- Không sử dụng dữ liệu demo để thay thế chỉ định của bác sĩ da liễu.
- Ứng dụng chưa có xác thực, phân quyền backend, lưu trữ lâu dài, đồng bộ realtime hoặc tích hợp hệ thống phòng khám.
- Trước khi triển khai thực tế cần bổ sung bảo mật dữ liệu y tế, audit log, API backend, kiểm soát quyền truy cập và kiểm thử nghiệp vụ.
