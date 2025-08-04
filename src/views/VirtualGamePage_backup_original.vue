<template>
  <div class="page game-page">
    <div class="container">
      <header>
        <h1>BẢNG VIRTUAL BATTLESHIP</h1>
        <p>Bảng theo dõi để chơi với bạn bè bằng cách đối thoại</p>
      </header>

      <div class="main-layout">
        <!-- Left Sidebar - Ship Controls -->
        <div class="controls-sidebar">
          <div class="control-section">
            <h3>🚢 Đặt Tàu</h3>
            
            <!-- Orientation Toggle -->
            <div class="orientation-toggle">
              <button 
                :class="['orientation-btn', { active: isHorizontal }]"
                @click="handleSetHorizontal(true)"
              >
                ➡️ Ngang
              </button>
              <button 
                :class="['orientation-btn', { active: !isHorizontal }]"
                @click="handleSetHorizontal(false)"
              >
                ⬇️ Dọc
              </button>
            </div>
            
            <!-- Ships List -->
            <div class="ships-list">
              <div 
                v-for="ship in shipTypes" 
                :key="ship.name"
                :class="['ship-item-compact', { 
                  'selected': selectedShipName === ship.name,
                  'completed': getPlacedCount(ship) >= ship.count 
                }]"
                @click="handleShipSelected(ship)"
              >
                <div class="ship-info">
                  <span class="ship-name">{{ ship.name }}</span>
                  <span class="ship-count">{{ getPlacedCount(ship) }}/{{ ship.count }}</span>
                </div>
                <div class="ship-visual-compact">
                  <div 
                    v-for="n in ship.size" 
                    :key="n" 
                    class="ship-segment-small"
                  ></div>
                </div>
              </div>
            </div>
            
            <!-- Control Buttons -->
            <div class="control-buttons">
              <button class="control-btn auto-btn" @click="autoPlaceShips">
                ⚡ Tự Động
              </button>
              <button class="control-btn clear-btn" @click="handleClearShips">
                🗑️ Xóa Tàu
              </button>
              <button class="control-btn reset-btn" @click="resetGame">
                🔄 Chơi Lại
              </button>
            </div>
          </div>
        </div>

        <!-- Game Area -->
        <div class="game-area">
          <div class="board-container">
            <h2>Bảng Của Bạn</h2>
            <GameBoard
              ref="myBoard"
              board-type="my"
              :grid-size="gridSize"
              :selected-ship-size="selectedShipSize"
              :is-horizontal="isHorizontal"
              :placed-ships="placedShips"
              @cell-click="handleCellClick"
              @cell-hover="handleCellHover"
              @cell-leave="handleCellLeave"
            />
          </div>
          
          <div class="board-container">
            <h2>Bảng Đối Thủ</h2>
            <GameBoard
              ref="opponentBoard"
              board-type="opponent"
              :grid-size="gridSize"
              @cell-click="handleCellClick"
              @cell-hover="handleCellHover"
              @cell-leave="handleCellLeave"
            />
          </div>
        </div>
      </div>
            </div>
          </div>
          
          <div class="control-buttons">
            <button @click="resetGame" class="control-btn reset-btn">
              🔄 Chơi Lại
            </button>
            <button @click="autoPlaceShips" class="control-btn auto-btn">
              ⚡ Tự Động
            </button>
            <button @click="handleClearShips" class="control-btn clear-btn">
              🗑️ Xóa Tàu
            </button>
          </div>
        </div>

        <!-- Right Area - Game Boards -->
        <div class="game-area">
          <div class="board-container">
            <h2>Bảng Của Bạn</h2>
            <GameBoard
              ref="myBoard"
              board-type="my"
              :grid-size="gridSize"
              :selected-ship-size="selectedShipSize"
              :is-horizontal="isHorizontal"
              :placed-ships="placedShips"
              @cell-click="handleCellClick"
              @cell-hover="handleCellHover"
              @cell-leave="handleCellLeave"
            />
          </div>
          <div class="board-container">
            <h2>Bảng Đối Thủ</h2>
            <GameBoard
              ref="opponentBoard"
              board-type="opponent"
              :grid-size="gridSize"
              @cell-click="handleCellClick"
              @cell-hover="handleCellHover"
              @cell-leave="handleCellLeave"
            />
          </div>
        </div>
      </div>

      <div class="info-area">
        <div class="legend">
          <h3>Chú giải màu:</h3>
          <div class="legend-item">
            <span class="legend-color ship"></span> Tàu của bạn
          </div>
          <div class="legend-item">
            <span class="legend-color my-ship-hit"></span> Tàu bị bắn trúng
          </div>
          <div class="legend-item">
            <span class="legend-color opponent-hit"></span> Bạn bắn trúng
          </div>
          <div class="legend-item">
            <span class="legend-color miss"></span> Bắn trượt
          </div>
        </div>

        <div class="hotkey-guide">
          <h3>Hướng dẫn phím tắt (Di chuột vào ô và bấm):</h3>
          <div class="guide-columns">
            <div class="guide-column">
              <h4>Trên Bảng Của Bạn:</h4>
              <p><code>1</code> : Đặt/Xóa Tàu</p>
              <p><code>2</code> : Đánh dấu Tàu bị bắn trúng</p>
              <p><code>3</code> : Đánh dấu Đối thủ bắn trượt</p>
              <p><code>0</code> / <code>C</code> : Xóa ô</p>
              <p><code>R</code> : Xoay hướng đặt tàu</p>
            </div>
            <div class="guide-column">
              <h4>Trên Bảng Đối Thủ:</h4>
              <p><code>1</code> : Đánh dấu Bắn Trúng</p>
              <p><code>2</code> : Đánh dấu Bắn Trượt</p>
              <p><code>0</code> / <code>C</code> : Xóa ô</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification List Container -->
    <div class="notification-container">
      <v-alert
        v-for="notification in notifications"
        :key="notification.id"
        v-model="notification.show"
        :color="notification.color"
        :icon="getIconForType(notification.color)"
        class="mb-3"
        border="start"
        elevation="2"
        closable
        transition="slide-x-reverse-transition"
        @update:modelValue="removeNotification(notification.id)"
      >
        {{ notification.text }}
      </v-alert>
    </div>
  </div>
