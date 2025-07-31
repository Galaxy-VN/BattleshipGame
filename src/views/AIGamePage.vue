<template>
  <div class="page ai-game-page">
    <div class="container">
      <header>
        <h1>CHƠI VỚI AI</h1>
        <p>Thách thức đối thủ máy tính thông minh</p>
      </header>

      <!-- Game Status - Moved to overlay -->
      <!-- Game Statistics moved to overlay -->

      <!-- Difficulty Selection -->
      <div class="difficulty-section">
        <h3>⚙️ Chọn độ khó AI:</h3>
        <div class="difficulty-selector">
          <button 
            v-for="diff in difficultyOptions" 
            :key="diff.value"
            :class="['difficulty-btn', { 
              active: selectedDifficulty === diff.value,
              disabled: gameState.isGameStarted 
            }]"
            @click="changeDifficulty(diff.value)"
            :disabled="gameState.isGameStarted"
          >
            {{ diff.label }}
          </button>
        </div>
        <div class="difficulty-description">
          <p v-if="selectedDifficulty === 'easy'">🟢 <strong>Dễ:</strong> AI bắn ngẫu nhiên, phù hợp cho người mới</p>
          <p v-if="selectedDifficulty === 'medium'">🟡 <strong>Trung bình:</strong> AI sử dụng chiến thuật hunt & target</p>
          <p v-if="selectedDifficulty === 'hard'">🔴 <strong>Khó:</strong> AI phân tích xác suất, rất thông minh</p>
        </div>
      </div>

      <!-- Ship Placement (Setup Mode) -->
      <div v-if="gameState.gameMode === 'setup'">
        <ShipControls
          :selected-ship-size="selectedShipSize"
          :selected-ship-name="selectedShipName"
          :is-horizontal="isHorizontal"
          :placed-ships="placedShips"
          @ship-selected="handleShipSelected"
          @rotate-ship="handleRotateShip"
          @clear-ships="handleClearShips"
        />
        
        <div class="setup-actions">
          <button 
            @click="autoPlaceShips" 
            class="action-btn auto-btn"
            :disabled="placedShips.length > 0"
            v-if="gameState.gameMode === 'setup'"
          >
            ⚡ Đặt Tàu Tự Động
          </button>
          <button 
            @click="startAIGame" 
            class="action-btn start-btn"
            :disabled="!canStartGame"
            v-if="gameState.gameMode === 'setup'"
          >
            🚀 Bắt Đầu Chơi
          </button>
          <button 
            @click="resetGame" 
            class="action-btn reset-btn"
            v-if="gameState.isGameFinished"
          >
            🔄 Chơi Lại
          </button>
          <button 
            @click="showAIShips = !showAIShips" 
            class="action-btn debug-btn"
            v-if="gameState.gameMode === 'playing' && showDebugMode"
          >
            👁️ {{ showAIShips ? 'Ẩn' : 'Hiện' }} Tàu AI
          </button>
        </div>
      </div>

      <!-- Game Boards -->
      <div class="game-area">
        <div class="board-container">
          <h2>Bảng Của Bạn</h2>
          <GameBoard
            ref="humanBoard"
            board-type="my"
            :grid-size="gridSize"
            :selected-ship-size="selectedShipSize"
            :is-horizontal="isHorizontal"
            :placed-ships="placedShips"
            :game-board="visibleBoards.humanBoard"
            :disabled="gameState.gameMode === 'playing'"
            @cell-click="handleHumanBoardClick"
            @cell-hover="handleCellHover"
            @cell-leave="handleCellLeave"
          />
        </div>
        
        <div class="board-container">
          <h2>Bảng Đối Thủ AI</h2>
          <GameBoard
            ref="aiBoard"
            board-type="opponent"
            :grid-size="gridSize"
            :game-board="visibleBoards.aiBoard"
            :disabled="gameState.currentPlayer !== 'human' || gameState.gameMode !== 'playing'"
            @cell-click="handleAIBoardClick"
          />
        </div>
      </div>

      <!-- Information Area -->
      <div class="info-area">
        <div class="legend">
          <h3>Chú giải màu:</h3>
          <div class="legend-item">
            <span class="legend-color ship"></span> Tàu của bạn
          </div>
          <div class="legend-item">
            <span class="legend-color my-ship-hit"></span> Tàu bị AI bắn trúng
          </div>
          <div class="legend-item">
            <span class="legend-color opponent-hit"></span> Bạn bắn trúng AI
          </div>
          <div class="legend-item">
            <span class="legend-color miss"></span> Bắn trượt
          </div>
        </div>

        <div class="hotkey-guide">
          <h3>Hướng dẫn phím tắt (Di chuột vào ô và bấm):</h3>
          <div class="guide-columns">
            <div class="guide-column">
              <h4>Trên Bảng Của Bạn (Chế độ đặt tàu):</h4>
              <p><code>1</code> : Đặt/Xóa Tàu</p>
              <p><code>0</code> / <code>C</code> : Xóa ô</p>
              <p><code>R</code> : Xoay hướng đặt tàu</p>
            </div>
            <div class="guide-column">
              <h4>Trên Bảng AI (Khi chơi):</h4>
              <p><code>Click</code> : Bắn vào ô</p>
              <p><code>Space</code> : Đặt tàu tự động</p>
              <p><code>Enter</code> : Bắt đầu game</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Controls - Only for debug when playing -->
      <div class="game-controls" v-if="gameState.gameMode === 'playing' && showDebugMode && !gameState.isGameFinished">
        <button 
          @click="showAIShips = !showAIShips" 
          class="game-btn debug-btn"
        >
          👁️ {{ showAIShips ? 'Ẩn' : 'Hiện' }} Tàu AI
        </button>
      </div>

      <!-- Game Over Modal -->
      <div v-if="gameState.isGameFinished" class="game-over-modal">
        <div class="modal-content">
          <h2 class="game-over-title">
            {{ gameState.winner === 'human' ? '🎉 CHIẾN THẮNG!' : '😢 THẤT BẠI!' }}
          </h2>
          <div class="final-stats">
            <h3>Thống kê trận đấu:</h3>
            <div class="stat-row">
              <span>Độ chính xác của bạn:</span>
              <span class="stat-value">{{ getAccuracy().human }}%</span>
            </div>
            <div class="stat-row">
              <span>Độ chính xác của AI:</span>
              <span class="stat-value">{{ getAccuracy().ai }}%</span>
            </div>
            <div class="stat-row">
              <span>Số lượt bắn:</span>
              <span class="stat-value">{{ gameState.stats.humanShots }} vs {{ gameState.stats.aiShots }}</span>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="resetGame" class="modal-btn primary">
              🔄 Chơi Lại
            </button>
            <button @click="goToMenu" class="modal-btn secondary">
              🏠 Về Menu
            </button>
          </div>
        </div>
      </div>

      <!-- AI Thinking Indicator -->
      <div v-if="aiThinking" class="ai-thinking">
        <div class="thinking-content">
          <div class="spinner"></div>
          <span>AI đang suy nghĩ...</span>
        </div>
      </div>

      <!-- Status Overlay - Bottom Left -->
      <div class="status-overlay" v-if="gameEngine">
        <div class="status-header">
          <h4>📊 Trạng Thái Game</h4>
          <button class="toggle-stats" @click="toggleStatsExpanded">
            {{ isStatsExpanded ? '▼' : '▲' }}
          </button>
        </div>
        
        <div class="status-content">
          <div class="game-mode-overlay">
            <span class="overlay-label">🎮</span>
            <span :class="['status-badge-overlay', gameState.gameMode]">
              {{ getGameModeText() }}
            </span>
          </div>
          
          <div class="current-player-overlay" v-if="gameState.gameMode === 'playing'">
            <span class="overlay-label">🎯</span>
            <span :class="['player-badge-overlay', gameState.currentPlayer]">
              {{ gameState.currentPlayer === 'human' ? 'Lượt của bạn' : 'Lượt AI' }}
            </span>
          </div>
        </div>
        
        <!-- Expandable Game Statistics -->
        <div class="stats-content" v-if="gameState.isGameStarted && isStatsExpanded">
          <div class="stats-divider"></div>
          <div class="stat-row-overlay">
            <div class="stat-item-overlay human">
              <span class="stat-icon">👤</span>
              <div class="stat-details">
                <span class="stat-label-overlay">Bạn</span>
                <span class="stat-value-overlay">{{ gameState.stats.humanHits }}/{{ gameState.stats.humanShots }}</span>
                <span class="accuracy-overlay">({{ getAccuracy().human }}%)</span>
              </div>
            </div>
            <div class="stat-item-overlay ai">
              <span class="stat-icon">🤖</span>
              <div class="stat-details">
                <span class="stat-label-overlay">AI</span>
                <span class="stat-value-overlay">{{ gameState.stats.aiHits }}/{{ gameState.stats.aiShots }}</span>
                <span class="accuracy-overlay">({{ getAccuracy().ai }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameBoard from '../components/GameBoard.vue'
import ShipControls from '../components/ShipControls.vue'
import GameEngine from '../services/GameEngine.js'

export default {
  name: 'AIGamePage',
  components: {
    GameBoard,
    ShipControls
  },
  data() {
    return {
      gameEngine: null,
      gridSize: 10,
      selectedShipSize: null,
      selectedShipName: '',
      isHorizontal: true,
      placedShips: [],
      selectedDifficulty: 'medium',
      showAIShips: false,
      showDebugMode: false, // Set to true for development
      aiThinking: false,
      isStatsExpanded: false, // New property for stats toggle
      
      difficultyOptions: [
        { value: 'easy', label: 'Dễ' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'hard', label: 'Khó' }
      ],
      
      shipTypes: [
        { name: 'Tàu Sân Bay', size: 5, count: 1 },
        { name: 'Thiết Giáp Hạm', size: 4, count: 1 },
        { name: 'Tàu Tuần Dương', size: 3, count: 1 },
        { name: 'Tàu Ngầm', size: 3, count: 1 },
        { name: 'Tàu Khu Trục', size: 2, count: 1 }
      ]
    }
  },
  inject: ['showMessage'],
  computed: {
    gameState() {
      return this.gameEngine ? this.gameEngine.getGameState() : {
        gameMode: 'setup',
        currentPlayer: 'human',
        isGameStarted: false,
        isGameFinished: false,
        winner: null,
        stats: { humanShots: 0, humanHits: 0, aiShots: 0, aiHits: 0 }
      }
    },
    
    visibleBoards() {
      if (!this.gameEngine) {
        return { humanBoard: {}, aiBoard: {} }
      }
      
      const boards = this.gameEngine.getVisibleBoards()
      
      // If debug mode is on and showAIShips is true, show AI ships
      if (this.showDebugMode && this.showAIShips) {
        const fullAIBoard = this.gameEngine.getGameState().aiBoard
        return {
          humanBoard: boards.humanBoard,
          aiBoard: fullAIBoard
        }
      }
      
      return boards
    },
    
    canStartGame() {
      const expectedShips = {}
      this.shipTypes.forEach(type => {
        expectedShips[type.name] = type.count
      })
      
      const placedShips = {}
      this.placedShips.forEach(ship => {
        placedShips[ship.name] = (placedShips[ship.name] || 0) + 1
      })
      
      return Object.keys(expectedShips).every(shipName => 
        placedShips[shipName] === expectedShips[shipName]
      )
    }
  },
  mounted() {
    this.initializeGame()
  },
  methods: {
    initializeGame() {
      this.gameEngine = new GameEngine(this.gridSize)
      this.gameEngine.setAIDifficulty(this.selectedDifficulty)
      const result = this.gameEngine.startGame()
      if (result.success) {
        this.showMessage(result.message, 'info')
      }
    },
    
    getGameModeText() {
      switch (this.gameState.gameMode) {
        case 'setup': return 'Đặt tàu'
        case 'playing': return 'Đang chơi'
        case 'finished': return 'Kết thúc'
        default: return 'Không xác định'
      }
    },
    
    getAccuracy() {
      return this.gameEngine ? this.gameEngine.getAccuracy() : { human: 0, ai: 0 }
    },
    
    changeDifficulty(difficulty) {
      if (this.gameState.isGameStarted) return
      
      this.selectedDifficulty = difficulty
      if (this.gameEngine) {
        this.gameEngine.setAIDifficulty(this.selectedDifficulty)
        this.showMessage(`Đã chuyển độ khó: ${this.getDifficultyText()}`, 'info')
      }
    },
    
    getDifficultyText() {
      const difficultyMap = {
        easy: 'Dễ',
        medium: 'Trung bình', 
        hard: 'Khó'
      }
      return difficultyMap[this.selectedDifficulty] || 'Không xác định'
    },
    
    toggleStatsExpanded() {
      this.isStatsExpanded = !this.isStatsExpanded
    },
    
    // Ship placement methods
    handleShipSelected(ship) {
      this.selectedShipSize = ship.size
      this.selectedShipName = ship.name
    },
    
    handleRotateShip() {
      this.isHorizontal = !this.isHorizontal
      this.showMessage(
        `Hướng đặt tàu: ${this.isHorizontal ? 'Ngang' : 'Dọc'}`,
        'info',
        1500
      )
    },
    
    handleClearShips() {
      this.placedShips = []
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.$refs.humanBoard.resetBoard()
      this.showMessage('Đã xóa tất cả tàu!', 'info', 2000)
    },
    
    handleHumanBoardClick({ cell }) {
      if (this.gameState.gameMode !== 'setup') return
      
      // Ship placement mode
      if (this.selectedShipSize) {
        if (this.canPlaceShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal)) {
          this.placeShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal, this.selectedShipName)
        }
      }
    },
    
    async handleAIBoardClick({ cell }) {
      if (this.gameState.gameMode !== 'playing' || this.gameState.currentPlayer !== 'human') {
        return
      }
      
      // Human attacks AI
      const result = this.gameEngine.humanAttack(cell.row, cell.col)
      
      if (result.success) {
        this.showMessage(result.message, result.isHit ? 'success' : 'info')
        this.updateBoardDisplay()
        
        if (result.gameOver) {
          return // Game ended
        }
        
        // If human missed, AI's turn
        if (!result.isHit) {
          await this.processAITurn()
        }
      } else {
        this.showMessage(result.message, 'warning')
      }
    },
    
    async processAITurn() {
      this.aiThinking = true
      
      try {
        const result = await this.gameEngine.aiTurn()
        
        if (result.success) {
          this.showMessage(result.message, result.isHit ? 'warning' : 'info')
          this.updateBoardDisplay()
          
          if (result.gameOver) {
            return // Game ended
          }
          
          // If AI hit, continue AI turn
          if (result.isHit && result.nextPlayer === 'ai') {
            setTimeout(() => this.processAITurn(), 1500)
          }
        }
      } finally {
        this.aiThinking = false
      }
    },
    
    handleCellHover() {
      // Handle hover for ship placement preview
    },
    
    handleCellLeave() {
      // Handle leave for ship placement preview
    },
    
    canPlaceShip(row, col, size, isHorizontal) {
      return this.$refs.humanBoard.canPlaceShip(row, col, size, isHorizontal)
    },
    
    placeShip(row, col, size, isHorizontal, name) {
      // Check if we can place more ships of this type
      const currentCount = this.placedShips.filter(ship => ship.name === name).length
      const shipType = this.shipTypes.find(type => type.name === name)
      
      if (currentCount >= shipType.count) {
        this.showMessage(
          `Bạn đã đặt đủ ${name}! Chỉ được đặt ${shipType.count} tàu loại này.`,
          'warning'
        )
        return
      }
      
      // Add ship to placed ships
      const ship = {
        row,
        col,
        size,
        isHorizontal,
        name
      }
      
      this.placedShips.push(ship)
      
      // Update board display
      for (let i = 0; i < size; i++) {
        const shipRow = isHorizontal ? row : row + i
        const shipCol = isHorizontal ? col + i : col
        this.$refs.humanBoard.setCellState(shipRow, shipCol, 'ship')
      }
      
      this.showMessage(`Đã đặt ${name}!`, 'success', 2000)
      
      // Clear selection if we've placed the maximum number of this ship type
      if (currentCount + 1 >= shipType.count) {
        this.selectedShipSize = null
        this.selectedShipName = ''
      }
    },
    
    autoPlaceShips() {
      this.handleClearShips()
      
      const ships = [...this.shipTypes]
      let attempts = 0
      const maxAttempts = 1000
      
      for (const shipType of ships) {
        for (let count = 0; count < shipType.count; count++) {
          let placed = false
          attempts = 0
          
          while (!placed && attempts < maxAttempts) {
            const row = Math.floor(Math.random() * this.gridSize) + 1
            const col = Math.floor(Math.random() * this.gridSize) + 1
            const isHorizontal = Math.random() < 0.5
            
            if (this.canPlaceShip(row, col, shipType.size, isHorizontal)) {
              this.placeShip(row, col, shipType.size, isHorizontal, shipType.name)
              placed = true
            }
            attempts++
          }
          
          if (!placed) {
            this.showMessage('Không thể đặt tất cả tàu tự động. Hãy thử lại!', 'warning')
            return
          }
        }
      }
      
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.showMessage('Đã đặt tàu tự động thành công!', 'success')
    },
    
    async startAIGame() {
      if (!this.canStartGame) {
        this.showMessage('Bạn cần đặt đủ tất cả tàu trước khi bắt đầu!', 'warning')
        return
      }
      
      const result = this.gameEngine.setHumanShips(this.placedShips)
      
      if (result.success) {
        this.showMessage(result.message, 'success')
        this.updateBoardDisplay()
      } else {
        this.showMessage(result.message, 'error')
      }
    },
    
    updateBoardDisplay() {
      // Force update of board displays
      this.$refs.humanBoard?.updateFromGameBoard()
      this.$refs.aiBoard?.updateFromGameBoard()
    },
    
    resetGame() {
      this.placedShips = []
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.isHorizontal = true
      this.showAIShips = false
      this.aiThinking = false
      
      if (this.gameEngine) {
        this.gameEngine.reset()
      }
      
      this.$refs.humanBoard?.resetBoard()
      this.$refs.aiBoard?.resetBoard()
      
      this.showMessage('Game đã được reset!', 'info', 2000)
    },
    
    goToMenu() {
      this.$emit('page-changed', 'game')
    }
  }
}
</script>

