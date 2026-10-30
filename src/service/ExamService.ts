import apiClient from './AxiosClient'

export default {
  takeExam(levelId: number) {
    return apiClient.get('/api/exams/take?levelId=' + levelId)
  },
  submitExam(request: any) {
    return apiClient.post('/api/exams/submit', request)
  },
}