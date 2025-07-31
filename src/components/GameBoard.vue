<template>
  <div 
    class="gameboard-container bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden"
    :class="[boardType, { disabled }]"
  >
    <div class="p-4">
      <div class="game-board board-with-coordinates">
        <!-- Grid Labels -->
        <div class="grid-labels">
          <div class="corner-label"></div>
          <div 
            v-for="col in gridSize" 
            :key="`col-${col}`" 
            class="col-label coordinate-col"
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
              class="row-label coordinate-row"
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
                'board-cell',
                {
                  'ship': cell.ship,
                  'hit': cell.hit,
                  'miss': cell.miss,
                  'water': !cell.ship && !cell.hit && !cell.miss,
                  'sunk': cell.sunk,
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
    </div>
  </div>
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
  gap: 0.75rem;
}

.grid-labels {
  display: grid;
  grid-template-columns: 2rem repeat(v-bind(gridSize), 2.5rem);
  gap: 0.125rem;
  margin-bottom: 0.5rem;
}

.corner-label {
  width: 2rem;
  height: 2rem;
}

.col-label {
  width: 2.5rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--primary-700);
  background: var(--primary-50);
  border-radius: 0.375rem;
  border: 1px solid var(--primary-200);
}

.grid-container {
  display: flex;
  gap: 0.5rem;
}

.row-labels {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.row-label {
  width: 2rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--primary-700);
  background: var(--primary-50);
  border-radius: 0.375rem;
  border: 1px solid var(--primary-200);
}

.grid {
  display: grid;
  grid-template-columns: repeat(v-bind(gridSize), 2.5rem);
  grid-template-rows: repeat(v-bind(gridSize), 2.5rem);
  gap: 0.125rem;
  border-radius: 0.75rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #0277BD 0%, #01579B 50%, #004D7A 100%);
  position: relative;
  margin-top: 0;
}

.row-labels {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.cell {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--neutral-300);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.375rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.cell:hover:not(.disabled):not(.ship):not(.hit):not(.miss):not(.preview):not(.invalid-preview) {
  background: linear-gradient(135deg, var(--primary-100) 0%, var(--secondary-100) 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(var(--primary-500-rgb), 0.3);
  border-color: var(--primary-400);
}

.cell.ship:hover:not(.disabled) {
  background: linear-gradient(135deg, #0288D1 0%, #0277BD 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(2, 119, 189, 0.4);
  border-color: var(--primary-700);
}

.cell.hit:hover:not(.disabled) {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
  border-color: #be185d;
}

.cell.ship.hit:hover:not(.disabled) {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
  border-color: #ea580c;
}

.cell.miss:hover:not(.disabled) {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(100, 116, 139, 0.4);
  border-color: var(--neutral-600);
}

.cell.ship {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  border-color: var(--primary-700);
  color: white;
}

.cell.ship::after {
  content: '\2693';
  font-size: 1.125rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.cell.hit {
  background: linear-gradient(135deg, #e11d48 0%, #be185d 100%);
  border-color: #9f1239;
  animation: hitPulse 0.6s ease-out;
}

.cell.hit::after {
  content: '💥';
  font-size: 1.125rem;
  animation: explosion 0.8s ease-out;
  color: white;
  font-weight: bold;
  text-shadow: 
    0 0 4px rgba(255, 255, 255, 1),
    0 0 8px rgba(255, 255, 255, 0.8),
    0 0 12px rgba(255, 255, 255, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
}

.cell.ship.hit {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border-color: #c2410c;
}

.cell.ship.hit::after {
  content: '\1F525';
  font-size: 1.125rem;
}

.cell.miss {
  background: linear-gradient(135deg, var(--neutral-400) 0%, var(--neutral-500) 100%);
  border-color: var(--neutral-600);
}

.cell.miss::after {
  content: '\2022';
  font-size: 1rem;
  opacity: 0.8;
  color: var(--neutral-200);
}

.cell.preview {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.3) 100%) !important;
  border-color: var(--success-500) !important;
  transform: scale(1.02) !important;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4) !important;
}

.cell.preview:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.5) 0%, rgba(22, 163, 74, 0.5) 100%) !important;
  border-color: var(--success-600) !important;
  transform: translateY(-1px) scale(1.05) !important;
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.5) !important;
}

.cell.invalid-preview {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%) !important;
  border-color: #ef4444 !important;
  transform: scale(1.02) !important;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4) !important;
}

.cell.invalid-preview:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.5) 100%) !important;
  border-color: #dc2626 !important;
  transform: translateY(-1px) scale(1.05) !important;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5) !important;
}

.cell.highlight {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%);
  border-color: #f59e0b;
  transform: scale(1.02);
}

.gameboard-container.disabled .cell {
  cursor: not-allowed;
  opacity: 0.6;
}

.gameboard-container.disabled .cell:hover {
  transform: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
  box-shadow: none;
}

@keyframes hitPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes explosion {
  0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(v-bind(gridSize), 2rem);
    grid-template-rows: repeat(v-bind(gridSize), 2rem);
    padding: 0.5rem;
    border-radius: 0.5rem;
  }
  
  .row-labels {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .cell {
    width: 2rem;
    height: 2rem;
    border-radius: 0.25rem;
  }
  
  .cell::after {
    font-size: 0.875rem;
  }
  
  .col-label,
  .row-label {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;
  }
  
  .grid-labels {
    grid-template-columns: 1.5rem repeat(v-bind(gridSize), 2rem);
  }
  
  .corner-label {
    width: 1.5rem;
  }
  
  .row-label {
    width: 1.5rem;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(v-bind(gridSize), 1.75rem);
    grid-template-rows: repeat(v-bind(gridSize), 1.75rem);
    padding: 0.375rem;
    border-radius: 0.375rem;
  }

  .grid::before {
    border-radius: 0.375rem;
  }

  .row-labels {
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
  }
  
  .cell {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.25rem;
  }
  
  .cell::after {
    font-size: 0.75rem;
  }
  
  .col-label,
  .row-label {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.675rem;
    border-radius: 0.25rem;
  }
  
  .grid-labels {
    grid-template-columns: 1.25rem repeat(v-bind(gridSize), 1.75rem);
  }
  
  .corner-label {
    width: 1.25rem;
  }
  
  .row-label {
    width: 1.25rem;
  }
}
</style>
