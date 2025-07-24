<template>
  <div class="anime py-8">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-8">Аниме</h1>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="seasons.length === 0" class="text-center py-8">
        <p class="text-gray-500">Нет доступных сезонов</p>
      </div>
      
      <div v-else class="space-y-8">
        <div v-for="season in seasons" :key="season.id" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-2">{{ season.title }}</h2>
          <p class="text-gray-600 mb-2">Год выпуска: {{ season.release_year }}</p>
          <p v-if="season.description" class="text-gray-700 mb-4">{{ season.description }}</p>
          
          <div class="grid gap-3">
            <div 
              v-for="episode in season.episodes" 
              :key="episode.id"
              class="border-l-4 border-purple-500 pl-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <router-link 
                :to="`/anime/episode/${episode.id}`"
                class="text-purple-600 hover:text-purple-800 font-medium"
              >
                Эпизод {{ episode.episode_number }}: {{ episode.title }}
              </router-link>
              <div class="text-sm text-gray-500 mt-1">
                Создано: {{ formatDate(episode.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { animeAPI } from '../services/api'

const seasons = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await animeAPI.getSeasons()
    // Исправлено: берем данные из results
    seasons.value = response.data.results || response.data
  } catch (error) {
    console.error('Ошибка загрузки сезонов:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}
</script>