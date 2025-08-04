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
            VIRTUAL BATTLESHIP
          </h1>
          <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 mx-auto mb-4 rounded-full"></div>
          <p class="text-lg text-gray-600 dark:text-gray-100 font-medium max-w-2xl mx-auto transition-colors duration-300">
            Bảng theo dõi để chơi với bạn bè bằng cách đối thoại
          </p>
        </div>
      </header>

      <!-- Main Game Layout -->
      <div class="grid grid-cols-12 gap-6 items-start">

        <!-- Left Sidebar - Ship Controls -->
        <div class="col-span-4 xl:col-span-3">
          <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-4 sticky top-4 flex flex-col min-h-[420px] transition-colors duration-300">

            <!-- Section Header -->
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-600">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span class="text-xl">🚢</span>
              </div>
              <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Đặt Tàu Chiến
              </h3>
            </div>

            <!-- Orientation Toggle -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-100 mb-3 transition-colors duration-300">Hướng Đặt Tàu</label>
              <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl transition-colors duration-300">
                <button
                  :class="[
                    'px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2',
                    isHorizontal
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                      : 'text-gray-600 dark:text-gray-100 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'
                  ]"
                  @click="handleSetHorizontal(true)"
                >
                  <span>➡️</span>
                  <span>Ngang</span>
                </button>
                <button
                  :class="[
                    'px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2',
                    !isHorizontal
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                      : 'text-gray-600 dark:text-gray-100 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'
                  ]"
                  @click="handleSetHorizontal(false)"
                >
                  <span>⬇️</span>
                  <span>Dọc</span>
                </button>
              </div>
            </div>
            
            <!-- Ships List -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-100 mb-3 transition-colors duration-300">Chọn Loại Tàu</label>
              <div class="space-y-2">
                <div
                  v-for="ship in shipTypes"
                  :key="ship.name"
                  :class="[
                    'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                    selectedShipName === ship.name
                      ? 'border-blue-400 shadow-md ring-2 ring-blue-200 dark:ring-blue-400/50'
                      : getPlacedCount(ship) >= ship.count
                        ? 'border-green-300 dark:border-green-600 opacity-75'
                        : 'border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500'
                  ]"
                  :style="{
                    backgroundColor: selectedShipName === ship.name
                      ? (isDarkMode ? 'rgba(30, 58, 138, 0.3)' : '#eff6ff')
                      : getPlacedCount(ship) >= ship.count
                        ? (isDarkMode ? 'rgba(21, 128, 61, 0.3)' : '#f0fdf4')
                        : (isDarkMode ? '#1e293b' : '#ffffff')
                  }"
                  @click="handleShipSelected(ship)"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-sm transition-colors duration-300"
                          :style="{
                            color: selectedShipName === ship.name
                              ? (isDarkMode ? '#93c5fd' : '#1e40af')
                              : (isDarkMode ? '#ffffff' : '#1f2937')
                          }">{{ ship.name }}</span>
                    <span class="text-xs font-bold px-2 py-1 rounded-full transition-colors duration-300"
                          :class="getPlacedCount(ship) >= ship.count
                            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'">
                      {{ getPlacedCount(ship) }}/{{ ship.count }}
                    </span>
                  </div>
                  <div class="flex items-center justify-center gap-1">
                    <div
                      v-for="n in ship.size"
                      :key="n"
                      class="w-3 h-3 rounded-sm transition-all duration-200"
                      :class="getPlacedCount(ship) >= ship.count
                        ? 'bg-green-400 dark:bg-green-500'
                        : selectedShipName === ship.name
                          ? 'bg-blue-400 dark:bg-blue-500'
                          : 'bg-gray-300 dark:bg-slate-600'"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Spacer to match right side height -->
            <div class="flex-1 min-h-[47px]"></div>

          </div>
        </div>

        <!-- Game Boards Area -->
        <div class="col-span-8 xl:col-span-9">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[500px]">
            
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
                    ref="myBoard"
                    board-type="my"
                    :grid-size="gridSize"
                    :selected-ship-size="selectedShipSize"
                    :is-horizontal="isHorizontal"
                    :placed-ships="placedShips"
                    @cell-click="handleCellClick"
                    @cell-hover="handleCellHover"
                    @cell-leave="handleCellLeave"
                  />
                </div>
              </div>
            </div>
            
            <!-- Opponent Board -->
            <div class="flex flex-col h-full">
              <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 h-full flex flex-col transition-colors duration-300">
                <div class="flex items-center justify-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-lg">🎯</span>
                  </div>
                  <h2 class="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
                    Bảng Đối Thủ
                  </h2>
                </div>
                <div class="flex justify-center items-center flex-1">
                  <GameBoard
                    ref="opponentBoard"
                    board-type="opponent"
                    :grid-size="gridSize"
                    @cell-click="handleCellClick"
                    @cell-hover="handleCellHover"
                    @cell-leave="handleCellLeave"
                  />
                </div>
              </div>
            </div>

          </div>

          <!-- Action Buttons Section -->
          <div class="mt-8">
            <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300">
              <div class="flex items-center justify-center gap-3 mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-xl">⚙️</span>
                </div>
                <h3 class="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Điều Khiển Trò Chơi
                </h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                  @click="autoPlaceShips"
                >
                  <span class="text-xl group-hover:animate-pulse">⚡</span>
                  <span class="text-lg">Tự Động Đặt Tàu</span>
                </button>

                <button
                  class="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                  @click="handleClearShips"
                >
                  <span class="text-xl group-hover:animate-bounce">🗑️</span>
                  <span class="text-lg">Xóa Tất Cả Tàu</span>
                </button>

                <button
                  class="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                  @click="resetGame"
                >
                  <span class="text-xl group-hover:animate-spin">🔄</span>
                  <span class="text-lg">Chơi Lại</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information and Guide Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
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
            <div
              v-for="(item, index) in enhancedLegendItems"
              :key="item.label"
              class="legend-item flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl hover:from-white hover:to-gray-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="legend-icon-wrapper relative">
                <div
                  class="w-8 h-8 rounded-xl border-3 border-white dark:border-gray-300 shadow-lg transition-all duration-300 hover:scale-110"
                  :style="{ backgroundColor: item.color }"
                ></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg">{{ item.icon }}</span>
                </div>
              </div>
              <div class="flex-1">
                <span class="font-semibold text-gray-800 dark:text-gray-100 text-base transition-colors duration-300">{{ item.label }}</span>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">{{ item.description }}</p>
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="hotkey-section">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span class="text-white text-xs">🚢</span>
                </div>
                <h4 class="font-bold text-gray-800 dark:text-gray-100 text-base uppercase tracking-wide transition-colors duration-300">Điều Khiển Tàu</h4>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(shortcut, index) in shipShortcuts"
                  :key="shortcut.key"
                  class="hotkey-item flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/60 dark:to-slate-700/60 rounded-xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-slate-700/80 dark:hover:to-slate-600/80 transition-all duration-300 transform hover:scale-105 border border-blue-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-slate-500"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <kbd class="hotkey-badge px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 min-w-[60px] text-center">
                    {{ shortcut.key }}
                  </kbd>
                  <div class="flex-1">
                    <span class="font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">{{ shortcut.action }}</span>
                    <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">{{ shortcut.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="hotkey-section">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span class="text-white text-xs">🎯</span>
                </div>
                <h4 class="font-bold text-gray-800 dark:text-gray-100 text-base uppercase tracking-wide transition-colors duration-300">Bắn Đối Thủ</h4>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(shortcut, index) in attackShortcuts"
                  :key="shortcut.key"
                  class="hotkey-item flex items-center gap-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-slate-800/60 dark:to-slate-700/60 rounded-xl hover:from-red-100 hover:to-pink-100 dark:hover:from-slate-700/80 dark:hover:to-slate-600/80 transition-all duration-300 transform hover:scale-105 border border-red-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-slate-500"
                  :style="{ animationDelay: `${(index + 3) * 100}ms` }"
                >
                  <kbd class="hotkey-badge px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 min-w-[60px] text-center">
                    {{ shortcut.key }}
                  </kbd>
                  <div class="flex-1">
                    <span class="font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">{{ shortcut.action }}</span>
                    <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">{{ shortcut.description }}</p>
                  </div>
                </div>
              </div>
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
          <v-alert
            :type="notification.type"
            :color="notification.color"
            :icon="getIconForType(notification.type)"
            closable
            :model-value="true"
            @update:modelValue="removeNotification(notification.id)"
            class="shadow-xl backdrop-blur-md border border-white/20 rounded-xl overflow-hidden"
            :class="getNotificationClasses(notification.type)"
          >
            <div class="flex items-center gap-3">
              <div class="notification-icon-wrapper">
                <span class="notification-icon text-lg">{{ getEmojiForType(notification.type) }}</span>
              </div>
              <div class="flex-1">
                <span class="font-medium">{{ notification.text }}</span>
              </div>
            </div>
          </v-alert>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import GameBoard from '../components/GameBoard.vue'
