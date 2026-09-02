import type { Context } from 'hono'
import { generateState, generateCodeVerifier } from 'arctic'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { googleAuth, githubAuth } from '../lib/oauth'
import { authService } from '../services/auth.service'
import { env } from '../config/env'
import type { HonoEnv, ApiResponse } from '../types'
import { db } from '../db/client'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { updateProfileSchema } from '../validators/schemas'
import { z } from 'zod'

const setTokensCookie = (c: Context, accessToken: string, refreshToken: string) => {
  setCookie(c, 'accessToken', accessToken, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: 15 * 60, // 15 mins
    path: '/',
  })

  setCookie(c, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/api/v1/auth/refresh', // Restrict path
  })
}

export const authHandler = {
  // ==========================================
  // GOOGLE LOGIN
  // ==========================================
  async googleLogin(c: Context) {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()

    const url = googleAuth.createAuthorizationURL(state, codeVerifier, ['profile', 'email'])

    setCookie(c, 'google_oauth_state', state, { httpOnly: true, secure: env.isProd, maxAge: 600, path: '/' })
    setCookie(c, 'google_oauth_code_verifier', codeVerifier, { httpOnly: true, secure: env.isProd, maxAge: 600, path: '/' })

    return c.redirect(url.toString())
  },

  async googleCallback(c: Context) {
    const code = c.req.query('code')
    const state = c.req.query('state')
    
    const storedState = getCookie(c, 'google_oauth_state')
    const storedCodeVerifier = getCookie(c, 'google_oauth_code_verifier')

    if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
      return c.json<ApiResponse>({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid state or code' }, meta: { timestamp: new Date().toISOString(), requestId: '' } }, 400)
    }

    try {
      const tokens = await googleAuth.validateAuthorizationCode(code, storedCodeVerifier)
      const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${tokens.accessToken()}` },
      })
      const userProfile = await response.json()

      const user = await authService.handleOAuthLogin('google', userProfile.sub, {
        email: userProfile.email,
        displayName: userProfile.name,
        avatarUrl: userProfile.picture,
      })

      const authTokens = await authService.generateAuthTokens(user.id, user.email, user.role)
      setTokensCookie(c, authTokens.accessToken, authTokens.refreshToken)

      return c.redirect(`${env.frontendUrl}?login=success`)
    } catch (e: any) {
      return c.redirect(`${env.frontendUrl}?login=error`)
    }
  },

  // ==========================================
  // GITHUB LOGIN
  // ==========================================
  async githubLogin(c: Context) {
    const state = generateState()
    const url = githubAuth.createAuthorizationURL(state, ['user:email'])
    setCookie(c, 'github_oauth_state', state, { httpOnly: true, secure: env.isProd, maxAge: 600, path: '/' })
    return c.redirect(url.toString())
  },

  async githubCallback(c: Context) {
    const code = c.req.query('code')
    const state = c.req.query('state')
    const storedState = getCookie(c, 'github_oauth_state')

    if (!code || !state || !storedState || state !== storedState) {
       return c.json({ error: 'Invalid state' }, 400)
    }

    try {
      const tokens = await githubAuth.validateAuthorizationCode(code)
      
      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${tokens.accessToken()}` },
      })
      const userProfile = await userRes.json()

      // GitHub emails are often private, need secondary patch request
      let email = userProfile.email
      let isVerified = false

      if (!email) {
         const emailRes = await fetch('https://api.github.com/user/emails', {
           headers: { Authorization: `Bearer ${tokens.accessToken()}` },
         })
         const emails = await emailRes.json()
         
         // EXTRA PROTECTION: Prevent Account Hijacking via Unverified Github Email
         const primaryVerified = emails.find((e: any) => e.primary && e.verified)
         
         if (!primaryVerified) {
           return c.redirect(`${env.frontendUrl}?error=unverified_github_email`)
         }
         
         email = primaryVerified.email
         isVerified = true
      }

      const user = await authService.handleOAuthLogin('github', String(userProfile.id), {
        email: email,
        displayName: userProfile.name || userProfile.login,
        avatarUrl: userProfile.avatar_url,
      })

       const authTokens = await authService.generateAuthTokens(user.id, user.email, user.role)
       setTokensCookie(c, authTokens.accessToken, authTokens.refreshToken)

       return c.redirect(`${env.frontendUrl}?login=success`)
    } catch (e) {
       return c.redirect(`${env.frontendUrl}?login=error`)
    }
  },

  // ==========================================
  // TOKEN AND SESSION
  // ==========================================
  async refresh(c: Context<HonoEnv>) {
    // Expected in cookie or body
    const body = await c.req.json().catch(() => ({}))
    const token = body.refreshToken || getCookie(c, 'refreshToken')

    if (!token) return c.json({ error: 'No token' }, 401)

    try {
      const { accessToken, refreshToken } = await authService.rotateToken(token)
      setTokensCookie(c, accessToken, refreshToken)

      return c.json<ApiResponse>({ success: true, data: { accessToken }, meta: { timestamp: new Date().toISOString(), requestId: '' } })
    } catch {
      return c.json({ error: 'Invalid refresh token' }, 401)
    }
  },

  async logout(c: Context<HonoEnv>) {
    const refreshToken = getCookie(c, 'refreshToken')
    if (refreshToken) await authService.revokeRefreshToken(refreshToken)

    deleteCookie(c, 'accessToken', { path: '/' })
    deleteCookie(c, 'refreshToken', { path: '/api/v1/auth/refresh' })

    return c.json<ApiResponse>({ success: true, meta: { timestamp: new Date().toISOString(), requestId: '' } })
  },

  async logoutAll(c: Context<HonoEnv>) {
    const user = c.get('user')!
    await authService.logoutAll(user.id)
    deleteCookie(c, 'accessToken', { path: '/' })
    deleteCookie(c, 'refreshToken', { path: '/api/v1/auth/refresh' })
    
    return c.json<ApiResponse>({ success: true, meta: { timestamp: new Date().toISOString(), requestId: '' } })
  },

  // ==========================================
  // ME / PROFILE
  // ==========================================
  async me(c: Context<HonoEnv>) {
    return c.json<ApiResponse>({ success: true, data: c.get('user'), meta: { timestamp: new Date().toISOString(), requestId: '' } })
  },

  async updateProfile(c: Context<HonoEnv>) {
     const user = c.get('user')!
     const data = c.req.valid('json' as never) as z.infer<typeof updateProfileSchema>

     const [updatedUser] = await db.update(users).set({
       username: data.username,
       displayName: data.displayName,
       avatarUrl: data.avatarUrl,
       updatedAt: new Date()
     }).where(eq(users.id, user.id)).returning()

     return c.json<ApiResponse>({ success: true, data: updatedUser, meta: { timestamp: new Date().toISOString(), requestId: '' } })
  }
}
