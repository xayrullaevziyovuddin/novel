<template>
  <div class="audio-player bg-gray-800 text-white rounded-lg p-4">
    <div class="flex items-center space-x-4 flex-wrap">
      <!-- Кнопки управления -->
      <div class="flex items-center space-x-2">
        <button 
          @click="skipBackward"
          class="p-2 rounded-full hover:bg-gray-700 transition-colors"
          title="Назад на 10 секунд"
        >
          ⏪
        </button>
        
        <button 
          @click="togglePlay"
          class="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
          title="Воспроизвести/Пауза"
        >
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        
        <button 
          @click="skipForward"
          class="p-2 rounded-full hover:bg-gray-700 transition-colors"
          title="Вперед на 10 секунд"
        >
          ⏩
        </button>
      </div>
      
      <!-- Прогресс бар -->
      <div class="flex-1 flex items-center space-x-3 min-w-0">
        <span class="text-xs w-12 text-gray-300">{{ formatTime(currentTime) }}</span>
        <div class="flex-1 min-w-0">
          <input 
            type="range" 
            :min="0" 
            :max="duration || 100" 
            :value="currentTime"
            @input="onSeekInput"
            @change="onSeekChange"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            ref="progressRef"
          />
        </div>
        <span class="text-xs w-12 text-gray-300">{{ formatTime(duration) }}</span>
      </div>
      
      <!-- Громкость -->
      <div class="flex items-center space-x-2">
        <span class="text-lg">🔊</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          :value="volume"
          @input="setVolume"
          class="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
    
    <!-- Информация о треке -->
    <div v-if="trackInfo" class="mt-3 text-center">
      <p class="text-sm font-medium truncate">{{ trackInfo }}</p>
    </div>
    
    <audio 
      ref="audioRef"
      :src="audioSrc"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
      @waiting="onWaiting"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  audioSrc: {
    type: String,
    required: true
  },
  trackInfo: {
    type: String,
    default: 'Аудио глава'
  },
  onNext: {
    type: Function,
    default: null
  },
  onPrevious: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['ended'])

const audioRef = ref(null)
const progressRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isSeeking = ref(false)

const togglePlay = () => {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.play().catch(error => {
        console.error('Ошибка воспроизведения:', error)
      })
    }
  }
}

const onPlay = () => {
  isPlaying.value = true
}

const onPause = () => {
  isPlaying.value = false
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration || 0
    audioRef.value.volume = volume.value
    currentTime.value = audioRef.value.currentTime || 0
  }
}

const onTimeUpdate = () => {
  // Обновляем время только если не происходит перемотка
  if (audioRef.value && !isSeeking.value) {
    currentTime.value = audioRef.value.currentTime || 0
  }
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  // Автоматически переходим к следующей главе
  if (props.onNext) {
    props.onNext()
  } else {
    emit('ended')
  }
}

const onError = (e) => {
  console.error('Ошибка аудио:', e)
}

const onWaiting = () => {
  // Во время буферизации можно показать индикатор
}

// Обработчики перемотки
const onSeekInput = (event) => {
  isSeeking.value = true
  currentTime.value = parseFloat(event.target.value)
}

const onSeekChange = (event) => {
  if (audioRef.value) {
    const newTime = parseFloat(event.target.value)
    audioRef.value.currentTime = newTime
    currentTime.value = newTime
  }
  isSeeking.value = false
}

const seek = (event) => {
  onSeekChange(event)
}

const skipForward = () => {
  if (audioRef.value) {
    const newTime = Math.min((audioRef.value.currentTime || 0) + 10, duration.value)
    audioRef.value.currentTime = newTime
    currentTime.value = newTime
  }
}

const skipBackward = () => {
  if (audioRef.value) {
    const newTime = Math.max((audioRef.value.currentTime || 0) - 10, 0)
    audioRef.value.currentTime = newTime
    currentTime.value = newTime
  }
}

const setVolume = (event) => {
  const newVolume = parseFloat(event.target.value)
  volume.value = newVolume
  if (audioRef.value) {
    audioRef.value.volume = newVolume
  }
}

// Горячие клавиши
const handleKeyDown = (e) => {
  if (!audioRef.value) return
  
  switch(e.code) {
    case 'Space':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowRight':
      skipForward()
      break
    case 'ArrowLeft':
      skipBackward()
      break
    case 'ArrowUp':
      setVolume({ target: { value: Math.min(volume.value + 0.1, 1) } })
      break
    case 'ArrowDown':
      setVolume({ target: { value: Math.max(volume.value - 0.1, 0) } })
      break
  }
}

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>