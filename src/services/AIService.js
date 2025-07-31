/**
 * AI Service for Battleship Game
 * Implements smart AI opponent with hunt & target strategy
 */

export class AIService {
  constructor(gridSize = 10) {
    this.gridSize = gridSize
    this.difficulty = 'medium' // easy, medium, hard
    this.mode = 'hunt' // hunt, target
    this.targetQueue = [] // Stack for adjacent cells to check
    this.lastHit = null
    this.hitCells = []
    this.missedCells = []
    this.sunkShips = []
    this.probabilityMap = this.initializeProbabilityMap()
  }

  /**
   * Initialize probability map for ship placement
   */
  initializeProbabilityMap() {
    const map = []
    for (let row = 1; row <= this.gridSize; row++) {
      map[row] = []
      for (let col = 1; col <= this.gridSize; col++) {
        map[row][col] = 0
      }
    }
    return map
  }

  /**
   * Get AI's next move
   * @returns {Object} {row, col} coordinates
   */
  getNextMove() {
    switch (this.difficulty) {
      case 'easy':
        return this.getRandomMove()
      case 'medium':
        return this.getSmartMove()
      case 'hard':
        return this.getAdvancedMove()
      default:
        return this.getSmartMove()
    }
  }

  /**
   * Random move for easy difficulty
   */
  getRandomMove() {
    let row, col
    do {
      row = Math.floor(Math.random() * this.gridSize) + 1
      col = Math.floor(Math.random() * this.gridSize) + 1
    } while (this.hasBeenTargeted(row, col))
    
    return { row, col }
  }

  /**
   * Smart move using hunt & target strategy
   */
  getSmartMove() {
    // Target mode: continue attacking around last hit
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      return this.targetQueue.pop()
    }

