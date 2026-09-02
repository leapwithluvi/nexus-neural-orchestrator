import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  real,
  unique,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ==========================================
// ENUMS
// ==========================================
export const roleEnum = pgEnum('role', ['user', 'admin'])
export const statusEnum = pgEnum('status', ['active', 'inactive', 'banned'])
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant', 'system'])
export const providerEnum = pgEnum('provider', ['google', 'github'])

// ==========================================
// USERS
// ==========================================
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    username: text('username').unique(),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    role: roleEnum('role').default('user').notNull(),
    status: statusEnum('status').default('active').notNull(),
    emailVerified: boolean('email_verified').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('users_email_idx').on(t.email),
    index('users_username_idx').on(t.username),
  ],
)

// ==========================================
// OAUTH ACCOUNTS
// ==========================================
export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: providerEnum('provider').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),
    scope: text('scope'),
    tokenType: text('token_type'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    unique('oauth_accounts_provider_provider_id_unique').on(t.provider, t.providerId),
    index('oauth_accounts_user_id_idx').on(t.userId),
  ],
)

// ==========================================
// REFRESH TOKENS
// ==========================================
export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    token: text('token').notNull().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('refresh_tokens_user_id_idx').on(t.userId),
    index('refresh_tokens_token_idx').on(t.token),
  ],
)

// ==========================================
// CONVERSATIONS
// ==========================================
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').default('New Conversation').notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    isPinned: boolean('is_pinned').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('conversations_user_id_idx').on(t.userId),
    index('conversations_created_at_idx').on(t.createdAt),
  ],
)

// ==========================================
// MESSAGES
// ==========================================
export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    tokenCount: integer('token_count'),
    latency: real('latency'),
    model: text('model'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('messages_conversation_id_idx').on(t.conversationId),
    index('messages_created_at_idx').on(t.createdAt),
  ],
)

// ==========================================
// RATE LIMITS
// ==========================================
export const rateLimits = pgTable(
  'rate_limits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    identifier: text('identifier').notNull(), // IP or user ID
    endpoint: text('endpoint').notNull(),
    count: integer('count').default(1).notNull(),
    windowStart: timestamp('window_start').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (t) => [
    unique('rate_limits_identifier_endpoint_unique').on(t.identifier, t.endpoint),
    index('rate_limits_expires_at_idx').on(t.expiresAt),
  ],
)

// ==========================================
// RELATIONS
// ==========================================
export const usersRelations = relations(users, ({ many }) => ({
  oauthAccounts: many(oauthAccounts),
  refreshTokens: many(refreshTokens),
  conversations: many(conversations),
}))

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, { fields: [oauthAccounts.userId], references: [users.id] }),
}))

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}))

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, { fields: [conversations.userId], references: [users.id] }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}))
