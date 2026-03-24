import { relations } from "drizzle-orm"
import {
    boolean,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("Role", ["USER", "ADMIN", "PUBLISHER"])
export const posturaEnum = pgEnum("Postura", [
    "TEISTA",
    "ATEO",
    "AGNOSTICO",
    "DEISTA",
    "PANTEISTA",
    "OTRO",
])
export const debateStatusEnum = pgEnum("DebateStatus", [
    "DRAFT",
    "SCHEDULED",
    "LIVE",
    "FINISHED",
])
export const teamEnum = pgEnum("Team", ["none", "red", "blue", "public"])
export const registrationStatusEnum = pgEnum("RegistrationStatus", [
    "participant",
    "orator",
    "reserve",
])
export const summaryBlockTeamEnum = pgEnum("SummaryBlockTeam", [
    "RED",
    "BLUE",
    "PUBLIC",
])
export const chatTeamEnum = pgEnum("ChatTeam", ["red", "blue"])
export const chatFileTypeEnum = pgEnum("ChatFileType", [
    "IMAGE",
    "AUDIO",
    "DOCUMENT",
])
export const reportStatusEnum = pgEnum("ReportStatus", [
    "PENDING",
    "REVIEWED",
    "DISMISSED",
])

export type DebateStatus = (typeof debateStatusEnum.enumValues)[number]
export type ChatTeam = (typeof chatTeamEnum.enumValues)[number]
export type ChatFileType = (typeof chatFileTypeEnum.enumValues)[number]

export const user = pgTable(
    "user",
    {
        id: text("id").primaryKey(),
        email: text("email").notNull().unique(),
        role: roleEnum("role").notNull().default("USER"),
        name: text("name").notNull(),
        emailVerified: boolean("emailVerified").notNull(),
        image: text("image"),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        postura: posturaEnum("postura").notNull().default("OTRO"),
        phoneNumber: text("phoneNumber"),
    },
    (t) => [index("User_role_idx").on(t.role)]
)

export const userSuggestion = pgTable(
    "user_suggestion",
    {
        id: text("id").primaryKey(),
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        subject: text("subject").notNull(),
        message: text("message").notNull(),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("UserSuggestion_userId_createdAt_idx").on(t.userId, t.createdAt)]
)

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt", { mode: "date", precision: 3 }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
        mode: "date",
        precision: 3,
    }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
        mode: "date",
        precision: 3,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow(),
})

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt", { mode: "date", precision: 3 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 }).defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 }),
})

export const debate = pgTable(
    "debate",
    {
        id: text("id").primaryKey(),
        title: text("title").notNull(),
        subtitle: text("subtitle").notNull(),
        question: text("question").notNull(),
        thesis: text("thesis").notNull(),
        startAt: timestamp("startAt", { mode: "date", precision: 3 }).notNull(),
        endAt: timestamp("endAt", { mode: "date", precision: 3 }).notNull(),
        status: debateStatusEnum("status").notNull().default("DRAFT"),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("Debate_status_startAt_idx").on(t.status, t.startAt),
        index("Debate_endAt_idx").on(t.endAt),
    ]
)

export const debateRegistration = pgTable(
    "debate_registration",
    {
        id: text("id").primaryKey(),
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        debateId: text("debateId")
            .notNull()
            .references(() => debate.id, { onDelete: "cascade" }),
        team: teamEnum("team").notNull(),
        status: registrationStatusEnum("status").notNull().default("participant"),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        unique("DebateRegistration_userId_debateId_key").on(t.userId, t.debateId),
        index("DebateRegistration_debateId_team_status_idx").on(
            t.debateId,
            t.team,
            t.status
        ),
        index("DebateRegistration_userId_idx").on(t.userId),
        index("DebateRegistration_userId_createdAt_idx").on(t.userId, t.createdAt),
    ]
)

export const debateBibliography = pgTable(
    "debate_bibliography",
    {
        id: text("id").primaryKey(),
        label: text("label").notNull(),
        url: text("url").notNull(),
        debateId: text("debateId")
            .notNull()
            .references(() => debate.id, { onDelete: "cascade" }),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("DebateBibliography_debateId_idx").on(t.debateId)]
)

export const debateSummaryBlock = pgTable(
    "debate_summary_block",
    {
        id: text("id").primaryKey(),
        debateId: text("debateId")
            .notNull()
            .references(() => debate.id, { onDelete: "cascade" }),
        team: summaryBlockTeamEnum("team").notNull(),
        content: text("content").notNull(),
        order: integer("order").notNull().default(0),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("DebateSummaryBlock_debateId_idx").on(t.debateId)]
)