<style scoped>
.page {
  min-height: calc(100vh - var(--nav-height));
  padding: 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
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

/* Status Overlay - Bottom Left */
.status-overlay {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 249, 250, 0.9),
    rgba(240, 248, 255, 0.85)
  );
  border-radius: 15px;
  box-shadow: 
    0 8px 32px rgba(13, 71, 161, 0.2),
    inset 0 2px 8px rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 16px;
  max-width: 320px;
  min-width: 280px;
  z-index: 1000;
  transition: all 0.4s ease;
  transform: translateY(0);
}

.status-overlay:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px rgba(13, 71, 161, 0.25),
    inset 0 2px 8px rgba(255, 255, 255, 0.4);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(13, 71, 161, 0.1);
}

.status-header h4 {
  margin: 0;
  color: rgba(13, 71, 161, 0.9);
  font-size: 1.1em;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.toggle-stats {
  background: linear-gradient(135deg, 
    rgba(13, 71, 161, 0.1), 
    rgba(25, 118, 210, 0.1)
  );
  border: 1px solid rgba(13, 71, 161, 0.3);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(13, 71, 161, 0.8);
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.toggle-stats:hover {
  background: linear-gradient(135deg, 
    rgba(13, 71, 161, 0.2), 
    rgba(25, 118, 210, 0.2)
  );
  transform: scale(1.1);
  border-color: rgba(13, 71, 161, 0.5);
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-mode-overlay,
.current-player-overlay {
  display: flex;
  align-items: center;
  gap: 8px;
}

.overlay-label {
  font-size: 1.1em;
  width: 24px;
  text-align: center;
}

.status-badge-overlay {
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
}

.status-badge-overlay.setup {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  color: #856404;
  border-color: #ffeaa7;
}

.status-badge-overlay.playing {
  background: linear-gradient(135deg, #d1ecf1, #74b9ff);
  color: #0c5460;
  border-color: #74b9ff;
  animation: pulse-overlay 2s infinite;
}

.status-badge-overlay.finished {
  background: linear-gradient(135deg, #f8d7da, #fd79a8);
  color: #721c24;
  border-color: #fd79a8;
}

@keyframes pulse-overlay {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.player-badge-overlay {
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
}

.player-badge-overlay.human {
  background: linear-gradient(135deg, #d4edda, #00b894);
  color: #155724;
  border: 1px solid #00b894;
}

.player-badge-overlay.ai {
  background: linear-gradient(135deg, #fff3cd, #fdcb6e);
  color: #856404;
  border: 1px solid #fdcb6e;
}

.stats-content {
  margin-top: 8px;
  transition: all 0.4s ease;
}

.stats-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(13, 71, 161, 0.3), 
    transparent
  );
  margin: 12px 0;
}

.stat-row-overlay {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item-overlay {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.stat-item-overlay.human {
  background: linear-gradient(135deg, 
    rgba(0, 184, 148, 0.1), 
    rgba(0, 184, 148, 0.05)
  );
  border: 1px solid rgba(0, 184, 148, 0.2);
}

.stat-item-overlay.ai {
  background: linear-gradient(135deg, 
    rgba(253, 203, 110, 0.1), 
    rgba(253, 203, 110, 0.05)
  );
  border: 1px solid rgba(253, 203, 110, 0.2);
}

.stat-item-overlay:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 1.2em;
  width: 24px;
  text-align: center;
}

.stat-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
}

.stat-label-overlay {
  font-weight: 600;
  font-size: 0.85em;
  color: var(--text-color);
}

.stat-value-overlay {
  font-weight: bold;
  font-size: 0.9em;
  color: var(--primary-color);
}

.accuracy-overlay {
  font-size: 0.75em;
  color: var(--secondary-color);
  opacity: 0.8;
}

/* Setup Actions */
.setup-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 30px 0;
  padding: 20px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98), 
    rgba(248, 249, 250, 0.95),
    rgba(255, 255, 255, 0.92)
  );
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(13, 71, 161, 0.2);
  box-shadow: 
    0 6px 20px rgba(13, 71, 161, 0.15),
    inset 0 2px 6px rgba(255, 255, 255, 0.8);
}

.action-btn {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1em;
  white-space: nowrap;
  min-width: 160px;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 71, 161, 0.3);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auto-btn {
  background: linear-gradient(135deg, var(--success-color), #4caf50);
}

.auto-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.start-btn {
  background: linear-gradient(135deg, var(--primary-color), #1976d2);
}

.reset-btn {
  background: linear-gradient(135deg, var(--warning-color), #f57c00);
}

.reset-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.3);
}

.debug-btn {
  background: linear-gradient(135deg, #9c27b0, #7b1fa2);
}

.debug-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(156, 39, 176, 0.3);
}

/* Game Area */
.game-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 30px 0;
  justify-items: center;
}

.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.board-container h2 {
  color: var(--primary-color);
  font-size: 1.5em;
  margin: 0;
  text-align: center;
}

/* Game Controls */
.game-controls {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 249, 250, 0.9),
    rgba(240, 248, 255, 0.85)
  );
  border-radius: 20px;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.12),
    inset 0 2px 8px rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.game-controls::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--primary-color));
  opacity: 0.7;
}

