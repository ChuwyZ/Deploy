import apiClient from './AxiosClient'
import { getImageUrl } from './ImageService'
import type { User, UserApi, UpdateUserForm, UserFilter } from '@/type'

const PLACEHOLDER = 'https://placehold.co/150/007BFF/FFF?text='

/** backend UserDTO -> the `User` shape the views already use */
async function toUser(dto: UserApi): Promise<User> {
  const isAdmin = dto.roles?.includes('ROLE_ADMIN') ?? false
  let image = ''
  try {
    image = await getImageUrl(dto.profileImage)
  } catch {
    image = ''
  }
  return {
    id: dto.id,
    username: dto.username,
    name: dto.firstname,
    surname: dto.lastname,
    email: dto.email,
    province: dto.province,
    level: isAdmin ? null : (dto.level?.levelNumber ?? null),
    isActive: dto.enabled,
    profileImage: [image || PLACEHOLDER + encodeURIComponent(dto.firstname?.[0] ?? '?')],
    profileImageKey: dto.profileImage ?? undefined,
  }
}

export default {
  // ---------------- admin ----------------
  async getUsers(perPage: number, page: number, filter: UserFilter = {}) {
    const res = await apiClient.get<UserApi[]>('/api/admin/users', {
      params: {
        _limit: perPage,
        _page: page,
        firstname: filter.firstname || undefined,
        lastname: filter.lastname || undefined,
        province: filter.province || undefined,
        level: filter.level || undefined,
      },
    })
    const data = await Promise.all(res.data.map(toUser))
    return { data, headers: { 'x-total-count': String(res.headers['x-total-count'] ?? '0') } }
  },
  async getUser(id: number) {
    const res = await apiClient.get<UserApi>('/api/admin/users/' + id)
    return { data: await toUser(res.data) }
  },
  async updateUser(id: number, form: UpdateUserForm) {
    const res = await apiClient.put<UserApi>('/api/admin/users/' + id, form)
    return { data: await toUser(res.data) }
  },
  async updateUserLevel(id: number, level: number) {
    const res = await apiClient.patch<UserApi>(`/api/admin/users/${id}/level`, { level })
    return { data: await toUser(res.data) }
  },
  async deactivateUser(id: number) {
    const res = await apiClient.patch<UserApi>(`/api/admin/users/${id}/deactivate`)
    return { data: await toUser(res.data) }
  },
  async reactivateUser(id: number) {
    const res = await apiClient.patch<UserApi>(`/api/admin/users/${id}/reactivate`)
    return { data: await toUser(res.data) }
  },

  // ---------------- logged-in user (own profile) ----------------
  async getMyProfile() {
    const res = await apiClient.get<UserApi>('/api/user/profile')
    return { data: await toUser(res.data) }
  },
  async updateMyProfile(form: UpdateUserForm) {
    const res = await apiClient.put<UserApi>('/api/user/profile', form)
    return { data: await toUser(res.data) }
  },

  // ---------------- exam module (unchanged) ----------------
  getExamHistory(userId: number) {
    return apiClient.get('/api/users/' + userId + '/exam-history')
  },
  getBadges(userId: number) {
    return apiClient.get('/api/users/' + userId + '/badges')
  },
}
