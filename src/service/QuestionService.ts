import apiClient from './AxiosClient'

export default {
  getQuestionsByLevel(levelId: number) {
    return apiClient.get('/api/admin/questions?level=' + levelId)
  },
  addQuestion(question: any) {
    return apiClient.post('/api/admin/questions', question)
  },
  updateQuestion(id: number, question: any) {
    return apiClient.put('/api/admin/questions/' + id, question)
  },
  deleteQuestion(id: number) {
    return apiClient.delete('/api/admin/questions/' + id)
  },
}