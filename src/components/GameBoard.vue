<template>
  <v-card 
    class="game-board-card"
    :class="[boardType, { disabled }]"
    elevation="3"
    rounded="lg"
  >
    <div class="game-board">
      <!-- Grid Labels -->
      <div class="grid-labels">
        <div class="corner-label"></div>
        <div 
          v-for="col in gridSize" 
          :key="`col-${col}`" 
          class="col-label"
        >
          {{ String.fromCharCode(64 + col) }}
        </div>
      </div>
      
      <!-- Game Grid -->
      <div class="grid-container">
        <div class="row-labels">
          <div 
            v-for="row in gridSize" 
            :key="`row-${row}`" 
            class="row-label"
          >
            {{ row }}
          </div>
        </div>
        
        <div class="grid">
          <div 
            v-for="cell in cells" 
            :key="`${boardType}-${cell.row}-${cell.col}`"
            :class="[
              'cell',
              {
                'ship': cell.ship,
                'hit': cell.hit,
                'miss': cell.miss,
                'highlight': cell.highlight,
                'preview': cell.preview,
                'invalid-preview': cell.invalidPreview,
                'disabled': disabled
              }
            ]"
            :data-row="cell.row"
            :data-col="cell.col"
            @click="handleCellClick(cell)"
            @mouseenter="handleCellHover(cell)"
            @mouseleave="handleCellLeave(cell)"
          >
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'GameBoard',
  props: {
    boardType: {
      type: String,
      required: true,
      validator: value => ['my', 'opponent'].includes(value)
    },
    gridSize: {
      type: Number,
      default: 10
    },
    selectedShipSize: {
      type: Number,
      default: null
    },
    isHorizontal: {
      type: Boolean,
      default: true
    },
    placedShips: {
      type: Array,
      default: () => []
    },
    gameBoard: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cell-click', 'cell-hover', 'cell-leave'],
  data() {
    return {
      cells: [],
      hoveredCell: null
    }
  },
  watch: {
    gridSize: {
      immediate: true,
      handler() {
        this.initializeCells()
      }
    },
    placedShips: {
      deep: true,
      handler() {
        this.updateShipDisplay()
      }
    },
    gameBoard: {
      deep: true,
      handler() {
        this.updateFromGameBoard()
      }
    },
    // Watch for changes in isHorizontal and update preview
    isHorizontal: {
      handler() {
        if (this.hoveredCell && this.selectedShipSize && this.boardType === 'my') {
          this.highlightShipPlacement(this.hoveredCell)
        }
      },
      immediate: false
    },
    // Watch for changes in selectedShipSize and update preview
    selectedShipSize: {
      handler() {
        if (this.hoveredCell && this.boardType === 'my') {
          if (this.selectedShipSize) {
            this.highlightShipPlacement(this.hoveredCell)
          } else {
            this.clearPreview()
          }
        }
      },
      immediate: false
    }
  },
  methods: {
    initializeCells() {
      this.cells = []
      for (let row = 1; row <= this.gridSize; row++) {
        for (let col = 1; col <= this.gridSize; col++) {
          this.cells.push({
            row,
            col,
            ship: false,
            hit: false,
            miss: false,
            highlight: false,
            preview: false,
            invalidPreview: false
          })
        }
      }
    },
    
    getCell(row, col) {
      return this.cells.find(cell => cell.row === row && cell.col === col)
    },
    
    updateShipDisplay() {
      // Clear all ship states
      this.cells.forEach(cell => {
        cell.ship = false
      })
      
      // Set ship states based on placed ships
      this.placedShips.forEach(ship => {
        for (let i = 0; i < ship.size; i++) {
          const row = ship.isHorizontal ? ship.row : ship.row + i
          const col = ship.isHorizontal ? ship.col + i : ship.col
          const cell = this.getCell(row, col)
          if (cell) {
            cell.ship = true
          }
        }
      })
    },
    
    handleCellClick(cell) {
      if (this.disabled) return
      this.$emit('cell-click', { cell, boardType: this.boardType })
    },
    
    handleCellHover(cell) {
      this.hoveredCell = cell
      
      if (this.boardType === 'my' && this.selectedShipSize) {
        this.highlightShipPlacement(cell)
      } else {
        this.clearPreview()
      }
      
      this.$emit('cell-hover', { cell, boardType: this.boardType })
    },
    
    handleCellLeave(cell) {
      this.clearPreview()
      this.$emit('cell-leave', { cell, boardType: this.boardType })
    },
    
    clearPreview() {
      this.cells.forEach(cell => {
        cell.preview = false
        cell.invalidPreview = false
        cell.highlight = false
      })
    },
    
    highlightShipPlacement(cell) {
      if (!this.selectedShipSize) return
      
      // Luôn xóa preview cũ trước khi tạo preview mới
      this.clearPreview()
      
      const canPlace = this.canPlaceShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal)
      
      for (let i = 0; i < this.selectedShipSize; i++) {
        const row = this.isHorizontal ? cell.row : cell.row + i
        const col = this.isHorizontal ? cell.col + i : cell.col
        const targetCell = this.getCell(row, col)
        
        if (targetCell) {
          if (canPlace) {
            targetCell.preview = true
          } else {
            targetCell.invalidPreview = true
          }
        }
      }
    },
    
    canPlaceShip(row, col, size, isHorizontal) {
      // Check if ship fits within grid
      if (isHorizontal) {
        if (col + size - 1 > this.gridSize) return false
      } else {
        if (row + size - 1 > this.gridSize) return false
      }
      
      // Check if cells are available
      for (let i = 0; i < size; i++) {
        const checkRow = isHorizontal ? row : row + i
        const checkCol = isHorizontal ? col + i : col
        const cell = this.getCell(checkRow, checkCol)
        
        if (!cell || cell.ship) return false
      }
      
      // Check for adjacent ships
      for (let i = 0; i < size; i++) {
        const checkRow = isHorizontal ? row : row + i
        const checkCol = isHorizontal ? col + i : col
        
        if (this.hasAdjacentShip(checkRow, checkCol)) return false
      }
      
      return true
    },
    
    hasAdjacentShip(row, col) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ]
      
      return directions.some(([dr, dc]) => {
        const cell = this.getCell(row + dr, col + dc)
        return cell && cell.ship
      })
    },
    
    setCellState(row, col, state) {
      const cell = this.getCell(row, col)
      if (!cell) return
      
      // Reset all states
      cell.ship = false
      cell.hit = false
      cell.miss = false
      
      // Set new state
      switch (state) {
        case 'ship':
          cell.ship = true
          break
        case 'my_ship_hit':
          cell.ship = true
          cell.hit = true
          break
        case 'hit':
          cell.hit = true
          break
        case 'miss':
          cell.miss = true
          break
        case 'clear':
          // Already cleared above
          break
      }
    },
    
    resetBoard() {
      this.cells.forEach(cell => {
        cell.ship = false
        cell.hit = false
        cell.miss = false
        cell.highlight = false
        cell.preview = false
        cell.invalidPreview = false
      })
    },
    
    // Method để update preview từ bên ngoài
    updatePreview() {
      this.clearPreview()
      if (this.hoveredCell && this.selectedShipSize) {
        this.highlightShipPlacement(this.hoveredCell)
      }
    },
    
    // Update cells from game board state
    updateFromGameBoard() {
      if (!this.gameBoard || Object.keys(this.gameBoard).length === 0) return
      
      for (let row = 1; row <= this.gridSize; row++) {
        for (let col = 1; col <= this.gridSize; col++) {
          if (this.gameBoard[row] && this.gameBoard[row][col]) {
            const gameCell = this.gameBoard[row][col]
            const cell = this.getCell(row, col)
            
            if (cell) {
              cell.ship = gameCell.hasShip || false
              cell.hit = gameCell.isHit || false
              cell.miss = gameCell.isMiss || false
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.grid-labels {
  display: grid;
  grid-template-columns: 30px repeat(v-bind(gridSize), 35px);
  gap: 2px;
  margin-bottom: 5px;
}

.corner-label {
  width: 30px;
  height: 25px;
}

.col-label {
  width: 35px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--primary-color);
}

.grid-container {
  display: flex;
  gap: 5px;
}

.row-labels {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row-label {
  width: 30px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--primary-color);
}

.grid {
  display: grid;
  grid-template-columns: repeat(v-bind(gridSize), 35px);
  grid-template-rows: repeat(v-bind(gridSize), 35px);
  gap: 2px;
  border: 3px solid var(--primary-color);
  border-radius: 8px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.8);
}

.cell {
  width: 35px;
  height: 35px;
  border: 1px solid var(--cell-border-color);
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 3px;
  position: relative;
}

.cell:hover {
  background: var(--hover-color);
  transform: scale(1.05);
}

.cell.ship {
  background: var(--ship-color);
  border-color: #37474f;
}

.cell.ship::after {
  content: '🚢';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
}

.cell.hit {
  background: var(--hit-color);
  border-color: #b71c1c;
}

.cell.hit::after {
  content: '🔥';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
}

.cell.ship.hit {
  background: var(--my-ship-hit-color);
}

.cell.ship.hit::after {
  content: '💥';
}

.cell.miss {
  background: var(--miss-color);
  border-color: #ccc;
}

.cell.miss::after {
  content: '●';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 12px;
}

.cell.preview {
  background: rgba(76, 175, 80, 0.3);
  border-color: var(--success-color);
}

.cell.invalid-preview {
  background: rgba(244, 67, 54, 0.3);
  border-color: var(--hit-color);
}

.cell.highlight {
  background: rgba(255, 193, 7, 0.3);
  border-color: var(--warning-color);
}

.game-board.disabled .cell {
  cursor: not-allowed;
  opacity: 0.7;
}

.game-board.disabled .cell:hover {
  transform: none;
  background: rgba(255, 255, 255, 0.9);
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(v-bind(gridSize), 28px);
    grid-template-rows: repeat(v-bind(gridSize), 28px);
  }
  
  .cell {
    width: 28px;
    height: 28px;
  }
  
  .cell::after {
    font-size: 14px;
  }
  
  .col-label,
  .row-label {
    width: 28px;
    height: 28px;
    font-size: 0.9em;
  }
  
  .grid-labels {
    grid-template-columns: 25px repeat(v-bind(gridSize), 28px);
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(v-bind(gridSize), 24px);
    grid-template-rows: repeat(v-bind(gridSize), 24px);
  }
  
  .cell {
    width: 24px;
    height: 24px;
  }
  
  .cell::after {
    font-size: 12px;
  }
  
  .col-label,
  .row-label {
    width: 24px;
    height: 24px;
    font-size: 0.8em;
  }
  
  .grid-labels {
    grid-template-columns: 20px repeat(v-bind(gridSize), 24px);
  }
}
</style>
