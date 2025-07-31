/**
 * Game Engine for Battleship
 * Manages game state, turns, and win conditions
 */

import AIService from './AIService.js'

export class GameEngine {
  constructor(gridSize = 10) {
    this.gridSize = gridSize
    this.gameMode = 'setup' // setup, playing, finished
    this.currentPlayer = 'human' // human, ai
    this.isGameStarted = false
    this.isGameFinished = false
    this.winner = null
    
    // Game boards
    this.humanBoard = this.initializeBoard()
    this.aiBoard = this.initializeBoard()
    
    // Ships
    this.humanShips = []
    this.aiShips = []
    
    // AI instance
    this.ai = new AIService(gridSize)
    
    // Game statistics
    this.gameStats = {
      humanShots: 0,
      humanHits: 0,
      aiShots: 0,
      aiHits: 0,
      turnCount: 0
    }

    // Ship types
    this.shipTypes = [
      { name: 'Tàu Sân Bay', size: 5, count: 1 },
      { name: 'Thiết Giáp Hạm', size: 4, count: 1 },
      { name: 'Tàu Tuần Dương', size: 3, count: 1 },
      { name: 'Tàu Ngầm', size: 3, count: 1 },
      { name: 'Tàu Khu Trục', size: 2, count: 1 }
    ]
  }

  /**
   * Initialize empty game board
   */
  initializeBoard() {
    const board = {}
    for (let row = 1; row <= this.gridSize; row++) {
      board[row] = {}
      for (let col = 1; col <= this.gridSize; col++) {
        board[row][col] = {
          hasShip: false,
          isHit: false,
          isMiss: false,
          shipId: null
        }
      }
    }
    return board
  }

  /**
   * Start new game
   */
  startGame() {
    this.reset()
    this.gameMode = 'setup'
    return {
      success: true,
      message: 'Game khởi tạo thành công. Hãy đặt tàu của bạn!'
    }
  }

  /**
   * Set human ships and start playing
   */
  setHumanShips(ships) {
    if (!this.validateShipPlacement(ships)) {
      return {
        success: false,
        message: 'Vị trí đặt tàu không hợp lệ!'
      }
    }

    this.humanShips = ships
    this.placeShipsOnBoard(ships, this.humanBoard)
    
    // Generate AI ships
    this.aiShips = this.ai.generateShipPlacement()
    this.placeShipsOnBoard(this.aiShips, this.aiBoard)
    
    this.gameMode = 'playing'
    this.isGameStarted = true
    this.currentPlayer = 'human'

    return {
      success: true,
      message: 'Game bắt đầu! Lượt của bạn.',
      aiShips: this.aiShips // For debugging, remove in production
    }
  }

  /**
   * Validate ship placement
   */
  validateShipPlacement(ships) {
    const expectedCounts = {}
    this.shipTypes.forEach(type => {
      expectedCounts[type.name] = type.count
    })

    const actualCounts = {}
    ships.forEach(ship => {
      actualCounts[ship.name] = (actualCounts[ship.name] || 0) + 1
    })

    // Check if all required ships are placed
    for (const [shipName, expectedCount] of Object.entries(expectedCounts)) {
      if ((actualCounts[shipName] || 0) !== expectedCount) {
        return false
      }
    }

    return true
  }

  /**
   * Place ships on board
   */
  placeShipsOnBoard(ships, board) {
    ships.forEach((ship, shipId) => {
      for (let i = 0; i < ship.size; i++) {
        const row = ship.isHorizontal ? ship.row : ship.row + i
        const col = ship.isHorizontal ? ship.col + i : ship.col
        
        board[row][col].hasShip = true
        board[row][col].shipId = shipId
      }
    })
  }

  /**
   * Process human attack
   */
  humanAttack(row, col) {
    if (this.gameMode !== 'playing') {
      return { success: false, message: 'Game chưa bắt đầu!' }
    }

    if (this.currentPlayer !== 'human') {
      return { success: false, message: 'Không phải lượt của bạn!' }
    }

    if (this.aiBoard[row][col].isHit || this.aiBoard[row][col].isMiss) {
      return { success: false, message: 'Ô này đã được bắn rồi!' }
    }

    this.gameStats.humanShots++
    const cell = this.aiBoard[row][col]
    
    if (cell.hasShip) {
      // Hit!
      cell.isHit = true
      this.gameStats.humanHits++
      
      const sunkShip = this.checkShipSunk(row, col, this.aiBoard, this.aiShips)
      
      // Important: Notify AI about human's attack results
      // This helps AI understand when its ships are sunk and update strategy accordingly
      if (sunkShip) {
        const sunkShipCells = this.getShipCells(sunkShip)
        // Inform AI that one of its ships was sunk by human
        this.ai.shipSunk(sunkShipCells)
      }
      
      let result = {
        success: true,
        isHit: true,
        isSunk: !!sunkShip,
        sunkShip: sunkShip,
        message: sunkShip ? `Bạn đã đánh chìm ${sunkShip.name}!` : 'Trúng mục tiêu!',
        coordinates: { row, col }
      }

      // Check if human wins
      if (this.checkWinCondition(this.aiBoard)) {
        this.gameMode = 'finished'
        this.isGameFinished = true
        this.winner = 'human'
        result.gameOver = true
        result.winner = 'human'
        result.message = 'Chúc mừng! Bạn đã thắng!'
      }

      return result
    } else {
      // Miss
      cell.isMiss = true
      this.currentPlayer = 'ai'
      
      return {
        success: true,
        isHit: false,
        message: 'Trượt mục tiêu! Lượt của máy.',
        coordinates: { row, col }
      }
    }
  }

