<template>
  <div class="ship-controls">
    <h3>Đặt Tàu Chiến:</h3>
    <div class="ship-buttons">
      <button 
        v-for="ship in shipTypes" 
        :key="ship.name"
        :class="['ship-btn', { 
          active: selectedShipName === ship.name,
          disabled: !canPlaceMoreShips(ship)
        }]"
        :data-size="ship.size" 
        :data-name="ship.name"
        @click="selectShip(ship)"
        :disabled="!canPlaceMoreShips(ship)"
      >
        {{ ship.name }} ({{ ship.size }} ô)
        <span v-if="getShipCount(ship) > 0" class="ship-count">
          {{ getShipCount(ship) }}/{{ ship.count }}
        </span>
      </button>
    </div>
    <div class="placement-controls">
      <button @click="rotateShip" class="control-btn">
        🔄 Xoay (R)
      </button>
      <button @click="clearAllShips" class="control-btn">
        🗑️ Xóa Tất Cả Tàu
      </button>
      <span class="direction-indicator">
        Hướng: <span>{{ isHorizontal ? 'Ngang' : 'Dọc' }}</span>
      </span>
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
  emits: ['ship-selected', 'rotate-ship', 'clear-ships'],
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
