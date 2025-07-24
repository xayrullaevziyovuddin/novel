import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Функция для форматирования URL медиа файлов (на случай если понадобится)
export const getMediaUrl = (relativeUrl) => {
  if (!relativeUrl) return null
  // Если URL уже абсолютный, возвращаем как есть
  if (relativeUrl.startsWith('http')) {
    return relativeUrl
  }
  // Иначе добавляем базовый URL Django
  return `http://localhost:8000${relativeUrl}`
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API методы
export const novelAPI = {
  getVolumes: () => api.get('/volumes/'),
  getVolume: (id) => api.get(`/volumes/${id}/`),
  getChapters: () => api.get('/chapters/'),
  getChapter: (id) => api.get(`/chapters/${id}/`),
}

export const wikiAPI = {
  getCharacters: () => api.get('/characters/'),
  getCharacter: (id) => api.get(`/characters/${id}/`),
}

export const animeAPI = {
  getSeasons: () => api.get('/anime-seasons/'),
  getEpisodes: () => api.get('/episodes/'),
  getEpisode: (id) => api.get(`/episodes/${id}/`),
}

export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  refresh: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
}

export default api