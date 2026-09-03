import { sign, verify } from 'hono/jwt'
import { env } from '../config/env.js'
import type { TokenPayload } from '../types/index.js'

export const signAccessToken = async (payload: Omit<TokenPayload, 'type' | 'exp' | 'iat'>) => {
  const iat = Math.floor(Date.now() / 1000)
  // Access Token: 15 minutes by default
  const exp = iat + 15 * 60

  return await sign(
    { ...payload, type: 'access', iat, exp },
    env.jwt.accessSecret
  )
}

export const signRefreshToken = async (payload: Omit<TokenPayload, 'type' | 'exp' | 'iat'>) => {
  const iat = Math.floor(Date.now() / 1000)
  // Refresh Token: 7 days by default
  const exp = iat + 7 * 24 * 60 * 60

  return await sign(
    { ...payload, type: 'refresh', iat, exp },
    env.jwt.refreshSecret
  )
}

export const verifyAccessToken = async (token: string): Promise<TokenPayload> => {
  const decoded = await verify(token, env.jwt.accessSecret, 'HS256')
  return decoded as unknown as TokenPayload
}

export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
  const decoded = await verify(token, env.jwt.refreshSecret, 'HS256')
  return decoded as unknown as TokenPayload
}
