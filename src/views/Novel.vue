<template>
  <div class="novel py-8">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-8">Ранобэ</h1>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="volumes.length === 0" class="text-center py-8">
        <p class="text-gray-500">Нет доступных томов</p>
      </div>
      
      <div v-else class="space-y-8">
        <div v-for="volume in volumes" :key="volume.id" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">{{ volume.title }}</h2>
          <p v-if="volume.description" class="text-gray-600 mb-4">{{ volume.description }}</p>
          
          <div class="grid gap-4">
            <div 
              v-for="(chapter, index) in volume.chapters" 
              :key="chapter.id"
              class="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <!-- Отладочная информация -->
              <div class="text-xs text-gray-400 mb-1 flex justify-between">
                <span>Глава {{ index + 1 }}</span>
                <span>Audio: {{ chapter.audio_file ? 'есть' : 'нет' }} | Img: {{ chapter.illustration ? 'есть' : 'нет' }}</span>
              </div>
              
              <router-link 
                :to="`/novel/chapter/${chapter.id}`"
                class="text-blue-600 hover:text-blue-800 font-medium block"
              >
                {{ chapter.title }}
              </router-link>
              <div class="text-sm text-gray-500 mt-1">
                Создано: {{ formatDate(chapter.created_at) }}
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
import { novelAPI } from '../services/api'

const volumes = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await novelAPI.getVolumes()
    console.log('Volumes ', response.data)
    // Исправлено: берем данные из results
    volumes.value = response.data.results || response.data
  } catch (error) {
    console.error('Ошибка загрузки томов:', error)
    console.error('Error response:', error.response)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}
</script>