</template>

<script>
import GameBoard from '../components/GameBoard.vue'
import { VAlert } from 'vuetify/components'

export default {
  name: 'GamePage',
  components: {
    GameBoard,
    VAlert
  },
  data() {
    return {
      gridSize: 10,
      hoveredCell: null,
      selectedShipSize: null,
      selectedShipName: '',
      isHorizontal: true,
      placedShips: [],
      shipTypes: [
        { name: 'Tàu Sân Bay', size: 5, count: 1 },
        { name: 'Thiết Giáp Hạm', size: 4, count: 1 },
        { name: 'Tàu Tuần Dương', size: 3, count: 1 },
        { name: 'Tàu Ngầm', size: 3, count: 1 },
        { name: 'Tàu Khu Trục', size: 2, count: 1 }
      ],
      legendItems: [
        { label: 'Tàu của bạn', color: 'ship-gray' },
        { label: 'Tàu bị trúng', color: 'error' },
        { label: 'Bạn bắn trúng', color: 'success' },
        { label: 'Bắn trượt', color: 'info' }
      ],
      notifications: []
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    showMessage(text, color = 'info', timeout = 3000) {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        text,
        color,
        timeout,
        show: true
      }
      this.notifications.push(newNotification)

      if (timeout > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, timeout)
      }
    },
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },
    getIconForType(type) {
      switch (type) {
        case 'success':
          return '$success'
        case 'warning':
          return '$warning'
        case 'error':
          return '$error'
        default:
          return '$info'
      }
    },
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
    
    handleSetHorizontal(value) {
      this.isHorizontal = value
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
      this.$refs.myBoard.resetBoard()
      this.showMessage('Đã xóa tất cả tàu!', 'info', 2000)
    },
    
    handleCellClick({ cell, boardType }) {
      if (boardType === 'my') {
        this.handleMyBoardClick(cell)
      } else {
        this.handleOpponentBoardClick(cell)
      }
    },
    
    handleMyBoardClick(cell) {
      // Ship placement mode
      if (this.selectedShipSize) {
        if (this.canPlaceShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal)) {
          this.placeShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal, this.selectedShipName)
        }
        return
      }
      
      // Regular click behavior for manual cell editing
      if (cell.ship) {
        if (cell.hit) {
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'miss')
        } else {
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'my_ship_hit')
        }
      } else {
        if (cell.miss) {
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'clear')
        } else if (cell.hit) {
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'miss')
        } else {
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'ship')
        }
      }
    },
    
    handleOpponentBoardClick(cell) {
      if (cell.hit) {
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'miss')
      } else if (cell.miss) {
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'clear')
      } else {
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'hit')
      }
    },
    
    handleCellHover({ cell, boardType }) {
      this.hoveredCell = { ...cell, boardType }
    },
    
    handleCellLeave({ cell }) {
      if (this.hoveredCell && this.hoveredCell.row === cell.row && this.hoveredCell.col === cell.col) {
        this.hoveredCell = null
      }
    },
    
    handleKeyPress(event) {
      if (!this.hoveredCell) return
      
      const key = event.key.toLowerCase()
      const boardType = this.hoveredCell.boardType || 'my'
      
      // Handle rotation
      if (key === 'r' && boardType === 'my') {
        this.handleRotateShip()
        return
      }
      
      if (boardType === 'my') {
        switch (key) {
          case '1':
            if (this.hoveredCell.ship) {
              this.removeShip(this.hoveredCell)
            } else if (this.selectedShipSize) {
              if (this.canPlaceShip(this.hoveredCell.row, this.hoveredCell.col, this.selectedShipSize, this.isHorizontal)) {
                this.placeShip(this.hoveredCell.row, this.hoveredCell.col, this.selectedShipSize, this.isHorizontal, this.selectedShipName)
              }
            } else {
              this.$refs.myBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'ship')
            }
            break
          case '2':
            this.$refs.myBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'my_ship_hit')
            break
          case '3':
            this.$refs.myBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'miss')
            break
          case '0':
          case 'c':
            this.$refs.myBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'clear')
            break
        }
      } else {
        switch (key) {
          case '1':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'hit')
            break
          case '2':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'miss')
            break
          case '0':
          case 'c':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'clear')
            break
        }
      }
    },
    
    getPlacedCount(shipType) {
      return this.placedShips.filter(ship => ship.name === shipType.name).length
    },
    
    canPlaceShip(row, col, size, isHorizontal) {
      return this.$refs.myBoard.canPlaceShip(row, col, size, isHorizontal)
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
        this.$refs.myBoard.setCellState(shipRow, shipCol, 'ship')
      }
      
      this.showMessage(`Đã đặt ${name}!`, 'success', 2000)
      
      // Clear selection if we've placed the maximum number of this ship type
      if (currentCount + 1 >= shipType.count) {
        this.selectedShipSize = null
        this.selectedShipName = ''
      }
    },
    
    removeShip(cell) {
      // Find and remove the ship that contains this cell
      const shipIndex = this.placedShips.findIndex(ship => {
        for (let i = 0; i < ship.size; i++) {
          const shipRow = ship.isHorizontal ? ship.row : ship.row + i
          const shipCol = ship.isHorizontal ? ship.col + i : ship.col
          if (shipRow === cell.row && shipCol === cell.col) {
            return true
          }
        }
        return false
      })
      
      if (shipIndex > -1) {
        const ship = this.placedShips[shipIndex]
        this.placedShips.splice(shipIndex, 1)
        
        // Clear ship cells on board
        for (let i = 0; i < ship.size; i++) {
          const shipRow = ship.isHorizontal ? ship.row : ship.row + i
          const shipCol = ship.isHorizontal ? ship.col + i : ship.col
          this.$refs.myBoard.setCellState(shipRow, shipCol, 'clear')
        }
        
        this.showMessage(`Đã xóa ${ship.name}!`, 'info', 2000)
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
    
    resetGame() {
      this.placedShips = []
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.isHorizontal = true
      
      this.$refs.myBoard.resetBoard()
      this.$refs.opponentBoard.resetBoard()
      
      this.showMessage('Game đã được reset!', 'info', 2000)
    }
  }
}
</script>

