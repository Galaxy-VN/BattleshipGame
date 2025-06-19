document.addEventListener('DOMContentLoaded', () => {
    const myBoardWrapper = document.getElementById('my-board-wrapper');
    const opponentBoardWrapper = document.getElementById('opponent-board-wrapper');
    const resetButton = document.getElementById('reset-button');
    const gridSize = 10;
    let hoveredCell = null;

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
                    cell.textContent = row - 1;
                } else {
                    cell.classList.add('cell');
                    const cellId = (row - 1) * gridSize + (col - 1);
                    cell.dataset.id = cellId;
                    cell.dataset.coordinate = letters[col - 1] + (row - 1);

                    cell.addEventListener('click', () => handleCellClick(cell, type));
                    cell.addEventListener('mouseenter', () => hoveredCell = cell);
                    cell.addEventListener('mouseleave', () => hoveredCell = null);
                }
                wrapperElement.appendChild(cell);
            }
        }
    }

    function handleKeyPress(e) {
        if (!hoveredCell) return;

        const key = e.key.toLowerCase();
        const boardType = hoveredCell.parentElement.id === 'my-board-wrapper' ? 'my' : 'opponent';

        if (boardType === 'my') {
            switch (key) {
                case '1':
                    hoveredCell.classList.toggle('ship');
                    hoveredCell.classList.remove('hit', 'miss');
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
            const isShip = cell.classList.contains('ship');
            const isHit = cell.classList.contains('hit');
            const isMiss = cell.classList.contains('miss');

            if (isShip && !isHit) {
                setCellState(cell, 'my_ship_hit');
            } else if (isShip && isHit) {
                setCellState(cell, 'miss');
            } else if (isMiss) {
                setCellState(cell, 'clear');
            } else {
                setCellState(cell, 'ship');
            }
        } else if (type === 'opponent') {
            if (cell.classList.contains('hit')) {
                setCellState(cell, 'clear');
            } else if (cell.classList.contains('miss')) {
                setCellState(cell, 'hit');
            } else {
                setCellState(cell, 'miss');
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
    }

    document.addEventListener('keydown', handleKeyPress);
    resetButton.addEventListener('click', resetGame);

    createGrid(myBoardWrapper, 'my');
    createGrid(opponentBoardWrapper, 'opponent');
});