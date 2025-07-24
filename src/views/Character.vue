<template>
  <div class="character py-8">
    <div class="container mx-auto">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="character" class="max-w-4xl mx-auto">
        <div class="mb-6">
          <router-link to="/wiki" class="text-blue-500 hover:text-blue-700">
            ← Назад к вики
          </router-link>
        </div>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="md:flex">
            <div class="md:w-1/3">
              <img 
                v-if="character.image" 
                :src="character.image" 
                :alt="character.name"
                class="w-full h-96 object-cover"
                @error="console.log('Ошибка загрузки изображения персонажа:', character.image)"
              >
              <div v-else class="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500">Нет изображения</span>
              </div>
            </div>
            
            <div class="md:w-2/3 p-8">
              <h1 class="text-3xl font-bold mb-2">{{ character.name }}</h1>
              <p v-if="character.alias" class="text-xl text-gray-600 mb-6">
                Псевдоним: {{ character.alias }}
              </p>
              
              <div class="prose max-w-none">
                <h2 class="text-xl font-semibold mb-3">Описание</h2>
                <p class="mb-6 whitespace-pre-line">{{ character.description }}</p>
                
                <h2 class="text-xl font-semibold mb-3">Предыстория</h2>
                <p class="whitespace-pre-line">{{ character.backstory || 'Информация отсутствует' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Персонаж не найден</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { wikiAPI } from '../services/api'

const route = useRoute()
const character = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    // Для получения одного персонажа API может быть другим
    const response = await wikiAPI.getCharacter(route.params.id)
    character.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки персонажа:', error)
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