<style scoped>
.page {
  min-height: calc(100vh - var(--nav-height));
  padding: 20px;
  font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #2d3748;
}

.notification-container {
  position: fixed;
  top: 80px; /* Adjust based on your nav-height */
  right: 16px;
  width: 100%;
  max-width: 350px;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 32px 24px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  animation: gradientShift 3s ease-in-out infinite;
}

header h1 {
  color: #1a202c;
  font-size: 2.8em;
  margin-bottom: 12px;
  font-weight: 900;
  letter-spacing: -0.025em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  text-transform: uppercase;
}

header h1::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

header p {
  color: #ffffff;
  font-size: 1.15em;
  opacity: 1;
  font-weight: 600;
  margin: 0 auto;
  max-width: 600px;
  line-height: 1.6;
  text-align: center !important;
  display: block;
  width: 100%;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Main Layout */
.main-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  margin: 20px 0;
  min-height: 600px;
}

/* Controls Sidebar */
.controls-sidebar {
  width: 280px;
  min-width: 280px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: 80vh;
  overflow-y: auto;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-section h3 {
  margin: 0;
  font-size: 1.3em;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.orientation-toggle {
  display: flex;
  gap: 4px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.orientation-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  font-family: inherit;
  text-align: center;
}

.orientation-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transform: scale(1.02);
}

/* Compact Ship List */
.ships-list {
  margin-bottom: 16px;
}

.ship-item-compact {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.ship-item-compact::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.ship-item-compact:hover {
  background: #f8fafc;
  border-color: #667eea;
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
}

.ship-item-compact:hover::before {
  transform: scaleX(1);
}

.ship-item-compact.selected {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  transform: translateX(2px);
}

.ship-item-compact.selected::before {
  transform: scaleX(1);
}

.ship-item-compact.completed {
  background: linear-gradient(135deg, rgba(81, 207, 102, 0.1) 0%, rgba(64, 192, 87, 0.1) 100%);
  border-color: #51cf66;
  opacity: 0.8;
}

.ship-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.ship-name {
  font-size: 0.85em;
  font-weight: 600;
  color: #374151;
}

.ship-count {
  font-size: 0.75em;
  color: #64748b;
  font-weight: 500;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 8px;
}

.ship-visual-compact {
  display: flex;
  gap: 1px;
  justify-content: center;
}

.ship-segment-small {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.ship-item-compact.completed .ship-segment-small {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
}

.ship-item-compact:hover .ship-segment-small {
  transform: scale(1.1);
}

/* Control Buttons */
.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-btn {
  font-family: inherit;
  font-weight: 600;
  font-size: 0.8em;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  color: white;
  text-align: center;
}

.reset-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.auto-btn {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  box-shadow: 0 2px 8px rgba(81, 207, 102, 0.3);
}

.auto-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(81, 207, 102, 0.4);
}

.clear-btn {
  background: linear-gradient(135deg, #ffd93d 0%, #ff6b35 100%);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.clear-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

/* Game Area */
.game-area {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: flex-start;
  min-width: 0;
  width: 100%;
}

.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1;
  max-width: 480px;
  min-width: 300px;
}

.board-container h2 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.4em;
  margin: 0;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.01em;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Info Area */
.info-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 40px 0;
}

.legend,
.hotkey-guide {
  background: rgba(255, 255, 255, 0.98);
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.legend h3,
.hotkey-guide h3 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 700;
  font-size: 1.2em;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.legend-item:hover {
  background: #f8fafc;
}

.legend-color {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.guide-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.guide-column h4 {
  color: #374151;
  margin-bottom: 12px;
  font-size: 1.1em;
  font-weight: 700;
}

.guide-column p {
  margin-bottom: 8px;
  font-size: 0.9em;
  font-weight: 500;
  color: #64748b;
}

.guide-column code {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85em;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

/* Responsive design */
@media (max-width: 1024px) {
  .container {
    max-width: 100%;
    padding: 0 15px;
  }
  
  .main-layout {
    gap: 24px;
  }
  
  .controls-sidebar {
    width: 260px;
    min-width: 260px;
    padding: 18px;
    max-height: 70vh;
  }
  
  .game-area {
    gap: 30px;
  }
  
  .board-container {
    max-width: 400px;
  }
  
  .info-area {
    gap: 20px;
  }
  
  header h1 {
    font-size: 2.2em;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .page {
    padding: 15px;
  }
  
  .main-layout {
    flex-direction: column;
    gap: 20px;
    min-height: auto;
  }
  
  .controls-sidebar {
    width: 100%;
    min-width: auto;
    position: static;
    order: 2;
    max-height: none;
    padding: 20px;
  }
  
  .game-area {
    flex-direction: column;
    align-items: center;
    gap: 30px;
    order: 1;
  }
  
  .board-container {
    width: 100%;
    max-width: 100%;
    min-width: auto;
  }
  
  .ships-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .ship-item-compact {
    margin-bottom: 0;
  }
  
  .control-buttons {
    flex-direction: row;
    gap: 12px;
  }
  
  .control-btn {
    flex: 1;
    font-size: 0.85em;
    padding: 10px 14px;
  }
  
  header {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  header h1 {
    font-size: 2em;
  }
  
  header p {
    font-size: 1em;
  }
  
  .info-area {
    grid-template-columns: 1fr;
    gap: 20px;
    margin: 30px 0;
  }
  
  .guide-columns {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .legend,
  .hotkey-guide {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 10px;
  }
  
  .container {
    padding: 0 10px;
  }
  
  .main-layout {
    gap: 15px;
  }
  
  .controls-sidebar {
    padding: 16px;
  }
  
  .ships-list {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .control-buttons {
    flex-direction: column;
    gap: 6px;
  }
  
  .control-btn {
    font-size: 0.8em;
    padding: 8px 12px;
  }
  
  .ship-item-compact {
    padding: 10px;
  }
  
  .ship-info {
    margin-bottom: 6px;
  }
  
  .ship-name {
    font-size: 0.85em;
  }
  
  .ship-count {
    font-size: 0.75em;
  }
  
  .control-section h3 {
    font-size: 1.1em;
  }
  
  .orientation-btn {
    padding: 6px 10px;
    font-size: 0.8em;
  }
  
  header {
    padding: 12px;
    margin-bottom: 15px;
  }
  
  header h1 {
    font-size: 1.8em;
  }
  
  header p {
    font-size: 0.9em;
  }
  
  .board-container {
    max-width: 100%;
    width: 100%;
  }
  
  .board-container h2 {
    font-size: 1.2em;
  }
  
  .legend,
  .hotkey-guide {
    padding: 16px;
  }
  
  .legend h3,
  .hotkey-guide h3 {
    font-size: 1.1em;
    margin-bottom: 15px;
  }
  
  .guide-column h4 {
    font-size: 1em;
  }
  
  .guide-column p {
    font-size: 0.85em;
  }
  
  .legend-item {
    padding: 6px;
    margin-bottom: 8px;
  }
}

/* Animation keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Apply animations */
header {
  animation: fadeInUp 0.8s ease-out;
}

.controls-sidebar {
  animation: slideInLeft 0.6s ease-out 0.2s both;
}

.game-area {
  animation: slideInRight 0.6s ease-out 0.4s both;
}

.ship-item-compact.selected {
  animation: pulse 2s infinite;
}

.control-btn {
  position: relative;
  overflow: hidden;
}

.control-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -200px;
  width: 200px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
  opacity: 0;
  transition: opacity 0.3s;
}

.control-btn:hover::after {
  opacity: 1;
}

/* Enhanced hover effects */
.ship-item-compact {
  transform-origin: left center;
  will-change: transform;
}

.ship-item-compact:active {
  transform: translateX(0) scale(0.98);
}

.control-btn:active {
  transform: translateY(0) scale(0.98);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
.control-btn:focus,
.orientation-btn:focus,
.ship-item-compact:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>
