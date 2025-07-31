# Trận Chiến Trên Biển - Vue.js Edition

> Một ứng dụng web Battleship được xây dựng bằng Vue.js 3, chuyển đổi từ HTML/CSS/JS thuần.

## 🚀 Tính năng

- ✅ **Vue.js 3**: Sử dụng framework hiện đại với Composition API
- ✅ **Component-based**: Kiến trúc component tái sử dụng
- ✅ **Responsive Design**: Tương thích trên mọi thiết bị
- ✅ **Interactive Gameplay**: Trải nghiệm chơi game mượt mà
- ✅ **Smart Ship Placement**: Hệ thống đặt tàu thông minh
- ✅ **Keyboard Shortcuts**: Phím tắt tiện lợi
- ✅ **Auto Ship Placement**: Tính năng đặt tàu tự động
- ✅ **Tutorial & Guide**: Hướng dẫn chi tiết

## 🛠️ Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vue CLI** - Standard tooling for Vue.js development
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Advanced styling with custom properties
- **HTML5** - Semantic markup

## 📦 Cài đặt

1. **Clone repository hoặc download source code**

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run serve
   ```

4. **Mở trình duyệt và truy cập**
   ```
   http://localhost:8080
   ```

## 🔧 Các lệnh có sẵn

```bash
# Chạy development server
npm run serve

# Build cho production
npm run build

# Lint và fix files
npm run lint
```

## 🚀 Deploy lên GitHub Pages

Project này được deploy tự động lên GitHub Pages thông qua GitHub Actions.

### Cách deploy:

1. **Push code lên GitHub repository**
2. **GitHub Actions sẽ tự động build và deploy**
3. **Truy cập ứng dụng tại:**
   ```
   https://galaxy-vn.github.io/BattleshipGame/
   ```

### Cấu hình GitHub Pages (chỉ cần làm 1 lần):

1. Vào repository **Settings** → **Pages**
2. Chọn **Source**: **GitHub Actions**
3. Lưu cài đặt

Sau đó, mỗi lần push code lên branch `main`, ứng dụng sẽ được deploy tự động!

## 🎮 Cách chơi

### Đặt tàu
1. Chọn loại tàu từ menu điều khiển
2. Sử dụng nút "Xoay" hoặc phím `R` để thay đổi hướng
3. Click vào bảng để đặt tàu

### Tấn công
- Click vào bảng đối thủ để đánh dấu vị trí tấn công
- Sử dụng phím tắt để thao tác nhanh

### Phím tắt

**Trên bảng của bạn:**
- `1`: Đặt/Xóa tàu
- `2`: Đánh dấu tàu bị trúng
- `3`: Đánh dấu đối thủ bắn trượt
- `0`/`C`: Xóa ô
- `R`: Xoay hướng đặt tàu

**Trên bảng đối thủ:**
- `1`: Đánh dấu bắn trúng
- `2`: Đánh dấu bắn trượt
- `0`/`C`: Xóa ô

## 📁 Cấu trúc Project

```
src/
├── components/          # Vue components
│   ├── GameBoard.vue   # Component bảng game
│   ├── Navigation.vue  # Component điều hướng
│   ├── ShipControls.vue # Component điều khiển tàu
│   └── MessageContainer.vue # Component thông báo
├── views/              # Vue views/pages
│   ├── GamePage.vue    # Trang chơi game
│   ├── TutorialPage.vue # Trang hướng dẫn
│   └── AboutPage.vue   # Trang giới thiệu
├── App.vue             # Root component
└── main.js            # Entry point
```

## 🔄 Thay đổi từ phiên bản HTML/CSS/JS

### Cải tiến chính:
- **Modularization**: Code được chia thành các component riêng biệt
- **State Management**: Quản lý state tốt hơn với Vue reactivity
- **Component Reusability**: Các component có thể tái sử dụng
- **Better Performance**: Vue.js Virtual DOM cải thiện hiệu suất
- **Modern Tooling**: Vue CLI cung cấp dev tools hiện đại
- **TypeScript Ready**: Dễ dàng migration sang TypeScript

### Component Architecture:
- `App.vue`: Root component quản lý navigation và global state
- `Navigation.vue`: Header navigation với routing logic
- `GameBoard.vue`: Reusable game board component
- `ShipControls.vue`: Ship placement controls
- `MessageContainer.vue`: Toast notification system
- `GamePage.vue`: Main game view
- `TutorialPage.vue`: Tutorial and instructions
- `AboutPage.vue`: About and version information

## 🌟 Tính năng nổi bật

### 1. Component-based Architecture
- Tách biệt logic và UI thành các component độc lập
- Dễ dàng maintain và test

### 2. Reactive State Management
- Vue reactivity system tự động update UI khi state thay đổi
- Không cần manual DOM manipulation

### 3. Enhanced User Experience
- Smooth transitions và animations
- Responsive design cho mobile
- Toast notifications cho feedback

### 4. Modern Development Experience
- Hot reload trong development
- Vue DevTools support
- ES6+ features

## 📱 Tương thích

- ✅ Desktop: Windows, macOS, Linux
- ✅ Mobile: iOS Safari, Android Chrome
- ✅ Browsers: Chrome, Firefox, Safari, Edge
- ✅ Screen sizes: từ 320px trở lên

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License.

## 📞 Liên hệ

Nếu bạn có câu hỏi hoặc góp ý, hãy tạo issue trên repository.

---

**Enjoy playing Battleship! 🚢⚓**
