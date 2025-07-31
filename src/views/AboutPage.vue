<template>
  <div class="page about-page">
    <div class="container">
      <header>
        <h1>GIỚI THIỆU</h1>
        <p>Về trò chơi Trận Chiến Trên Biển</p>
      </header>

      <div class="about-content">
        <section class="about-section">
          <h2>📋 Thông Tin Game</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Tên game:</strong> Trận Chiến Trên Biển (Battleship)
            </div>
            <div class="info-item">
              <strong>Thể loại:</strong> Chiến thuật, Board Game
            </div>
            <div class="info-item">
              <strong>Số người chơi:</strong> 2 người
            </div>
            <div class="info-item">
              <strong>Thời gian:</strong> 15-30 phút
            </div>
            <div class="info-item">
              <strong>Framework:</strong> Vue.js 3
            </div>
            <div class="info-item">
              <strong>Ngôn ngữ:</strong> JavaScript, HTML5, CSS3
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2>🎮 Tính Năng</h2>
          <ul class="feature-list">
            <li>✅ Bảng ảo để theo dõi trò chơi</li>
            <li>✅ Đặt tàu thông minh với nhiều hướng</li>
            <li>✅ Phím tắt tiện lợi</li>
            <li>✅ Giao diện thân thiện</li>
            <li>✅ Đặt tàu tự động</li>
            <li>✅ Hướng dẫn chi tiết</li>
            <li>✅ Responsive design cho mobile</li>
            <li>✅ Vue.js 3 Composition API</li>
            <li>✅ Component-based architecture</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>📱 Tương Thích</h2>
          <p>Game hoạt động tốt trên:</p>
          <div class="compatibility-grid">
            <div class="compatibility-item">
              <span class="icon">💻</span>
              <div>
                <strong>Desktop</strong>
                <p>Windows, macOS, Linux</p>
              </div>
            </div>
            <div class="compatibility-item">
              <span class="icon">📱</span>
              <div>
                <strong>Mobile</strong>
                <p>iOS, Android</p>
              </div>
            </div>
            <div class="compatibility-item">
              <span class="icon">📟</span>
              <div>
                <strong>Tablet</strong>
                <p>iPad, Android tablets</p>
              </div>
            </div>
            <div class="compatibility-item">
              <span class="icon">🌐</span>
              <div>
                <strong>Browsers</strong>
                <p>Chrome, Firefox, Safari, Edge</p>
              </div>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2>🔧 Phiên Bản</h2>
          <div class="version-info">
            <div class="version-header">
              <h3>Version 3.0 - Vue.js Edition</h3>
              <span class="version-badge">Latest</span>
            </div>
            <p><strong>Cập nhật mới nhất:</strong> Chuyển đổi sang Vue.js 3</p>
            
            <div class="changelog">
              <h4>🆕 Có gì mới:</h4>
              <ul>
                <li>🔄 Chuyển đổi hoàn toàn sang Vue.js 3</li>
                <li>🧩 Kiến trúc component-based</li>
                <li>⚡ Performance được cải thiện</li>
                <li>🎨 UI/UX được tối ưu hóa</li>
                <li>📱 Mobile responsive tốt hơn</li>
                <li>🔧 Code maintainability cao hơn</li>
                <li>🚀 Build system hiện đại với Vue CLI</li>
                <li>💾 State management tốt hơn</li>
              </ul>
            </div>
            
            <div class="tech-stack">
              <h4>🛠️ Tech Stack:</h4>
              <div class="tech-tags">
                <span class="tech-tag vue">Vue.js 3</span>
                <span class="tech-tag js">JavaScript ES6+</span>
                <span class="tech-tag css">CSS3</span>
                <span class="tech-tag html">HTML5</span>
                <span class="tech-tag responsive">Responsive Design</span>
                <span class="tech-tag cli">Vue CLI</span>
              </div>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2>🎯 Mục Tiêu Phát Triển</h2>
          <p>
            Dự án này được tạo ra nhằm mục đích học tập và thực hành Vue.js, 
            đồng thời cung cấp một công cụ hữu ích cho những ai yêu thích trò chơi Battleship.
          </p>
          <div class="goals-grid">
            <div class="goal-item">
              <span class="goal-icon">🎓</span>
              <div>
                <strong>Học tập</strong>
                <p>Thực hành Vue.js 3 và modern web development</p>
              </div>
            </div>
            <div class="goal-item">
              <span class="goal-icon">🎮</span>
              <div>
                <strong>Giải trí</strong>
                <p>Tạo ra công cụ hỗ trợ chơi game Battleship</p>
              </div>
            </div>
            <div class="goal-item">
              <span class="goal-icon">💡</span>
              <div>
                <strong>Sáng tạo</strong>
                <p>Áp dụng kiến thức vào dự án thực tế</p>
              </div>
            </div>
            <div class="goal-item">
              <span class="goal-icon">🌍</span>
              <div>
                <strong>Chia sẻ</strong>
                <p>Đóng góp vào cộng đồng open source</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
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

