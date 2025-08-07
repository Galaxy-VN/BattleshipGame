<template>
  <div
    class="min-h-screen p-3 transition-all duration-500"
    :class="isDarkMode
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950'
      : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700'"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 mb-6 p-6 transition-colors duration-300">
        <!-- Theme Toggle Button -->
        <div class="absolute top-4 right-4 z-10">
          <button
            @click="toggleTheme"
            class="theme-toggle-btn p-3 rounded-xl bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
            :title="isDarkMode ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'"
          >
            <div class="relative w-6 h-6">
              <!-- Sun Icon -->
              <svg
                v-show="!isDarkMode"
                class="absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>

              <!-- Moon Icon -->
              <svg
                v-show="isDarkMode"
                class="absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-12"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
          </button>
        </div>

        <div class="text-center relative">
          <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-3 tracking-tight">
            CHƠI VỚI AI
          </h1>
          <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 mx-auto mb-4 rounded-full"></div>
          <p class="text-lg text-gray-600 dark:text-gray-100 font-medium max-w-2xl mx-auto transition-colors duration-300">
            Thách thức đối thủ máy tính thông minh
          </p>
        </div>
      </header>

      <!-- Game Status - Moved to overlay -->
      <!-- Game Statistics moved to overlay -->

      <!-- Compact Game Setup Panel -->
      <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-4 mb-4 transition-colors duration-300">
        <!-- Difficulty Selection - Compact -->
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span class="text-sm">⚙️</span>
            </div>
            <h3 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">
              Chọn Độ Khó AI
            </h3>
          </div>

          <div class="flex gap-2 mb-2">
            <button
              v-for="diff in difficultyOptions"
              :key="diff.value"
              :class="[
                'flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 border',
                selectedDifficulty === diff.value
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md border-orange-400'
                  : gameState.isGameStarted
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-slate-600'
                    : 'bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white hover:shadow-md border-gray-200 dark:border-slate-600'
              ]"
              @click="changeDifficulty(diff.value)"
              :disabled="gameState.isGameStarted"
            >
              <span v-if="diff.value === 'easy'" class="text-xs">🟢</span>
              <span v-if="diff.value === 'medium'" class="text-xs">🟡</span>
              <span v-if="diff.value === 'hard'" class="text-xs">🔴</span>
              <span>{{ diff.label }}</span>
            </button>
          </div>

          <div class="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 rounded-lg px-3 py-2">
            <span v-if="selectedDifficulty === 'easy'">🟢 AI bắn ngẫu nhiên, phù hợp cho người mới</span>
            <span v-if="selectedDifficulty === 'medium'">🟡 AI sử dụng chiến thuật hunt & target</span>
            <span v-if="selectedDifficulty === 'hard'">🔴 AI phân tích xác suất, rất thông minh</span>
          </div>
        </div>

        <!-- Ship Placement - Compact -->
        <div v-if="gameState.gameMode === 'setup'" class="border-t border-gray-200 dark:border-slate-600 pt-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span class="text-sm">🚢</span>
            </div>
            <h3 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Đặt Tàu Chiến
            </h3>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
            <button
              v-for="ship in shipTypes"
              :key="ship.name"
              :class="[
                'px-2 py-2 rounded-lg font-medium text-xs transition-all duration-300 flex flex-col items-center gap-1 border',
                selectedShipName === ship.name
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md border-blue-400'
                  : getPlacedCount(ship) >= ship.count
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-400 cursor-not-allowed'
                    : 'bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-md border-gray-200 dark:border-slate-600'
              ]"
              @click="selectShip(ship)"
              :disabled="getPlacedCount(ship) >= ship.count"
            >
              <span class="text-sm">{{ getShipEmoji(ship.name) }}</span>
              <span class="text-xs leading-tight text-center">{{ ship.name.split(' ')[0] }}</span>
              <span class="text-xs opacity-80">{{ ship.count - getPlacedCount(ship) }}/{{ ship.count }}</span>
            </button>
          </div>

          <div class="flex flex-wrap gap-2 items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                @click="toggleOrientation"
                class="px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 flex items-center gap-1 border bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-100 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:shadow-md border-gray-200 dark:border-slate-600"
              >
                <span class="text-sm">{{ isHorizontal ? '↔️' : '↕️' }}</span>
                <span>{{ isHorizontal ? 'Ngang' : 'Dọc' }}</span>
              </button>

              <button
                @click="autoPlaceShips"
                class="px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 flex items-center gap-1 border bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:shadow-md border-gray-200 dark:border-slate-600"
              >
                <span class="text-sm">🎲</span>
                <span>Tự Động</span>
              </button>
            </div>

            <button
              v-if="canStartGame"
              @click="startAIGame"
              class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span class="text-sm">🚀</span>
              <span>Bắt Đầu</span>
            </button>
          </div>
        </div>

        <!-- Game Controls - Compact -->
        <div v-if="gameState.gameMode === 'playing' || gameState.isGameFinished" class="border-t border-gray-200 dark:border-slate-600 pt-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span class="text-sm">⚙️</span>
            </div>
            <h3 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Điều Khiển
            </h3>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-if="gameState.isGameFinished"
              @click="resetGame"
              class="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span class="text-sm">🔄</span>
              <span>Chơi Lại</span>
            </button>

            <button
              v-if="gameState.gameMode === 'playing'"
              @click="resetGame"
              class="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span class="text-sm">🏳️</span>
              <span>Đầu Hàng</span>
            </button>
          </div>
        </div>
      </div>



      <!-- Game Boards -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <!-- My Board -->
        <div class="flex flex-col h-full">
          <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 h-full flex flex-col transition-colors duration-300">
            <div class="flex items-center justify-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-lg">⚓</span>
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                Bảng Của Bạn
              </h2>
            </div>
            <div class="flex justify-center items-center flex-1">
              <GameBoard
                ref="humanBoard"
                board-type="my"
                :grid-size="gridSize"
                :selected-ship-size="selectedShipSize"
                :is-horizontal="isHorizontal"
                :placed-ships="placedShips"
                :game-board="visibleBoards.humanBoard"
                :disabled="gameState.gameMode === 'playing'"
                @cell-click="handleHumanBoardClick"
                @cell-hover="handleCellHover"
                @cell-leave="handleCellLeave"
              />
            </div>
          </div>
        </div>

        <!-- AI Board -->
        <div class="flex flex-col h-full">
          <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 h-full flex flex-col transition-colors duration-300">
            <div class="flex items-center justify-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-lg">🤖</span>
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
                Bảng Đối Thủ AI
              </h2>
            </div>
            <div class="flex justify-center items-center flex-1">
              <GameBoard
                ref="aiBoard"
                board-type="opponent"
                :grid-size="gridSize"
                :game-board="getAIBoardForDisplay()"
                :disabled="gameState.currentPlayer !== 'human' || gameState.gameMode !== 'playing'"
                @cell-click="handleAIBoardClick"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Information Area -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Legend Section -->
        <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-white font-bold text-lg">🎨</span>
            </div>
            <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Chú Giải Màu Sắc
            </h3>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div class="legend-item flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl hover:from-white hover:to-gray-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500">
              <div class="legend-icon-wrapper relative">
                <div class="w-8 h-8 rounded-xl border-3 border-white dark:border-gray-300 shadow-lg transition-all duration-300 hover:scale-110 bg-blue-500"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg">⚓</span>
                </div>
              </div>
              <div class="flex-1">
                <span class="font-semibold text-gray-800 dark:text-gray-100 text-base transition-colors duration-300">Tàu Chiến</span>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Vị trí đặt tàu của bạn</p>
              </div>
            </div>

            <div class="legend-item flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl hover:from-white hover:to-gray-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500">
              <div class="legend-icon-wrapper relative">
                <div class="w-8 h-8 rounded-xl border-3 border-white dark:border-gray-300 shadow-lg transition-all duration-300 hover:scale-110 bg-orange-500"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg">🔥</span>
                </div>
              </div>
              <div class="flex-1">
                <span class="font-semibold text-gray-800 dark:text-gray-100 text-base transition-colors duration-300">Tàu Bị Trúng</span>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Tàu của bạn bị AI bắn trúng</p>
              </div>
            </div>

            <div class="legend-item flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl hover:from-white hover:to-gray-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500">
              <div class="legend-icon-wrapper relative">
                <div class="w-8 h-8 rounded-xl border-3 border-white dark:border-gray-300 shadow-lg transition-all duration-300 hover:scale-110 bg-red-500"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg">💥</span>
                </div>
              </div>
              <div class="flex-1">
                <span class="font-semibold text-gray-800 dark:text-gray-100 text-base transition-colors duration-300">Bắn Trúng</span>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Bạn bắn trúng tàu AI</p>
              </div>
            </div>

            <div class="legend-item flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl hover:from-white hover:to-gray-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500">
              <div class="legend-icon-wrapper relative">
                <div class="w-8 h-8 rounded-xl border-3 border-white dark:border-gray-300 shadow-lg transition-all duration-300 hover:scale-110 bg-gray-500"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg">💧</span>
                </div>
              </div>
              <div class="flex-1">
                <span class="font-semibold text-gray-800 dark:text-gray-100 text-base transition-colors duration-300">Bắn Trượt</span>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Bắn trượt, không có tàu</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Hotkey Guide Section -->
        <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-white font-bold text-lg">⌨️</span>
            </div>
            <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
              Phím Tắt
            </h3>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div class="hotkey-section">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span class="text-white text-xs">🚢</span>
                </div>
                <h4 class="font-bold text-gray-800 dark:text-gray-100 text-base uppercase tracking-wide transition-colors duration-300">Điều Khiển Tàu</h4>
              </div>
              <div class="space-y-3">
                <div class="hotkey-item flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/60 dark:to-slate-700/60 rounded-xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-slate-700/80 dark:hover:to-slate-600/80 transition-all duration-300 transform hover:scale-105 border border-blue-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-slate-500">
                  <kbd class="hotkey-badge px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 min-w-[60px] text-center">R</kbd>
                  <div class="flex-1">
                    <span class="font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">Xoay Tàu</span>
                    <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Chuyển đổi hướng ngang/dọc</p>
                  </div>
                </div>
                <div class="hotkey-item flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/60 dark:to-slate-700/60 rounded-xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-slate-700/80 dark:hover:to-slate-600/80 transition-all duration-300 transform hover:scale-105 border border-blue-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-slate-500">
                  <kbd class="hotkey-badge px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 min-w-[60px] text-center">Space</kbd>
                  <div class="flex-1">
                    <span class="font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">Đặt Tàu Tự Động</span>
                    <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Tự động đặt tất cả tàu</p>
                  </div>
                </div>
                <div class="hotkey-item flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/60 dark:to-slate-700/60 rounded-xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-slate-700/80 dark:hover:to-slate-600/80 transition-all duration-300 transform hover:scale-105 border border-blue-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-slate-500">
                  <kbd class="hotkey-badge px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 min-w-[60px] text-center">Enter</kbd>
                  <div class="flex-1">
                    <span class="font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">Bắt Đầu Game</span>
                    <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Bắt đầu chơi với AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Controls - Only for debug when playing -->
      <div class="game-controls" v-if="gameState.gameMode === 'playing' && showDebugMode && !gameState.isGameFinished">
        <button 
          @click="showAIShips = !showAIShips" 
          class="game-btn debug-btn"
        >
          👁️ {{ showAIShips ? 'Ẩn' : 'Hiện' }} Tàu AI
        </button>
      </div>

      <!-- Game Over Modal -->
      <div v-if="gameState.isGameFinished" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 max-w-md w-full mx-4 transform transition-all duration-300">
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-4xl">{{ gameState.winner === 'human' ? '🎉' : '😢' }}</span>
            </div>

            <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
              {{ gameState.winner === 'human' ? 'CHIẾN THẮNG!' : 'THẤT BẠI!' }}
            </h2>

            <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 mb-6 border border-gray-200 dark:border-slate-600">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Thống kê trận đấu:</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Độ chính xác của bạn:</span>
                  <span class="font-bold text-blue-600 dark:text-blue-400">{{ getAccuracy().human }}%</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Độ chính xác của AI:</span>
                  <span class="font-bold text-red-600 dark:text-red-400">{{ getAccuracy().ai }}%</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Số lượt bắn:</span>
                  <span class="font-bold text-purple-600 dark:text-purple-400">{{ gameState.stats.humanShots }} vs {{ gameState.stats.aiShots }}</span>
                </div>
              </div>
            </div>

            <div class="flex gap-4 justify-center">
              <button
                @click="resetGame"
                class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span class="text-lg">🔄</span>
                <span>Chơi Lại</span>
              </button>
              <button
                @click="goToMenu"
                class="px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span class="text-lg">🏠</span>
                <span>Về Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Thinking Indicator -->
      <div v-if="aiThinking" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
        <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 mx-4 max-w-sm w-full">
          <div class="text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl">🤖</span>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">AI đang suy nghĩ...</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">Đang phân tích và lên kế hoạch tấn công</p>

            <!-- Thinking progress dots -->
            <div class="flex justify-center gap-1 mt-4">
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Loading Overlay -->
      <div v-if="isLoading" class="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center z-50">
        <div class="text-center text-white">
          <div class="relative mb-8">
            <div class="w-24 h-24 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-4xl">⚓</span>
            </div>
          </div>
          <h2 class="text-3xl font-bold mb-4">Đang khởi tạo trò chơi...</h2>
          <p class="text-lg opacity-80">Chuẩn bị chiến trường và AI đối thủ</p>

          <!-- Loading progress -->
          <div class="mt-6 w-64 mx-auto">
            <div class="w-full bg-white/20 rounded-full h-2">
              <div class="bg-white h-2 rounded-full transition-all duration-500" :style="{ width: `${loadingProgress}%` }"></div>
            </div>
            <p class="text-sm mt-2 opacity-70">{{ loadingProgress }}%</p>
          </div>
        </div>
      </div>

      <!-- Game Progress Indicator -->
      <div v-if="gameState.gameMode === 'setup'" class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 mb-6 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <span class="text-xl">📈</span>
          </div>
          <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
            Tiến Độ Chuẩn Bị
          </h3>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Đã đặt {{ placedShips.length }}/{{ getTotalShipsCount() }} tàu</span>
            <span class="text-sm font-bold text-green-600 dark:text-green-400">{{ Math.round((placedShips.length / getTotalShipsCount()) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${(placedShips.length / getTotalShipsCount()) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Ship Type Progress -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div
            v-for="shipType in shipTypes"
            :key="shipType.name"
            class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-3 border border-gray-200 dark:border-slate-600 transition-all duration-300"
            :class="getPlacedCount(shipType) >= shipType.count ? 'ring-2 ring-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : ''"
          >
            <div class="text-center">
              <div class="text-2xl mb-1">{{ getShipEmoji(shipType.name) }}</div>
              <div class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">{{ shipType.name }}</div>
              <div class="flex justify-center items-center gap-1">
                <span :class="[
                  'text-xs font-bold px-2 py-1 rounded-full',
                  getPlacedCount(shipType) >= shipType.count
                    ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                    : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                ]">
                  {{ getPlacedCount(shipType) }}/{{ shipType.count }}
                </span>
                <span v-if="getPlacedCount(shipType) >= shipType.count" class="text-green-500 text-sm">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Insights Panel - Bottom Right (when hard difficulty) -->
      <div v-if="gameEngine && selectedDifficulty === 'hard' && gameState.gameMode === 'playing'" class="fixed bottom-4 right-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-4 max-w-xs z-30 transition-all duration-300 hover:shadow-2xl">
        <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-slate-600">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span class="text-white text-sm">🧠</span>
            </div>
            <h4 class="font-bold text-gray-800 dark:text-gray-100">AI Insights</h4>
          </div>
          <button
            @click="toggleAIInsights"
            class="w-6 h-6 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            {{ isAIInsightsExpanded ? '▼' : '▲' }}
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="text-lg">🎯</span>
            <span :class="[
              'px-3 py-1 rounded-lg text-sm font-semibold',
              getAIMode() === 'hunt' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
              'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            ]">
              {{ getAIMode() === 'hunt' ? 'Săn tìm' : 'Nhắm mục tiêu' }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-lg">📊</span>
            <span class="text-sm text-gray-600 dark:text-gray-300">
              Queue: {{ getAITargetQueue() }} | Phase: {{ getAIGamePhase() }}
            </span>
          </div>

          <div v-if="isAIInsightsExpanded" class="space-y-2 pt-2 border-t border-gray-200 dark:border-slate-600">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <div class="flex justify-between">
                <span>Hit Rate:</span>
                <span class="font-semibold">{{ getAIHitRate() }}%</span>
              </div>
              <div class="flex justify-between">
                <span>Pattern:</span>
                <span class="font-semibold">{{ getAIHuntPattern() }}</span>
              </div>
              <div class="flex justify-between">
                <span>Strategy:</span>
                <span class="font-semibold">{{ getAIStrategy() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Overlay - Bottom Left -->
      <div v-if="gameEngine" class="fixed bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-4 max-w-sm z-30 transition-all duration-300 hover:shadow-2xl">
        <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-slate-600">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span class="text-white text-sm">📊</span>
            </div>
            <h4 class="font-bold text-gray-800 dark:text-gray-100">Trạng Thái Game</h4>
          </div>
          <button
            @click="toggleStatsExpanded"
            class="w-6 h-6 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            {{ isStatsExpanded ? '▼' : '▲' }}
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="text-lg">🎮</span>
            <span :class="[
              'px-3 py-1 rounded-lg text-sm font-semibold',
              gameState.gameMode === 'setup' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
              gameState.gameMode === 'playing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
              'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
            ]">
              {{ getGameModeText() }}
            </span>
          </div>

          <div v-if="gameState.gameMode === 'playing'" class="flex items-center gap-3">
            <span class="text-lg">🎯</span>
            <span :class="[
              'px-3 py-1 rounded-lg text-sm font-semibold',
              gameState.currentPlayer === 'human' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
              'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
            ]">
              {{ gameState.currentPlayer === 'human' ? 'Lượt của bạn' : 'Lượt AI' }}
            </span>
          </div>
        </div>

        <!-- Expandable Game Statistics -->
        <div v-if="gameState.isGameStarted && isStatsExpanded" class="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span class="text-lg">👤</span>
              <div class="flex-1">
                <div class="font-semibold text-green-800 dark:text-green-300">Bạn</div>
                <div class="text-sm text-green-600 dark:text-green-400">{{ gameState.stats.humanHits }}/{{ gameState.stats.humanShots }} ({{ getAccuracy().human }}%)</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span class="text-lg">🤖</span>
              <div class="flex-1">
                <div class="font-semibold text-orange-800 dark:text-orange-300">AI</div>
                <div class="text-sm text-orange-600 dark:text-orange-400">{{ gameState.stats.aiHits }}/{{ gameState.stats.aiShots }} ({{ getAccuracy().ai }}%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <div class="fixed bottom-4 right-4 z-40">
        <div class="relative fab-container">
          <!-- Main FAB -->
          <button
            @click="toggleFABMenu"
            class="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            :class="{ 'rotate-45': showFABMenu }"
          >
            <span class="text-2xl transition-transform duration-300">{{ showFABMenu ? '✕' : '⚙️' }}</span>
          </button>

          <!-- FAB Menu Items -->
          <transition-group name="fab" tag="div" class="absolute bottom-16 right-0 space-y-3">
            <div
              v-for="(item, index) in fabMenuItems"
              :key="item.id"
              v-show="showFABMenu"
              :style="{ transitionDelay: `${index * 100}ms` }"
              class="fab-item"
            >
              <button
                @click="handleFABAction(item.action)"
                :class="[
                  'w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-white font-bold',
                  item.bgClass
                ]"
                :title="item.tooltip"
              >
                <span class="text-lg">{{ item.icon }}</span>
              </button>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Game Tips Panel -->
      <div
        v-if="showTips"
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-6 max-w-md w-full mx-4 z-50"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span class="text-xl">💡</span>
            </div>
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400">
              Mẹo Chơi Game
            </h3>
          </div>
          <button
            @click="showTips = false"
            class="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(tip, index) in gameTips"
            :key="index"
            class="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-gray-200 dark:border-slate-600"
          >
            <div class="flex items-start gap-3">
              <span class="text-2xl">{{ tip.icon }}</span>
              <div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-1">{{ tip.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ tip.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Container -->
      <div class="fixed top-20 right-4 w-full max-w-sm z-50 space-y-3">
        <transition-group
          name="notification"
          tag="div"
          class="space-y-3"
          @enter="onNotificationEnter"
          @leave="onNotificationLeave"
        >
          <div
            v-for="(notification, index) in notifications"
            :key="notification.id"
            :data-index="index"
            class="notification-item transform transition-all duration-500 ease-out"
            :style="{
              transitionDelay: `${index * 100}ms`,
              zIndex: 1000 - index
            }"
          >
            <div
              :class="[
                'p-4 rounded-xl shadow-xl backdrop-blur-md border border-white/20 overflow-hidden',
                getNotificationClasses(notification.type)
              ]"
            >
              <div class="flex items-center gap-3">
                <div class="notification-icon-wrapper">
                  <span class="notification-icon text-lg">{{ getEmojiForType(notification.type) }}</span>
                </div>
                <div class="flex-1">
                  <span class="font-medium text-white">{{ notification.text }}</span>
                </div>
                <button
                  @click="removeNotification(notification.id)"
                  class="text-white/80 hover:text-white transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import GameBoard from '../components/GameBoard.vue'
import GameEngine from '../services/GameEngine.js'

export default {
  name: 'AIGamePage',
  components: {
    GameBoard
  },
  data() {
    return {
      gameEngine: null,
      gridSize: 10,
      selectedShipSize: null,
      selectedShipName: '',
      isHorizontal: true,
      placedShips: [],
      selectedDifficulty: 'medium',
      showDebugMode: true, // Set to true for development - shows AI insights and debug options
      showAIShips: false, // Debug mode to show AI ships
      aiThinking: false,
      isStatsExpanded: false, // New property for stats toggle
      isAIInsightsExpanded: false, // AI insights toggle
      isDarkMode: false, // Theme toggle
      notifications: [], // Notification system
      showFABMenu: false, // Floating Action Button menu
      showTips: false, // Game tips panel
      soundEnabled: true, // Sound effects toggle
      isLoading: false, // Game loading state
      loadingProgress: 0, // Loading progress percentage
      
      difficultyOptions: [
        { value: 'easy', label: 'Dễ' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'hard', label: 'Khó' }
      ],
      
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
  computed: {
    gameState() {
      return this.gameEngine ? this.gameEngine.getGameState() : {
        gameMode: 'setup',
        currentPlayer: 'human',
        isGameStarted: false,
        isGameFinished: false,
        winner: null,
        stats: { humanShots: 0, humanHits: 0, aiShots: 0, aiHits: 0 }
      }
    },
    
    visibleBoards() {
      if (!this.gameEngine) {
        return { humanBoard: {}, aiBoard: {} }
      }
      
      const boards = this.gameEngine.getVisibleBoards()
      
      // If debug mode is on and showAIShips is true, show AI ships
      if (this.showDebugMode && this.showAIShips) {
        const fullAIBoard = this.gameEngine.getGameState().aiBoard
        return {
          humanBoard: boards.humanBoard,
          aiBoard: fullAIBoard
        }
      }
      
      return boards
    },
    
    canStartGame() {
      const expectedShips = {}
      this.shipTypes.forEach(type => {
        expectedShips[type.name] = type.count
      })

      const placedShips = {}
      this.placedShips.forEach(ship => {
        placedShips[ship.name] = (placedShips[ship.name] || 0) + 1
      })

      return Object.keys(expectedShips).every(shipName =>
        placedShips[shipName] === expectedShips[shipName]
      )
    },

    fabMenuItems() {
      const baseItems = [
        {
          id: 'tips',
          icon: '💡',
          tooltip: 'Xem mẹo chơi game',
          action: 'showTips',
          bgClass: 'bg-gradient-to-r from-yellow-500 to-orange-500'
        },
        {
          id: 'reset',
          icon: '🔄',
          tooltip: 'Reset game',
          action: 'resetGame',
          bgClass: 'bg-gradient-to-r from-red-500 to-pink-500'
        },
        {
          id: 'sound',
          icon: this.soundEnabled ? '🔊' : '🔇',
          tooltip: this.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh',
          action: 'toggleSound',
          bgClass: 'bg-gradient-to-r from-green-500 to-emerald-500'
        },
        {
          id: 'fullscreen',
          icon: '⛶',
          tooltip: 'Chế độ toàn màn hình',
          action: 'toggleFullscreen',
          bgClass: 'bg-gradient-to-r from-indigo-500 to-purple-500'
        }
      ]

      // Add debug items for hard difficulty
      if (this.selectedDifficulty === 'hard' && this.showDebugMode) {
        baseItems.push({
          id: 'aiShips',
          icon: '👁️',
          tooltip: this.showAIShips ? 'Ẩn tàu AI' : 'Hiện tàu AI',
          action: 'toggleAIShips',
          bgClass: 'bg-gradient-to-r from-purple-500 to-pink-500'
        })
      }

      return baseItems
    },

    gameTips() {
      const baseTips = [
        {
          icon: '🎯',
          title: 'Chiến thuật bắn',
          description: 'Sau khi bắn trúng, hãy bắn các ô xung quanh để tìm toàn bộ con tàu.'
        },
        {
          icon: '🚢',
          title: 'Đặt tàu thông minh',
          description: 'Đừng đặt tàu quá gần nhau. Tạo khoảng cách để AI khó đoán.'
        },
        {
          icon: '⚡',
          title: 'Phím tắt',
          description: 'Sử dụng phím R để xoay tàu, Space để đặt tàu tự động.'
        }
      ]

      const hardModeTips = [
        {
          icon: '🧠',
          title: 'AI Khó - Thuật toán tiên tiến',
          description: 'AI sử dụng machine learning, constraint satisfaction và strategic ship completion. Đặt tàu không theo pattern!'
        },
        {
          icon: '🚫',
          title: 'Quy tắc không kề nhau',
          description: 'AI biết tàu không thể đặt kề nhau. Sau khi chìm tàu, AI sẽ không bắn vào 8 ô xung quanh.'
        },
        {
          icon: '📊',
          title: 'Phân tích xác suất',
          description: 'AI tính toán xác suất cho từng ô dựa trên kích thước tàu còn lại và pattern placement.'
        },
        {
          icon: '🎯',
          title: 'Strategic Targeting',
          description: 'Khi tìm thấy tàu, AI sử dụng Bayesian prediction và cluster analysis để hoàn thành nhanh nhất.'
        }
      ]

      return this.selectedDifficulty === 'hard' ? [...baseTips, ...hardModeTips] : baseTips
    }
  },
  mounted() {
    this.initializeGame()

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode = true
      document.documentElement.classList.add('dark')
    } else {
      this.isDarkMode = false
      document.documentElement.classList.remove('dark')
    }

    // Load sound preference
    const savedSound = localStorage.getItem('soundEnabled')
    if (savedSound !== null) {
      this.soundEnabled = savedSound === 'true'
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = e.matches
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    })

    // Add keyboard event listeners
    document.addEventListener('keydown', this.handleKeyboardShortcuts)

    // Close FAB menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.fab-container')) {
        this.showFABMenu = false
      }
    })

    // Setup AI logging capture for hard difficulty
    this.setupAILogging()
  },

  beforeUnmount() {
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyboardShortcuts)
  },
  methods: {
    async initializeGame() {
      this.isLoading = true
      this.loadingProgress = 0

      // Simulate loading steps with progress
      const loadingSteps = [
        { message: 'Khởi tạo game engine...', progress: 20 },
        { message: 'Chuẩn bị bảng chơi...', progress: 40 },
        { message: 'Khởi tạo AI đối thủ...', progress: 60 },
        { message: 'Thiết lập giao diện...', progress: 80 },
        { message: 'Hoàn tất!', progress: 100 }
      ]

      for (const step of loadingSteps) {
        await new Promise(resolve => setTimeout(resolve, 300))
        this.loadingProgress = step.progress
      }

      this.gameEngine = new GameEngine(this.gridSize)
      this.gameEngine.setAIDifficulty(this.selectedDifficulty)
      const result = this.gameEngine.startGame()

      await new Promise(resolve => setTimeout(resolve, 500))
      this.isLoading = false

      if (result.success) {
        let message = 'Game đã sẵn sàng! Hãy đặt tàu của bạn 🚢'
        if (this.selectedDifficulty === 'hard') {
          message += ' 🧠 AI sử dụng thuật toán tiên tiến!'
        }
        this.showMessage(message, 'success', 3000)
      } else {
        this.showMessage(result.message, 'error')
      }
    },
    
    getGameModeText() {
      switch (this.gameState.gameMode) {
        case 'setup': return 'Đặt tàu'
        case 'playing': return 'Đang chơi'
        case 'finished': return 'Kết thúc'
        default: return 'Không xác định'
      }
    },
    
    getAccuracy() {
      return this.gameEngine ? this.gameEngine.getAccuracy() : { human: 0, ai: 0 }
    },
    
    changeDifficulty(difficulty) {
      if (this.gameState.isGameStarted) return
      
      this.selectedDifficulty = difficulty
      if (this.gameEngine) {
        this.gameEngine.setAIDifficulty(this.selectedDifficulty)
        this.showMessage(`Đã chuyển độ khó: ${this.getDifficultyText()}`, 'info')
      }
    },
    
    getDifficultyText() {
      const difficultyMap = {
        easy: 'Dễ',
        medium: 'Trung bình', 
        hard: 'Khó'
      }
      return difficultyMap[this.selectedDifficulty] || 'Không xác định'
    },
    
    toggleStatsExpanded() {
      this.isStatsExpanded = !this.isStatsExpanded
    },

    toggleAIInsights() {
      this.isAIInsightsExpanded = !this.isAIInsightsExpanded
    },

    // AI Insights Methods
    getAIMode() {
      return this.gameEngine?.ai?.mode || 'hunt'
    },

    getAITargetQueue() {
      return this.gameEngine?.ai?.targetQueue?.length || 0
    },

    getAIGamePhase() {
      return this.gameEngine?.ai?.gamePhase || 'early'
    },

    getAIHitRate() {
      const stats = this.gameState.stats
      if (stats.aiShots === 0) return 0
      return Math.round((stats.aiHits / stats.aiShots) * 100)
    },

    getAIHuntPattern() {
      return this.gameEngine?.ai?.currentHuntPattern || 'checkerboard'
    },

    getAIStrategy() {
      const ai = this.gameEngine?.ai
      if (!ai) return 'basic'

      if (this.selectedDifficulty === 'hard') {
        if (ai.mode === 'target') {
          return 'strategic targeting'
        } else {
          return 'advanced hunt'
        }
      } else if (this.selectedDifficulty === 'medium') {
        return 'hunt & target'
      } else {
        return 'random'
      }
    },

    getAIBoardForDisplay() {
      if (!this.gameEngine) return {}

      const visibleBoard = this.visibleBoards.aiBoard

      // If debug mode is enabled and showAIShips is true, show AI ships
      if (this.showDebugMode && this.showAIShips && this.gameEngine.aiBoard) {
        const debugBoard = {}

        for (let row = 1; row <= this.gridSize; row++) {
          debugBoard[row] = {}
          for (let col = 1; col <= this.gridSize; col++) {
            const aiCell = this.gameEngine.aiBoard[row][col]
            const visibleCell = visibleBoard[row] ? visibleBoard[row][col] : {}

            debugBoard[row][col] = {
              ...visibleCell,
              // Show ships in debug mode (but only if not hit/miss)
              hasShip: aiCell?.hasShip && !visibleCell.isHit && !visibleCell.isMiss
            }
          }
        }

        return debugBoard
      }

      return visibleBoard
    },
    
    // Ship placement methods
    handleShipSelected(ship) {
      this.selectedShipSize = ship.size
      this.selectedShipName = ship.name
    },
    
    handleRotateShip() {
      this.isHorizontal = !this.isHorizontal
      this.showMessage(
        `Hướng đặt tàu: ${this.isHorizontal ? 'Ngang' : 'Dọc'}`,
        'info',
        1500
      )
    },
    
    handleSetHorizontal(value) {
      this.isHorizontal = value
      this.showMessage(
        `Hướng đặt tàu: ${this.isHorizontal ? 'Ngang' : 'Dọc'}`,
        'info',
        1500
      )
    },
    
    handleClearShips() {
      this.placedShips = []
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.$refs.humanBoard.resetBoard()
      this.showMessage('Đã xóa tất cả tàu!', 'info', 2000)
    },
    
    handleHumanBoardClick({ cell }) {
      if (this.gameState.gameMode !== 'setup') return
      
      // Ship placement mode
      if (this.selectedShipSize) {
        if (this.canPlaceShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal)) {
          this.placeShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal, this.selectedShipName)
        }
      }
    },
    
    async handleAIBoardClick({ cell }) {
      if (this.gameState.gameMode !== 'playing' || this.gameState.currentPlayer !== 'human') {
        return
      }
      
      // Human attacks AI
      const result = this.gameEngine.humanAttack(cell.row, cell.col)
      
      if (result.success) {
        this.showMessage(result.message, result.isHit ? 'success' : 'info')
        this.updateBoardDisplay()
        
        if (result.gameOver) {
          return // Game ended
        }
        
        // If human missed, AI's turn
        if (!result.isHit) {
          await this.processAITurn()
        }
      } else {
        this.showMessage(result.message, 'warning')
      }
    },
    
    async processAITurn() {
      this.aiThinking = true

      try {
        // Get AI state before move for insights
        const aiBefore = {
          mode: this.getAIMode(),
          queueLength: this.getAITargetQueue(),
          phase: this.getAIGamePhase(),
          pattern: this.getAIHuntPattern()
        }

        const result = await this.gameEngine.aiTurn()

        if (result.success) {
          // Enhanced message with strategic information for hard difficulty
          let message = result.message
          if (this.selectedDifficulty === 'hard') {
            const aiAfter = {
              mode: this.getAIMode(),
              queueLength: this.getAITargetQueue(),
              strategy: this.getAIStrategy()
            }

            // Add strategic context to the message
            if (result.isHit) {
              if (aiBefore.mode === 'hunt' && aiAfter.mode === 'target') {
                message += ' 🎯 AI chuyển sang chế độ nhắm mục tiêu!'
              } else if (aiAfter.mode === 'target') {
                message += ` 🧠 AI đang sử dụng ${aiAfter.strategy}!`
              }
            } else {
              if (aiBefore.mode === 'target' && aiAfter.mode === 'hunt') {
                message += ' 🔍 AI quay lại chế độ săn tìm!'
              }
            }
          }

          this.showMessage(message, result.isHit ? 'warning' : 'info')
          this.updateBoardDisplay()

          if (result.gameOver) {
            return // Game ended
          }

          // If AI hit, continue AI turn
          if (result.isHit && result.nextPlayer === 'ai') {
            setTimeout(() => this.processAITurn(), 1500)
          }
        }
      } finally {
        this.aiThinking = false
      }
    },
    
    handleCellHover() {
      // Handle hover for ship placement preview
    },
    
    handleCellLeave() {
      // Handle leave for ship placement preview
    },
    
    canPlaceShip(row, col, size, isHorizontal) {
      return this.$refs.humanBoard.canPlaceShip(row, col, size, isHorizontal)
    },
    
    placeShip(row, col, size, isHorizontal, name) {
      // Check if we can place more ships of this type
      const currentCount = this.placedShips.filter(ship => ship.name === name).length
      const shipType = this.shipTypes.find(type => type.name === name)
      
      if (currentCount >= shipType.count) {
        this.showMessage(
          `Bạn đã đặt đủ ${name}! Chỉ được đặt ${shipType.count} tàu loại này.`,
          'warning'
        )
        return
      }
      
      // Add ship to placed ships
      const ship = {
        row,
        col,
        size,
        isHorizontal,
        name
      }
      
      this.placedShips.push(ship)
      
      // Update board display
      for (let i = 0; i < size; i++) {
        const shipRow = isHorizontal ? row : row + i
        const shipCol = isHorizontal ? col + i : col
        this.$refs.humanBoard.setCellState(shipRow, shipCol, 'ship')
      }
      
      this.showMessage(`Đã đặt ${name}!`, 'success', 2000)
      
      // Clear selection if we've placed the maximum number of this ship type
      if (currentCount + 1 >= shipType.count) {
        this.selectedShipSize = null
        this.selectedShipName = ''
      }
    },
    
    autoPlaceShips() {
      this.handleClearShips()
      
      const ships = [...this.shipTypes]
      let attempts = 0
      const maxAttempts = 1000
      
      for (const shipType of ships) {
        for (let count = 0; count < shipType.count; count++) {
          let placed = false
          attempts = 0
          
          while (!placed && attempts < maxAttempts) {
            const row = Math.floor(Math.random() * this.gridSize) + 1
            const col = Math.floor(Math.random() * this.gridSize) + 1
            const isHorizontal = Math.random() < 0.5
            
            if (this.canPlaceShip(row, col, shipType.size, isHorizontal)) {
              this.placeShip(row, col, shipType.size, isHorizontal, shipType.name)
              placed = true
            }
            attempts++
          }
          
          if (!placed) {
            this.showMessage('Không thể đặt tất cả tàu tự động. Hãy thử lại!', 'warning')
            return
          }
        }
      }
      
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.showMessage('Đã đặt tàu tự động thành công!', 'success')
    },
    
    async startAIGame() {
      if (!this.canStartGame) {
        this.showMessage('Bạn cần đặt đủ tất cả tàu trước khi bắt đầu!', 'warning')
        return
      }
      
      const result = this.gameEngine.setHumanShips(this.placedShips)
      
      if (result.success) {
        this.showMessage(result.message, 'success')
        this.updateBoardDisplay()
      } else {
        this.showMessage(result.message, 'error')
      }
    },
    
    updateBoardDisplay() {
      // Force update of board displays
      this.$refs.humanBoard?.updateFromGameBoard()
      this.$refs.aiBoard?.updateFromGameBoard()
    },
    
    resetGame() {
      this.placedShips = []
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.isHorizontal = true
      this.showAIShips = false
      this.aiThinking = false
      
      if (this.gameEngine) {
        this.gameEngine.reset()
      }
      
      this.$refs.humanBoard?.resetBoard()
      this.$refs.aiBoard?.resetBoard()
      
      this.showMessage('Game đã được reset!', 'info', 2000)
    },
    
    goToMenu() {
      this.$emit('page-changed', 'game')
    },

    toggleTheme() {
      this.isDarkMode = !this.isDarkMode

      // Apply theme to document root
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        this.showMessage('Đã chuyển sang Dark Mode! 🌙', 'info', 2000)
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
        this.showMessage('Đã chuyển sang Light Mode! ☀️', 'info', 2000)
      }
    },

    // Notification system methods
    showMessage(text, type = 'info', timeout = 3000) {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        text,
        type,
        show: true
      }
      this.notifications.push(newNotification)

      if (timeout > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, timeout)
      }
    },

    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    getEmojiForType(type) {
      switch (type) {
        case 'success': return '✅'
        case 'error': return '❌'
        case 'warning': return '⚠️'
        case 'info':
        default: return 'ℹ️'
      }
    },

    getNotificationClasses(type) {
      const baseClasses = 'notification-alert'
      switch (type) {
        case 'success':
          return `${baseClasses} notification-success`
        case 'error':
          return `${baseClasses} notification-error`
        case 'warning':
          return `${baseClasses} notification-warning`
        case 'info':
        default:
          return `${baseClasses} notification-info`
      }
    },

    onNotificationEnter(el, done) {
      const index = parseInt(el.dataset.index)

      // Set initial state
      el.style.transform = 'translateX(100%) scale(0.8)'
      el.style.opacity = '0'

      // Animate in with stagger delay
      setTimeout(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
        el.style.transform = 'translateX(0) scale(1)'
        el.style.opacity = '1'

        setTimeout(done, 600)
      }, index * 150)
    },

    onNotificationLeave(el, done) {
      // Animate out to the right (opposite of entry direction)
      el.style.transition = 'all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)'
      el.style.transform = 'translateX(100%) scale(0.8)'
      el.style.opacity = '0'

      setTimeout(done, 400)
    },

    // Progress and ship helper methods
    getTotalShipsCount() {
      return this.shipTypes.reduce((total, ship) => total + ship.count, 0)
    },

    getPlacedCount(shipType) {
      return this.placedShips.filter(ship => ship.name === shipType.name).length
    },

    getShipEmoji(shipName) {
      const emojiMap = {
        'Tàu Sân Bay': '🛩️',
        'Thiết Giáp Hạm': '⚔️',
        'Tàu Tuần Dương': '🚢',
        'Tàu Ngầm': '🔱',
        'Tàu Khu Trục': '⚓'
      }
      return emojiMap[shipName] || '🚢'
    },

    // Ship placement helper methods
    selectShip(ship) {
      if (this.getPlacedCount(ship) >= ship.count) return
      this.selectedShipSize = ship.size
      this.selectedShipName = ship.name
    },

    toggleOrientation() {
      this.isHorizontal = !this.isHorizontal
      this.showMessage(`Đã chuyển sang hướng ${this.isHorizontal ? 'ngang' : 'dọc'}`, 'info', 1500)
    },

    // FAB and advanced features
    toggleFABMenu() {
      this.showFABMenu = !this.showFABMenu
    },

    handleFABAction(action) {
      this.showFABMenu = false

      switch (action) {
        case 'showTips':
          this.showTips = true
          break
        case 'resetGame':
          this.resetGame()
          break
        case 'toggleSound':
          this.toggleSound()
          break
        case 'toggleFullscreen':
          this.toggleFullscreen()
          break
        case 'toggleAIShips':
          this.toggleAIShips()
          break
      }
    },

    toggleSound() {
      this.soundEnabled = !this.soundEnabled
      localStorage.setItem('soundEnabled', this.soundEnabled.toString())
      this.showMessage(
        this.soundEnabled ? 'Đã bật âm thanh! 🔊' : 'Đã tắt âm thanh! 🔇',
        'info',
        2000
      )
    },

    toggleAIShips() {
      this.showAIShips = !this.showAIShips
      this.showMessage(
        this.showAIShips ? 'Hiển thị tàu AI (Debug Mode) 👁️' : 'Ẩn tàu AI 🙈',
        'info',
        2000
      )
    },

    setupAILogging() {
      // Only setup logging for hard difficulty and debug mode
      if (this.selectedDifficulty === 'hard' && this.showDebugMode) {
        // Store original console.log
        if (!window.originalConsoleLog) {
          window.originalConsoleLog = console.log
        }

        // Override console.log to capture AI messages
        console.log = (...args) => {
          // Call original console.log
          window.originalConsoleLog.apply(console, args)

          // Capture AI-related messages
          const message = args.join(' ')
          if (message.includes('AI')) {
            // You could store these in a reactive array and display them
            // For now, we'll just ensure they're logged
          }
        }
      }
    },

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          this.showMessage('Đã chuyển sang chế độ toàn màn hình! ⛶', 'info', 2000)
        }).catch(() => {
          this.showMessage('Không thể chuyển sang chế độ toàn màn hình!', 'error', 2000)
        })
      } else {
        document.exitFullscreen().then(() => {
          this.showMessage('Đã thoát chế độ toàn màn hình!', 'info', 2000)
        })
      }
    },

    // Enhanced keyboard shortcuts
    handleKeyboardShortcuts(event) {
      // Global shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'r':
            event.preventDefault()
            this.resetGame()
            break
          case 't':
            event.preventDefault()
            this.showTips = !this.showTips
            break
          case 'm':
            event.preventDefault()
            this.toggleSound()
            break
        }
      }

      // Game-specific shortcuts
      switch (event.key.toLowerCase()) {
        case 'escape':
          this.showTips = false
          this.showFABMenu = false
          break
        case 'f11':
          event.preventDefault()
          this.toggleFullscreen()
          break
      }
    }
  }
}
</script>

