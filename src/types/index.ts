export interface UserAttachment {
  id: number
  filename: string
  url: string
}

export interface User {
  id: number
  name: string
  email: string
  type: 'admin' | 'user'
  originalUrl?: string
  previewUrl?: string
  attachments?: UserAttachment[]
}