.game-btn {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95), 
    rgba(240, 248, 255, 0.95)
  );
  color: var(--primary-color);
  border: 3px solid var(--primary-color);
  padding: 14px 24px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.4s ease;
  font-weight: 700;
  font-size: 1.05em;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    inset 0 2px 5px rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.game-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent
  );
  transition: left 0.6s ease;
}

.game-btn:hover::before {
  left: 100%;
}

.game-btn:hover {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 8px 25px rgba(13, 71, 161, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.2);
  border-color: var(--secondary-color);
}

.reset-btn {
  background: linear-gradient(135deg, 
    rgba(255, 248, 240, 0.95), 
    rgba(255, 243, 224, 0.95)
  );
  color: var(--warning-color);
  border-color: var(--warning-color);
}

.reset-btn:hover {
  background: linear-gradient(135deg, var(--warning-color), #f57c00);
  color: white;
  border-color: #f57c00;
  box-shadow: 
    0 8px 25px rgba(255, 152, 0, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.2);
}

.debug-btn {
  background: linear-gradient(135deg, 
    rgba(252, 245, 255, 0.95), 
    rgba(248, 235, 255, 0.95)
  );
  color: #9c27b0;
  border-color: #9c27b0;
}

.debug-btn:hover {
  background: linear-gradient(135deg, #9c27b0, #7b1fa2);
  color: white;
  border-color: #7b1fa2;
  box-shadow: 
    0 8px 25px rgba(156, 39, 176, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.2);
}

/* Difficulty Selection */
.difficulty-section {
  text-align: center;
  margin: 30px 0;
  padding: 30px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98), 
    rgba(248, 249, 250, 0.95),
    rgba(255, 255, 255, 0.92)
  );
  border-radius: 20px;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(13, 71, 161, 0.2);
  box-shadow: 
    0 8px 32px rgba(13, 71, 161, 0.15),
    inset 0 2px 10px rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.difficulty-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(13, 71, 161, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(25, 118, 210, 0.05) 0%, transparent 50%);
  z-index: -1;
}

