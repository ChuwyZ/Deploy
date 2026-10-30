import axios from 'axios'

/** Turns an Axios error into a short, readable reason, e.g. "HTTP 404: Not Found". */
export function apiErrorText(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'cannot reach the server'
    const data = err.response.data as { error?: string; message?: string } | string | undefined
    const detail = typeof data === 'string' ? data : (data?.message ?? data?.error ?? '')
    return `HTTP ${err.response.status}${detail ? ': ' + detail : ''}`
  }
  return err instanceof Error ? err.message : 'unknown error'
}
