import { Hono } from 'hono'
import { authHandler } from '../handlers/auth.handler'
import { authenticate, requireAuth } from '../middleware/auth'
import { zValidator } from '@hono/zod-validator'
import { updateProfileSchema } from '../validators/schemas'
import type { HonoEnv, ApiResponse } from '../types'

const router = new Hono<HonoEnv>()

// ==========================================
// OAUTH - GOOGLE
// ==========================================
router.get('/google', authHandler.googleLogin)
router.get('/google/callback', authHandler.googleCallback)

// ==========================================
// OAUTH - GITHUB
// ==========================================
router.get('/github', authHandler.githubLogin)
router.get('/github/callback', authHandler.githubCallback)

// ==========================================
// TOKEN ROTATION
// ==========================================
router.post('/refresh', authHandler.refresh)

// ==========================================
// AUTHENTICATED ROUTES
// ==========================================
// Apply the 'authenticate' middleware (decodes JWT to Hono Context) for all routes below
router.use('/*', authenticate)

router.post('/logout', requireAuth, authHandler.logout)
router.post('/logout-all', requireAuth, authHandler.logoutAll)
router.get('/me', requireAuth, authHandler.me)

router.get('/check', (c) => {
  return c.json<ApiResponse>({
    success: true,
    data: { isAuthenticated: !c.get('isAnonymous') },
    meta: { timestamp: new Date().toISOString(), requestId: '' }
  })
})

router.patch(
  '/profile',
  requireAuth,
  zValidator('json', updateProfileSchema),
  authHandler.updateProfile
)

export default router