.about-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.about-section {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  color: var(--primary-color);
  font-size: 1.6em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-section p {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  background: rgba(13, 71, 161, 0.05);
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid var(--secondary-color);
}

.info-item strong {
  color: var(--secondary-color);
  display: block;
  margin-bottom: 5px;
}

.feature-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
}

.feature-list li {
  background: rgba(76, 175, 80, 0.1);
  padding: 10px 15px;
  border-radius: 6px;
  border-left: 3px solid var(--success-color);
  color: var(--text-color);
}

.compatibility-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.compatibility-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.compatibility-item .icon {
  font-size: 2em;
  flex-shrink: 0;
}

.compatibility-item strong {
  color: var(--primary-color);
  display: block;
  margin-bottom: 5px;
}

.compatibility-item p {
  margin: 0;
  font-size: 0.9em;
  opacity: 0.8;
}

.version-info {
  background: rgba(13, 71, 161, 0.05);
  padding: 20px;
  border-radius: 8px;
}

.version-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.version-header h3 {
  color: var(--secondary-color);
  margin: 0;
}

.version-badge {
  background: var(--success-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
}

.changelog {
  margin-top: 20px;
}

.changelog h4 {
  color: var(--secondary-color);
  margin-bottom: 10px;
}

.changelog ul {
  list-style: none;
  padding: 0;
}

.changelog li {
  background: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid var(--secondary-color);
}

.tech-stack {
  margin-top: 20px;
}

.tech-stack h4 {
  color: var(--secondary-color);
  margin-bottom: 15px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 500;
  color: white;
}

.tech-tag.vue {
  background: #4fc08d;
}

.tech-tag.js {
  background: #f7df1e;
  color: #000;
}

.tech-tag.css {
  background: #1572b6;
}

.tech-tag.html {
  background: #e34f26;
}

.tech-tag.responsive {
  background: #6f42c1;
}

.tech-tag.cli {
  background: #42b883;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.goal-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.goal-icon {
  font-size: 2em;
  flex-shrink: 0;
}

.goal-item strong {
  color: var(--primary-color);
  display: block;
  margin-bottom: 5px;
}

.goal-item p {
  margin: 0;
  font-size: 0.9em;
  opacity: 0.8;
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
  
  .about-section {
    padding: 20px;
  }
  
  .about-section h2 {
    font-size: 1.4em;
    flex-direction: column;
    text-align: center;
    gap: 5px;
  }
  
  .info-grid,
  .compatibility-grid,
  .goals-grid {
    grid-template-columns: 1fr;
  }
  
  .version-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .tech-tags {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 10px;
  }
  
  header h1 {
    font-size: 1.8em;
  }
  
  .about-section {
    padding: 15px;
  }
  
  .about-section h2 {
    font-size: 1.3em;
  }
  
  .compatibility-item,
  .goal-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .version-info {
    padding: 15px;
  }
}
</style>
