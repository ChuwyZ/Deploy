import type { User, ExamHistory } from '@/type'
import { defineStore } from 'pinia'

interface UserState {
  user: User | null
  examHistory: ExamHistory[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    examHistory: [],
  }),
  actions: {
    setUser(userData: User | null) {
      this.user = userData
    },
    levelUp(): void {
      if (this.user !== null && this.user.level !== null && this.user.level < 4) {
        this.user.level++
      }
    },
    // อัปเดตประวัติการสอบจาก API ลง Store
    setExamHistory(history: ExamHistory[]) {
      this.examHistory = history
    },
  },
})