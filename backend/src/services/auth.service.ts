import { db } from '../db/client'
import { users, oauthAccounts, refreshTokens } from '../db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt'

interface OAuthProfile {
  email: string
  displayName?: string
  avatarUrl?: string
}

export const authService = {
  /**
   * Finds or creates a user from an OAuth provider login.
   * Links the OAuth account to the user in a single DB transaction.
   */
  async handleOAuthLogin(provider: 'google' | 'github', providerId: string, profile: OAuthProfile) {
    return await db.transaction(async (tx) => {
      // Check if this OAuth account is already linked to a user.
      const [existingOAuth] = await tx
        .select({ userId: oauthAccounts.userId })
        .from(oauthAccounts)
        .where(and(eq(oauthAccounts.provider, provider), eq(oauthAccounts.providerId, providerId)))
        .limit(1)

      if (existingOAuth) {
        // OAuth account exists — fetch the user and update last login time.
        const [user] = await tx
          .select()
          .from(users)
          .where(eq(users.id, existingOAuth.userId))
          .limit(1)
        await tx
          .update(users)
          .set({ lastLoginAt: new Date() })
          .where(eq(users.id, user.id))
        return user
      }

      // Check if a user with this email already exists (e.g. from another OAuth provider).
      let [user] = await tx.select().from(users).where(eq(users.email, profile.email)).limit(1)

      if (!user) {
        // No existing user — create a new one.
        // OAuth providers verify email, so emailVerified is set to true.
        const [newUser] = await tx
          .insert(users)
          .values({
            email: profile.email,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            emailVerified: true,
            lastLoginAt: new Date(),
          })
          .returning()
        user = newUser
      }

      // Link the OAuth account to the user.
      await tx.insert(oauthAccounts).values({
        userId: user.id,
        provider,
        providerId,
        accessToken: 'oauth_issued',
      })

      return user
    })
  },

  /**
   * Issues a new access + refresh token pair and persists the refresh token in DB.
   */
  async generateAuthTokens(userId: string, email: string, role: 'user' | 'admin') {
    const payload = { userId, email, role }

    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)

    // Refresh token expires in 7 days.
    const expDate = new Date()
    expDate.setDate(expDate.getDate() + 7)

    await db.insert(refreshTokens).values({
      userId,
      token: refreshToken,
      expiresAt: expDate,
    })

    return { accessToken, refreshToken }
  },

  /**
   * Validates the old refresh token, revokes it, and issues a new token pair.
   * Implements refresh token rotation to prevent token reuse attacks.
   */
  async rotateToken(oldRefreshToken: string) {
    try {
      const decoded = await verifyRefreshToken(oldRefreshToken)

      if (decoded.type !== 'refresh') throw new Error()

      // Verify the token exists in DB and has not been revoked or expired.
      const [storedToken] = await db
        .select()
        .from(refreshTokens)
        .where(
          and(
            eq(refreshTokens.token, oldRefreshToken),
            sql`${refreshTokens.revokedAt} IS NULL`,
            sql`${refreshTokens.expiresAt} > NOW()`
          )
        )
        .limit(1)

      if (!storedToken) {
        throw new Error('Refresh token invalid or revoked')
      }

      // Revoke the old token before issuing a new one.
      await this.revokeRefreshToken(oldRefreshToken)

      const [user] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1)
      if (!user) throw new Error()

      return await this.generateAuthTokens(decoded.userId, decoded.email, user.role)
    } catch {
      throw new Error('Invalid refresh token')
    }
  },

  async revokeRefreshToken(token: string) {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.token, token))
  },

  async logoutAll(userId: string) {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), sql`${refreshTokens.revokedAt} IS NULL`))
  },
}
