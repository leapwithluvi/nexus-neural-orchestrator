import { z } from 'zod'

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

export const createConversationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
})

export const updateConversationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  isPinned: z.boolean().optional(),
})

export const chatMessageSchema = z.object({
  conversationId: z.string().uuid().optional(), // Opsional: kalau belum ada, buat baru
  content: z.string().min(1).max(4000), // Batas isi chat prompt
})