    // Hunt mode: find new targets
    return this.getHuntMove()
  }

  /**
   * Advanced move with probability calculation
   */
  getAdvancedMove() {
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      return this.targetQueue.pop()
    }

    // Calculate probability map
    this.updateProbabilityMap()
    return this.getBestProbabilityMove()
  }

  /**
   * Get move in hunt mode (looking for ships)
   */
  getHuntMove() {
    // Use checkerboard pattern for efficiency
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if ((row + col) % 2 === 0 && !this.hasBeenTargeted(row, col)) {
          return { row, col }
        }
      }
    }

    // Fallback to any available cell
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.hasBeenTargeted(row, col)) {
          return { row, col }
        }
      }
    }

    return null // No moves available
  }

  /**
   * Get move with highest probability
   */
  getBestProbabilityMove() {
    let bestMove = null
    let maxProbability = -1

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.hasBeenTargeted(row, col) && 
            this.probabilityMap[row][col] > maxProbability) {
          maxProbability = this.probabilityMap[row][col]
          bestMove = { row, col }
        }
      }
    }

    return bestMove || this.getRandomMove()
  }

  /**
   * Update probability map based on current game state
   */
  updateProbabilityMap() {
    // Reset map
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        this.probabilityMap[row][col] = 0
      }
    }

    // Calculate probability for each possible ship placement
    const shipSizes = [2, 3, 3, 4, 5] // Remaining ships
    
    shipSizes.forEach(size => {
      this.calculateShipProbability(size)
    })
  }

  /**
   * Calculate probability for a specific ship size
   */
  calculateShipProbability(shipSize) {
    // Check horizontal placements
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize - shipSize + 1; col++) {
        if (this.canPlaceShipHorizontally(row, col, shipSize)) {
          for (let i = 0; i < shipSize; i++) {
            this.probabilityMap[row][col + i]++
          }
        }
      }
    }

    // Check vertical placements
    for (let row = 1; row <= this.gridSize - shipSize + 1; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (this.canPlaceShipVertically(row, col, shipSize)) {
          for (let i = 0; i < shipSize; i++) {
            this.probabilityMap[row + i][col]++
          }
        }
      }
    }
  }

  /**
   * Check if ship can be placed horizontally
   */
  canPlaceShipHorizontally(row, col, size) {
    for (let i = 0; i < size; i++) {
      const checkCol = col + i
      if (this.missedCells.some(cell => cell.row === row && cell.col === checkCol)) {
        return false
      }
    }
    return true
  }

  /**
   * Check if ship can be placed vertically
   */
  canPlaceShipVertically(row, col, size) {
    for (let i = 0; i < size; i++) {
      const checkRow = row + i
      if (this.missedCells.some(cell => cell.row === checkRow && cell.col === col)) {
        return false
      }
    }
    return true
  }

  /**
   * Process AI move result
   */
  processResult(row, col, isHit) {
    if (isHit) {
      this.hitCells.push({ row, col })
      this.lastHit = { row, col }
      this.mode = 'target'
      this.addAdjacentTargets(row, col)
    } else {
      this.missedCells.push({ row, col })
      
      // If we were in target mode and missed, continue with queue
      if (this.mode === 'target' && this.targetQueue.length === 0) {
        this.mode = 'hunt'
      }
    }
  }

  /**
   * Add adjacent cells to target queue
   */
  addAdjacentTargets(row, col) {
    const directions = [
      { row: row - 1, col }, // Up
      { row: row + 1, col }, // Down
      { row, col: col - 1 }, // Left
      { row, col: col + 1 }  // Right
    ]

    directions.forEach(target => {
      if (this.isValidTarget(target.row, target.col)) {
        // Avoid duplicates
        if (!this.targetQueue.some(t => t.row === target.row && t.col === target.col)) {
          this.targetQueue.push(target)
        }
      }
    })
  }

  /**
   * Check if target is valid
   */
  isValidTarget(row, col) {
    return row >= 1 && row <= this.gridSize &&
           col >= 1 && col <= this.gridSize &&
           !this.hasBeenTargeted(row, col)
  }

  /**
   * Check if cell has been targeted before
   */
  hasBeenTargeted(row, col) {
    return this.hitCells.some(cell => cell.row === row && cell.col === col) ||
           this.missedCells.some(cell => cell.row === row && cell.col === col)
  }

  /**
   * Notify AI that a ship was sunk
   */
  shipSunk(shipCells) {
    this.sunkShips.push(shipCells)
    
    // Remove sunk ship cells from target queue
    this.targetQueue = this.targetQueue.filter(target => 
      !shipCells.some(cell => cell.row === target.row && cell.col === target.col)
    )

    // If no more targets, switch to hunt mode
    if (this.targetQueue.length === 0) {
      this.mode = 'hunt'
    }
  }

  /**
   * Generate AI ship placement
   */
  generateShipPlacement() {
    const ships = [
      { name: 'Tàu Sân Bay', size: 5, count: 1 },
      { name: 'Thiết Giáp Hạm', size: 4, count: 1 },
      { name: 'Tàu Tuần Dương', size: 3, count: 1 },
      { name: 'Tàu Ngầm', size: 3, count: 1 },
      { name: 'Tàu Khu Trục', size: 2, count: 1 }
    ]

    const placedShips = []
    const occupiedCells = new Set()

    ships.forEach(shipType => {
      for (let count = 0; count < shipType.count; count++) {
        let placed = false
        let attempts = 0
        const maxAttempts = 1000

        while (!placed && attempts < maxAttempts) {
          const row = Math.floor(Math.random() * this.gridSize) + 1
          const col = Math.floor(Math.random() * this.gridSize) + 1
          const isHorizontal = Math.random() < 0.5

          if (this.canPlaceAIShip(row, col, shipType.size, isHorizontal, occupiedCells)) {
            // Place the ship
            const ship = {
              row,
              col,
              size: shipType.size,
              isHorizontal,
              name: shipType.name
            }
            
            placedShips.push(ship)

            // Mark cells as occupied
            for (let i = 0; i < shipType.size; i++) {
              const shipRow = isHorizontal ? row : row + i
              const shipCol = isHorizontal ? col + i : col
              occupiedCells.add(`${shipRow}-${shipCol}`)
            }

            placed = true
          }
          attempts++
        }

        if (!placed) {
          console.warn(`Could not place ${shipType.name} after ${maxAttempts} attempts`)
        }
      }
    })

    return placedShips
  }

  /**
   * Check if AI can place ship at position
   */
  canPlaceAIShip(row, col, size, isHorizontal, occupiedCells) {
    // Check if ship fits within grid
    if (isHorizontal) {
      if (col + size - 1 > this.gridSize) return false
    } else {
      if (row + size - 1 > this.gridSize) return false
    }

    // Check if cells are available (including adjacent cells)
    for (let i = 0; i < size; i++) {
      const checkRow = isHorizontal ? row : row + i
      const checkCol = isHorizontal ? col + i : col

      // Check if cell is occupied
      if (occupiedCells.has(`${checkRow}-${checkCol}`)) return false

      // Check adjacent cells
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const adjRow = checkRow + dr
          const adjCol = checkCol + dc
          
          if (adjRow >= 1 && adjRow <= this.gridSize &&
              adjCol >= 1 && adjCol <= this.gridSize &&
              occupiedCells.has(`${adjRow}-${adjCol}`)) {
            return false
          }
        }
      }
    }

    return true
  }

  /**
   * Set AI difficulty
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty
  }

  /**
   * Reset AI state for new game
   */
  reset() {
    this.mode = 'hunt'
    this.targetQueue = []
    this.lastHit = null
    this.hitCells = []
    this.missedCells = []
    this.sunkShips = []
    this.probabilityMap = this.initializeProbabilityMap()
  }
}

export default AIService