import { VAlert } from 'vuetify/components'

export default {
  name: 'GamePage',
  components: {
    GameBoard,
    VAlert
  },
  data() {
    return {
      gridSize: 10,
      hoveredCell: null,
      selectedShipSize: null,
      selectedShipName: '',
      isHorizontal: true,
      placedShips: [],
      isDarkMode: false,
      shipTypes: [
        { name: 'Tàu Sân Bay', size: 5, count: 1 },
        { name: 'Thiết Giáp Hạm', size: 4, count: 1 },
        { name: 'Tàu Tuần Dương', size: 3, count: 2 },
        { name: 'Tàu Ngầm', size: 3, count: 1 },
        { name: 'Tàu Khu Trục', size: 2, count: 1 }
      ],
      legendItems: [
        { label: 'Tàu chiến', color: 'var(--primary-500)' },
        { label: 'Trúng', color: '#e11d48' },
        { label: 'Bắn trượt', color: 'var(--neutral-400)' }
      ],
      enhancedLegendItems: [
        {
          label: 'Tàu Chiến',
          color: '#3b82f6',
          icon: '⚓',
          description: 'Vị trí đặt tàu của bạn'
        },
        {
          label: 'Tàu Bị Trúng',
          color: '#f59e0b',
          icon: '🔥',
          description: 'Tàu của bạn bị đối thủ bắn trúng'
        },
        {
          label: 'Bắn Trúng',
          color: '#ef4444',
          icon: '💥',
          description: 'Bạn bắn trúng tàu đối thủ'
        },
        {
          label: 'Bắn Trượt',
          color: '#6b7280',
          icon: '💧',
          description: 'Bắn trượt, không có tàu'
        }
      ],
      shipShortcuts: [
        {
          key: 'R',
          action: 'Xoay Tàu',
          description: 'Chuyển đổi hướng ngang/dọc'
        },
        {
          key: 'Space',
          action: 'Đặt Tàu',
          description: 'Đặt tàu đã chọn vào vị trí'
        },
        {
          key: 'Del',
          action: 'Xóa Tàu',
          description: 'Xóa tàu tại vị trí hiện tại'
        }
      ],
      attackShortcuts: [
        {
          key: 'H',
          action: 'Đánh Dấu Trúng',
          description: 'Đánh dấu bắn trúng tàu đối thủ'
        },
        {
          key: 'M',
          action: 'Đánh Dấu Trượt',
          description: 'Đánh dấu bắn trượt'
        },
        {
          key: 'C',
          action: 'Xóa Đánh Dấu',
          description: 'Xóa tất cả đánh dấu'
        }
      ],
      notifications: []
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyPress)

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
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    showMessage(text, color = 'info', timeout = 3000) {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        text,
        color,
        type: color,
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
    getIconForType(type) {
      switch (type) {
        case 'success': return 'mdi-check-circle'
        case 'error': return 'mdi-alert-circle'
        case 'warning': return 'mdi-alert'
        case 'info':
        default: return 'mdi-information'
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
    handleShipSelected(ship) {
      this.selectedShipSize = ship.size
      this.selectedShipName = ship.name
    },
    
    handleRotateShip() {
      this.isHorizontal = !this.isHorizontal
      this.showMessage(
        `Đã xoay thành ${this.isHorizontal ? 'ngang' : 'dọc'}!`, 
        'info', 
        2000
      )
    },
    
    handleSetHorizontal(value) {
      this.isHorizontal = value
      this.showMessage(
        `Đã chuyển thành ${value ? 'ngang' : 'dọc'}!`, 
        'info', 
        2000
      )
    },
    
    handleClearShips() {
      this.placedShips = []
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.$refs.myBoard.resetBoard()
      this.showMessage('Đã xóa tất cả tàu!', 'info', 2000)
    },
    
    handleCellClick({ cell, boardType }) {
      if (boardType === 'my') {
        this.handleMyBoardClick(cell)
      } else {
        this.handleOpponentBoardClick(cell)
      }
    },
    
    handleMyBoardClick(cell) {
      // Ship placement mode
      if (this.selectedShipSize) {
        if (this.canPlaceShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal)) {
          this.placeShip(cell.row, cell.col, this.selectedShipSize, this.isHorizontal, this.selectedShipName)
        } else {
          this.showMessage('Không thể đặt tàu ở vị trí này!', 'warning', 2000)
        }
        return
      }

      // Regular click behavior for manual cell editing - 4-state cycle
      if (cell.ship) {
        if (cell.hit) {
          // Ship + Hit -> Miss
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'miss')
          this.showMessage('Đã đánh dấu: Bắn trượt', 'info', 2000)
        } else {
          // Ship -> Ship + Hit
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'my_ship_hit')
          this.showMessage('Đã đánh dấu: Tàu bị trúng', 'warning', 2000)
        }
      } else {
        if (cell.miss) {
          // Miss -> Clear
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'clear')
          this.showMessage('Đã xóa đánh dấu', 'info', 2000)
        } else if (cell.hit) {
          // Hit -> Miss
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'miss')
          this.showMessage('Đã đánh dấu: Bắn trượt', 'info', 2000)
        } else {
          // Clear -> Ship
          this.$refs.myBoard.setCellState(cell.row, cell.col, 'ship')
          this.showMessage('Đã đặt tàu thủ công!', 'success', 2000)
        }
      }
    },
    
    handleOpponentBoardClick(cell) {
      // Cycle through states: blank -> hit -> miss -> blank (3-state cycle)
      if (cell.hit) {
        // Hit -> Miss
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'miss')
        this.showMessage('Đã đánh dấu: Bắn trượt', 'info', 2000)
      } else if (cell.miss) {
        // Miss -> Clear (blank)
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'clear')
        this.showMessage('Đã xóa đánh dấu', 'info', 2000)
      } else {
        // Blank -> Hit
        this.$refs.opponentBoard.setCellState(cell.row, cell.col, 'hit')
        this.showMessage('Đã đánh dấu: Bắn trúng!', 'success', 2000)
      }
    },
    
    handleCellHover({ cell, boardType }) {
      this.hoveredCell = { ...cell, boardType }
    },
    
    handleCellLeave({ cell }) {
      if (this.hoveredCell && this.hoveredCell.row === cell.row && this.hoveredCell.col === cell.col) {
        this.hoveredCell = null
      }
    },
    
    handleKeyPress(event) {
      if (!this.hoveredCell) return

      const key = event.key.toLowerCase()
      const boardType = this.hoveredCell.boardType || 'my'

      // Handle rotation
      if (key === 'r' && boardType === 'my') {
        this.handleRotateShip()
        return
      }
      
      if (boardType === 'my') {
        // My board controls
        switch (key) {
          case ' ':
            if (this.selectedShipSize) {
              this.handleMyBoardClick(this.hoveredCell)
            }
            break
          case 'delete':
          case 'backspace':
            this.removeShip(this.hoveredCell)
            break
        }
      } else {
        // Opponent board controls
        switch (key) {
          case 'h':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'hit')
            this.showMessage('Đã đánh dấu: Bắn trúng!', 'success', 2000)
            break
          case 'm':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'miss')
            this.showMessage('Đã đánh dấu: Bắn trượt', 'info', 2000)
            break
          case 'c':
            this.$refs.opponentBoard.setCellState(this.hoveredCell.row, this.hoveredCell.col, 'clear')
            this.showMessage('Đã xóa đánh dấu', 'info', 2000)
            break
        }
      }
    },
    
    getPlacedCount(shipType) {
      return this.placedShips.filter(ship => ship.name === shipType.name).length
    },
    
    canPlaceShip(row, col, size, isHorizontal) {
      return this.$refs.myBoard.canPlaceShip(row, col, size, isHorizontal)
    },
    
    placeShip(row, col, size, isHorizontal, name) {
      // Check if we can place more ships of this type
      const currentCount = this.placedShips.filter(ship => ship.name === name).length
      const shipType = this.shipTypes.find(type => type.name === name)
      
      if (currentCount >= shipType.count) {
        this.showMessage(`Đã đặt đủ ${name}! (${shipType.count}/${shipType.count})`, 'warning', 2000)
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
        const cellRow = isHorizontal ? row : row + i
        const cellCol = isHorizontal ? col + i : col
        this.$refs.myBoard.setCellState(cellRow, cellCol, 'ship')
      }
      
      this.showMessage(`Đã đặt ${name}!`, 'success', 2000)
      
      // Clear selection if we've placed the maximum number of this ship type
      if (currentCount + 1 >= shipType.count) {
        this.selectedShipSize = null
        this.selectedShipName = ''
      }
    },
    
    removeShip(cell) {
      // Find and remove the ship that contains this cell
      const shipIndex = this.placedShips.findIndex(ship => {
        for (let i = 0; i < ship.size; i++) {
          const shipRow = ship.isHorizontal ? ship.row : ship.row + i
          const shipCol = ship.isHorizontal ? ship.col + i : ship.col
          if (shipRow === cell.row && shipCol === cell.col) {
            return true
          }
        }
        return false
      })
      
      if (shipIndex > -1) {
        const removedShip = this.placedShips[shipIndex]
        this.placedShips.splice(shipIndex, 1)
        
        // Clear ship cells on board
        for (let i = 0; i < removedShip.size; i++) {
          const cellRow = removedShip.isHorizontal ? removedShip.row : removedShip.row + i
          const cellCol = removedShip.isHorizontal ? removedShip.col + i : removedShip.col
          this.$refs.myBoard.setCellState(cellRow, cellCol, 'clear')
        }
        
        this.showMessage(`Đã xóa ${removedShip.name}!`, 'info', 2000)
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
          while (!placed && attempts < maxAttempts) {
            attempts++
            const row = Math.floor(Math.random() * this.gridSize) + 1
            const col = Math.floor(Math.random() * this.gridSize) + 1
            const isHorizontal = Math.random() < 0.5
            
            if (this.canPlaceShip(row, col, shipType.size, isHorizontal)) {
              this.placeShip(row, col, shipType.size, isHorizontal, shipType.name)
              placed = true
            }
          }
          
          if (!placed) {
            this.showMessage('Không thể đặt tự động tất cả tàu!', 'error', 3000)
            return
          }
        }
      }
      
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.showMessage('Đã đặt tàu tự động thành công!', 'success')
    },
    
    resetGame() {
      this.placedShips = []
      this.selectedShipSize = null
      this.selectedShipName = ''
      this.isHorizontal = true

      this.$refs.myBoard.resetBoard()
      this.$refs.opponentBoard.resetBoard()

      this.showMessage('Game đã được reset!', 'info', 2000)
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

.controls-sidebar {
  animation: slideInLeft 0.6s ease-out 0.1s both;
}

.game-area {
  animation: slideInRight 0.6s ease-out 0.2s both;
}

/* Pulse animation for selected ships */
.ship-item-compact.selected {
  animation: pulse 2s infinite;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Enhanced focus styles for accessibility */
button:focus,
.cursor-pointer:focus {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
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

  .grid.grid-cols-1.sm\:grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
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

/* Custom button hover effects */
.bg-gradient-to-r:hover {
  filter: brightness(1.1) saturate(1.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: transform, box-shadow, filter;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
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

/* Stagger animation for multiple notifications */
.notification-item:nth-child(1) { animation-delay: 0ms; }
.notification-item:nth-child(2) { animation-delay: 150ms; }
.notification-item:nth-child(3) { animation-delay: 300ms; }
.notification-item:nth-child(4) { animation-delay: 450ms; }
.notification-item:nth-child(5) { animation-delay: 600ms; }

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

/* Responsive improvements for legend and hotkeys */
@media (max-width: 768px) {
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
</style>
