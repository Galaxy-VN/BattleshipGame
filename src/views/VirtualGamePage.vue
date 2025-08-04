<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-3">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 mb-6 p-6">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 tracking-tight">
            VIRTUAL BATTLESHIP
          </h1>
          <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 rounded-full"></div>
          <p class="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Bảng theo dõi để chơi với bạn bè bằng cách đối thoại
          </p>
        </div>
      </header>

      <!-- Main Game Layout -->
      <div class="grid grid-cols-12 gap-6 items-start">

        <!-- Left Sidebar - Ship Controls -->
        <div class="col-span-4 xl:col-span-3">
          <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-4 sticky top-4 flex flex-col min-h-[420px]">
            
            <!-- Section Header -->
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span class="text-xl">🚢</span>
              </div>
              <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Đặt Tàu Chiến
              </h3>
            </div>
            
            <!-- Orientation Toggle -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Hướng Đặt Tàu</label>
              <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                <button 
                  :class="[
                    'px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2',
                    isHorizontal 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  ]"
                  @click="handleSetHorizontal(true)"
                >
                  <span>➡️</span>
                  <span>Ngang</span>
                </button>
                <button 
                  :class="[
                    'px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2',
                    !isHorizontal 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  ]"
                  @click="handleSetHorizontal(false)"
                >
                  <span>⬇️</span>
                  <span>Dọc</span>
                </button>
              </div>
            </div>
            
            <!-- Ships List -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Chọn Loại Tàu</label>
              <div class="space-y-2">
                <div 
                  v-for="ship in shipTypes" 
                  :key="ship.name"
                  :class="[
                    'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                    selectedShipName === ship.name
                      ? 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200'
                      : getPlacedCount(ship) >= ship.count
                        ? 'border-green-300 bg-green-50 opacity-75'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  ]"
                  @click="handleShipSelected(ship)"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-gray-800 text-sm">{{ ship.name }}</span>
                    <span class="text-xs font-bold px-2 py-1 rounded-full"
                          :class="getPlacedCount(ship) >= ship.count ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'">
                      {{ getPlacedCount(ship) }}/{{ ship.count }}
                    </span>
                  </div>
                  <div class="flex items-center justify-center gap-1">
                    <div 
                      v-for="n in ship.size" 
                      :key="n" 
                      class="w-3 h-3 rounded-sm transition-all duration-200"
                      :class="getPlacedCount(ship) >= ship.count 
                        ? 'bg-green-400' 
                        : selectedShipName === ship.name 
                          ? 'bg-blue-400' 
                          : 'bg-gray-300'"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Spacer to match right side height -->
            <div class="flex-1 min-h-[47px]"></div>

          </div>
        </div>

        <!-- Game Boards Area -->
        <div class="col-span-8 xl:col-span-9">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[500px]">
            
            <!-- My Board -->
            <div class="flex flex-col h-full">
              <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 h-full flex flex-col">
                <div class="flex items-center justify-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-lg">⚓</span>
                  </div>
                  <h2 class="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                    Bảng Của Bạn
                  </h2>
                </div>
                <div class="flex justify-center items-center flex-1">
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
              </div>
            </div>
            
            <!-- Opponent Board -->
            <div class="flex flex-col h-full">
              <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 h-full flex flex-col">
                <div class="flex items-center justify-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-lg">🎯</span>
                  </div>
                  <h2 class="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                    Bảng Đối Thủ
                  </h2>
                </div>
                <div class="flex justify-center items-center flex-1">
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

          <!-- Action Buttons Section -->
          <div class="mt-8">
            <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
              <div class="flex items-center justify-center gap-3 mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-xl">⚙️</span>
                </div>
                <h3 class="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Điều Khiển Trò Chơi
                </h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                  @click="autoPlaceShips"
                >
                  <span class="text-xl group-hover:animate-pulse">⚡</span>
                  <span class="text-lg">Tự Động Đặt Tàu</span>
                </button>

                <button
                  class="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                  @click="handleClearShips"
                >
                  <span class="text-xl group-hover:animate-bounce">🗑️</span>
                  <span class="text-lg">Xóa Tất Cả Tàu</span>
                </button>

                <button
                  class="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                  @click="resetGame"
                >
                  <span class="text-xl group-hover:animate-spin">🔄</span>
                  <span class="text-lg">Chơi Lại</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information and Guide Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        <!-- Legend Section -->
        <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">🎨</span>
            </div>
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Chú Giải Màu Sắc
            </h3>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="item in legendItems" 
              :key="item.label" 
              class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <div 
                class="w-6 h-6 rounded-lg border-2 border-white shadow-md"
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="font-medium text-gray-700">{{ item.label }}</span>
            </div>
          </div>
        </div>
        
        <!-- Hotkey Guide Section -->
        <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">⌨️</span>
            </div>
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Phím Tắt
            </h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Điều Khiển Tàu:</h4>
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <kbd class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-bold shadow-md">R</kbd>
                  <span class="text-sm text-gray-600">Xoay tàu</span>
                </div>
                <div class="flex items-center gap-3">
                  <kbd class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-bold shadow-md">Space</kbd>
                  <span class="text-sm text-gray-600">Đặt tàu</span>
                </div>
                <div class="flex items-center gap-3">
                  <kbd class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-bold shadow-md">Del</kbd>
                  <span class="text-sm text-gray-600">Xóa tàu</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Bắn Đối Thủ:</h4>
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <kbd class="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs font-bold shadow-md">H</kbd>
                  <span class="text-sm text-gray-600">Trúng</span>
                </div>
                <div class="flex items-center gap-3">
                  <kbd class="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs font-bold shadow-md">M</kbd>
                  <span class="text-sm text-gray-600">Trượt</span>
                </div>
                <div class="flex items-center gap-3">
                  <kbd class="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs font-bold shadow-md">C</kbd>
                  <span class="text-sm text-gray-600">Xóa đánh dấu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Container -->
    <div class="fixed top-20 right-4 w-full max-w-sm z-50 space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="transform transition-all duration-300 ease-in-out"
      >
        <v-alert
          :type="notification.type"
          :color="notification.color"
          :icon="getIconForType(notification.type)"
          closable
          :model-value="true"
          @update:modelValue="removeNotification(notification.id)"
          class="shadow-lg backdrop-blur-sm"
        >
          {{ notification.text }}
        </v-alert>
      </div>
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
        { name: 'Tàu Tuần Dương', size: 3, count: 2 },
        { name: 'Tàu Ngầm', size: 3, count: 1 },
        { name: 'Tàu Khu Trục', size: 2, count: 1 }
      ],
      legendItems: [
        { label: 'Tàu chiến', color: 'var(--primary-500)' },
        { label: 'Trúng', color: '#e11d48' },
        { label: 'Bắn trượt', color: 'var(--neutral-400)' }
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
        type: color,
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
        case 'success': return 'mdi-check-circle'
        case 'error': return 'mdi-alert-circle'
        case 'warning': return 'mdi-alert'
        case 'info': 
        default: return 'mdi-information'
      }
    },
    handleShipSelected(ship) {
      this.selectedShipSize = ship.size
      this.selectedShipName = ship.name
    },
    
    handleRotateShip() {
      this.isHorizontal = !this.isHorizontal
      this.showMessage(
        `Đã xoay thành ${this.isHorizontal ? 'ngang' : 'dọc'}!`, 
        'info', 
        2000
      )
    },
    
    handleSetHorizontal(value) {
      this.isHorizontal = value
      this.showMessage(
        `Đã chuyển thành ${value ? 'ngang' : 'dọc'}!`, 
        'info', 
        2000
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
        } else {
          this.showMessage('Không thể đặt tàu ở vị trí này!', 'warning', 2000)
        }
        return
      }
      
      // Regular click behavior for manual cell editing
      if (cell.ship) {
        this.removeShip(cell)
      } else {
        this.$refs.myBoard.setCellState(cell.row, cell.col, 'ship')
        this.showMessage('Đã đặt tàu thủ công!', 'success', 2000)
      }
    },
    
    handleOpponentBoardClick(cell) {
      if (cell.hit) {
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'miss')
        this.showMessage('Đã đánh dấu: Bắn trượt', 'info', 2000)
      } else if (cell.miss) {
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'clear')
        this.showMessage('Đã xóa đánh dấu', 'info', 2000)
      } else {
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'hit')
        this.showMessage('Đã đánh dấu: Bắn trúng!', 'success', 2000)
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
        // My board controls
        switch (key) {
          case ' ':
            if (this.selectedShipSize) {
              this.handleMyBoardClick(this.hoveredCell)
            }
            break
          case 'delete':
          case 'backspace':
            this.removeShip(this.hoveredCell)
            break
        }
      } else {
        // Opponent board controls
        switch (key) {
          case 'h':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'hit')
            this.showMessage('Đã đánh dấu: Bắn trúng!', 'success', 2000)
            break
          case 'm':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'miss')
            this.showMessage('Đã đánh dấu: Bắn trượt', 'info', 2000)
            break
          case 'c':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'clear')
            this.showMessage('Đã xóa đánh dấu', 'info', 2000)
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
        this.showMessage(`Đã đặt đủ ${name}! (${shipType.count}/${shipType.count})`, 'warning', 2000)
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
        const cellRow = isHorizontal ? row : row + i
        const cellCol = isHorizontal ? col + i : col
        this.$refs.myBoard.setCellState(cellRow, cellCol, 'ship')
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
        const removedShip = this.placedShips[shipIndex]
        this.placedShips.splice(shipIndex, 1)
        
        // Clear ship cells on board
        for (let i = 0; i < removedShip.size; i++) {
          const cellRow = removedShip.isHorizontal ? removedShip.row : removedShip.row + i
          const cellCol = removedShip.isHorizontal ? removedShip.col + i : removedShip.col
          this.$refs.myBoard.setCellState(cellRow, cellCol, 'clear')
        }
        
        this.showMessage(`Đã xóa ${removedShip.name}!`, 'info', 2000)
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
          while (!placed && attempts < maxAttempts) {
            attempts++
            const row = Math.floor(Math.random() * this.gridSize) + 1
            const col = Math.floor(Math.random() * this.gridSize) + 1
            const isHorizontal = Math.random() < 0.5
            
            if (this.canPlaceShip(row, col, shipType.size, isHorizontal)) {
              this.placeShip(row, col, shipType.size, isHorizontal, shipType.name)
              placed = true
            }
          }
          
          if (!placed) {
            this.showMessage('Không thể đặt tự động tất cả tàu!', 'error', 3000)
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
/* Custom keyframe animations for enhanced UX */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Apply subtle animations */
.page {
  animation: fadeInUp 0.6s ease-out;
}

.controls-sidebar {
  animation: slideInLeft 0.6s ease-out 0.1s both;
}

.game-area {
  animation: slideInRight 0.6s ease-out 0.2s both;
}

/* Pulse animation for selected ships */
.ship-item-compact.selected {
  animation: pulse 2s infinite;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Enhanced focus styles for accessibility */
button:focus,
.cursor-pointer:focus {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
}

/* Responsive improvements for game boards */
@media (max-width: 1280px) {
  .grid.grid-cols-12 {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .col-span-4,
  .col-span-8,
  .xl\:col-span-3,
  .xl\:col-span-9 {
    grid-column: span 1;
  }

  .grid.grid-cols-1.xl\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid.grid-cols-1.xl\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .min-h-\[500px\] {
    min-height: auto;
  }

  .p-6 {
    padding: 1rem;
  }

  .text-2xl.lg\:text-3xl {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .p-3 {
    padding: 0.75rem;
  }

  .gap-6 {
    gap: 1rem;
  }

  .rounded-2xl {
    border-radius: 1rem;
  }

  .grid.grid-cols-1.sm\:grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .px-6.py-4 {
    padding: 0.75rem 1rem;
  }

  .text-lg {
    font-size: 1rem;
  }

  .text-xl {
    font-size: 1.125rem;
  }
}

/* Enhanced action button animations */
.group:hover .group-hover\:animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

.group:hover .group-hover\:animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

.group:hover .group-hover\:animate-spin {
  animation: spin 2s linear infinite;
}

/* Custom button hover effects */
.bg-gradient-to-r:hover {
  filter: brightness(1.1) saturate(1.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: transform, box-shadow, filter;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
