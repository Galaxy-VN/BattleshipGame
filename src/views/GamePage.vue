<template>
  <div class="page game-page">
    <div class="container">
      <header>
        <h1>TRẬN CHIẾN TRÊN BIỂN</h1>
        <p>Bảng virtual để theo dõi trò chơi của bạn</p>
      </header>

      <!-- Ship Placement Controls -->
      <ShipControls
        :selected-ship-size="selectedShipSize"
        :selected-ship-name="selectedShipName"
        :is-horizontal="isHorizontal"
        :placed-ships="placedShips"
        @ship-selected="handleShipSelected"
        @rotate-ship="handleRotateShip"
        @clear-ships="handleClearShips"
      />

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
          />
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
      
      <div class="game-buttons">
        <button @click="resetGame" class="game-btn reset-btn">
          🔄 Chơi Lại
        </button>
        <button @click="autoPlaceShips" class="game-btn auto-btn">
          ⚡ Đặt Tàu Tự Động
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import GameBoard from '../components/GameBoard.vue'
import ShipControls from '../components/ShipControls.vue'

export default {
  name: 'GamePage',
  components: {
    GameBoard,
    ShipControls
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
      ]
    }
  },
  inject: ['showMessage'],
  mounted() {
    document.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
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
}

.container {
  max-width: 1200px;
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

.game-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
}

.game-btn {
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

.game-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 71, 161, 0.3);
}

.auto-btn {
  background: linear-gradient(135deg, var(--success-color), #2e7d32);
}

.auto-btn:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
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
  
  .game-buttons {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .game-btn {
    width: 100%;
    max-width: 200px;
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
