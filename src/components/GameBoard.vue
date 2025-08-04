<template>
  <div 
    :class="[
      'w-full max-w-full mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden transition-all duration-300',
      boardType === 'my' ? 'hover:shadow-2xl hover:scale-[1.005]' : 'hover:shadow-xl',
      { 'opacity-60 cursor-not-allowed': disabled }
    ]"
  >
    <div class="p-2">
      <div class="flex flex-col items-center gap-1 w-full">
        <!-- Grid Labels -->
        <div class="grid gap-1 justify-center items-center mb-2"
             :style="{ gridTemplateColumns: `${labelSize} repeat(${gridSize}, ${labelSize})` }">
          <div :style="{ width: labelSize, height: labelSize }"></div>
          <div
            v-for="col in gridSize"
            :key="`col-${col}`"
            class="flex items-center justify-center font-bold text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg border border-blue-200 shadow-sm"
            :style="{ width: labelSize, height: labelSize }"
          >
            {{ String.fromCharCode(64 + col) }}
          </div>
        </div>

        <!-- Game Grid -->
        <div class="flex gap-1 justify-center items-start">
          <div class="flex flex-col gap-1">
            <div
              v-for="row in gridSize"
              :key="`row-${row}`"
              class="flex items-center justify-center font-bold text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg border border-blue-200 shadow-sm"
              :style="{ width: labelSize, height: labelSize }"
            >
              {{ row }}
            </div>
          </div>

          <div class="grid gap-1 p-2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl shadow-xl"
               :style="{
                 gridTemplateColumns: `repeat(${gridSize}, ${cellSize})`,
                 gridTemplateRows: `repeat(${gridSize}, ${cellSize})`
               }">
            <div
              v-for="cell in cells"
              :key="`${boardType}-${cell.row}-${cell.col}`"
              :class="[
                'border border-2 rounded-lg cursor-pointer transition-all duration-300 relative flex items-center justify-center backdrop-blur-sm text-sm select-none',
                // Base styles
                !cell.ship && !cell.hit && !cell.miss ? 'bg-white/90 border-white/40 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 hover:scale-105' : '',
                // Ship styles
                cell.ship && !cell.hit ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 text-white shadow-lg' : '',
                // Hit styles
                cell.hit && !cell.ship ? 'bg-gradient-to-br from-red-500 to-pink-600 border-red-400 text-white shadow-lg animate-pulse' : '',
                // Ship hit styles
                cell.ship && cell.hit ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400 text-white shadow-lg animate-pulse' : '',
                // Miss styles
                cell.miss ? 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300 text-white' : '',
                // Preview styles
                cell.preview ? 'bg-gradient-to-br from-green-400/60 to-emerald-500/60 border-green-400 shadow-lg scale-105 ring-2 ring-green-300' : '',
                cell.invalidPreview ? 'bg-gradient-to-br from-red-400/60 to-red-500/60 border-red-400 shadow-lg scale-105 ring-2 ring-red-300' : '',
                // Disabled state
                disabled ? 'cursor-not-allowed opacity-50' : ''
              ]"
              :data-row="cell.row"
              :data-col="cell.col"
              :style="{ width: cellSize, height: cellSize }"
              @click="handleCellClick(cell)"
              @mouseenter="handleCellHover(cell)"
              @mouseleave="handleCellLeave(cell)"
            >
              <!-- Cell content icons -->
              <span v-if="cell.ship && !cell.hit" class="text-sm drop-shadow-md">⚓</span>
              <span v-else-if="cell.hit && !cell.ship" class="text-sm animate-bounce">💥</span>
              <span v-else-if="cell.ship && cell.hit" class="text-sm animate-spin">🔥</span>
              <span v-else-if="cell.miss" class="text-sm opacity-80">💧</span>
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
  computed: {
    cellSize() {
      // Responsive cell sizing based on screen size
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        if (width < 640) return '1.5rem' // sm: 24px
        if (width < 1024) return '1.75rem' // md: 28px
        return '2rem' // lg+: 32px
      }
      return '2rem'
    },
    labelSize() {
      // Responsive label sizing
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        if (width < 640) return '1.5rem'
        if (width < 1024) return '1.75rem'
        return '2rem'
      }
      return '2rem'
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
    },

    handleResize() {
      // Force reactivity update on resize for responsive sizing
      this.$forceUpdate()
    }
  },
  mounted() {
    // Add window resize listener for responsive sizing
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    // Clean up resize listener
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
/* Enhanced hover effects for interactive cells */
.cursor-pointer:hover:not(.opacity-50) {
  transform: translateY(-2px) scale(1.05);
}

/* Tối ưu cho desktop 1920x1080 */
.cursor-pointer:hover:not(.opacity-50) {
  transform: translateY(-2px) scale(1.05);
}

/* Đảm bảo board không quá lớn */
.grid {
  max-width: 100%;
}

/* Animation for hit effects */
@keyframes hitPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-pulse {
  animation: hitPulse 1s ease-in-out infinite;
}

/* Custom animations for special effects */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-8px,0); }
  70% { transform: translate3d(0,-4px,0); }
  90% { transform: translate3d(0,-2px,0); }
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 2s linear infinite;
}
</style>
