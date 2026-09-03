import { GitHub, Google } from 'arctic'
import { env } from '../config/env.js'

export const googleAuth = new Google(
  env.oauth.google.clientId,
  env.oauth.google.clientSecret,
  env.oauth.google.callbackUrl,
)

export const githubAuth = new GitHub(
  env.oauth.github.clientId,
  env.oauth.github.clientSecret,
  env.oauth.github.callbackUrl
)
