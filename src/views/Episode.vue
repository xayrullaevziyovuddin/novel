<template>
  <div class="episode py-8">
    <div class="container mx-auto">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="episode" class="max-w-4xl mx-auto">
        <div class="mb-6">
          <router-link to="/anime" class="text-purple-500 hover:text-purple-700">
            ← Назад к аниме
          </router-link>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-8">
          <h1 class="text-3xl font-bold mb-2">{{ episode.title }}</h1>
          <p class="text-xl text-gray-600 mb-6">
            Эпизод {{ episode.episode_number }}
          </p>
          
          <div v-if="episode.description" class="prose max-w-none mb-8">
            <p class="whitespace-pre-line">{{ episode.description }}</p>
          </div>
          
          <div v-if="episode.video_file" class="mt-8">
            <h2 class="text-xl font-semibold mb-4">Видео</h2>
            <video 
              :src="episode.video_file" 
              controls
              class="w-full rounded-lg"
              style="max-height: 500px;"
              @error="console.log('Ошибка загрузки видео:', episode.video_file)"
            >
              Ваш браузер не поддерживает видео тег.
            </video>
          </div>
          <div v-else class="mt-8 text-gray-500">Нет видео файла</div>
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Серия не найдена</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { animeAPI } from '../services/api'

const route = useRoute()
const episode = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await animeAPI.getEpisode(route.params.id)
    episode.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки серии:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.prose {
  font-size: 1.1rem;
  line-height: 1.7;
}
</style>