document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử HTML
    const myBoard = document.getElementById('my-board');
    const opponentBoard = document.getElementById('opponent-board');
    const resetButton = document.getElementById('reset-button');
    const gridSize = 10;

    /**
     * Hàm tạo ra một lưới 10x10 và thêm vào phần tử cha
     * @param {HTMLElement} gridElement - Phần tử div của bảng
     * @param {string} type - Loại bảng ('my' hoặc 'opponent')
     */
    function createGrid(gridElement, type) {
        // Xóa lưới cũ nếu có
        gridElement.innerHTML = ''; 
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.id = i; // Gán id để nhận biết
            gridElement.appendChild(cell);
        }

        // Thêm sự kiện click cho bảng
        gridElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                handleCellClick(e.target, type);
            }
        });
    }

    /**
     * Hàm xử lý sự kiện khi một ô được nhấp chuột
     * @param {HTMLElement} cell - Ô được nhấp
     * @param {string} type - Loại bảng ('my' hoặc 'opponent')
     */
    function handleCellClick(cell, type) {
        if (type === 'my') {
            // Logic cho Bảng Của Bạn (chu kỳ 4 trạng thái)
            // Trống -> Tàu -> Tàu Bị Bắn -> Bắn Trượt -> Trống
            const isShip = cell.classList.contains('ship');
            const isHit = cell.classList.contains('hit');
            const isMiss = cell.classList.contains('miss');

            if (isShip && !isHit) {
                // Trạng thái hiện tại: Tàu -> Chuyển thành: Tàu Bị Bắn
                cell.classList.add('hit');
            } else if (isShip && isHit) {
                // Trạng thái hiện tại: Tàu Bị Bắn -> Chuyển thành: Bắn Trượt
                cell.classList.remove('ship', 'hit');
                cell.classList.add('miss');
            } else if (isMiss) {
                // Trạng thái hiện tại: Bắn Trượt -> Chuyển thành: Trống
                cell.classList.remove('miss');
            } else {
                // Trạng thái hiện tại: Trống -> Chuyển thành: Tàu
                cell.classList.add('ship');
            }

        } else if (type === 'opponent') {
            // Logic cho Bảng Đối Thủ (chu kỳ 3 trạng thái)
            // Trống -> Bắn Trượt -> Bắn Trúng -> Trống
            if (cell.classList.contains('hit')) {
                // Đang là 'hit' -> chuyển về 'trống'
                cell.classList.remove('hit');
            } else if (cell.classList.contains('miss')) {
                // Đang là 'miss' -> chuyển thành 'hit'
                cell.classList.remove('miss');
                cell.classList.add('hit');
            } else {
                // Đang là 'trống' -> chuyển thành 'miss'
                cell.classList.add('miss');
            }
        }
        
        // Cập nhật icon cho ô (quan trọng để xóa icon cũ)
        updateCellIcon(cell);
    }
    
    /**
     * Cập nhật icon dựa trên trạng thái của ô
     * @param {HTMLElement} cell
     */
    function updateCellIcon(cell) {
        // Xóa icon cũ trước
        cell.innerHTML = '';
        
        // Thêm icon mới nếu cần
        // (CSS :before sẽ tự động xử lý việc hiển thị)
    }

    /**
     * Hàm reset lại tất cả các bảng
     */
    function resetGame() {
        const allCells = document.querySelectorAll('.cell');
        allCells.forEach(cell => {
            cell.classList.remove('ship', 'hit', 'miss');
            updateCellIcon(cell); // Xóa tất cả icon
        });
    }

    // Gắn sự kiện cho nút Chơi Lại
    resetButton.addEventListener('click', resetGame);

    // Khởi tạo cả hai bảng khi trang được tải
    createGrid(myBoard, 'my');
    createGrid(opponentBoard, 'opponent');
});

document.addEventListener('DOMContentLoaded', () => {
    const myBoard = document.getElementById('my-board');
    const opponentBoard = document.getElementById('opponent-board');
    const resetButton = document.getElementById('reset-button');
    const gridSize = 10;
    let hoveredCell = null; // Biến để lưu ô đang được di chuột vào

    /**
     * Hàm tạo lưới và thêm các trình lắng nghe sự kiện
     */
    function createGrid(gridElement, type) {
        gridElement.innerHTML = '';
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.id = i;
            
            // Lắng nghe sự kiện click
            cell.addEventListener('click', () => handleCellClick(cell, type));

            // Lắng nghe sự kiện di chuột vào/ra để xác định ô mục tiêu cho phím tắt
            cell.addEventListener('mouseenter', () => hoveredCell = cell);
            cell.addEventListener('mouseleave', () => hoveredCell = null);

            gridElement.appendChild(cell);
        }
    }

    /**
     * Hàm xử lý khi click chuột
     */
    function handleCellClick(cell, type) {
        // ... (Logic click chuột từ phiên bản trước vẫn giữ nguyên)
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

    /**
     * Hàm xử lý khi bấm phím
     * @param {KeyboardEvent} e 
     */
    function handleKeyPress(e) {
        // Nếu không di chuột vào ô nào thì không làm gì
        if (!hoveredCell) return;

        const key = e.key.toLowerCase();
        const boardType = hoveredCell.parentElement.id === 'my-board' ? 'my' : 'opponent';

        if (boardType === 'my') {
            switch (key) {
                case '1':
                    // Chuyển đổi trạng thái Tàu
                    hoveredCell.classList.toggle('ship');
                    // Nếu đang là tàu bị bắn hoặc bắn trượt, chuyển thành tàu thường
                    hoveredCell.classList.remove('hit', 'miss');
                    break;
                case '2':
                    setCellState(hoveredCell, 'my_ship_hit');
                    break;
                case '3':
                    setCellState(hoveredCell, 'miss');
                    break;
                case '0':
                case 'c':
                    setCellState(hoveredCell, 'clear');
                    break;
            }
        } else { // Bảng đối thủ
            switch (key) {
                case '1':
                    setCellState(hoveredCell, 'hit');
                    break;
                case '2':
                    setCellState(hoveredCell, 'miss');
                    break;
                case '0':
                case 'c':
                    setCellState(hoveredCell, 'clear');
                    break;
            }
        }
    }

    /**
     * Hàm trung tâm để thiết lập trạng thái của một ô.
     * Giúp tránh lặp code.
     * @param {HTMLElement} cell 
     * @param {string} state - 'clear', 'ship', 'my_ship_hit', 'hit', 'miss'
     */
    function setCellState(cell, state) {
        // Xóa mọi trạng thái cũ
        cell.classList.remove('ship', 'hit', 'miss');

        switch (state) {
            case 'ship':
                cell.classList.add('ship');
                break;
            case 'my_ship_hit':
                cell.classList.add('ship', 'hit');
                break;
            case 'hit':
                cell.classList.add('hit');
                break;
            case 'miss':
                cell.classList.add('miss');
                break;
            case 'clear':
                // Không làm gì thêm, chỉ xóa là đủ
                break;
        }
    }

    /**
     * Reset lại trò chơi
     */
    function resetGame() {
        const allCells = document.querySelectorAll('.cell');
        allCells.forEach(cell => {
            setCellState(cell, 'clear');
        });
    }

    // Lắng nghe sự kiện bấm phím trên toàn bộ trang
    document.addEventListener('keydown', handleKeyPress);
    resetButton.addEventListener('click', resetGame);

    // Khởi tạo
    createGrid(myBoard, 'my');
    createGrid(opponentBoard, 'opponent');
});