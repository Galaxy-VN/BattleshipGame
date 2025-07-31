<template>
  <div class="page tutorial-page">
    <div class="container">
      <header>
        <h1>HƯỚNG DẪN CHƠI</h1>
        <p>Tìm hiểu cách chơi Trận Chiến Trên Biển</p>
      </header>

      <div class="tutorial-content">
        <section class="tutorial-section">
          <h2>🚢 Giới thiệu Game</h2>
          <p>
            Trận Chiến Trên Biển là game chiến thuật nơi hai người chơi cố gắng tìm và bắn hạ tất cả tàu chiến của đối phương trên một lưới biển 10x10.
          </p>
        </section>

        <section class="tutorial-section">
          <h2>⚙️ Cách Đặt Tàu</h2>
          <div class="tutorial-steps">
            <div class="step">
              <h3>Bước 1: Chọn loại tàu</h3>
              <p>Nhấn vào một trong 5 loại tàu ở phần trên để bắt đầu đặt tàu:</p>
              <ul>
                <li><strong>Tàu Sân Bay:</strong> 5 ô</li>
                <li><strong>Thiết Giáp Hạm:</strong> 4 ô</li>
                <li><strong>Tàu Tuần Dương:</strong> 3 ô</li>
                <li><strong>Tàu Ngầm:</strong> 3 ô</li>
                <li><strong>Tàu Khu Trục:</strong> 2 ô</li>
              </ul>
            </div>
            <div class="step">
              <h3>Bước 2: Chọn hướng</h3>
              <p>
                Nhấn nút "🔄 Xoay" hoặc phím <code>R</code> để thay đổi hướng đặt tàu (Ngang/Dọc)
              </p>
            </div>
            <div class="step">
              <h3>Bước 3: Đặt tàu lên bảng</h3>
              <p>
                Nhấn vào ô đầu tiên nơi bạn muốn đặt tàu. Tàu sẽ được đặt theo hướng đã chọn.
              </p>
            </div>
          </div>
        </section>

        <section class="tutorial-section">
          <h2>🎯 Cách Chơi</h2>
          <div class="tutorial-steps">
            <div class="step">
              <h3>Lượt của bạn</h3>
              <p>Nhấn vào bảng đối thủ để bắn. Sử dụng phím tắt:</p>
              <ul>
                <li><code>1</code> - Đánh dấu bắn trúng (đỏ 🔥)</li>
                <li><code>2</code> - Đánh dấu bắn trượt (trắng ●)</li>
              </ul>
            </div>
            <div class="step">
              <h3>Lượt đối thủ</h3>
              <p>Khi đối thủ bắn vào bảng của bạn:</p>
              <ul>
                <li><code>2</code> - Đánh dấu tàu bị trúng (cam 💥)</li>
                <li><code>3</code> - Đánh dấu đối thủ bắn trượt (trắng ●)</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="tutorial-section">
          <h2>🏆 Chiến Thắng</h2>
          <p>
            Người chơi nào tìm và bắn hạ hết tất cả tàu của đối phương trước sẽ thắng!
          </p>
        </section>

        <section class="tutorial-section">
          <h2>💡 Mẹo Chơi</h2>
          <ul>
            <li>Đặt tàu ở những vị trí khó đoán</li>
            <li>Không đặt tàu sát nhau quá nhiều</li>
            <li>Bắn theo pattern có hệ thống</li>
            <li>Khi trúng một ô, bắn xung quanh để tìm phần còn lại của tàu</li>
          </ul>
        </section>

        <section class="tutorial-section">
          <h2>⌨️ Phím Tắt Chi Tiết</h2>
          <div class="shortcut-tables">
            <div class="shortcut-table">
              <h4>Trên Bảng Của Bạn:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Phím</th>
                    <th>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>1</code></td>
                    <td>Đặt/Xóa Tàu</td>
                  </tr>
                  <tr>
                    <td><code>2</code></td>
                    <td>Đánh dấu Tàu bị bắn trúng</td>
                  </tr>
                  <tr>
                    <td><code>3</code></td>
                    <td>Đánh dấu Đối thủ bắn trượt</td>
                  </tr>
                  <tr>
                    <td><code>0</code> / <code>C</code></td>
                    <td>Xóa ô</td>
                  </tr>
                  <tr>
                    <td><code>R</code></td>
                    <td>Xoay hướng đặt tàu</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="shortcut-table">
              <h4>Trên Bảng Đối Thủ:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Phím</th>
                    <th>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>1</code></td>
                    <td>Đánh dấu Bắn Trúng</td>
                  </tr>
                  <tr>
                    <td><code>2</code></td>
                    <td>Đánh dấu Bắn Trượt</td>
                  </tr>
                  <tr>
                    <td><code>0</code> / <code>C</code></td>
                    <td>Xóa ô</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TutorialPage'
}
</script>

<style scoped>
.page {
  min-height: calc(100vh - var(--nav-height));
  padding: 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

header h1 {
  color: var(--primary-color);
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

header p {
  color: var(--text-color);
  font-size: 1.2em;
  opacity: 0.8;
}

.tutorial-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.tutorial-section {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.tutorial-section h2 {
  color: var(--primary-color);
  font-size: 1.6em;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tutorial-section p {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 15px;
}

.tutorial-section ul {
  color: var(--text-color);
  line-height: 1.6;
  padding-left: 20px;
}

.tutorial-section ul li {
  margin-bottom: 8px;
}

.tutorial-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step {
  background: rgba(13, 71, 161, 0.05);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid var(--secondary-color);
}

.step h3 {
  color: var(--secondary-color);
  font-size: 1.2em;
  margin-bottom: 10px;
}

.step p {
  margin-bottom: 10px;
}

.step ul {
  margin-bottom: 0;
}

.step code {
  background: var(--background-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Courier New', monospace;
}

.shortcut-tables {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.shortcut-table h4 {
  color: var(--secondary-color);
  margin-bottom: 15px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

thead {
  background: var(--secondary-color);
  color: white;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  font-weight: 600;
}

tbody tr:hover {
  background: rgba(13, 71, 161, 0.05);
}

tbody tr:last-child td {
  border-bottom: none;
}

td code {
  background: var(--background-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Courier New', monospace;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }
  
  header h1 {
    font-size: 2em;
  }
  
  header p {
    font-size: 1em;
  }
  
  .tutorial-section {
    padding: 20px;
  }
  
  .tutorial-section h2 {
    font-size: 1.4em;
    flex-direction: column;
    text-align: center;
    gap: 5px;
  }
  
  .shortcut-tables {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .step {
    padding: 15px;
  }
  
  .step h3 {
    font-size: 1.1em;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 10px;
  }
  
  header h1 {
    font-size: 1.8em;
  }
  
  .tutorial-section {
    padding: 15px;
  }
  
  .tutorial-section h2 {
    font-size: 1.3em;
  }
  
  .step {
    padding: 12px;
  }
  
  th,
  td {
    padding: 8px;
    font-size: 0.9em;
  }
}
</style>
