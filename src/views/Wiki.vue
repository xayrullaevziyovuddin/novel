<template>
  <div class="wiki py-8">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-8">Википедия персонажей</h1>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="characters.length === 0" class="text-center py-8">
        <p class="text-gray-500">Нет персонажей</p>
      </div>
      
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CharacterCard 
          v-for="character in characters" 
          :key="character.id"
          :character="character"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { wikiAPI } from '../services/api'
import CharacterCard from '../components/CharacterCard.vue'

const characters = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await wikiAPI.getCharacters()
    // Исправлено: берем данные из results
    characters.value = response.data.results || response.data
  } catch (error) {
    console.error('Ошибка загрузки персонажей:', error)
  } finally {
    loading.value = false
  }
})
</script>