<style scoped>
/* Custom keyframe animations for enhanced UX */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Apply subtle animations */
.page {
  animation: fadeInUp 0.6s ease-out;
}

/* Enhanced focus styles for accessibility */
button:focus,
.cursor-pointer:focus {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Theme Toggle Button */
.theme-toggle-btn {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.theme-toggle-btn:hover {
  transform: scale(1.05);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

/* Enhanced action button animations */
.group:hover .group-hover\:animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

.group:hover .group-hover\:animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

.group:hover .group-hover\:animate-spin {
  animation: spin 2s linear infinite;
}

/* Smooth transitions for interactive elements */
button,
[role="button"],
.cursor-pointer,
.group,
.legend-item,
.hotkey-item,
.hotkey-badge,
.theme-toggle-btn {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.bg-gradient-to-r:hover {
  filter: brightness(1.1) saturate(1.1);
}

button,
[role="button"],
.theme-toggle-btn,
.legend-item,
.hotkey-item,
.hotkey-badge {
  transition-property: transform, box-shadow, filter;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced Legend and Hotkey Sections */
.legend-item {
  animation: slideInUp 0.6s ease-out both;
}

.legend-icon-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.legend-item:hover .legend-icon-wrapper {
  transform: rotate(5deg) scale(1.1);
}

.hotkey-section {
  animation: fadeInScale 0.8s ease-out both;
}

.hotkey-item {
  animation: slideInUp 0.6s ease-out both;
  position: relative;
  overflow: hidden;
}

.hotkey-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.hotkey-item:hover::before {
  left: 100%;
}

.hotkey-badge {
  position: relative;
  overflow: hidden;
}

.hotkey-badge::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.hotkey-badge:hover::after {
  width: 100px;
  height: 100px;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive improvements for game boards */
@media (max-width: 1280px) {
  .grid.grid-cols-12 {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .col-span-4,
  .col-span-8,
  .xl\:col-span-3,
  .xl\:col-span-9 {
    grid-column: span 1;
  }

  .grid.grid-cols-1.xl\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid.grid-cols-1.xl\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .min-h-\[500px\] {
    min-height: auto;
  }

  .p-6 {
    padding: 1rem;
  }

  .text-2xl.lg\:text-3xl {
    font-size: 1.5rem;
  }

  .grid.grid-cols-1.sm\:grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .grid.grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

@media (max-width: 640px) {
  .p-3 {
    padding: 0.75rem;
  }

  .gap-6 {
    gap: 1rem;
  }

  .rounded-2xl {
    border-radius: 1rem;
  }

  .px-6.py-4 {
    padding: 0.75rem 1rem;
  }

  .text-lg {
    font-size: 1rem;
  }

  .text-xl {
    font-size: 1.125rem;
  }

  .legend-item,
  .hotkey-item {
    padding: 0.75rem;
  }

  .hotkey-badge {
    min-width: 50px;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}

/* Notification Animations */
.notification-item {
  transform-origin: right center;
}

.notification-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.notification-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.notification-move {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Enhanced notification styling */
.notification-alert {
  position: relative;
  overflow: hidden;
}

.notification-alert::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.notification-alert:hover::before {
  left: 100%;
}

.notification-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border-left: 4px solid #34d399 !important;
}

.notification-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  border-left: 4px solid #f87171 !important;
}

.notification-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
  border-left: 4px solid #fbbf24 !important;
}

.notification-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border-left: 4px solid #60a5fa !important;
}

.notification-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.notification-icon {
  animation: notification-icon-bounce 2s ease-in-out infinite;
}

@keyframes notification-icon-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

/* Stagger animation for multiple notifications */
.notification-item:nth-child(1) { animation-delay: 0ms; }
.notification-item:nth-child(2) { animation-delay: 150ms; }
.notification-item:nth-child(3) { animation-delay: 300ms; }
.notification-item:nth-child(4) { animation-delay: 450ms; }
.notification-item:nth-child(5) { animation-delay: 600ms; }

/* FAB Menu Animations */
.fab-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fab-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.fab-enter-from {
  transform: scale(0) translateY(20px);
  opacity: 0;
}

.fab-leave-to {
  transform: scale(0) translateY(20px);
  opacity: 0;
}

.fab-item {
  transform-origin: bottom right;
}

/* Enhanced button hover effects */
.group:hover .group-hover\:animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

.group:hover .group-hover\:animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

.group:hover .group-hover\:animate-spin {
  animation: spin 2s linear infinite;
}

/* Progress bar animation */
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--progress-width);
  }
}

/* Floating elements */
.floating {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Pulse effect for important elements */
.pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6);
  }
}

/* Enhanced accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-white\/95 {
    background-color: white !important;
  }

  .dark\:bg-slate-900\/95 {
    background-color: #0f172a !important;
  }

  .border-white\/20 {
    border-color: #000 !important;
  }

  .dark\:border-slate-700\/50 {
    border-color: #fff !important;
  }
}
</style>