.difficulty-section h3 {
  color: rgba(13, 71, 161, 0.9);
  margin-bottom: 25px;
  font-size: 1.4em;
  text-shadow: 
    2px 2px 4px rgba(255, 255, 255, 0.8),
    0 0 10px rgba(13, 71, 161, 0.2);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.difficulty-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.difficulty-btn {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95), 
    rgba(248, 249, 250, 0.9),
    rgba(240, 248, 255, 0.85)
  );
  color: var(--primary-color);
  border: 2px solid rgba(13, 71, 161, 0.6);
  padding: 14px 22px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.4s ease;
  font-weight: 700;
  font-size: 1em;
  text-align: center;
  box-shadow: 
    0 4px 15px rgba(13, 71, 161, 0.2),
    inset 0 2px 5px rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(3px);
}

.difficulty-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent
  );
  transition: left 0.6s ease;
}

.difficulty-btn:hover:not(.disabled)::before {
  left: 100%;
}

.difficulty-btn:hover:not(.disabled) {
  background: linear-gradient(135deg, 
    rgba(13, 71, 161, 0.9), 
    rgba(25, 118, 210, 0.8)
  );
  color: white;
  transform: translateY(-4px);
  box-shadow: 
    0 8px 25px rgba(13, 71, 161, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
}

.difficulty-btn.active {
  background: linear-gradient(135deg, 
    rgba(13, 71, 161, 0.95), 
    rgba(25, 118, 210, 0.9)
  );
  color: white;
  box-shadow: 
    0 8px 25px rgba(13, 71, 161, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.7);
}

.difficulty-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  color: #999;
  border-color: #ddd;
}

