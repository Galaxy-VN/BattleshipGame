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
   * Advanced move with probability calculation and smart targeting
   */
  getAdvancedMove() {
    // Advanced target mode: prioritize based on hit patterns
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      return this.getSmartTargetMove()
    }

    // Calculate probability map and find best move
    this.updateProbabilityMap()
    return this.getBestProbabilityMove()
  }

  /**
   * Get move in hunt mode (looking for ships)
   */
  getHuntMove() {
    // For hard difficulty, use probability-based hunt
    if (this.difficulty === 'hard') {
      return this.getAdvancedHuntMove()
    }

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
   * Advanced hunt mode with statistical analysis
   */
  getAdvancedHuntMove() {
    // Update probability map first
    this.updateProbabilityMap()
    
    // Find cells with highest probability on checkerboard pattern
    let bestCheckerMove = null
    let maxCheckerProbability = -1

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if ((row + col) % 2 === 0 && !this.hasBeenTargeted(row, col)) {
          if (this.probabilityMap[row][col] > maxCheckerProbability) {
            maxCheckerProbability = this.probabilityMap[row][col]
            bestCheckerMove = { row, col }
          }
        }
      }
    }

    if (bestCheckerMove) return bestCheckerMove

    // If no checkerboard moves, use best probability
    return this.getBestProbabilityMove()
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
   * Smart targeting for hard difficulty - analyzes hit patterns
   */
  getSmartTargetMove() {
    // Priority 1: Continue established directional patterns
    if (this.hitCells.length >= 2) {
      const smartMove = this.getDirectionalMove()
      if (smartMove) {
        console.log('AI continuing directional pattern:', smartMove)
        return smartMove
      }
    }

    // Priority 2: Target adjacent to most recent hit
    if (this.lastHit) {
      const adjacentMoves = [
        { row: this.lastHit.row - 1, col: this.lastHit.col },
        { row: this.lastHit.row + 1, col: this.lastHit.col },
        { row: this.lastHit.row, col: this.lastHit.col - 1 },
        { row: this.lastHit.row, col: this.lastHit.col + 1 }
      ].filter(move => this.isValidTarget(move.row, move.col))

      if (adjacentMoves.length > 0) {
        // Prefer moves that could extend a line
        const prioritizedMoves = adjacentMoves.sort((a, b) => {
          const priorityA = this.getMovePriority(a)
          const priorityB = this.getMovePriority(b)
          return priorityB - priorityA
        })
        
        console.log('AI targeting adjacent to last hit:', prioritizedMoves[0])
        return prioritizedMoves[0]
      }
    }

    // Priority 3: Use target queue with distance sorting
    if (this.targetQueue.length > 0) {
      if (this.lastHit) {
        this.targetQueue.sort((a, b) => {
          const distA = Math.abs(a.row - this.lastHit.row) + Math.abs(a.col - this.lastHit.col)
          const distB = Math.abs(b.row - this.lastHit.row) + Math.abs(b.col - this.lastHit.col)
          return distA - distB
        })
      }
      
      const move = this.targetQueue.pop()
      console.log('AI using target queue:', move)
      return move
    }

    // Fallback to hunt mode
    return this.getHuntMove()
  }

  /**
   * Calculate priority for a potential move
   */
  getMovePriority(move) {
    let priority = 1

    // Check if this move would extend an existing line
    const wouldExtendHorizontal = this.hitCells.some(hit => 
      hit.row === move.row && Math.abs(hit.col - move.col) === 1
    )
    const wouldExtendVertical = this.hitCells.some(hit => 
      hit.col === move.col && Math.abs(hit.row - move.row) === 1
    )

    if (wouldExtendHorizontal || wouldExtendVertical) {
      priority += 10
    }

    // Higher priority if it continues the direction of the last hit pattern
    if (this.lastHit && this.hitCells.length >= 2) {
      const recentHits = this.hitCells.slice(-2)
      if (recentHits.length === 2) {
        const [prev, last] = recentHits
        
        // Check if move continues the same direction
        if (prev.row === last.row && last.row === move.row) {
          // Horizontal continuation
          const direction = last.col - prev.col
          const expectedCol = last.col + direction
          if (move.col === expectedCol) {
            priority += 20
          }
        } else if (prev.col === last.col && last.col === move.col) {
          // Vertical continuation
          const direction = last.row - prev.row
          const expectedRow = last.row + direction
          if (move.row === expectedRow) {
            priority += 20
          }
        }
      }
    }

    return priority
  }

  /**
   * Get directional move based on hit pattern - enhanced for better pattern recognition
   */
  getDirectionalMove() {
    // Get all unsunk hits
    const alreadySunkCells = new Set()
    this.sunkShips.forEach(ship => {
      ship.forEach(cell => {
        alreadySunkCells.add(`${cell.row}-${cell.col}`)
      })
    })

    const unsunkHits = this.hitCells.filter(hit => 
      !alreadySunkCells.has(`${hit.row}-${hit.col}`)
    )

    if (unsunkHits.length < 2) return null

    // Find the longest continuous line of hits
    const horizontalGroups = this.groupHitsByDirection(unsunkHits, 'horizontal')
    const verticalGroups = this.groupHitsByDirection(unsunkHits, 'vertical')

    // Get the longest group
    const allGroups = [...horizontalGroups, ...verticalGroups]
    if (allGroups.length === 0) return null

    const longestGroup = allGroups.reduce((longest, current) => 
      current.length > longest.length ? current : longest
    )

    if (longestGroup.length < 2) return null

    // Determine if this group is horizontal or vertical
    const isHorizontal = longestGroup[0].row === longestGroup[1].row

    if (isHorizontal) {
      // Try extending horizontal line
      longestGroup.sort((a, b) => a.col - b.col)
      const row = longestGroup[0].row
      const leftCol = longestGroup[0].col - 1
      const rightCol = longestGroup[longestGroup.length - 1].col + 1

      // Prioritize the end that's more likely to continue the ship
      if (this.isValidTarget(row, rightCol)) {
        return { row, col: rightCol }
      }
      if (this.isValidTarget(row, leftCol)) {
        return { row, col: leftCol }
      }
    } else {
      // Try extending vertical line  
      longestGroup.sort((a, b) => a.row - b.row)
      const col = longestGroup[0].col
      const topRow = longestGroup[0].row - 1
      const bottomRow = longestGroup[longestGroup.length - 1].row + 1

      // Prioritize the end that's more likely to continue the ship
      if (this.isValidTarget(bottomRow, col)) {
        return { row: bottomRow, col }
      }
      if (this.isValidTarget(topRow, col)) {
        return { row: topRow, col }
      }
    }

    return null
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

    // Get remaining ship sizes (smarter calculation)
    const remainingShips = this.getRemainingShipSizes()
    
    remainingShips.forEach(size => {
      this.calculateShipProbability(size)
    })

    // Boost probability around known hits
    this.boostProbabilityAroundHits()
  }

  /**
   * Calculate remaining ship sizes based on hits and sunk ships
   */
  getRemainingShipSizes() {
    const allShips = [2, 3, 3, 4, 5] // All ship sizes
    const sunkSizes = this.sunkShips.map(ship => ship.length)
    
    // Remove sunk ships from remaining list
    const remaining = [...allShips]
    sunkSizes.forEach(size => {
      const index = remaining.indexOf(size)
      if (index > -1) {
        remaining.splice(index, 1)
      }
    })

    return remaining
  }

  /**
   * Boost probability around isolated hits and eliminate areas around sunk ships
   */
  boostProbabilityAroundHits() {
    // First, eliminate probability around sunk ships
    this.eliminateProbabilityAroundSunkShips()
    
    // Then boost probability around unsunk hits
    this.hitCells.forEach(hit => {
      // Check if this hit is part of a sunk ship
      const isSunk = this.sunkShips.some(ship => 
        ship.some(cell => cell.row === hit.row && cell.col === hit.col)
      )
      
      if (!isSunk) {
        // Boost adjacent cells
        const adjacent = [
          { row: hit.row - 1, col: hit.col },
          { row: hit.row + 1, col: hit.col },
          { row: hit.row, col: hit.col - 1 },
          { row: hit.row, col: hit.col + 1 }
        ]
        
        adjacent.forEach(cell => {
          if (this.isValidTarget(cell.row, cell.col)) {
            this.probabilityMap[cell.row][cell.col] += 50 // Significant boost
          }
        })
      }
    })
  }

  /**
   * Eliminate probability around sunk ships since ships can't be adjacent
   */
  eliminateProbabilityAroundSunkShips() {
    this.sunkShips.forEach(ship => {
      ship.forEach(shipCell => {
        // Eliminate probability in all 8 directions around each ship cell
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const row = shipCell.row + dr
            const col = shipCell.col + dc
            
            if (row >= 1 && row <= this.gridSize && 
                col >= 1 && col <= this.gridSize) {
              this.probabilityMap[row][col] = 0 // Set to zero probability
            }
          }
        }
      })
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
    // Check if any cell is missed
    for (let i = 0; i < size; i++) {
      const checkCol = col + i
      if (this.missedCells.some(cell => cell.row === row && cell.col === checkCol)) {
        return false
      }
    }

    // Check if placement would conflict with sunk ships (including adjacent rule)
    for (let i = 0; i < size; i++) {
      const checkCol = col + i
      
      // Check if any sunk ship cell is adjacent to this potential placement
      const hasAdjacentSunkShip = this.sunkShips.some(ship =>
        ship.some(sunkCell => {
          const rowDiff = Math.abs(sunkCell.row - row)
          const colDiff = Math.abs(sunkCell.col - checkCol)
          // Adjacent includes diagonal (ships can't touch at all)
          return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
        })
      )
      
      if (hasAdjacentSunkShip) {
        return false
      }
    }
    
    return true
  }

  /**
   * Check if ship can be placed vertically
   */
  canPlaceShipVertically(row, col, size) {
    // Check if any cell is missed
    for (let i = 0; i < size; i++) {
      const checkRow = row + i
      if (this.missedCells.some(cell => cell.row === checkRow && cell.col === col)) {
        return false
      }
    }

    // Check if placement would conflict with sunk ships (including adjacent rule)
    for (let i = 0; i < size; i++) {
      const checkRow = row + i
      
      // Check if any sunk ship cell is adjacent to this potential placement
      const hasAdjacentSunkShip = this.sunkShips.some(ship =>
        ship.some(sunkCell => {
          const rowDiff = Math.abs(sunkCell.row - checkRow)
          const colDiff = Math.abs(sunkCell.col - col)
          // Adjacent includes diagonal (ships can't touch at all)
          return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
        })
      )
      
      if (hasAdjacentSunkShip) {
        return false
      }
    }
    
    return true
  }

  /**
   * Process AI move result with auto ship detection
   */
  processResult(row, col, isHit, isShipSunk = false, sunkShipCells = null) {
    if (isHit) {
      this.hitCells.push({ row, col })
      this.lastHit = { row, col }
      this.mode = 'target'
      
      // If ship sunk info is provided, use it
      if (isShipSunk && sunkShipCells) {
        this.shipSunk(sunkShipCells)
      } else {
        // Always add adjacent targets when hit (don't auto-detect ship sunk)
        // Only rely on official ship sunk notification from game engine
        this.addAdjacentTargets(row, col)
      }
    } else {
      this.missedCells.push({ row, col })
      
      // If we were in target mode and missed, continue with queue
      if (this.mode === 'target' && this.targetQueue.length === 0) {
        this.mode = 'hunt'
      }
    }
  }

  /**
   * Auto-detect if a ship might be sunk based on hit patterns
   */
  autoDetectSunkShip(row, col) {
    // Try to detect if we just completed a ship
    const possibleShip = this.findCompletedShip(row, col)
    if (possibleShip && possibleShip.length >= 2) {
      // Verify this is actually a complete ship
      if (this.isCompletedShip(possibleShip)) {
        console.log(`AI detected completed ship of size ${possibleShip.length}:`, possibleShip)
        this.shipSunk(possibleShip)
        return true
      }
    }
    
    // Also check all existing hit patterns to see if any ships are now complete
    return this.checkAllHitPatternsForCompletedShips()
  }

  /**
   * Check all existing hit patterns for completed ships
   */
  checkAllHitPatternsForCompletedShips() {
    const alreadySunkCells = new Set()
    this.sunkShips.forEach(ship => {
      ship.forEach(cell => {
        alreadySunkCells.add(`${cell.row}-${cell.col}`)
      })
    })

    // Group hits by potential ships
    const unsunkHits = this.hitCells.filter(hit => 
      !alreadySunkCells.has(`${hit.row}-${hit.col}`)
    )

    // Check for horizontal ships
    const horizontalGroups = this.groupHitsByDirection(unsunkHits, 'horizontal')
    for (const group of horizontalGroups) {
      if (group.length >= 2 && this.isCompletedShip(group)) {
        console.log(`AI detected completed horizontal ship of size ${group.length}:`, group)
        this.shipSunk(group)
        return true
      }
    }

    // Check for vertical ships  
    const verticalGroups = this.groupHitsByDirection(unsunkHits, 'vertical')
    for (const group of verticalGroups) {
      if (group.length >= 2 && this.isCompletedShip(group)) {
        console.log(`AI detected completed vertical ship of size ${group.length}:`, group)
        this.shipSunk(group)
        return true
      }
    }

    return false
  }

  /**
   * Group hits by direction (horizontal or vertical)
   */
  groupHitsByDirection(hits, direction) {
    const groups = []
    const processed = new Set()

    hits.forEach(hit => {
      const key = `${hit.row}-${hit.col}`
      if (processed.has(key)) return

      const group = [hit]
      processed.add(key)

      if (direction === 'horizontal') {
        // Expand left
        let col = hit.col - 1
        while (col >= 1) {
          const leftHit = hits.find(h => h.row === hit.row && h.col === col)
          if (leftHit && !processed.has(`${leftHit.row}-${leftHit.col}`)) {
            group.unshift(leftHit)
            processed.add(`${leftHit.row}-${leftHit.col}`)
            col--
          } else {
            break
          }
        }

        // Expand right
        col = hit.col + 1
        while (col <= this.gridSize) {
          const rightHit = hits.find(h => h.row === hit.row && h.col === col)
          if (rightHit && !processed.has(`${rightHit.row}-${rightHit.col}`)) {
            group.push(rightHit)
            processed.add(`${rightHit.row}-${rightHit.col}`)
            col++
          } else {
            break
          }
        }
      } else {
        // Expand up
        let row = hit.row - 1
        while (row >= 1) {
          const upHit = hits.find(h => h.row === row && h.col === hit.col)
          if (upHit && !processed.has(`${upHit.row}-${upHit.col}`)) {
            group.unshift(upHit)
            processed.add(`${upHit.row}-${upHit.col}`)
            row--
          } else {
            break
          }
        }

        // Expand down
        row = hit.row + 1
        while (row <= this.gridSize) {
          const downHit = hits.find(h => h.row === row && h.col === hit.col)
          if (downHit && !processed.has(`${downHit.row}-${downHit.col}`)) {
            group.push(downHit)
            processed.add(`${downHit.row}-${downHit.col}`)
            row++
          } else {
            break
          }
        }
      }

      if (group.length >= 2) {
        groups.push(group)
      }
    })

    return groups
  }

  /**
   * Find potential completed ship including the new hit
   */
  findCompletedShip(newRow, newCol) {
    const shipCells = [{ row: newRow, col: newCol }]
    
    // Check horizontal expansion
    let left = newCol - 1
    while (left >= 1 && this.hitCells.some(hit => hit.row === newRow && hit.col === left)) {
      shipCells.unshift({ row: newRow, col: left })
      left--
    }
    
    let right = newCol + 1
    while (right <= this.gridSize && this.hitCells.some(hit => hit.row === newRow && hit.col === right)) {
      shipCells.push({ row: newRow, col: right })
      right++
    }
    
    // If horizontal ship found and complete (surrounded by misses or boundaries)
    if (shipCells.length > 1) {
      return shipCells
    }
    
    // Reset and check vertical expansion
    shipCells.length = 1
    shipCells[0] = { row: newRow, col: newCol }
    
    let up = newRow - 1
    while (up >= 1 && this.hitCells.some(hit => hit.row === up && hit.col === newCol)) {
      shipCells.unshift({ row: up, col: newCol })
      up--
    }
    
    let down = newRow + 1
    while (down <= this.gridSize && this.hitCells.some(hit => hit.row === down && hit.col === newCol)) {
      shipCells.push({ row: down, col: newCol })
      down++
    }
    
    return shipCells.length > 1 ? shipCells : null
  }

  /**
   * Check if a potential ship is actually complete
   */
  isCompletedShip(shipCells) {
    if (shipCells.length < 2) return false
    
    // Check if ship size matches any valid ship size
    const validShipSizes = [2, 3, 4, 5]
    if (!validShipSizes.includes(shipCells.length)) {
      return false
    }
    
    // Determine if ship is horizontal or vertical
    const isHorizontal = shipCells[0].row === shipCells[1].row
    
    if (isHorizontal) {
      // Check ends of horizontal ship
      const row = shipCells[0].row
      const leftCol = shipCells[0].col - 1
      const rightCol = shipCells[shipCells.length - 1].col + 1
      
      const leftBlocked = leftCol < 1 || this.hasBeenTargeted(row, leftCol)
      const rightBlocked = rightCol > this.gridSize || this.hasBeenTargeted(row, rightCol)
      
      // For horizontal ships, also check if both ends are blocked or there's evidence ship ends here
      return (leftBlocked && rightBlocked) || this.isShipDefinitelyComplete(shipCells)
    } else {
      // Check ends of vertical ship
      const col = shipCells[0].col
      const topRow = shipCells[0].row - 1
      const bottomRow = shipCells[shipCells.length - 1].row + 1
      
      const topBlocked = topRow < 1 || this.hasBeenTargeted(topRow, col)
      const bottomBlocked = bottomRow > this.gridSize || this.hasBeenTargeted(bottomRow, col)
      
      // For vertical ships, also check if both ends are blocked or there's evidence ship ends here
      return (topBlocked && bottomBlocked) || this.isShipDefinitelyComplete(shipCells)
    }
  }

  /**
   * Check if ship is definitely complete based on remaining ship types
   */
  isShipDefinitelyComplete(shipCells) {
    const shipSize = shipCells.length
    const remainingShips = this.getRemainingShipSizes()
    
    // If we have a ship of this size and it's the only one of this size remaining
    const sameSize = remainingShips.filter(size => size === shipSize)
    
    // If this is size 4 and there's only one size-4 ship, it must be complete
    if (shipSize === 4 && sameSize.length === 1) {
      return true
    }
    
    // If this is size 5 and there's only one size-5 ship, it must be complete  
    if (shipSize === 5 && sameSize.length === 1) {
      return true
    }
    
    // For size 2 and 3, we need to be more careful since there might be multiple
    // But if both ends are next to misses or boundaries, likely complete
    return false
  }

  /**
   * Add adjacent cells to target queue with smart prioritization
   */
  addAdjacentTargets(row, col) {
    const directions = [
      { row: row - 1, col, priority: this.getDirectionPriority(row - 1, col, 'vertical') }, // Up
      { row: row + 1, col, priority: this.getDirectionPriority(row + 1, col, 'vertical') }, // Down
      { row, col: col - 1, priority: this.getDirectionPriority(row, col - 1, 'horizontal') }, // Left
      { row, col: col + 1, priority: this.getDirectionPriority(row, col + 1, 'horizontal') }  // Right
    ]

    // Sort by priority (higher priority first)
    directions.sort((a, b) => b.priority - a.priority)

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
   * Calculate priority for a direction based on hit patterns
   */
  getDirectionPriority(row, col, direction) {
    let priority = 1

    // Check if this direction aligns with existing hits
    const alignedHits = this.hitCells.filter(hit => {
      if (direction === 'horizontal') {
        return hit.row === row && Math.abs(hit.col - col) <= 2
      } else {
        return hit.col === col && Math.abs(hit.row - row) <= 2
      }
    })

    // Higher priority if aligned with existing hits
    priority += alignedHits.length * 10

    // Boost priority if it's continuing a known pattern
    if (this.lastHit) {
      if (direction === 'horizontal' && this.lastHit.row === row) {
        priority += 5
      } else if (direction === 'vertical' && this.lastHit.col === col) {
        priority += 5
      }
    }

    return priority
  }

  /**
   * Check if target is valid (not targeted before and not adjacent to sunk ships)
   */
  isValidTarget(row, col) {
    // Basic bounds and targeting check
    if (row < 1 || row > this.gridSize || col < 1 || col > this.gridSize) {
      return false
    }
    
    if (this.hasBeenTargeted(row, col)) {
      return false
    }

    // Check if target is adjacent to any sunk ship (ships can't be adjacent)
    const isAdjacentToSunkShip = this.sunkShips.some(ship =>
      ship.some(sunkCell => {
        const rowDiff = Math.abs(sunkCell.row - row)
        const colDiff = Math.abs(sunkCell.col - col)
        return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
      })
    )

    return !isAdjacentToSunkShip
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
    
    // Remove sunk ship cells AND all adjacent cells from target queue
    this.targetQueue = this.targetQueue.filter(target => {
      // Remove if it's the sunk ship cell
      const isSunkCell = shipCells.some(cell => cell.row === target.row && cell.col === target.col)
      if (isSunkCell) return false
      
      // Remove if it's adjacent to any sunk ship cell (ships can't be adjacent)
      const isAdjacentToSunkShip = shipCells.some(cell => {
        const rowDiff = Math.abs(cell.row - target.row)
        const colDiff = Math.abs(cell.col - target.col)
        return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
      })
      
      return !isAdjacentToSunkShip
    })

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
