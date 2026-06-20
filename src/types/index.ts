export interface UserAttachment {
  id: string
  filename: string
  url: string
}

export interface User {
  id: string
  name: string
  email: string
  type: 'admin' | 'user'
  originalUrl?: string
  previewUrl?: string
  attachments?: UserAttachment[]
}
