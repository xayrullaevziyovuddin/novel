<template>
  <footer class="bg-gray-800 text-white py-8 mt-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">Ренкорнация Безработного</h3>
          <p class="text-gray-300">
            Сайт посвящен ранобэ и аниме "Ренкорнация безработного"
          </p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Навигация</h4>
          <ul class="space-y-2">
            <li><router-link to="/" class="text-gray-300 hover:text-white">Главная</router-link></li>
            <li><router-link to="/novel" class="text-gray-300 hover:text-white">Ранобэ</router-link></li>
            <li><router-link to="/anime" class="text-gray-300 hover:text-white">Аниме</router-link></li>
            <li><router-link to="/wiki" class="text-gray-300 hover:text-white">Вики</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Контакты</h4>
          <p class="text-gray-300">
            Email: admin@example.com
          </p>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
        <p>&copy; 2024 Ренкорнация Безработного. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
</style>