  /**
   * Process AI turn
   */
  async aiTurn() {
    if (this.gameMode !== 'playing' || this.currentPlayer !== 'ai') {
      return { success: false, message: 'Không phải lượt của AI!' }
    }

    // Add delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1000))

    const move = this.ai.getNextMove()
    if (!move) {
      return { success: false, message: 'AI không thể thực hiện nước đi!' }
    }

    this.gameStats.aiShots++
    const cell = this.humanBoard[move.row][move.col]
    
    if (cell.hasShip) {
      // AI hit!
      cell.isHit = true
      this.gameStats.aiHits++
      
      const sunkShip = this.checkShipSunk(move.row, move.col, this.humanBoard, this.humanShips)
      const sunkShipCells = sunkShip ? this.getShipCells(sunkShip) : null
      
      // Inform AI with complete information
      this.ai.processResult(move.row, move.col, true, !!sunkShip, sunkShipCells)

      let result = {
        success: true,
        isHit: true,
        isSunk: !!sunkShip,
        sunkShip: sunkShip,
        message: sunkShip ? `AI đã đánh chìm ${sunkShip.name} của bạn!` : 'AI trúng mục tiêu!',
        coordinates: move,
        nextPlayer: 'ai' // AI continues if hit
      }

      // Check if AI wins
      if (this.checkWinCondition(this.humanBoard)) {
        this.gameMode = 'finished'
        this.isGameFinished = true
        this.winner = 'ai'
        result.gameOver = true
        result.winner = 'ai'
        result.message = 'AI đã thắng! Hãy thử lại.'
      }

      return result
    } else {
      // AI miss
      cell.isMiss = true
      this.ai.processResult(move.row, move.col, false)
      this.currentPlayer = 'human'
      
      return {
        success: true,
        isHit: false,
        message: 'AI bắn trượt! Lượt của bạn.',
        coordinates: move,
        nextPlayer: 'human'
      }
    }
  }

  /**
   * Check if ship is sunk
   */
  checkShipSunk(row, col, board, ships) {
    const cell = board[row][col]
    if (!cell.hasShip || cell.shipId === null) return null

    const ship = ships[cell.shipId]
    if (!ship) return null

    // Check all cells of this ship
    for (let i = 0; i < ship.size; i++) {
      const shipRow = ship.isHorizontal ? ship.row : ship.row + i
      const shipCol = ship.isHorizontal ? ship.col + i : ship.col
      
      if (!board[shipRow][shipCol].isHit) {
        return null // Ship not completely sunk
      }
    }

    return ship // Ship is sunk
  }

  /**
   * Get all cells of a ship
   */
  getShipCells(ship) {
    const cells = []
    for (let i = 0; i < ship.size; i++) {
      const row = ship.isHorizontal ? ship.row : ship.row + i
      const col = ship.isHorizontal ? ship.col + i : ship.col
      cells.push({ row, col })
    }
    return cells
  }

  /**
   * Check win condition
   */
  checkWinCondition(board) {
    for (let row = 1; row <= this.gridSize; row++) {
      for (let col = 1; col <= this.gridSize; col++) {
        const cell = board[row][col]
        if (cell.hasShip && !cell.isHit) {
          return false // Still has unhit ship parts
        }
      }
    }
    return true // All ships are sunk
  }

  /**
   * Get game state
   */
  getGameState() {
    return {
      gameMode: this.gameMode,
      currentPlayer: this.currentPlayer,
      isGameStarted: this.isGameStarted,
      isGameFinished: this.isGameFinished,
      winner: this.winner,
      stats: this.gameStats,
      humanBoard: this.humanBoard,
      aiBoard: this.aiBoard,
      humanShips: this.humanShips,
      turnCount: this.gameStats.turnCount
    }
  }

  /**
   * Get visible board for UI (hide AI ships)
   */
  getVisibleBoards() {
    const visibleAiBoard = {}
    for (let row = 1; row <= this.gridSize; row++) {
      visibleAiBoard[row] = {}
      for (let col = 1; col <= this.gridSize; col++) {
        const cell = this.aiBoard[row][col]
        visibleAiBoard[row][col] = {
          isHit: cell.isHit,
          isMiss: cell.isMiss,
          hasShip: cell.isHit && cell.hasShip // Only show ship if hit
        }
      }
    }

    return {
      humanBoard: this.humanBoard,
      aiBoard: visibleAiBoard
    }
  }

  /**
   * Set AI difficulty
   */
  setAIDifficulty(difficulty) {
    this.ai.setDifficulty(difficulty)
  }

  /**
   * Reset game
   */
  reset() {
    this.gameMode = 'setup'
    this.currentPlayer = 'human'
    this.isGameStarted = false
    this.isGameFinished = false
    this.winner = null
    
    this.humanBoard = this.initializeBoard()
    this.aiBoard = this.initializeBoard()
    this.humanShips = []
    this.aiShips = []
    
    this.ai.reset()
    
    this.gameStats = {
      humanShots: 0,
      humanHits: 0,
      aiShots: 0,
      aiHits: 0,
      turnCount: 0
    }
  }

  /**
   * Get accuracy statistics
   */
  getAccuracy() {
    return {
      human: this.gameStats.humanShots > 0 ? 
        Math.round((this.gameStats.humanHits / this.gameStats.humanShots) * 100) : 0,
      ai: this.gameStats.aiShots > 0 ? 
        Math.round((this.gameStats.aiHits / this.gameStats.aiShots) * 100) : 0
    }
  }
}

export default GameEngine
