document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const myBoardWrapper = document.getElementById('my-board-wrapper');
    const opponentBoardWrapper = document.getElementById('opponent-board-wrapper');
    const resetButton = document.getElementById('reset-button');
    const autoPlaceBtn = document.getElementById('auto-place-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const clearShipsBtn = document.getElementById('clear-ships-btn');
    const directionIndicator = document.getElementById('current-direction');
    
    // Navigation elements
    const gameBtn = document.getElementById('game-btn');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const aboutBtn = document.getElementById('about-btn');
    const gamePage = document.getElementById('game-page');
    const tutorialPage = document.getElementById('tutorial-page');
    const aboutPage = document.getElementById('about-page');

    // Game state
    const gridSize = 10;
    let hoveredCell = null;
    let selectedShipSize = null;
    let selectedShipName = '';
    let isHorizontal = true;
    let placedShips = [];
    
    // Ship definitions
    const shipTypes = [
        { name: 'Tàu Sân Bay', size: 5, count: 1 },
        { name: 'Thiết Giáp Hạm', size: 4, count: 1 },
        { name: 'Tàu Tuần Dương', size: 3, count: 1 },
        { name: 'Tàu Ngầm', size: 3, count: 1 },
        { name: 'Tàu Khu Trục', size: 2, count: 1 }
    ];

    // Navigation functions
    function showPage(pageToShow) {
        // Hide all pages
        [gamePage, tutorialPage, aboutPage].forEach(page => {
            page.style.display = 'none';
        });
        
        // Show selected page
        pageToShow.style.display = 'block';
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Force reflow to prevent layout issues
        pageToShow.offsetHeight;
    }

    function initNavigation() {
        gameBtn.addEventListener('click', () => {
            showPage(gamePage);
            gameBtn.classList.add('active');
        });
        
        tutorialBtn.addEventListener('click', () => {
            showPage(tutorialPage);
            tutorialBtn.classList.add('active');
        });
        
        aboutBtn.addEventListener('click', () => {
            showPage(aboutPage);
            aboutBtn.classList.add('active');
        });
    }

    // Ship placement functions
    function initShipButtons() {
        const shipButtons = document.querySelectorAll('.ship-btn');
        shipButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const size = parseInt(btn.dataset.size);
                const name = btn.dataset.name;
                
                // Check if we can place more ships of this specific type (by name)
                const currentCount = placedShips.filter(ship => ship.name === name).length;
                const limit = getShipLimit(size);
                
                if (currentCount >= limit) {
                    showMessage(`Bạn đã đặt đủ ${name}! Chỉ được đặt ${limit} tàu loại này.`, 'warning');
                    return;
                }
                
                // Remove active class from all buttons
                shipButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Set selected ship
                selectedShipSize = size;
                selectedShipName = name;
                
                // Update UI
                updatePlacementUI();
            });
        });
        
        // Initial button state update
        updateShipButtonStates();
    }

    function updateShipButtonStates() {
        const shipButtons = document.querySelectorAll('.ship-btn');
        shipButtons.forEach(btn => {
            const size = parseInt(btn.dataset.size);
            const name = btn.dataset.name;
            
            // Count ships by exact name match (not just size) to handle multiple ships of same size
            const count = placedShips.filter(ship => ship.name === name).length;
            const limit = getShipLimit(size);
            
            // Update button text to show count
            btn.textContent = `${name} (${size} ô) - ${count}/${limit}`;
            
            // Disable if limit reached for this specific ship type
            if (count >= limit) {
                btn.classList.add('disabled');
                btn.disabled = true;
            } else {
                btn.classList.remove('disabled');
                btn.disabled = false;
            }
        });
    }

    function updatePlacementUI() {
        directionIndicator.textContent = isHorizontal ? 'Ngang' : 'Dọc';
        
        // Update button text
        if (selectedShipSize) {
            rotateBtn.textContent = `🔄 Xoay (${isHorizontal ? 'Ngang' : 'Dọc'}) - ${selectedShipName}`;
        }
    }

    function rotateShip() {
        isHorizontal = !isHorizontal;
        updatePlacementUI();
    }

    function canPlaceShip(startRow, startCol, size, horizontal) {
        // Check if ship fits in grid
        if (horizontal && startCol + size > gridSize) return false;
        if (!horizontal && startRow + size > gridSize) return false;
        
        // Check ship placement area and surrounding cells (1 cell buffer)
        const minRow = Math.max(0, startRow - 1);
        const maxRow = Math.min(gridSize - 1, horizontal ? startRow + 1 : startRow + size);
        const minCol = Math.max(0, startCol - 1);
        const maxCol = Math.min(gridSize - 1, horizontal ? startCol + size : startCol + 1);
        
        // Check all cells in the expanded area for existing ships
        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                const cellId = row * gridSize + col;
                const cell = myBoardWrapper.querySelector(`[data-id="${cellId}"]`);
                
                if (cell && cell.classList.contains('ship')) {
                    return false;
                }
            }
        }
        
        return true;
    }

    function placeShip(startRow, startCol, size, horizontal, shipName) {
        // Check if we can place more ships of this specific type (by name)
        const currentCount = placedShips.filter(ship => ship.name === shipName).length;
        const limit = getShipLimit(size);
        
        if (currentCount >= limit) {
            showMessage(`Bạn đã đặt đủ ${shipName}! Chỉ được đặt ${limit} tàu loại này.`, 'warning');
            return false;
        }

        const shipCells = [];
        
        for (let i = 0; i < size; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            const cellId = row * gridSize + col;
            const cell = myBoardWrapper.querySelector(`[data-id="${cellId}"]`);
            
            if (cell) {
                cell.classList.add('ship');
                shipCells.push({ row, col, cellId });
            }
        }
        
        // Save ship info
        placedShips.push({
            name: shipName,
            size: size,
            cells: shipCells,
            horizontal: horizontal
        });
        
        // Clear selection
        selectedShipSize = null;
        selectedShipName = '';
        document.querySelectorAll('.ship-btn').forEach(btn => btn.classList.remove('active'));
        updatePlacementUI();
        
        // Show success message
        showMessage(`Đặt ${shipName} thành công!`, 'success', 2000);
        
        // Update ship button states
        updateShipButtonStates();
        
        return true;
    }

    function removeShip(cell) {
        const cellId = parseInt(cell.dataset.id);
        
        // Find which ship this cell belongs to
        const shipIndex = placedShips.findIndex(ship => 
            ship.cells.some(shipCell => shipCell.cellId === cellId)
        );
        
        if (shipIndex !== -1) {
            const ship = placedShips[shipIndex];
            
            // Remove ship class from all cells of this ship
            ship.cells.forEach(shipCell => {
                const shipCellElement = myBoardWrapper.querySelector(`[data-id="${shipCell.cellId}"]`);
                if (shipCellElement) {
                    shipCellElement.classList.remove('ship', 'hit');
                }
            });
            
            // Remove ship from placed ships array
            placedShips.splice(shipIndex, 1);
            
            // Update ship button states
            updateShipButtonStates();
            
            showMessage(`Đã xóa ${ship.name}!`, 'info', 1500);
        }
    }

    function clearAllShips() {
        placedShips = [];
        const allCells = myBoardWrapper.querySelectorAll('.cell');
        allCells.forEach(cell => {
            cell.classList.remove('ship', 'hit');
        });
        updateShipButtonStates();
        showMessage('Đã xóa tất cả tàu!', 'info', 2000);
    }

    function autoPlaceShips() {
        clearAllShips();
        
        // Sort ships by size (largest first) for better placement success
        const sortedShips = [...shipTypes].sort((a, b) => b.size - a.size);
        
        sortedShips.forEach(shipType => {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 500; // Increase attempts for better placement
            
            while (!placed && attempts < maxAttempts) {
                const horizontal = Math.random() < 0.5;
                const maxRow = horizontal ? gridSize : gridSize - shipType.size;
                const maxCol = horizontal ? gridSize - shipType.size : gridSize;
                
                const row = Math.floor(Math.random() * maxRow);
                const col = Math.floor(Math.random() * maxCol);
                
                if (canPlaceShip(row, col, shipType.size, horizontal)) {
                    placeShip(row, col, shipType.size, horizontal, shipType.name);
                    placed = true;
                }
                attempts++;
            }
            
            // If still can't place after many attempts, try a systematic approach
            if (!placed) {
                outerLoop: for (let row = 0; row < gridSize; row++) {
                    for (let col = 0; col < gridSize; col++) {
                        for (let horizontal of [true, false]) {
                            if (canPlaceShip(row, col, shipType.size, horizontal)) {
                                placeShip(row, col, shipType.size, horizontal, shipType.name);
                                placed = true;
                                break outerLoop;
                            }
                        }
                    }
                }
            }
        });
        
        // Show success message
        showMessage(`Đã đặt ${placedShips.length}/${shipTypes.length} tàu tự động!`, 'success');
    }

    function createGrid(wrapperElement, type) {
        wrapperElement.innerHTML = '';
        const letters = 'ABCDEFGHIJ';

        for (let row = 0; row < gridSize + 1; row++) {
            for (let col = 0; col < gridSize + 1; col++) {
                const cell = document.createElement('div');

                if (row === 0 && col === 0) {
                    cell.classList.add('label-cell');
                } else if (row === 0) {
                    cell.classList.add('label-cell');
                    cell.textContent = letters[col - 1];
                } else if (col === 0) {
                    cell.classList.add('label-cell');
                    cell.textContent = row;
                } else {
                    cell.classList.add('cell');
                    const cellId = (row - 1) * gridSize + (col - 1);
                    cell.dataset.id = cellId;
                    cell.dataset.coordinate = letters[col - 1] + row;
                    cell.dataset.row = row - 1;
                    cell.dataset.col = col - 1;

                    cell.addEventListener('click', () => handleCellClick(cell, type));
                    cell.addEventListener('mouseenter', () => {
                        hoveredCell = cell;
                        if (type === 'my' && selectedShipSize) {
                            highlightShipPlacement(cell);
                        }
                    });
                    cell.addEventListener('mouseleave', () => {
                        hoveredCell = null;
                        clearHighlight();
                    });
                }
                wrapperElement.appendChild(cell);
            }
        }
    }

    function highlightShipPlacement(cell) {
        clearHighlight();
        
        if (!selectedShipSize) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (canPlaceShip(row, col, selectedShipSize, isHorizontal)) {
            for (let i = 0; i < selectedShipSize; i++) {
                const targetRow = isHorizontal ? row : row + i;
                const targetCol = isHorizontal ? col + i : col;
                const targetCellId = targetRow * gridSize + targetCol;
                const targetCell = myBoardWrapper.querySelector(`[data-id="${targetCellId}"]`);
                
                if (targetCell) {
                    targetCell.classList.add('ship-preview');
                }
            }
        } else {
            // Show invalid placement
            for (let i = 0; i < selectedShipSize; i++) {
                const targetRow = isHorizontal ? row : row + i;
                const targetCol = isHorizontal ? col + i : col;
                
                if (targetRow < gridSize && targetCol < gridSize) {
                    const targetCellId = targetRow * gridSize + targetCol;
                    const targetCell = myBoardWrapper.querySelector(`[data-id="${targetCellId}"]`);
                    
                    if (targetCell) {
                        targetCell.classList.add('ship-preview-invalid');
                    }
                }
            }
        }
    }

    function clearHighlight() {
        const previewCells = myBoardWrapper.querySelectorAll('.ship-preview, .ship-preview-invalid');
        previewCells.forEach(cell => {
            cell.classList.remove('ship-preview', 'ship-preview-invalid');
        });
    }

    function handleKeyPress(e) {
        if (!hoveredCell) return;

        const key = e.key.toLowerCase();
        const boardType = hoveredCell.parentElement.id === 'my-board-wrapper' ? 'my' : 'opponent';

        // Handle rotate key
        if (key === 'r' && boardType === 'my') {
            rotateShip();
            if (selectedShipSize) {
                highlightShipPlacement(hoveredCell);
            }
            return;
        }

        if (boardType === 'my') {
            switch (key) {
                case '1':
                    if (hoveredCell.classList.contains('ship')) {
                        removeShip(hoveredCell);
                    } else if (selectedShipSize) {
                        const row = parseInt(hoveredCell.dataset.row);
                        const col = parseInt(hoveredCell.dataset.col);
                        
                        if (canPlaceShip(row, col, selectedShipSize, isHorizontal)) {
                            placeShip(row, col, selectedShipSize, isHorizontal, selectedShipName);
                        }
                    } else {
                        hoveredCell.classList.toggle('ship');
                        hoveredCell.classList.remove('hit', 'miss');
                    }
                    break;
                case '2': setCellState(hoveredCell, 'my_ship_hit'); break;
                case '3': setCellState(hoveredCell, 'miss'); break;
                case '0': case 'c': setCellState(hoveredCell, 'clear'); break;
            }
        } else {
            switch (key) {
                case '1': setCellState(hoveredCell, 'hit'); break;
                case '2': setCellState(hoveredCell, 'miss'); break;
                case '0': case 'c': setCellState(hoveredCell, 'clear'); break;
            }
        }
    }
    
    function handleCellClick(cell, type) {
        if (type === 'my') {
            // Ship placement mode
            if (selectedShipSize) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                
                if (canPlaceShip(row, col, selectedShipSize, isHorizontal)) {
                    placeShip(row, col, selectedShipSize, isHorizontal, selectedShipName);
                }
                return;
            }
            
            // Regular click behavior
            if (cell.classList.contains('ship')) {
                if (cell.classList.contains('hit')) {
                    setCellState(cell, 'miss');
                } else {
                    setCellState(cell, 'my_ship_hit');
                }
            } else {
                const isHit = cell.classList.contains('hit');
                const isMiss = cell.classList.contains('miss');

                if (isMiss) {
                    setCellState(cell, 'clear');
                } else if (isHit) {
                    setCellState(cell, 'miss');
                } else {
                    setCellState(cell, 'ship');
                }
            }
        } else if (type === 'opponent') {
            if (cell.classList.contains('hit')) {
                setCellState(cell, 'miss');
            } else if (cell.classList.contains('miss')) {
                setCellState(cell, 'clear');
            } else {
                setCellState(cell, 'hit');
            }
        }
    }

    function setCellState(cell, state) {
        cell.classList.remove('ship', 'hit', 'miss');
        switch (state) {
            case 'ship': cell.classList.add('ship'); break;
            case 'my_ship_hit': cell.classList.add('ship', 'hit'); break;
            case 'hit': cell.classList.add('hit'); break;
            case 'miss': cell.classList.add('miss'); break;
            case 'clear': break;
        }
    }

    function resetGame() {
        const allCells = document.querySelectorAll('.cell');
        allCells.forEach(cell => {
            setCellState(cell, 'clear');
        });
        placedShips = [];
        selectedShipSize = null;
        selectedShipName = '';
        isHorizontal = true;
        
        // Clear active ship buttons
        document.querySelectorAll('.ship-btn').forEach(btn => btn.classList.remove('active'));
        updatePlacementUI();
        updateShipButtonStates();
        
        showMessage('Game đã được reset!', 'info', 2000);
    }

    // Initialize everything
    function init() {
        initNavigation();
        initShipButtons();
        createGrid(myBoardWrapper, 'my');
        createGrid(opponentBoardWrapper, 'opponent');
        updatePlacementUI();
        createMessageContainer();
        
        // Event listeners
        document.addEventListener('keydown', handleKeyPress);
        resetButton.addEventListener('click', resetGame);
        autoPlaceBtn.addEventListener('click', autoPlaceShips);
        rotateBtn.addEventListener('click', rotateShip);
        clearShipsBtn.addEventListener('click', clearAllShips);
    }

    // Message system
    function createMessageContainer() {
        if (!document.getElementById('message-container')) {
            const messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.className = 'message-container';
            document.body.appendChild(messageContainer);
        }
    }

    function showMessage(text, type = 'info', duration = 3000) {
        const messageContainer = document.getElementById('message-container');
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        
        messageContainer.appendChild(message);
        
        // Animate in
        setTimeout(() => message.classList.add('show'), 100);
        
        // Remove after duration
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, duration);
    }

    // Add ship count validation
    function getShipCount(size) {
        return placedShips.filter(ship => ship.size === size).length;
    }

    function getShipLimit(size) {
        const shipType = shipTypes.find(type => type.size === size);
        return shipType ? shipType.count : 0;
    }

    function canPlaceMoreShips(size) {
        return getShipCount(size) < getShipLimit(size);
    }

    // Start the game
    init();
});