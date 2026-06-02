export interface User {
  id: number
  name: string
  email: string
  type: 'admin' | 'user'
  originalUrl?: string
  previewUrl?: string
}
