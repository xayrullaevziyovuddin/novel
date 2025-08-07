<template>
  <div class="chapter py-8">
    <div class="container mx-auto">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="error" class="text-center py-8 text-red-500">
        <p>Произошла ошибка при загрузке главы:</p>
        <p class="mt-2 text-sm text-gray-400">{{ error.message }}</p>
      </div>

      <div v-else-if="chapter" class="max-w-4xl mx-auto">
        <div class="mb-6">
          <router-link 
            v-if="currentVolume" 
            :to="`/novel`" 
            class="text-blue-500 hover:text-blue-700"
          >
            ← Назад к "{{ currentVolume.title }}"
          </router-link>
        </div>
        
        <article class="bg-white rounded-lg shadow-md p-8">
          <!-- Навигация между главами -->
          <div class="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
            <button 
              v-if="previousChapter"
              @click="goToPreviousChapter"
              class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← {{ previousChapter.title }}
            </button>
            <div v-else></div>
            
            <div class="text-center">
              <h2 class="text-xl font-bold">{{ chapter.title }}</h2>
              <p v-if="currentVolume" class="text-sm text-gray-600">{{ currentVolume.title }}</p>
            </div>
            
            <button 
              v-if="nextChapter"
              @click="goToNextChapter"
              class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              {{ nextChapter.title }} →
            </button>
            <div v-else></div>
          </div>
          
          <div v-if="chapter.illustration" class="mb-6 text-center">
            <img 
              :src="chapter.illustration" 
              :alt="chapter.title"
              class="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
              @error="console.log('Ошибка загрузки изображения:', chapter.illustration)"
            >
          </div>
          
          <div v-if="chapter.content" class="prose max-w-none mb-8">
            <div class="reading-content leading-relaxed text-gray-800">
              <p class="whitespace-pre-line">{{ chapter.content }}</p>
            </div>
          </div>
          
          <div v-if="chapter.audio_file" class="mt-8">
            <h2 class="text-xl font-semibold mb-4">Аудиоверсия</h2>
            <AudioPlayer 
              :audio-src="chapter.audio_file"
              :track-info="`${chapter.title} - ${currentVolume ? currentVolume.title : ''}`"
              :on-next="nextChapter ? goToNextChapter : null"
              :on-previous="previousChapter ? goToPreviousChapter : null"
              @ended="handleAudioEnded"
            />
          </div>
        </article>
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Глава не найдена</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { novelAPI } from '../services/api'
import AudioPlayer from '../components/AudioPlayer.vue'

const route = useRoute()
const router = useRouter()
const chapter = ref(null)
const currentVolume = ref(null)
const allChapters = ref([])
const loading = ref(true)
const error = ref(null)

// Вычисляемые свойства для навигации
const currentChapterIndex = computed(() => {
  if (!allChapters.value.length || !chapter.value) return -1
  return allChapters.value.findIndex(ch => ch.id === chapter.value.id)
})

const nextChapter = computed(() => {
  const index = currentChapterIndex.value
  if (index === -1 || index >= allChapters.value.length - 1) return null
  return allChapters.value[index + 1]
})

const previousChapter = computed(() => {
  const index = currentChapterIndex.value
  if (index <= 0) return null
  return allChapters.value[index - 1]
})

const goToNextChapter = () => {
  if (nextChapter.value) {
    router.push(`/novel/chapter/${nextChapter.value.id}`)
  }
}

const goToPreviousChapter = () => {
  if (previousChapter.value) {
    router.push(`/novel/chapter/${previousChapter.value.id}`)
  }
}

const handleAudioEnded = () => {
  // Автоматический переход к следующей главе
  setTimeout(() => {
    if (nextChapter.value) {
      goToNextChapter()
    }
  }, 1000) // Небольшая задержка для лучшего UX
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const chapterId = parseInt(route.params.id)
    
    // Загружаем главу и все тома параллельно
    const [chapterResponse, volumesResponse] = await Promise.all([
      novelAPI.getChapter(chapterId),
      novelAPI.getVolumes()
    ])

    chapter.value = chapterResponse.data
    const volumes = volumesResponse.data.results || volumesResponse.data
    
    // Находим том и список глав для текущей главы
    for (const volume of volumes) {
      if (volume.chapters.some(ch => ch.id === chapterId)) {
        currentVolume.value = volume
        // Сортируем главы по порядку, если они не отсортированы
        allChapters.value = [...volume.chapters].sort((a, b) => a.id - b.id)
        break
      }
    }

    if (!currentVolume.value) {
      console.warn("Том для главы не найден. Навигация может быть неполной.")
      // Можно попытаться загрузить все главы как запасной вариант, если это необходимо
    }
    
  } catch (err) {
    console.error('Ошибка загрузки главы:', err)
    error.value = err
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.reading-content {
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
}

.prose {
  font-size: 1.1rem;
  line-height: 1.7;
}
</style>