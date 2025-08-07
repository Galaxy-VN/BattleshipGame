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

    // Advanced AI features for hard mode
    this.heatMap = this.initializeProbabilityMap() // Tracks historical hit patterns
    this.densityMap = this.initializeProbabilityMap() // Ship density analysis
    this.parityMap = this.initializeProbabilityMap() // Parity-based targeting
    this.huntingPatterns = ['checkerboard', 'diagonal', 'spiral', 'random'] // Multiple hunting strategies
    this.currentHuntPattern = 'checkerboard'
    this.patternIndex = 0
    this.gamePhase = 'early' // early, mid, late
    this.shipConstraints = new Map() // Track ship placement constraints
    this.hitClusters = [] // Groups of related hits
    this.directionBias = { horizontal: 0, vertical: 0 } // Learn opponent's ship orientation preference
    this.adaptiveThreshold = 0.7 // Threshold for switching strategies
    this.moveHistory = [] // Track all moves for pattern analysis
    this.opponentModel = { // Model opponent behavior
      shipDensityPreference: new Map(),
      orientationBias: 0.5,
      clusteringTendency: 0.5
    }
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
    console.log(`AI getNextMove: difficulty=${this.difficulty} mode=${this.mode} queueLength=${this.targetQueue.length}`)

    let move
    switch (this.difficulty) {
      case 'easy':
        move = this.getRandomMove()
        break
      case 'medium':
        move = this.getSmartMove()
        break
      case 'hard':
        move = this.getAdvancedMove()
        break
      default:
        move = this.getSmartMove()
        break
    }

    console.log(`AI selected move: ${move ? `${move.row},${move.col}` : 'null'}`)
    return move
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
    // Target mode: prioritize directional targeting
    if (this.mode === 'target') {
      // First try directional continuation
      const directionalMove = this.getDirectionalContinuationMove()
      if (directionalMove) {
        console.log('AI using directional continuation:', directionalMove)
        return directionalMove
      }

      // Then try immediate adjacent targeting
      if (this.lastHit) {
        const adjacentMove = this.getImmediateAdjacentMove()
        if (adjacentMove) {
          return adjacentMove
        }
      }

      // Finally use target queue
      if (this.targetQueue.length > 0) {
        return this.getSmartQueueTarget()
      }
    }

    // Hunt mode: find new targets
    return this.getHuntMove()
  }

  /**
   * Advanced move with probability calculation and smart targeting
   */
  getAdvancedMove() {
    // Update game phase and adapt strategy
    this.updateGamePhase()
    this.adaptStrategy()

    // Target mode: prioritize directional targeting
    if (this.mode === 'target') {
      // PRIORITY 1: Directional continuation - if we have 2+ hits in a line, continue that direction
      const directionalMove = this.getDirectionalContinuationMove()
      if (directionalMove) {
        console.log('AI using directional continuation (HIGHEST PRIORITY):', directionalMove)
        return directionalMove
      }

      // PRIORITY 2: If we have a recent hit, target adjacent cells immediately
      if (this.lastHit) {
        const adjacentMove = this.getImmediateAdjacentMove()
        if (adjacentMove) {
          console.log('AI using immediate adjacent targeting:', adjacentMove)
          return adjacentMove
        }
      }

      // PRIORITY 3: Use target queue (already contains smart adjacent targets)
      if (this.targetQueue.length > 0) {
        const queueMove = this.getSmartQueueTarget()
        if (queueMove) {
          console.log('AI using target queue:', queueMove)
          return queueMove
        }
      }

      // PRIORITY 4: Advanced targeting only if simple methods fail
      const advancedTargetMove = this.getAdvancedTargetMove()
      if (advancedTargetMove) {
        return advancedTargetMove
      }
    }

    // Hunt mode: use advanced probability-based hunting
    return this.getAdvancedHuntMove()
  }

  /**
   * Get move in hunt mode (looking for ships)
   */
  getHuntMove() {
    // For hard difficulty, use probability-based hunt
    if (this.difficulty === 'hard') {
      const advancedMove = this.getAdvancedHuntMove()
      if (advancedMove) {
        return advancedMove
      }
      // If advanced hunt fails, fallback to smart checkerboard
    }

    // Use checkerboard pattern for efficiency
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if ((row + col) % 2 === 0 && !this.hasBeenTargeted(row, col)) {
          return { row, col }
        }
      }
    }

    // Fallback: use random selection instead of systematic scanning
    // This prevents the "left to right, top to bottom" behavior
    return this.getRandomMove()
  }

  /**
   * Advanced hunt mode with multiple sophisticated algorithms
   * ENHANCED: Strategic ship size analysis and constraint-based targeting
   */
  getAdvancedHuntMove() {
    // Update all probability layers
    this.updateAdvancedProbabilityMaps()

    // STRATEGIC ENHANCEMENT: Analyze remaining ship constraints
    const remainingShips = this.getRemainingShipSizes()
    console.log(`AI: Remaining ships to find: [${remainingShips.join(', ')}]`)

    // Apply strategic ship size filtering
    const strategicMove = this.getStrategicShipSizeMove(remainingShips)
    if (strategicMove) {
      console.log('AI using strategic ship size analysis:', strategicMove)
      return strategicMove
    }

    // Combine multiple probability sources with weighted scoring
    const combinedProbabilityMap = this.combineProbabilityMaps()

    // Use current hunting pattern with adaptive switching
    const patternMove = this.getPatternBasedMove(combinedProbabilityMap)
    if (patternMove) {
      console.log(`AI using ${this.currentHuntPattern} pattern:`, patternMove)
      return patternMove
    }

    // Fallback to highest probability move
    return this.getBestCombinedProbabilityMove(combinedProbabilityMap)
  }

  /**
   * Strategic move selection based on remaining ship sizes
   * ADVANCED: Focus on areas that can accommodate remaining ships
   */
  getStrategicShipSizeMove(remainingShips) {
    if (remainingShips.length === 0) return null

    // Focus on the largest remaining ship first (more strategic value)
    const targetShipSize = Math.max(...remainingShips)
    console.log(`AI: Focusing on ship size ${targetShipSize}`)

    // Find optimal positions for this ship size
    const optimalMoves = this.findOptimalMovesForShipSize(targetShipSize)

    if (optimalMoves.length > 0) {
      // Sort by strategic value (areas with multiple ship placement possibilities)
      optimalMoves.sort((a, b) => b.strategicValue - a.strategicValue)
      return optimalMoves[0]
    }

    return null
  }

  /**
   * Find optimal moves for a specific ship size
   * STRATEGIC: Prioritize cells that maximize ship placement possibilities
   */
  findOptimalMovesForShipSize(shipSize) {
    const optimalMoves = []

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.isValidTarget(row, col)) continue

        // Calculate strategic value for this position
        const strategicValue = this.calculateStrategicValue(row, col, shipSize)

        if (strategicValue > 0) {
          optimalMoves.push({ row, col, strategicValue })
        }
      }
    }

    return optimalMoves
  }

  /**
   * Calculate strategic value of a position for ship placement
   * ADVANCED: Consider multiple ship orientations and placement possibilities
   */
  calculateStrategicValue(row, col, shipSize) {
    let strategicValue = 0

    // Check how many different ship placements this cell could be part of
    const horizontalPlacements = this.countValidHorizontalPlacements(row, col, shipSize)
    const verticalPlacements = this.countValidVerticalPlacements(row, col, shipSize)

    strategicValue += horizontalPlacements * 10
    strategicValue += verticalPlacements * 10

    // Bonus for cells that could be part of multiple ship sizes
    const remainingShips = this.getRemainingShipSizes()
    remainingShips.forEach(size => {
      if (size !== shipSize) {
        strategicValue += this.countValidHorizontalPlacements(row, col, size) * 2
        strategicValue += this.countValidVerticalPlacements(row, col, size) * 2
      }
    })

    // Penalty for cells near edges (less flexible)
    const edgeDistance = Math.min(row - 1, this.gridSize - row, col - 1, this.gridSize - col)
    strategicValue += edgeDistance * 2

    return strategicValue
  }

  /**
   * Count valid horizontal ship placements that include this cell
   */
  countValidHorizontalPlacements(row, col, shipSize) {
    let count = 0

    // Check all possible starting positions for horizontal ships that include this cell
    for (let startCol = Math.max(1, col - shipSize + 1); startCol <= Math.min(col, this.gridSize - shipSize + 1); startCol++) {
      if (this.canPlaceShipHorizontally(row, startCol, shipSize)) {
        count++
      }
    }

    return count
  }

  /**
   * Count valid vertical ship placements that include this cell
   */
  countValidVerticalPlacements(row, col, shipSize) {
    let count = 0

    // Check all possible starting positions for vertical ships that include this cell
    for (let startRow = Math.max(1, row - shipSize + 1); startRow <= Math.min(row, this.gridSize - shipSize + 1); startRow++) {
      if (this.canPlaceShipVertically(startRow, col, shipSize)) {
        count++
      }
    }

    return count
  }

  /**
   * Advanced targeting with machine learning and pattern recognition
   * ENHANCED: Strategic ship completion with adjacency awareness
   */
  getAdvancedTargetMove() {
    console.log('AI using advanced targeting algorithms')
    console.log('Current hit cells:', this.hitCells)
    console.log('Target queue:', this.targetQueue)

    // PRIORITY 0: IMMEDIATE ADJACENT TARGETING - if we have a recent hit, target adjacent cells first
    if (this.lastHit) {
      const adjacentMove = this.getImmediateAdjacentMove()
      if (adjacentMove) {
        console.log('AI using immediate adjacent targeting (HIGHEST PRIORITY):', adjacentMove)
        return adjacentMove
      }
    }

    // PRIORITY 1: Directional continuation - if we have 2+ hits in a line, continue that direction
    const directionalMove = this.getDirectionalContinuationMove()
    if (directionalMove) {
      console.log('AI using directional continuation:', directionalMove)
      return directionalMove
    }

    // PRIORITY 2: Strategic ship completion analysis
    const completionMove = this.getStrategicShipCompletionMove()
    if (completionMove) {
      console.log('AI using strategic ship completion:', completionMove)
      return completionMove
    }

    // PRIORITY 3: Multi-ship cluster analysis
    const clusterMove = this.getClusterBasedMove()
    if (clusterMove) {
      console.log('AI using cluster analysis:', clusterMove)
      return clusterMove
    }

    // PRIORITY 4: Bayesian ship completion prediction
    const bayesianMove = this.getBayesianPredictionMove()
    if (bayesianMove) {
      console.log('AI using Bayesian prediction:', bayesianMove)
      return bayesianMove
    }

    // PRIORITY 5: Advanced directional analysis with constraint satisfaction
    const constraintMove = this.getConstraintSatisfactionMove()
    if (constraintMove) {
      console.log('AI using constraint satisfaction:', constraintMove)
      return constraintMove
    }

    // PRIORITY 6: Enhanced smart targeting (original algorithm)
    return this.getSmartTargetMove()
  }

  /**
   * IMMEDIATE ADJACENT TARGETING: Target cells adjacent to the most recent hit
   * This ensures AI focuses on the immediate area around a fresh hit
   */
  getImmediateAdjacentMove() {
    if (!this.lastHit) return null

    // Check if we have an established direction first
    const establishedDirection = this.getEstablishedDirection(this.lastHit.row, this.lastHit.col)

    let adjacentCells = [
      { row: this.lastHit.row - 1, col: this.lastHit.col }, // Up
      { row: this.lastHit.row + 1, col: this.lastHit.col }, // Down
      { row: this.lastHit.row, col: this.lastHit.col - 1 }, // Left
      { row: this.lastHit.row, col: this.lastHit.col + 1 }  // Right
    ]

    // If we have established direction, only consider cells in that direction
    if (establishedDirection === 'horizontal') {
      adjacentCells = adjacentCells.filter(cell => cell.row === this.lastHit.row)
      console.log('AI: Filtering to horizontal adjacent cells only')
    } else if (establishedDirection === 'vertical') {
      adjacentCells = adjacentCells.filter(cell => cell.col === this.lastHit.col)
      console.log('AI: Filtering to vertical adjacent cells only')
    }

    // Filter valid, untargeted adjacent cells
    const validAdjacent = adjacentCells.filter(cell =>
      this.isValidTarget(cell.row, cell.col) && !this.hasBeenTargeted(cell.row, cell.col)
    )

    if (validAdjacent.length === 0) return null

    // If we have multiple adjacent options, prioritize based on existing patterns
    if (validAdjacent.length > 1) {
      // Check if any adjacent cell would extend an existing line
      for (const cell of validAdjacent) {
        const wouldExtendLine = this.wouldExtendExistingLine(cell, this.lastHit)
        if (wouldExtendLine) {
          console.log(`AI: Adjacent cell ${cell.row},${cell.col} would extend existing line`)
          return cell
        }
      }
    }

    // Return the first valid adjacent cell
    console.log(`AI: Targeting adjacent to last hit ${this.lastHit.row},${this.lastHit.col}`)
    return validAdjacent[0]
  }

  /**
   * Check if targeting a cell would extend an existing line of hits
   */
  wouldExtendExistingLine(targetCell, fromHit) {
    const activeHits = this.getActiveHits()

    // Check horizontal extension: targetCell must be on same row as fromHit
    if (targetCell.row === fromHit.row) {
      // Look for other hits on the same row that would form a line
      const horizontalHits = activeHits.filter(hit =>
        hit.row === fromHit.row && hit.col !== fromHit.col
      )

      if (horizontalHits.length >= 1) {
        // Check if targetCell would extend the line in the right direction
        const allCols = [fromHit.col, targetCell.col, ...horizontalHits.map(h => h.col)]
        allCols.sort((a, b) => a - b)

        // Check if targetCell is at either end of the sorted sequence
        const isAtEnd = targetCell.col === allCols[0] || targetCell.col === allCols[allCols.length - 1]
        return isAtEnd
      }
    }

    // Check vertical extension: targetCell must be on same col as fromHit
    if (targetCell.col === fromHit.col) {
      // Look for other hits on the same column that would form a line
      const verticalHits = activeHits.filter(hit =>
        hit.col === fromHit.col && hit.row !== fromHit.row
      )

      if (verticalHits.length >= 1) {
        // Check if targetCell would extend the line in the right direction
        const allRows = [fromHit.row, targetCell.row, ...verticalHits.map(h => h.row)]
        allRows.sort((a, b) => a - b)

        // Check if targetCell is at either end of the sorted sequence
        const isAtEnd = targetCell.row === allRows[0] || targetCell.row === allRows[allRows.length - 1]
        return isAtEnd
      }
    }

    return false
  }

  /**
   * DIRECTIONAL CONTINUATION: When we have 2+ hits in a line, continue that direction
   * This prevents the AI from wasting shots around when direction is already known
   */
  getDirectionalContinuationMove() {
    const activeHits = this.getActiveHits()
    if (activeHits.length < 2) return null

    // Find all linear sequences of 2+ hits
    const sequences = this.findLinearSequences(activeHits)

    for (const sequence of sequences) {
      if (sequence.length >= 2) {
        // Determine direction and try to extend the sequence
        const direction = this.getSequenceDirection(sequence)
        const extensionMove = this.getSequenceExtension(sequence, direction)

        if (extensionMove && !this.hasBeenTargeted(extensionMove.row, extensionMove.col)) {
          console.log(`AI found directional continuation: sequence of ${sequence.length} hits, extending ${direction}`)
          return extensionMove
        }
      }
    }

    return null
  }

  /**
   * Find all linear sequences of hits (horizontal or vertical)
   */
  findLinearSequences(hits) {
    const sequences = []
    const processed = new Set()

    for (const hit of hits) {
      const hitKey = `${hit.row},${hit.col}`
      if (processed.has(hitKey)) continue

      // Try to build horizontal sequence
      const horizontalSeq = this.buildSequence(hit, hits, 'horizontal', processed)
      if (horizontalSeq.length >= 2) {
        sequences.push(horizontalSeq)
      }

      // Try to build vertical sequence
      const verticalSeq = this.buildSequence(hit, hits, 'vertical', processed)
      if (verticalSeq.length >= 2) {
        sequences.push(verticalSeq)
      }
    }

    return sequences
  }

  /**
   * Build a sequence of hits in a specific direction
   */
  buildSequence(startHit, allHits, direction, processed) {
    const sequence = [startHit]
    processed.add(`${startHit.row},${startHit.col}`)

    const isHorizontal = direction === 'horizontal'

    // Extend in positive direction
    let current = startHit
    let extending = true
    while (extending) {
      const nextRow = isHorizontal ? current.row : current.row + 1
      const nextCol = isHorizontal ? current.col + 1 : current.col

      const nextHit = allHits.find(h => h.row === nextRow && h.col === nextCol)
      if (!nextHit) {
        extending = false
      } else {
        sequence.push(nextHit)
        processed.add(`${nextHit.row},${nextHit.col}`)
        current = nextHit
      }
    }

    // Extend in negative direction
    current = startHit
    extending = true
    while (extending) {
      const prevRow = isHorizontal ? current.row : current.row - 1
      const prevCol = isHorizontal ? current.col - 1 : current.col

      const prevHit = allHits.find(h => h.row === prevRow && h.col === prevCol)
      if (!prevHit) {
        extending = false
      } else {
        sequence.unshift(prevHit)
        processed.add(`${prevHit.row},${prevHit.col}`)
        current = prevHit
      }
    }

    return sequence
  }

  /**
   * Get the direction of a sequence
   */
  getSequenceDirection(sequence) {
    if (sequence.length < 2) return null

    const first = sequence[0]
    const second = sequence[1]

    if (first.row === second.row) return 'horizontal'
    if (first.col === second.col) return 'vertical'
    return null
  }

  /**
   * Get the best extension point for a sequence
   */
  getSequenceExtension(sequence, direction) {
    if (!direction || sequence.length < 2) return null

    const isHorizontal = direction === 'horizontal'
    const sorted = [...sequence].sort((a, b) => {
      return isHorizontal ? a.col - b.col : a.row - b.row
    })

    const first = sorted[0]
    const last = sorted[sorted.length - 1]

    // Try to extend at both ends, prioritize the end that's more likely to be valid
    const extensions = []

    // Extend beyond the last element
    const extendRow = isHorizontal ? last.row : last.row + 1
    const extendCol = isHorizontal ? last.col + 1 : last.col
    if (this.isValidTarget(extendRow, extendCol)) {
      extensions.push({ row: extendRow, col: extendCol, priority: 1 })
    }

    // Extend before the first element
    const prependRow = isHorizontal ? first.row : first.row - 1
    const prependCol = isHorizontal ? first.col - 1 : first.col
    if (this.isValidTarget(prependRow, prependCol)) {
      extensions.push({ row: prependRow, col: prependCol, priority: 1 })
    }

    // Return the first valid extension
    for (const ext of extensions) {
      if (!this.hasBeenTargeted(ext.row, ext.col)) {
        return { row: ext.row, col: ext.col }
      }
    }

    return null
  }

  /**
   * Strategic ship completion move - focuses on finishing partially hit ships
   * ADVANCED: Considers remaining ship sizes and optimal completion strategies
   */
  getStrategicShipCompletionMove() {
    const activeHits = this.getActiveHits() // Hits not part of sunk ships
    if (activeHits.length === 0) return null

    const remainingShips = this.getRemainingShipSizes()

    // Analyze each active hit for completion potential
    const completionCandidates = []

    activeHits.forEach(hit => {
      const candidates = this.analyzeHitForCompletion(hit, remainingShips)
      completionCandidates.push(...candidates)
    })

    if (completionCandidates.length === 0) return null

    // Sort by completion probability and strategic value
    completionCandidates.sort((a, b) => {
      // Prioritize moves that could complete larger ships
      if (a.shipSize !== b.shipSize) {
        return b.shipSize - a.shipSize
      }
      // Then by completion probability
      return b.completionProbability - a.completionProbability
    })

    const bestCandidate = completionCandidates[0]
    console.log(`AI: Strategic completion targeting ship size ${bestCandidate.shipSize} with probability ${bestCandidate.completionProbability}`)

    return { row: bestCandidate.row, col: bestCandidate.col }
  }

  /**
   * Get hits that are not part of any sunk ship
   */
  getActiveHits() {
    const sunkCells = new Set()
    this.sunkShips.forEach(ship => {
      ship.forEach(cell => {
        sunkCells.add(`${cell.row}-${cell.col}`)
      })
    })

    return this.hitCells.filter(hit =>
      !sunkCells.has(`${hit.row}-${hit.col}`)
    )
  }

  /**
   * Analyze a hit for ship completion possibilities
   * STRATEGIC: Consider all possible ship sizes and orientations
   */
  analyzeHitForCompletion(hit, remainingShips) {
    const candidates = []

    remainingShips.forEach(shipSize => {
      // Check horizontal completion possibilities
      const horizontalCandidates = this.getHorizontalCompletionCandidates(hit, shipSize)
      candidates.push(...horizontalCandidates)

      // Check vertical completion possibilities
      const verticalCandidates = this.getVerticalCompletionCandidates(hit, shipSize)
      candidates.push(...verticalCandidates)
    })

    return candidates
  }

  /**
   * Get horizontal ship completion candidates for a hit
   */
  getHorizontalCompletionCandidates(hit, shipSize) {
    const candidates = []

    // Try all possible horizontal ship positions that include this hit
    for (let startCol = Math.max(1, hit.col - shipSize + 1); startCol <= Math.min(hit.col, this.gridSize - shipSize + 1); startCol++) {
      const shipCells = []
      let hitCount = 0
      let validPlacement = true

      // Check each cell of the potential ship
      for (let i = 0; i < shipSize; i++) {
        const cellCol = startCol + i

        if (this.hitCells.some(h => h.row === hit.row && h.col === cellCol)) {
          hitCount++
        } else if (this.missedCells.some(m => m.row === hit.row && m.col === cellCol)) {
          validPlacement = false
          break
        } else if (!this.isValidTarget(hit.row, cellCol)) {
          validPlacement = false
          break
        }

        shipCells.push({ row: hit.row, col: cellCol })
      }

      if (validPlacement && hitCount > 0) {
        // Find the best target cell in this potential ship
        shipCells.forEach(cell => {
          if (this.isValidTarget(cell.row, cell.col)) {
            const completionProbability = (hitCount / shipSize) * 100
            candidates.push({
              row: cell.row,
              col: cell.col,
              shipSize,
              completionProbability,
              orientation: 'horizontal'
            })
          }
        })
      }
    }

    return candidates
  }

  /**
   * Get vertical ship completion candidates for a hit
   */
  getVerticalCompletionCandidates(hit, shipSize) {
    const candidates = []

    // Try all possible vertical ship positions that include this hit
    for (let startRow = Math.max(1, hit.row - shipSize + 1); startRow <= Math.min(hit.row, this.gridSize - shipSize + 1); startRow++) {
      const shipCells = []
      let hitCount = 0
      let validPlacement = true

      // Check each cell of the potential ship
      for (let i = 0; i < shipSize; i++) {
        const cellRow = startRow + i

        if (this.hitCells.some(h => h.row === cellRow && h.col === hit.col)) {
          hitCount++
        } else if (this.missedCells.some(m => m.row === cellRow && m.col === hit.col)) {
          validPlacement = false
          break
        } else if (!this.isValidTarget(cellRow, hit.col)) {
          validPlacement = false
          break
        }

        shipCells.push({ row: cellRow, col: hit.col })
      }

      if (validPlacement && hitCount > 0) {
        // Find the best target cell in this potential ship
        shipCells.forEach(cell => {
          if (this.isValidTarget(cell.row, cell.col)) {
            const completionProbability = (hitCount / shipSize) * 100
            candidates.push({
              row: cell.row,
              col: cell.col,
              shipSize,
              completionProbability,
              orientation: 'vertical'
            })
          }
        })
      }
    }

    return candidates
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

      const move = this.getSmartQueueTarget()
      console.log('AI using smart target queue:', move)
      return move
    }

    // Don't fallback to hunt mode - return null to let caller handle
    // This prevents infinite recursion and ensures proper mode handling
    return null
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
   * Update all advanced probability maps for hard mode
   */
  updateAdvancedProbabilityMaps() {
    // Update basic probability map
    this.updateProbabilityMap()

    // Update heat map based on historical patterns
    this.updateHeatMap()

    // Update density map based on ship clustering analysis
    this.updateDensityMap()

    // Update parity map for optimal coverage
    this.updateParityMap()

    // Update opponent model
    this.updateOpponentModel()
  }

  /**
   * Combine multiple probability maps with intelligent weighting
   */
  combineProbabilityMaps() {
    const combined = this.initializeProbabilityMap()
    const weights = this.calculateMapWeights()

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.hasBeenTargeted(row, col)) {
          combined[row][col] =
            (this.probabilityMap[row][col] * weights.probability) +
            (this.heatMap[row][col] * weights.heat) +
            (this.densityMap[row][col] * weights.density) +
            (this.parityMap[row][col] * weights.parity)
        }
      }
    }

    return combined
  }

  /**
   * Calculate dynamic weights for probability map combination
   */
  calculateMapWeights() {
    const totalShots = this.moveHistory.length
    const hitRate = this.hitCells.length / Math.max(totalShots, 1)
    const gameProgress = totalShots / (this.gridSize * this.gridSize)

    // Adaptive weights based on game state
    return {
      probability: 0.4 + (gameProgress * 0.2), // Increase as game progresses
      heat: 0.2 + (hitRate * 0.3), // Increase with hit success
      density: 0.2 + (this.opponentModel.clusteringTendency * 0.2),
      parity: 0.2 - (gameProgress * 0.1) // Decrease as game progresses
    }
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
   * STRATEGIC ENHANCEMENT: Complete elimination of impossible areas
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
              // Set to negative probability to ensure these cells are never selected
              this.probabilityMap[row][col] = -1000
              this.heatMap[row][col] = -1000
              this.densityMap[row][col] = -1000
            }
          }
        }
      })
    })

    console.log(`AI: Eliminated probability around ${this.sunkShips.length} sunk ships`)
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
   * ENHANCED: Strict adjacency rules and strategic constraints
   */
  canPlaceShipHorizontally(row, col, size) {
    // Check if any cell is missed (including virtual misses from sunk ship adjacency)
    for (let i = 0; i < size; i++) {
      const checkCol = col + i
      if (this.missedCells.some(cell => cell.row === row && cell.col === checkCol)) {
        return false
      }
    }

    // STRATEGIC CONSTRAINT: Check if placement would conflict with sunk ships
    // Ships cannot be adjacent in ANY direction (including diagonally)
    for (let i = 0; i < size; i++) {
      const checkCol = col + i

      // Check if any sunk ship cell is adjacent to this potential placement
      const hasAdjacentSunkShip = this.sunkShips.some(ship =>
        ship.some(sunkCell => {
          const rowDiff = Math.abs(sunkCell.row - row)
          const colDiff = Math.abs(sunkCell.col - checkCol)
          // Adjacent includes all 8 directions (ships can't touch at all)
          return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
        })
      )

      if (hasAdjacentSunkShip) {
        return false
      }
    }

    // ADVANCED CONSTRAINT: Check buffer zones around ship placement
    // Ensure the entire ship + 1 cell buffer doesn't conflict
    for (let i = -1; i <= size; i++) {
      const checkCol = col + i
      if (checkCol >= 1 && checkCol <= this.gridSize) {
        // Check cells above and below the ship line
        for (let dr = -1; dr <= 1; dr++) {
          const checkRow = row + dr
          if (checkRow >= 1 && checkRow <= this.gridSize) {
            // If this buffer cell has a sunk ship, placement is invalid
            const hasSunkShip = this.sunkShips.some(ship =>
              ship.some(sunkCell => sunkCell.row === checkRow && sunkCell.col === checkCol)
            )
            if (hasSunkShip) {
              return false
            }
          }
        }
      }
    }

    return true
  }

  /**
   * Check if ship can be placed vertically
   * ENHANCED: Strict adjacency rules and strategic constraints
   */
  canPlaceShipVertically(row, col, size) {
    // Check if any cell is missed (including virtual misses from sunk ship adjacency)
    for (let i = 0; i < size; i++) {
      const checkRow = row + i
      if (this.missedCells.some(cell => cell.row === checkRow && cell.col === col)) {
        return false
      }
    }

    // STRATEGIC CONSTRAINT: Check if placement would conflict with sunk ships
    // Ships cannot be adjacent in ANY direction (including diagonally)
    for (let i = 0; i < size; i++) {
      const checkRow = row + i

      // Check if any sunk ship cell is adjacent to this potential placement
      const hasAdjacentSunkShip = this.sunkShips.some(ship =>
        ship.some(sunkCell => {
          const rowDiff = Math.abs(sunkCell.row - checkRow)
          const colDiff = Math.abs(sunkCell.col - col)
          // Adjacent includes all 8 directions (ships can't touch at all)
          return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
        })
      )

      if (hasAdjacentSunkShip) {
        return false
      }
    }

    // ADVANCED CONSTRAINT: Check buffer zones around ship placement
    // Ensure the entire ship + 1 cell buffer doesn't conflict
    for (let i = -1; i <= size; i++) {
      const checkRow = row + i
      if (checkRow >= 1 && checkRow <= this.gridSize) {
        // Check cells left and right of the ship line
        for (let dc = -1; dc <= 1; dc++) {
          const checkCol = col + dc
          if (checkCol >= 1 && checkCol <= this.gridSize) {
            // If this buffer cell has a sunk ship, placement is invalid
            const hasSunkShip = this.sunkShips.some(ship =>
              ship.some(sunkCell => sunkCell.row === checkRow && sunkCell.col === checkCol)
            )
            if (hasSunkShip) {
              return false
            }
          }
        }
      }
    }

    return true
  }

  /**
   * Update heat map based on historical hit patterns
   */
  updateHeatMap() {
    // Decay existing heat
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        this.heatMap[row][col] *= 0.95 // Gradual decay
      }
    }

    // Add heat around recent hits
    this.hitCells.forEach((hit, index) => {
      const recency = (this.hitCells.length - index) / this.hitCells.length
      const heatValue = 10 * recency

      // Spread heat in a radius
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const r = hit.row + dr
          const c = hit.col + dc
          if (r >= 1 && r <= this.gridSize && c >= 1 && c <= this.gridSize) {
            const distance = Math.abs(dr) + Math.abs(dc)
            this.heatMap[r][c] += heatValue / (distance + 1)
          }
        }
      }
    })
  }

  /**
   * Update density map based on ship clustering analysis
   */
  updateDensityMap() {
    // Reset density map
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        this.densityMap[row][col] = 0
      }
    }

    // Analyze ship density patterns
    const remainingShips = this.getRemainingShipSizes()

    remainingShips.forEach(shipSize => {
      this.calculateDensityForShipSize(shipSize)
    })

    // Apply opponent clustering tendency
    this.applyClusteringBias()
  }

  /**
   * Update parity map for optimal coverage patterns
   */
  updateParityMap() {
    const smallestShip = Math.min(...this.getRemainingShipSizes())

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        // Calculate parity score based on smallest remaining ship
        let parityScore = 0

        if (smallestShip === 2) {
          parityScore = (row + col) % 2 === 0 ? 5 : 1
        } else if (smallestShip === 3) {
          parityScore = (row + col) % 3 === 0 ? 5 : 2
        } else {
          parityScore = 3 // Equal weight for larger ships
        }

        this.parityMap[row][col] = parityScore
      }
    }
  }

  /**
   * Update opponent behavioral model
   */
  updateOpponentModel() {
    // Analyze ship orientation bias
    let horizontalShips = 0
    let verticalShips = 0

    this.sunkShips.forEach(ship => {
      if (ship.length >= 2) {
        const isHorizontal = ship[0].row === ship[1].row
        if (isHorizontal) horizontalShips++
        else verticalShips++
      }
    })

    const totalOrientedShips = horizontalShips + verticalShips
    if (totalOrientedShips > 0) {
      this.opponentModel.orientationBias = horizontalShips / totalOrientedShips
    }

    // Analyze clustering tendency
    this.analyzeClusteringTendency()

    // Update ship density preferences
    this.updateShipDensityPreferences()
  }

  /**
   * Analyze clustering tendency of opponent ships
   */
  analyzeClusteringTendency() {
    if (this.sunkShips.length < 2) return

    let totalDistance = 0
    let pairCount = 0

    for (let i = 0; i < this.sunkShips.length; i++) {
      for (let j = i + 1; j < this.sunkShips.length; j++) {
        const ship1Center = this.calculateClusterCenter(this.sunkShips[i])
        const ship2Center = this.calculateClusterCenter(this.sunkShips[j])
        const distance = Math.abs(ship1Center.row - ship2Center.row) +
                        Math.abs(ship1Center.col - ship2Center.col)
        totalDistance += distance
        pairCount++
      }
    }

    if (pairCount > 0) {
      const avgDistance = totalDistance / pairCount
      const maxDistance = this.gridSize * 2
      this.opponentModel.clusteringTendency = 1 - (avgDistance / maxDistance)
    }
  }

  /**
   * Update ship density preferences
   */
  updateShipDensityPreferences() {
    // Analyze where ships tend to be placed
    this.sunkShips.forEach(ship => {
      ship.forEach(cell => {
        const region = this.getRegion(cell.row, cell.col)
        const current = this.opponentModel.shipDensityPreference.get(region) || 0
        this.opponentModel.shipDensityPreference.set(region, current + 1)
      })
    })
  }

  /**
   * Get region for density analysis
   */
  getRegion(row, col) {
    const regionSize = Math.ceil(this.gridSize / 3)
    const regionRow = Math.ceil(row / regionSize)
    const regionCol = Math.ceil(col / regionSize)
    return `${regionRow}-${regionCol}`
  }

  /**
   * Calculate density for specific ship size
   */
  calculateDensityForShipSize(shipSize) {
    // Enhanced density calculation considering opponent model
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.hasBeenTargeted(row, col)) {
          let density = 0

          // Base density from ship placement possibilities
          density += this.calculateBaseDensity(row, col, shipSize)

          // Adjust based on opponent clustering tendency
          density += this.calculateClusteringBonus(row, col) * this.opponentModel.clusteringTendency

          // Adjust based on region preferences
          const region = this.getRegion(row, col)
          const regionPreference = this.opponentModel.shipDensityPreference.get(region) || 0
          density += regionPreference * 2

          this.densityMap[row][col] += density
        }
      }
    }
  }

  /**
   * Calculate base density for ship placement
   */
  calculateBaseDensity(row, col, shipSize) {
    let density = 0

    // Check horizontal placements
    for (let startCol = Math.max(1, col - shipSize + 1); startCol <= Math.min(col, this.gridSize - shipSize + 1); startCol++) {
      if (this.canPlaceShipHorizontally(row, startCol, shipSize)) {
        density += 1
      }
    }

    // Check vertical placements
    for (let startRow = Math.max(1, row - shipSize + 1); startRow <= Math.min(row, this.gridSize - shipSize + 1); startRow++) {
      if (this.canPlaceShipVertically(startRow, col, shipSize)) {
        density += 1
      }
    }

    return density
  }

  /**
   * Calculate clustering bonus based on nearby ships
   */
  calculateClusteringBonus(row, col) {
    let bonus = 0

    this.sunkShips.forEach(ship => {
      ship.forEach(cell => {
        const distance = Math.abs(cell.row - row) + Math.abs(cell.col - col)
        if (distance <= 3) {
          bonus += (4 - distance) * 0.5
        }
      })
    })

    return bonus
  }

  /**
   * Apply clustering bias to density map
   */
  applyClusteringBias() {
    const clusteringStrength = this.opponentModel.clusteringTendency

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        const clusteringBonus = this.calculateClusteringBonus(row, col)
        this.densityMap[row][col] += clusteringBonus * clusteringStrength
      }
    }
  }

  /**
   * Process AI move result with auto ship detection
   */
  processResult(row, col, isHit, isShipSunk = false, sunkShipCells = null) {
    console.log(`AI processResult: ${row},${col} hit=${isHit} sunk=${isShipSunk} mode=${this.mode} queueLength=${this.targetQueue.length}`)
    console.log(`AI: Current hit cells before processing:`, this.hitCells)

    // Track move in history for advanced analysis
    this.moveHistory.push({ row, col, isHit, timestamp: Date.now() })

    if (isHit) {
      this.hitCells.push({ row, col })
      this.lastHit = { row, col }
      this.mode = 'target'

      // Update direction bias for learning
      this.updateDirectionBias(row, col)

      // If ship sunk info is provided, use it
      if (isShipSunk && sunkShipCells) {
        console.log('AI: Ship sunk, cleaning up targets')
        console.log('AI: Sunk ship cells:', sunkShipCells)
        this.shipSunk(sunkShipCells)
      } else {
        // Always add adjacent targets when hit (don't auto-detect ship sunk)
        // Only rely on official ship sunk notification from game engine
        this.addAdjacentTargets(row, col)
        console.log(`AI: Added adjacent targets, queue now has ${this.targetQueue.length} items`)
      }
    } else {
      this.missedCells.push({ row, col })

      // If we were in target mode and missed, continue with queue if available
      if (this.mode === 'target' && this.targetQueue.length === 0) {
        console.log('AI: Switching from target to hunt mode - no more targets')
        this.mode = 'hunt'
      }
    }

    console.log(`AI processResult complete: mode=${this.mode} queueLength=${this.targetQueue.length}`)
    console.log(`AI: Current hit cells after processing:`, this.hitCells)
  }

  /**
   * Update direction bias based on successful hits
   */
  updateDirectionBias(row, col) {
    // Check if this hit extends a horizontal or vertical pattern
    const horizontalExtension = this.hitCells.some(hit =>
      hit.row === row && Math.abs(hit.col - col) === 1
    )
    const verticalExtension = this.hitCells.some(hit =>
      hit.col === col && Math.abs(hit.row - row) === 1
    )

    if (horizontalExtension) {
      this.directionBias.horizontal += 0.1
    }
    if (verticalExtension) {
      this.directionBias.vertical += 0.1
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
   * Add adjacent cells to target queue with SMART prioritization
   * ENHANCED: Only add targets that make strategic sense
   */
  addAdjacentTargets(row, col) {
    console.log(`AI: Adding adjacent targets for hit at ${row},${col}`)

    // Check if we already have a direction established
    const establishedDirection = this.getEstablishedDirection(row, col)
    console.log(`AI: Established direction: ${establishedDirection}`)

    if (establishedDirection) {
      // If we know the direction, only add targets in that direction
      this.addDirectionalTargets(row, col, establishedDirection)
    } else {
      // If no direction established, add all 4 directions but prioritize
      this.addAllDirectionalTargets(row, col)
    }
  }

  /**
   * Check if we have an established direction for this hit
   */
  getEstablishedDirection(row, col) {
    const activeHits = this.getActiveHits()

    // Check for horizontal alignment
    const horizontalHits = activeHits.filter(hit =>
      hit.row === row && Math.abs(hit.col - col) === 1
    )
    if (horizontalHits.length > 0) {
      return 'horizontal'
    }

    // Check for vertical alignment
    const verticalHits = activeHits.filter(hit =>
      hit.col === col && Math.abs(hit.row - row) === 1
    )
    if (verticalHits.length > 0) {
      return 'vertical'
    }

    return null
  }

  /**
   * Add targets only in the established direction
   */
  addDirectionalTargets(row, col, direction) {
    const targets = []

    if (direction === 'horizontal') {
      targets.push(
        { row, col: col - 1, priority: 10 },
        { row, col: col + 1, priority: 10 }
      )
    } else if (direction === 'vertical') {
      targets.push(
        { row: row - 1, col, priority: 10 },
        { row: row + 1, col, priority: 10 }
      )
    }

    console.log(`AI: Adding ${targets.length} directional targets for ${direction}`)
    this.addTargetsToQueue(targets)
  }

  /**
   * Add all 4 directional targets with priority
   */
  addAllDirectionalTargets(row, col) {
    const directions = [
      { row: row - 1, col, priority: this.getDirectionPriority(row - 1, col, 'vertical') }, // Up
      { row: row + 1, col, priority: this.getDirectionPriority(row + 1, col, 'vertical') }, // Down
      { row, col: col - 1, priority: this.getDirectionPriority(row, col - 1, 'horizontal') }, // Left
      { row, col: col + 1, priority: this.getDirectionPriority(row, col + 1, 'horizontal') }  // Right
    ]

    // Sort by priority (higher priority first)
    directions.sort((a, b) => b.priority - a.priority)

    console.log(`AI: Adding ${directions.length} targets with priorities:`, directions.map(d => d.priority))
    this.addTargetsToQueue(directions)
  }

  /**
   * Helper to add targets to queue with validation
   */
  addTargetsToQueue(targets) {
    targets.forEach(target => {
      if (this.isValidTarget(target.row, target.col)) {
        // Avoid duplicates
        if (!this.targetQueue.some(t => t.row === target.row && t.col === target.col)) {
          this.targetQueue.push(target)
        }
      }
    })
  }

  /**
   * Smart target selection from queue - prioritizes high-priority targets
   */
  getSmartQueueTarget() {
    if (this.targetQueue.length === 0) return null

    // Sort queue by priority (highest first)
    this.targetQueue.sort((a, b) => (b.priority || 1) - (a.priority || 1))

    // Take the highest priority target
    const target = this.targetQueue.shift()
    console.log(`AI: Selected target from queue with priority ${target.priority || 1}:`, target)

    return target
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

    // CRITICAL RULE: Ships cannot be placed adjacent to each other
    // Check if target is adjacent to any sunk ship (including diagonally)
    const isAdjacentToSunkShip = this.sunkShips.some(ship =>
      ship.some(sunkCell => {
        const rowDiff = Math.abs(sunkCell.row - row)
        const colDiff = Math.abs(sunkCell.col - col)
        // Adjacent includes all 8 directions (horizontal, vertical, diagonal)
        return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
      })
    )

    if (isAdjacentToSunkShip) {
      console.log(`AI: Skipping ${row},${col} - adjacent to sunk ship (ships can't touch)`)
      console.log(`AI: Current sunk ships:`, this.sunkShips)
      console.log(`AI: Current hit cells:`, this.hitCells)
      return false
    }

    return true
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
    console.log('AI: Ship sunk with cells:', shipCells)
    console.log(`AI: Before cleanup - queue length: ${this.targetQueue.length}`)
    console.log(`AI: Current hit cells:`, this.hitCells)

    this.sunkShips.push(shipCells)

    // STRATEGIC IMPROVEMENT: Mark all adjacent cells as "forbidden" since ships can't touch
    this.markAdjacentCellsAsForbidden(shipCells)

    // Remove sunk ship cells AND all adjacent cells from target queue
    const originalQueueLength = this.targetQueue.length
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

    console.log(`AI: After cleanup - removed ${originalQueueLength - this.targetQueue.length} targets, queue length: ${this.targetQueue.length}`)

    // Clean up any remaining hits that are part of this sunk ship
    this.cleanupSunkShipHits(shipCells)

    // CRITICAL FIX: Check if there are still unsunk hit clusters
    const remainingHitClusters = this.analyzeRemainingHitClusters()
    console.log(`AI: Found ${remainingHitClusters.length} remaining hit clusters:`, remainingHitClusters)

    // If we have remaining hit clusters, stay in target mode and rebuild target queue
    if (remainingHitClusters.length > 0) {
      console.log('AI: Still have unsunk ships, rebuilding target queue')
      this.rebuildTargetQueueFromClusters(remainingHitClusters)
      this.mode = 'target'
    } else if (this.targetQueue.length === 0) {
      console.log('AI: No more targets or hit clusters, switching to hunt mode')
      this.mode = 'hunt'
    } else {
      console.log('AI: Still have targets, staying in target mode')
    }

    console.log(`AI: Final state - mode: ${this.mode}, queue length: ${this.targetQueue.length}`)
  }

  /**
   * Mark all cells adjacent to sunk ship as forbidden (strategic optimization)
   */
  markAdjacentCellsAsForbidden(shipCells) {
    const forbiddenCells = new Set()

    shipCells.forEach(shipCell => {
      // Mark all 8 adjacent cells as forbidden
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue // Skip the ship cell itself

          const adjRow = shipCell.row + dr
          const adjCol = shipCell.col + dc

          if (adjRow >= 1 && adjRow <= this.gridSize &&
              adjCol >= 1 && adjCol <= this.gridSize) {
            forbiddenCells.add(`${adjRow}-${adjCol}`)
          }
        }
      }
    })

    console.log(`AI: Marked ${forbiddenCells.size} cells as forbidden around sunk ship`)

    // Add these to missed cells to prevent future targeting
    forbiddenCells.forEach(cellKey => {
      const [row, col] = cellKey.split('-').map(Number)
      if (!this.hasBeenTargeted(row, col)) {
        // Mark as "virtually missed" to prevent targeting
        this.missedCells.push({ row, col, virtual: true })
      }
    })
  }

  /**
   * Clean up hits that are part of the sunk ship
   */
  cleanupSunkShipHits(shipCells) {
    // Remove sunk ship cells from active hit tracking
    shipCells.forEach(sunkCell => {
      const hitIndex = this.hitCells.findIndex(hit =>
        hit.row === sunkCell.row && hit.col === sunkCell.col
      )
      if (hitIndex !== -1) {
        this.hitCells.splice(hitIndex, 1)
      }
    })

    // Update last hit if it was part of the sunk ship
    if (this.lastHit && shipCells.some(cell =>
        cell.row === this.lastHit.row && cell.col === this.lastHit.col)) {
      // Find the most recent hit that's not part of a sunk ship
      this.lastHit = this.findMostRecentActiveHit()
    }
  }

  /**
   * Analyze remaining hit clusters to find unsunk ships
   */
  analyzeRemainingHitClusters() {
    const clusters = []
    const processedHits = new Set()

    for (const hit of this.hitCells) {
      const hitKey = `${hit.row},${hit.col}`
      if (processedHits.has(hitKey)) continue

      // Find all connected hits (same ship)
      const cluster = this.findConnectedHits(hit, processedHits)
      if (cluster.length > 0) {
        clusters.push(cluster)
      }
    }

    return clusters
  }

  /**
   * Find all hits connected to a starting hit (same ship)
   */
  findConnectedHits(startHit, processedHits) {
    const cluster = []
    const toProcess = [startHit]

    while (toProcess.length > 0) {
      const currentHit = toProcess.pop()
      const hitKey = `${currentHit.row},${currentHit.col}`

      if (processedHits.has(hitKey)) continue

      processedHits.add(hitKey)
      cluster.push(currentHit)

      // Find adjacent hits (horizontally or vertically connected)
      const adjacentHits = this.hitCells.filter(hit => {
        const hitKey2 = `${hit.row},${hit.col}`
        if (processedHits.has(hitKey2)) return false

        const rowDiff = Math.abs(hit.row - currentHit.row)
        const colDiff = Math.abs(hit.col - currentHit.col)

        // Only horizontal or vertical adjacency (not diagonal)
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
      })

      toProcess.push(...adjacentHits)
    }

    return cluster
  }

  /**
   * Rebuild target queue from remaining hit clusters
   */
  rebuildTargetQueueFromClusters(clusters) {
    this.targetQueue = []

    for (const cluster of clusters) {
      // For each cluster, add potential targets to complete the ship
      for (const hit of cluster) {
        this.addAdjacentTargets(hit.row, hit.col)
      }
    }

    // Remove duplicates and invalid targets
    this.targetQueue = this.targetQueue.filter((target, index, self) => {
      // Remove duplicates
      const isDuplicate = self.findIndex(t => t.row === target.row && t.col === target.col) !== index
      if (isDuplicate) return false

      // Remove if already targeted
      if (this.hasBeenTargeted(target.row, target.col)) return false

      return true
    })

    console.log(`AI: Rebuilt target queue with ${this.targetQueue.length} targets from ${clusters.length} clusters`)
  }

  /**
   * Find the most recent hit that's not part of any sunk ship
   */
  findMostRecentActiveHit() {
    const sunkCells = new Set()
    this.sunkShips.forEach(ship => {
      ship.forEach(cell => {
        sunkCells.add(`${cell.row}-${cell.col}`)
      })
    })

    // Find the most recent hit that's not sunk
    for (let i = this.hitCells.length - 1; i >= 0; i--) {
      const hit = this.hitCells[i]
      if (!sunkCells.has(`${hit.row}-${hit.col}`)) {
        return hit
      }
    }

    return null
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
   * Get pattern-based move using current hunting strategy
   */
  getPatternBasedMove(probabilityMap) {
    switch (this.currentHuntPattern) {
      case 'checkerboard':
        return this.getCheckerboardMove(probabilityMap)
      case 'diagonal':
        return this.getDiagonalMove(probabilityMap)
      case 'spiral':
        return this.getSpiralMove(probabilityMap)
      case 'random':
        return this.getWeightedRandomMove(probabilityMap)
      default:
        return this.getCheckerboardMove(probabilityMap)
    }
  }

  /**
   * Get checkerboard pattern move with probability weighting
   */
  getCheckerboardMove(probabilityMap) {
    let bestMove = null
    let maxScore = -1

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if ((row + col) % 2 === 0 && !this.hasBeenTargeted(row, col)) {
          const score = probabilityMap[row][col]
          if (score > maxScore) {
            maxScore = score
            bestMove = { row, col }
          }
        }
      }
    }

    return bestMove
  }

  /**
   * Get diagonal pattern move
   */
  getDiagonalMove(probabilityMap) {
    let bestMove = null
    let maxScore = -1

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if ((row - col) % 3 === 0 && !this.hasBeenTargeted(row, col)) {
          const score = probabilityMap[row][col]
          if (score > maxScore) {
            maxScore = score
            bestMove = { row, col }
          }
        }
      }
    }

    return bestMove || this.getCheckerboardMove(probabilityMap)
  }

  /**
   * Get spiral pattern move
   */
  getSpiralMove(probabilityMap) {
    const center = Math.ceil(this.gridSize / 2)
    const spiralOrder = this.generateSpiralOrder(center)

    // Find best spiral position based on probability
    let bestMove = null
    let maxScore = -1

    for (const pos of spiralOrder) {
      if (!this.hasBeenTargeted(pos.row, pos.col)) {
        const score = probabilityMap[pos.row][pos.col] || 1
        if (score > maxScore) {
          maxScore = score
          bestMove = pos
        }
        // Return first valid move if no probability weighting needed
        if (!bestMove) bestMove = pos
      }
    }

    return bestMove || this.getRandomMove()
  }

  /**
   * Generate spiral order from center
   */
  generateSpiralOrder(centerRow, centerCol = null) {
    if (centerCol === null) centerCol = centerRow
    const order = []
    const visited = new Set()

    let row = centerRow, col = centerCol
    let dr = 0, dc = 1 // Start moving right

    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      if (row >= 1 && row <= this.gridSize && col >= 1 && col <= this.gridSize) {
        const key = `${row}-${col}`
        if (!visited.has(key)) {
          order.push({ row, col })
          visited.add(key)
        }
      }

      // Try to turn (spiral logic)
      const nextRow = row + dc, nextCol = col - dr
      if (nextRow >= 1 && nextRow <= this.gridSize &&
          nextCol >= 1 && nextCol <= this.gridSize &&
          !visited.has(`${nextRow}-${nextCol}`)) {
        [dr, dc] = [dc, -dr] // Turn right
      }

      row += dr
      col += dc
    }

    return order
  }

  /**
   * Get weighted random move based on probability
   */
  getWeightedRandomMove(probabilityMap) {
    const candidates = []

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.hasBeenTargeted(row, col)) {
          const weight = Math.max(1, probabilityMap[row][col])
          candidates.push({ row, col, weight })
        }
      }
    }

    if (candidates.length === 0) return null

    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0)
    let random = Math.random() * totalWeight

    for (const candidate of candidates) {
      random -= candidate.weight
      if (random <= 0) {
        return { row: candidate.row, col: candidate.col }
      }
    }

    return candidates[candidates.length - 1]
  }

  /**
   * Get best move from combined probability map
   */
  getBestCombinedProbabilityMove(combinedMap) {
    let bestMove = null
    let maxProbability = -1

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.hasBeenTargeted(row, col) &&
            combinedMap[row][col] > maxProbability) {
          maxProbability = combinedMap[row][col]
          bestMove = { row, col }
        }
      }
    }

    return bestMove || this.getRandomMove()
  }

  /**
   * Set AI difficulty
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty
  }

  /**
   * Update game phase based on progress
   */
  updateGamePhase() {
    const totalCells = this.gridSize * this.gridSize
    const targetedCells = this.hitCells.length + this.missedCells.length
    const progress = targetedCells / totalCells

    if (progress < 0.3) {
      this.gamePhase = 'early'
    } else if (progress < 0.7) {
      this.gamePhase = 'mid'
    } else {
      this.gamePhase = 'late'
    }
  }

  /**
   * Adapt strategy based on performance
   */
  adaptStrategy() {
    const recentMoves = this.moveHistory.slice(-10)
    if (recentMoves.length < 5) return

    const recentHitRate = recentMoves.filter(move => move.isHit).length / recentMoves.length

    // Switch hunting pattern if performance is poor
    if (recentHitRate < 0.2 && this.mode === 'hunt') {
      this.switchHuntingPattern()
    }

    // Adjust adaptive threshold
    this.adaptiveThreshold = Math.max(0.5, Math.min(0.9, recentHitRate + 0.3))
  }

  /**
   * Switch to next hunting pattern
   */
  switchHuntingPattern() {
    this.patternIndex = (this.patternIndex + 1) % this.huntingPatterns.length
    this.currentHuntPattern = this.huntingPatterns[this.patternIndex]
    console.log(`AI switching to ${this.currentHuntPattern} hunting pattern`)
  }

  /**
   * Advanced cluster-based targeting
   */
  getClusterBasedMove() {
    // Simple implementation - can be enhanced further
    if (this.hitCells.length < 2) return null

    // Find the most recent cluster of hits
    const recentHits = this.hitCells.slice(-3)
    const center = this.calculateClusterCenter(recentHits)

    // Look for moves around the cluster center
    const candidates = []
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const row = Math.round(center.row + dr)
        const col = Math.round(center.col + dc)
        if (this.isValidTarget(row, col)) {
          candidates.push({ row, col })
        }
      }
    }

    return candidates.length > 0 ? candidates[0] : null
  }

  /**
   * Calculate cluster center
   */
  calculateClusterCenter(hits) {
    const avgRow = hits.reduce((sum, hit) => sum + hit.row, 0) / hits.length
    const avgCol = hits.reduce((sum, hit) => sum + hit.col, 0) / hits.length
    return { row: avgRow, col: avgCol }
  }

  /**
   * Bayesian prediction for ship completion
   */
  getBayesianPredictionMove() {
    // Simplified Bayesian approach
    const remainingShips = this.getRemainingShipSizes()
    let bestMove = null
    let maxProbability = 0

    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.hasBeenTargeted(row, col)) {
          let probability = 0

          // Calculate probability based on nearby hits
          this.hitCells.forEach(hit => {
            const distance = Math.abs(hit.row - row) + Math.abs(hit.col - col)
            if (distance <= 2) {
              probability += (3 - distance) * 0.3
            }
          })

          // Boost probability based on remaining ship sizes
          remainingShips.forEach(shipSize => {
            if (this.couldCompleteShip(row, col, [shipSize])) {
              probability += shipSize * 0.2
            }
          })

          if (probability > maxProbability) {
            maxProbability = probability
            bestMove = { row, col }
          }
        }
      }
    }

    return maxProbability > this.adaptiveThreshold ? bestMove : null
  }

  /**
   * Constraint satisfaction move selection
   */
  getConstraintSatisfactionMove() {
    // Simplified constraint satisfaction
    const remainingShips = this.getRemainingShipSizes()
    if (remainingShips.length === 0) return null

    // Find moves that could complete ships
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        if (!this.hasBeenTargeted(row, col)) {
          // Check if this move could complete any ship pattern
          if (this.couldCompleteShip(row, col, remainingShips)) {
            return { row, col }
          }
        }
      }
    }

    return null
  }

  /**
   * Check if move could complete a ship
   */
  couldCompleteShip(row, col, shipSizes) {
    // Check horizontal and vertical directions
    for (const size of shipSizes) {
      // Check horizontal
      for (let startCol = Math.max(1, col - size + 1); startCol <= Math.min(col, this.gridSize - size + 1); startCol++) {
        if (this.wouldFormValidShip(row, startCol, size, true, row, col)) {
          return true
        }
      }

      // Check vertical
      for (let startRow = Math.max(1, row - size + 1); startRow <= Math.min(row, this.gridSize - size + 1); startRow++) {
        if (this.wouldFormValidShip(startRow, col, size, false, row, col)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Check if placing a ship would be valid and include the target cell
   */
  wouldFormValidShip(startRow, startCol, size, isHorizontal, targetRow, targetCol) {
    let hasTargetCell = false
    let hasHits = false

    for (let i = 0; i < size; i++) {
      const checkRow = isHorizontal ? startRow : startRow + i
      const checkCol = isHorizontal ? startCol + i : startCol

      if (checkRow === targetRow && checkCol === targetCol) {
        hasTargetCell = true
      }

      if (this.hitCells.some(hit => hit.row === checkRow && hit.col === checkCol)) {
        hasHits = true
      }

      if (this.missedCells.some(miss => miss.row === checkRow && miss.col === checkCol)) {
        return false // Can't place ship on missed cell
      }
    }

    return hasTargetCell && hasHits
  }

  /**
   * Debug method to show current AI state
   */
  debugState() {
    console.log('=== AI DEBUG STATE ===')
    console.log('Difficulty:', this.difficulty)
    console.log('Mode:', this.mode)
    console.log('Game Phase:', this.gamePhase)
    console.log('Hunt Pattern:', this.currentHuntPattern)
    console.log('Hit Cells:', this.hitCells)
    console.log('Target Queue:', this.targetQueue)
    console.log('Sunk Ships:', this.sunkShips)
    console.log('Last Hit:', this.lastHit)

    const clusters = this.analyzeRemainingHitClusters()
    console.log('Hit Clusters:', clusters)
    console.log('======================')

    return {
      difficulty: this.difficulty,
      mode: this.mode,
      gamePhase: this.gamePhase,
      huntPattern: this.currentHuntPattern,
      hitCells: this.hitCells,
      targetQueue: this.targetQueue,
      sunkShips: this.sunkShips,
      lastHit: this.lastHit,
      hitClusters: clusters
    }
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

    // Reset advanced features
    this.heatMap = this.initializeProbabilityMap()
    this.densityMap = this.initializeProbabilityMap()
    this.parityMap = this.initializeProbabilityMap()
    this.currentHuntPattern = 'checkerboard'
    this.patternIndex = 0
    this.gamePhase = 'early'
    this.shipConstraints.clear()
    this.hitClusters = []
    this.directionBias = { horizontal: 0, vertical: 0 }
    this.moveHistory = []
    this.opponentModel = {
      shipDensityPreference: new Map(),
      orientationBias: 0.5,
      clusteringTendency: 0.5
    }
  }
}

export default AIService
