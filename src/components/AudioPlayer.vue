<template>
  <div class="audio-player bg-gray-900 text-white rounded-lg p-4 shadow-lg">
    <div class="flex items-center">
      <!-- Track Info -->
      <div class="flex-1 min-w-0 mr-4">
        <p v-if="trackInfo" class="text-base font-semibold truncate">{{ trackInfo }}</p>
      </div>

      <!-- Player Controls -->
      <div class="flex items-center space-x-2">
        <button @click="skipBackward" class="control-button" title="Назад на 10 секунд">⏪</button>
        <button @click="togglePlay" class="control-button play-button" title="Воспроизвести/Пауза">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button @click="skipForward" class="control-button" title="Вперед на 10 секунд">⏩</button>
      </div>

      <!-- Progress Bar -->
      <div class="flex-1 flex items-center space-x-3 min-w-0 ml-4">
        <span class="time-display">{{ formatTime(currentTime) }}</span>
        <div class="progress-container">
          <input 
            type="range" 
            :min="0" 
            :max="duration || 100" 
            :value="currentTime"
            @input="onSeek"
            class="progress-bar"
            ref="progressRef"
            :style="progressStyle"
          />
        </div>
        <span class="time-display">{{ formatTime(duration) }}</span>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-2 ml-4">
        <span class="text-lg">🔊</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          :value="volume"
          @input="setVolume"
          class="volume-slider"
        />
      </div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'

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
  if (audioRef.value) {
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

// Обработчик перемотки
const onSeek = (event) => {
  if (audioRef.value) {
    const newTime = parseFloat(event.target.value)
    audioRef.value.currentTime = newTime
    currentTime.value = newTime
  }
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

const progressStyle = computed(() => {
  const progress = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  return {
    background: `linear-gradient(to right, #4f46e5 ${progress}%, #4b5563 ${progress}%)`
  }
})
</script>

<style scoped>
.control-button {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  line-height: 1;
}
.control-button:hover {
  background-color: #374151;
}
.play-button {
  font-size: 2rem;
}
.time-display {
  font-size: 0.875rem;
  color: #9ca3af;
  min-width: 45px;
  text-align: center;
}
.progress-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  height: 20px;
}
.progress-bar {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  outline: none;
  transition: opacity 0.2s;
  cursor: pointer;
}
.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #c7d2fe;
  cursor: pointer;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
}
.progress-bar:hover::-webkit-slider-thumb {
  transform: scale(1.1);
}
.progress-bar::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #c7d2fe;
  cursor: pointer;
  border: none;
}
.progress-bar:hover::-moz-range-thumb {
  transform: scale(1.1);
}
.volume-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 80px;
  height: 6px;
  border-radius: 3px;
  background: #4b5563;
  outline: none;
  cursor: pointer;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #c7d2fe;
  cursor: pointer;
}
.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #c7d2fe;
  cursor: pointer;
  border: none;
}
</style>