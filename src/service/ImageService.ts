import apiClient from './AxiosClient'

const cache = new Map<string, string>()

/** storage key (returned by /uploadImage) -> temporary URL via /presignedUrl (Lab 11) */
export async function getImageUrl(key: string | null | undefined): Promise<string> {
  if (!key) return ''
  if (key.startsWith('http')) return key
  const cached = cache.get(key)
  if (cached) return cached
  const res = await apiClient.get<string>('/presignedUrl', { params: { key }, responseType: 'text' })
  cache.set(key, res.data)
  return res.data
}
