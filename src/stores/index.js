import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  
  actions: {
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
    },
    
    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
    
    setUser(user) {
      this.user = user
    }
  }
})

export const useNovelStore = defineStore('novel', {
  state: () => ({
    volumes: [],
    currentVolume: null,
    chapters: [],
    currentChapter: null,
  }),
  
  actions: {
    setVolumes(volumes) {
      this.volumes = volumes
    },
    
    setCurrentVolume(volume) {
      this.currentVolume = volume
    },
    
    setChapters(chapters) {
      this.chapters = chapters
    },
    
    setCurrentChapter(chapter) {
      this.currentChapter = chapter
    }
  }
})

export const useWikiStore = defineStore('wiki', {
  state: () => ({
    characters: [],
    currentCharacter: null,
  }),
  
  actions: {
    setCharacters(characters) {
      this.characters = characters
    },
    
    setCurrentCharacter(character) {
      this.currentCharacter = character
    }
  }
})