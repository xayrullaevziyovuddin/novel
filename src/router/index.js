import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Novel from '../views/Novel.vue'
import Chapter from '../views/Chapter.vue'
import Anime from '../views/Anime.vue'
import Episode from '../views/Episode.vue'
import Wiki from '../views/Wiki.vue'
import Character from '../views/Character.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/novel',
    name: 'Novel',
    component: Novel
  },
  {
    path: '/novel/chapter/:id',
    name: 'Chapter',
    component: Chapter,
    props: true
  },
  {
    path: '/anime',
    name: 'Anime',
    component: Anime
  },
  {
    path: '/anime/episode/:id',
    name: 'Episode',
    component: Episode,
    props: true
  },
  {
    path: '/wiki',
    name: 'Wiki',
    component: Wiki
  },
  {
    path: '/wiki/character/:id',
    name: 'Character',
    component: Character,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router