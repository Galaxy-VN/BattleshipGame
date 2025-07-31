<template>
  <div class="page ai-game-page">
    <div class="container">
      <header>
        <h1>CHƠI VỚI AI</h1>
        <p>Thách thức đối thủ máy tính thông minh</p>
      </header>

      <!-- Game Status -->
      <div class="game-status" v-if="gameEngine">
        <div class="status-info">
          <div class="game-mode">
            <span class="label">Trạng thái:</span>
            <span :class="['status', gameState.gameMode]">
              {{ getGameModeText() }}
            </span>
          </div>
          <div class="current-player" v-if="gameState.gameMode === 'playing'">
            <span class="label">Lượt:</span>
            <span :class="['player', gameState.currentPlayer]">
              {{ gameState.currentPlayer === 'human' ? 'Của bạn' : 'AI' }}
            </span>
          </div>
          <div class="difficulty">
            <span class="label">Độ khó:</span>
            <select v-model="selectedDifficulty" @change="changeDifficulty" :disabled="gameState.isGameStarted">
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>
        </div>
        
        <!-- Game Statistics -->
        <div class="game-stats" v-if="gameState.isGameStarted">
          <div class="stat-item">
            <span class="stat-label">Bạn:</span>
            <span class="stat-value">{{ gameState.stats.humanHits }}/{{ gameState.stats.humanShots }}</span>
            <span class="accuracy">({{ getAccuracy().human }}%)</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">AI:</span>
            <span class="stat-value">{{ gameState.stats.aiHits }}/{{ gameState.stats.aiShots }}</span>
            <span class="accuracy">({{ getAccuracy().ai }}%)</span>
          </div>
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
          >
            ⚡ Đặt Tàu Tự Động
          </button>
          <button 
            @click="startAIGame" 
            class="action-btn start-btn"
            :disabled="!canStartGame"
          >
            🚀 Bắt Đầu Chơi
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

      <!-- Game Controls -->
      <div class="game-controls">
        <button @click="resetGame" class="control-btn reset-btn">
          🔄 Chơi Lại
        </button>
        <button 
          @click="showAIShips = !showAIShips" 
          class="control-btn debug-btn"
          v-if="gameState.gameMode === 'playing' && showDebugMode"
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
    
    changeDifficulty() {
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

/* Game Status */
.game-status {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.status-info {
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.status-info > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: 600;
  color: var(--text-color);
}

.status.setup {
  color: var(--warning-color);
  font-weight: bold;
}

.status.playing {
  color: var(--success-color);
  font-weight: bold;
}

.status.finished {
  color: var(--hit-color);
  font-weight: bold;
}

.player.human {
  color: var(--success-color);
  font-weight: bold;
}

.player.ai {
  color: var(--warning-color);
  font-weight: bold;
}

.difficulty select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em;
}

.game-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 0.9em;
  color: var(--text-color);
  opacity: 0.8;
}

.stat-value {
  font-weight: bold;
  color: var(--primary-color);
}

.accuracy {
  font-size: 0.8em;
  color: var(--secondary-color);
}

/* Setup Actions */
.setup-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
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
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 71, 161, 0.3);
}

.action-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auto-btn {
  background: linear-gradient(135deg, var(--warning-color), #f57c00);
}

.start-btn {
  background: linear-gradient(135deg, var(--success-color), #2e7d32);
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
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

.control-btn {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 71, 161, 0.3);
}

.debug-btn {
  background: linear-gradient(135deg, #9c27b0, #7b1fa2);
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

/* Responsive Design */
@media (max-width: 1024px) {
  .game-area {
    gap: 20px;
  }
  
  .status-info {
    gap: 20px;
  }
  
  .game-stats {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }
  
  header h1 {
    font-size: 2em;
  }
  
  .game-area {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .game-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .status-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
  }
  
  .game-stats {
    width: 100%;
    justify-content: space-around;
  }
  
  .setup-actions,
  .game-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .modal-content {
    padding: 30px 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 10px;
  }
  
  header h1 {
    font-size: 1.8em;
  }
  
  .game-status {
    padding: 15px;
  }
  
  .action-btn,
  .control-btn {
    width: 100%;
    max-width: 250px;
  }
}
</style>
