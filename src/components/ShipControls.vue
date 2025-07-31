<template>
  <div class="glass rounded-2xl p-4 shadow-xl border-primary-200">
    <!-- Modern Header -->
    <div class="flex items-center justify-center gap-3 mb-4">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
        <v-icon color="white" size="18">mdi-ferry</v-icon>
      </div>
      <h3 class="text-lg font-display font-semibold text-primary-700 tracking-tight">Đặt Tàu Chiến</h3>
    </div>
    
    <!-- Compact Ship Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-4">
      <div 
        v-for="ship in shipTypes" 
        :key="ship.name"
        :class="[
          'ship-card-compact',
          {
            'ship-card-selected': selectedShipName === ship.name,
            'ship-card-disabled': !canPlaceMoreShips(ship)
          }
        ]"
        @click="selectShip(ship)"
      >
        <!-- Ship Header -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-neutral-800 truncate font-display">{{ ship.name }}</span>
          <span class="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold min-w-[28px] text-center shadow-sm">{{ ship.size }}</span>
        </div>
        
        <!-- Ship Visual -->
        <div class="flex justify-center gap-1.5 mb-3">
          <div 
            v-for="n in ship.size" 
            :key="n" 
            :class="[
              'ship-segment-mini',
              {
                'ship-segment-selected': selectedShipName === ship.name,
                'ship-segment-completed': !canPlaceMoreShips(ship)
              }
            ]"
          ></div>
        </div>
        
        <!-- Ship Count & Status -->
        <div class="space-y-2">
          <div class="text-center">
            <span :class="[
              'text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200',
              getShipCount(ship) > 0 ? 'bg-success-100 text-success-700 border border-success-400/20' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
            ]">
              {{ getShipCount(ship) }}/{{ ship.count }}
            </span>
          </div>
          
          <div class="text-center">
            <span class="text-xs font-medium" :class="{
              'status-selected': selectedShipName === ship.name,
              'status-completed': !canPlaceMoreShips(ship),
              'status-available': selectedShipName !== ship.name && canPlaceMoreShips(ship)
            }">
              <span v-if="selectedShipName === ship.name">✓ Đã chọn</span>
              <span v-else-if="!canPlaceMoreShips(ship)">✅ Hoàn thành</span>
              <span v-else>○ Sẵn sàng</span>
            </span>
          </div>
        </div>
      </div>
    </div>
      
    <!-- Modern Controls -->
    <div class="glass rounded-xl p-4 border-primary-100">
      <!-- Orientation Controls -->
      <div class="mb-4">
        <div class="text-sm font-medium text-neutral-700 text-center mb-3 font-display">Hướng đặt tàu:</div>
        <div class="flex gap-2">
          <button
            :class="[
              'orientation-btn',
              isHorizontal ? 'orientation-btn-active' : 'orientation-btn-inactive'
            ]"
            @click="setHorizontal(true)"
          >
            <v-icon size="16">mdi-arrow-right</v-icon>
            <span class="text-sm font-medium">Ngang</span>
          </button>
          <button
            :class="[
              'orientation-btn',
              !isHorizontal ? 'orientation-btn-active' : 'orientation-btn-inactive'
            ]"
            @click="setHorizontal(false)"
          >
            <v-icon size="16">mdi-arrow-down</v-icon>
            <span class="text-sm font-medium">Dọc</span>
          </button>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="rotateShip"
          class="control-btn-primary flex-1 text-sm flex items-center justify-center gap-2 font-display"
        >
          <v-icon size="16">mdi-rotate-3d-variant</v-icon>
          <span>Xoay (R)</span>
        </button>
        
        <button
          @click="clearAllShips"
          class="control-btn-danger flex-1 text-sm flex items-center justify-center gap-2 font-display"
        >
          <v-icon size="16">mdi-delete-sweep</v-icon>
          <span>Xóa</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShipControls',
  props: {
    selectedShipSize: {
      type: Number,
      default: null
    },
    selectedShipName: {
      type: String,
      default: ''
    },
    isHorizontal: {
      type: Boolean,
      default: true
    },
    placedShips: {
      type: Array,
      default: () => []
    }
  },
  emits: ['ship-selected', 'rotate-ship', 'set-horizontal', 'clear-ships'],
  data() {
    return {
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
  methods: {
    selectShip(ship) {
      if (!this.canPlaceMoreShips(ship)) {
        this.showMessage(
          `Bạn đã đặt đủ ${ship.name}! Chỉ được đặt ${ship.count} tàu loại này.`,
          'warning'
        )
        return
      }
      
      this.$emit('ship-selected', {
        size: ship.size,
        name: ship.name
      })
    },
    
    rotateShip() {
      this.$emit('rotate-ship')
    },
    
    setHorizontal(value) {
      this.$emit('set-horizontal', value)
    },
    
    clearAllShips() {
      this.$emit('clear-ships')
    },
    
    getShipCount(ship) {
      return this.placedShips.filter(placedShip => placedShip.name === ship.name).length
    },
    
    canPlaceMoreShips(ship) {
      return this.getShipCount(ship) < ship.count
    }
  }
}
</script>

<style scoped>
.ship-controls {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.ship-controls h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
  text-align: center;
}

.ship-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
}

.ship-btn {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  min-width: 140px;
}

.ship-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 71, 161, 0.3);
}

.ship-btn.active {
  background: linear-gradient(135deg, var(--success-color), #2e7d32);
  transform: scale(1.05);
}

.ship-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.ship-count {
  font-size: 0.8em;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 5px;
}

.placement-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.control-btn {
  background: var(--warning-color);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.control-btn:hover {
  background: #f57c00;
  transform: translateY(-1px);
}

.direction-indicator {
  background: rgba(13, 71, 161, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--primary-color);
  font-weight: 500;
}

.direction-indicator span {
  font-weight: bold;
  color: var(--secondary-color);
}

/* Orientation Button Styles */
.orientation-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-family: var(--font-body);
}

.orientation-btn-active {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-color: var(--primary-300);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(var(--primary-500-rgb), 0.3);
}

.orientation-btn-inactive {
  background: rgba(255, 255, 255, 0.9);
  color: var(--neutral-600);
  border-color: var(--neutral-200);
}

.orientation-btn-inactive:hover {
  background: var(--primary-50);
  color: var(--primary-600);
  border-color: var(--primary-200);
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .ship-controls {
    padding: 15px;
  }
  
  .ship-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .ship-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .placement-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .control-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .direction-indicator {
    text-align: center;
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .ship-controls {
    padding: 10px;
  }
  
  .ship-controls h3 {
    font-size: 1.1em;
  }
  
  .ship-btn {
    font-size: 0.9em;
    padding: 8px 12px;
  }
  
  .control-btn {
    font-size: 0.9em;
    padding: 6px 10px;
  }
  
  .direction-indicator {
    font-size: 0.9em;
  }
}
</style>
