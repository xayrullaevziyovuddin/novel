<template>
  <div class="character-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img 
      v-if="character.image" 
      :src="character.image" 
      :alt="character.name"
      class="w-full h-48 object-cover"
      @error="console.log('Ошибка загрузки изображения персонажа:', character.image)"
    >
    <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
      <span class="text-gray-500">Нет изображения</span>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">{{ character.name }}</h3>
      <p v-if="character.alias" class="text-sm text-gray-600 mb-2">
        Псевдоним: {{ character.alias }}
      </p>
      <p class="text-sm text-gray-700 line-clamp-3">
        {{ character.description }}
      </p>
      <router-link 
        :to="`/wiki/character/${character.id}`"
        class="mt-3 inline-block text-blue-500 hover:text-blue-700 text-sm font-medium"
      >
        Подробнее →
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  character: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>