export const debateBibliographyDoc = pgTable(
    "debate_bibliography_doc",
    {
        id: text("id").primaryKey(),
        debateId: text("debateId")
            .notNull()
            .references(() => debate.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        description: text("description"),
        fileName: text("fileName").notNull(),
        storagePath: text("storagePath").notNull(),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("DebateBibliographyDoc_debateId_idx").on(t.debateId)]
)

export const libraryCategory = pgTable("library_category", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    icon: text("icon").notNull().default("FolderOpen"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow(),
})

export const libraryDocument = pgTable(
    "library_document",
    {
        id: text("id").primaryKey(),
        title: text("title").notNull(),
        description: text("description"),
        fileName: text("fileName").notNull(),
        storagePath: text("storagePath").notNull(),
        categoryId: text("categoryId")
            .notNull()
            .references(() => libraryCategory.id, { onDelete: "cascade" }),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("LibraryDocument_categoryId_idx").on(t.categoryId)]
)

export const chatMessage = pgTable(
    "chat_message",
    {
        id: text("id").primaryKey(),
        debateId: text("debateId")
            .notNull()
            .references(() => debate.id, { onDelete: "cascade" }),
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        team: chatTeamEnum("team").notNull(),
        content: text("content").notNull().default(""),
        fileUrl: text("fileUrl"),
        fileType: chatFileTypeEnum("fileType"),
        fileName: text("fileName"),
        deleted: boolean("deleted").notNull().default(false),
        deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("ChatMessage_debateId_team_createdAt_idx").on(
            t.debateId,
            t.team,
            t.createdAt
        ),
        index("ChatMessage_userId_idx").on(t.userId),
    ]
)

export const chatBan = pgTable(
    "chat_ban",
    {
        id: text("id").primaryKey(),
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        debateId: text("debateId")
            .notNull()
            .references(() => debate.id, { onDelete: "cascade" }),
        bannedBy: text("bannedBy")
            .notNull()
            .references(() => user.id),
        reason: text("reason"),
        expiresAt: timestamp("expiresAt", { mode: "date", precision: 3 }),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        unique("ChatBan_userId_debateId_key").on(t.userId, t.debateId),
        index("ChatBan_debateId_idx").on(t.debateId),
    ]
)

export const chatReport = pgTable(
    "chat_report",
    {
        id: text("id").primaryKey(),
        messageId: text("messageId")
            .notNull()
            .references(() => chatMessage.id, { onDelete: "cascade" }),
        reportedBy: text("reportedBy")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        reason: text("reason"),
        status: reportStatusEnum("status").notNull().default("PENDING"),
        createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("ChatReport_messageId_idx").on(t.messageId),
        index("ChatReport_reportedBy_idx").on(t.reportedBy),
        index("ChatReport_status_idx").on(t.status),
    ]
)

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    registrations: many(debateRegistration),
    chatMessages: many(chatMessage),
    chatBans: many(chatBan, { relationName: "userBans" }),
    chatBansIssued: many(chatBan, { relationName: "bannedByUser" }),
    chatReports: many(chatReport),
    suggestions: many(userSuggestion),
}))

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}))

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}))

export const userSuggestionRelations = relations(userSuggestion, ({ one }) => ({
    user: one(user, {
        fields: [userSuggestion.userId],
        references: [user.id],
    }),
}))

export const debateRelations = relations(debate, ({ many }) => ({
    bibliography: many(debateBibliography),
    registrations: many(debateRegistration),
    summaryBlocks: many(debateSummaryBlock),
    bibliographyDocs: many(debateBibliographyDoc),
    chatMessages: many(chatMessage),
    chatBans: many(chatBan),
}))

export const debateRegistrationRelations = relations(
    debateRegistration,
    ({ one }) => ({
        user: one(user, {
            fields: [debateRegistration.userId],
            references: [user.id],
        }),
        debate: one(debate, {
            fields: [debateRegistration.debateId],
            references: [debate.id],
        }),
    })
)

export const debateBibliographyRelations = relations(
    debateBibliography,
    ({ one }) => ({
        debate: one(debate, {
            fields: [debateBibliography.debateId],
            references: [debate.id],
        }),
    })
)

export const debateSummaryBlockRelations = relations(
    debateSummaryBlock,
    ({ one }) => ({
        debate: one(debate, {
            fields: [debateSummaryBlock.debateId],
            references: [debate.id],
        }),
    })
)

export const debateBibliographyDocRelations = relations(
    debateBibliographyDoc,
    ({ one }) => ({
        debate: one(debate, {
            fields: [debateBibliographyDoc.debateId],
            references: [debate.id],
        }),
    })
)

export const libraryCategoryRelations = relations(libraryCategory, ({ many }) => ({
    documents: many(libraryDocument),
}))

export const libraryDocumentRelations = relations(libraryDocument, ({ one }) => ({
    category: one(libraryCategory, {
        fields: [libraryDocument.categoryId],
        references: [libraryCategory.id],
    }),
}))

export const chatMessageRelations = relations(chatMessage, ({ one, many }) => ({
    debate: one(debate, {
        fields: [chatMessage.debateId],
        references: [debate.id],
    }),
    user: one(user, {
        fields: [chatMessage.userId],
        references: [user.id],
    }),
    reports: many(chatReport),
}))

export const chatBanRelations = relations(chatBan, ({ one }) => ({
    user: one(user, {
        fields: [chatBan.userId],
        references: [user.id],
        relationName: "userBans",
    }),
    debate: one(debate, {
        fields: [chatBan.debateId],
        references: [debate.id],
    }),
    admin: one(user, {
        fields: [chatBan.bannedBy],
        references: [user.id],
        relationName: "bannedByUser",
    }),
}))

export const chatReportRelations = relations(chatReport, ({ one }) => ({
    message: one(chatMessage, {
        fields: [chatReport.messageId],
        references: [chatMessage.id],
    }),
    reporter: one(user, {
        fields: [chatReport.reportedBy],
        references: [user.id],
    }),
}))

/** Full schema for Drizzle client + Better Auth adapter (joins). */
export const schema = {
    user,
    userSuggestion,
    session,
    account,
    verification,
    debate,
    debateRegistration,
    debateBibliography,
    debateSummaryBlock,
    debateBibliographyDoc,
    libraryCategory,
    libraryDocument,
    chatMessage,
    chatBan,
    chatReport,
    userRelations,
    sessionRelations,
    accountRelations,
    userSuggestionRelations,
    debateRelations,
    debateRegistrationRelations,
    debateBibliographyRelations,
    debateSummaryBlockRelations,
    debateBibliographyDocRelations,
    libraryCategoryRelations,
    libraryDocumentRelations,
    chatMessageRelations,
    chatBanRelations,
    chatReportRelations,
}
