<template>
  <div class="home">
    <div class="hero bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold mb-4">Ренкорнация Безработного</h1>
        <p class="text-xl mb-8">Погрузитесь в мир ранобэ и аниме</p>
        <div class="space-x-4">
          <router-link 
            to="/novel" 
            class="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Читать ранобэ
          </router-link>
          <router-link 
            to="/anime" 
            class="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
          >
            Смотреть аниме
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="features py-16">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Что мы предлагаем</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="text-4xl mb-4">📚</div>
            <h3 class="text-xl font-semibold mb-2">Ранобэ</h3>
            <p class="text-gray-600">Полный текст ранобэ с иллюстрациями и аудиоверсиями</p>
          </div>
          <div class="text-center p-6">
            <div class="text-4xl mb-4">📺</div>
            <h3 class="text-xl font-semibold mb-2">Аниме</h3>
            <p class="text-gray-600">Смотрите любимые серии с удобным плеером</p>
          </div>
          <div class="text-center p-6">
            <div class="text-4xl mb-4">📖</div>
            <h3 class="text-xl font-semibold mb-2">Википедия</h3>
            <p class="text-gray-600">Подробная информация о персонажах и мире</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>