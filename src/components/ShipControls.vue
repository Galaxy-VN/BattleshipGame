<template>
  <v-card 
    class="ship-controls"
    elevation="3"
    rounded="lg"
  >
    <v-card-title class="text-h6 pb-2">
      <v-icon left color="primary">mdi-ferry</v-icon>
      Đặt Tàu Chiến
    </v-card-title>
    
    <v-card-text>
      <!-- Ship Selection Buttons -->
      <v-row class="ship-buttons mb-4">
        <v-col 
          v-for="ship in shipTypes" 
          :key="ship.name"
          cols="12"
          sm="6"
          md="4"
        >
          <v-btn
            :color="selectedShipName === ship.name ? 'primary' : 'surface'"
            :variant="selectedShipName === ship.name ? 'elevated' : 'outlined'"
            :disabled="!canPlaceMoreShips(ship)"
            :data-size="ship.size" 
            :data-name="ship.name"
            @click="selectShip(ship)"
            block
            size="large"
            class="ship-btn"
          >
            <div class="text-center">
              <div class="font-weight-bold">{{ ship.name }}</div>
              <div class="text-caption">({{ ship.size }} ô)</div>
              <v-chip 
                v-if="getShipCount(ship) > 0" 
                color="accent"
                size="x-small"
                class="mt-1"
              >
                {{ getShipCount(ship) }}/{{ ship.count }}
              </v-chip>
            </div>
          </v-btn>
        </v-col>
      </v-row>
      
      <!-- Placement Controls -->
      <v-row class="placement-controls align-center">
        <v-col cols="12" sm="4">
          <v-btn
            @click="rotateShip"
            color="secondary"
            variant="outlined"
            prepend-icon="mdi-rotate-3d-variant"
            block
          >
            Xoay (R)
          </v-btn>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-btn
            @click="clearAllShips"
            color="error"
            variant="outlined"
            prepend-icon="mdi-delete-sweep"
            block
          >
            Xóa Tất Cả
          </v-btn>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-chip
            :color="isHorizontal ? 'info' : 'warning'"
            size="large"
            class="direction-indicator"
          >
            <v-icon left>
              {{ isHorizontal ? 'mdi-arrow-right' : 'mdi-arrow-down' }}
            </v-icon>
            {{ isHorizontal ? 'Ngang' : 'Dọc' }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
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
