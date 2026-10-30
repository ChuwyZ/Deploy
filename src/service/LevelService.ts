import apiClient from './AxiosClient'

export default {
  getLevels() {
    return apiClient.get('/api/admin/levels')
  },
  getLevel(id: number) {
    return apiClient.get('/api/admin/levels/' + id)
  },
  updateLevel(id: number, level: any) {
    return apiClient.put('/api/admin/levels/' + id, level)
  },
  getBenefits(levelId: number) {
    return apiClient.get('/api/admin/benefits/level/' + levelId)
  },
  getServices(levelId: number) {
    return apiClient.get('/api/admin/services/level/' + levelId)
  },
  getElearning(levelId: number) {
    return apiClient.get('/api/admin/elearning/level/' + levelId)
  },
  // user side: backend decides the level from the JWT, so a user can only read their own level's content
  getMyBenefits() {
    return apiClient.get('/api/user/benefits')
  },
  getMyServices() {
    return apiClient.get('/api/user/services')
  },
  getMyElearning() {
    return apiClient.get('/api/user/elearning')
  },
  getQuestions(levelId: number) {
    return apiClient.get('/api/admin/questions?level=' + levelId)
  },
  //Benefit
  addBenefit(benefit: any) {
    return apiClient.post('/api/admin/benefits', benefit)
  },
  updateBenefit(id: number, benefit: any) {
    return apiClient.put('/api/admin/benefits/' + id, benefit)
  },
  deleteBenefit(id: number) {
    return apiClient.delete('/api/admin/benefits/' + id)
  },
  //Service
  addService(service: any) {
    return apiClient.post('/api/admin/services', service)
  },
  updateService(id: number, service: any) {
    return apiClient.put('/api/admin/services/' + id, service)
  },
  deleteService(id: number) {
    return apiClient.delete('/api/admin/services/' + id)
  },
  //eLearning
  addElearning(content: any) {
    return apiClient.post('/api/admin/elearning', content)
  },
  updateElearning(id: number, content: any) {
    return apiClient.put('/api/admin/elearning/' + id, content)
  },
  deleteElearning(id: number) {
    return apiClient.delete('/api/admin/elearning/' + id)
  },
}