.difficulty-btn.disabled:hover {
  transform: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.difficulty-description {
  text-align: center;
  max-width: 650px;
  margin: 0 auto;
}

.difficulty-description p {
  font-size: 1.05em;
  color: var(--text-color);
  margin: 0;
  padding: 15px 25px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95), 
    rgba(248, 249, 250, 0.9),
    rgba(255, 255, 255, 0.88)
  );
  border-radius: 15px;
  box-shadow: 
    0 4px 15px rgba(13, 71, 161, 0.15),
    inset 0 2px 5px rgba(255, 255, 255, 0.9);
  border-left: 4px solid rgba(13, 71, 161, 0.8);
  backdrop-filter: blur(3px);
  border: 1px solid rgba(13, 71, 161, 0.2);
}

/* Information Area */
.info-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 30px 0;
}

.legend,
.hotkey-guide {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.legend h3,
.hotkey-guide h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
  text-align: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-color.ship {
  background: var(--ship-color);
}

.legend-color.my-ship-hit {
  background: var(--my-ship-hit-color);
}

.legend-color.opponent-hit {
  background: var(--hit-color);
}

.legend-color.miss {
  background: var(--miss-color);
}

.guide-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.guide-column h4 {
  color: var(--secondary-color);
  margin-bottom: 10px;
  font-size: 1.1em;
}

.guide-column p {
  margin-bottom: 5px;
  font-size: 0.9em;
}

.guide-column code {
  background: var(--background-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  color: var(--primary-color);
}

.guide-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.guide-column h4 {
  color: var(--secondary-color);
  margin-bottom: 10px;
  font-size: 1.1em;
}

.guide-column p {
  margin-bottom: 5px;
  font-size: 0.9em;
}

.guide-column code {
  background: var(--background-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  color: var(--primary-color);
}

/* Game Over Modal */
.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 500px;
  width: 90%;
}

.game-over-title {
  color: var(--primary-color);
  font-size: 2em;
  margin-bottom: 20px;
}

.final-stats {
  margin: 20px 0;
  text-align: left;
}

.final-stats h3 {
  color: var(--secondary-color);
  margin-bottom: 15px;
  text-align: center;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.modal-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-btn.primary {
  background: var(--success-color);
  color: white;
}

.modal-btn.secondary {
  background: var(--secondary-color);
  color: white;
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* AI Thinking */
.ai-thinking {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 30px;
  border-radius: 12px;
  z-index: 1500;
}

.thinking-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 1024px) {
  .game-area {
    gap: 20px;
  }
  
  .info-area {
    gap: 20px;
  }
}

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
  
  .game-area {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .info-area {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .guide-columns {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 10px;
  }
  
  header h1 {
    font-size: 1.8em;
  }
  
  .legend,
  .hotkey-guide {
    padding: 15px;
  }
  
  .legend h3,
  .hotkey-guide h3 {
    font-size: 1.1em;
  }
  
  .guide-column h4 {
    font-size: 1em;
  }
  
  .guide-column p {
    font-size: 0.8em;
  }
}
</style>
