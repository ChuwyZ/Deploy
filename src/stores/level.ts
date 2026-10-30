import type { Level, Question, Benefit, Service, Elearning } from '@/type'
import { defineStore } from 'pinia'
interface LevelState {
  level: Level | null
  questions: Question[]
  benefits: Benefit[]
  services: Service[]
  elearning: Elearning[]
}
export const useLevelStore = defineStore('level', {
  state: (): LevelState => ({
    level: null,
    questions: [],
    benefits: [],
    services: [],
    elearning: [],
  }),
  actions: {
    setLevel(levelData: Level | null) {
      this.level = levelData
    },
   },
})