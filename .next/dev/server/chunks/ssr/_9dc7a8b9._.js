module.exports = [
"[project]/lib/auth/admin-auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "ensureAdminSession",
    ()=>ensureAdminSession,
    "ensureLibrarySession",
    ()=>ensureLibrarySession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/auth.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function getSessionOrThrowUnauthorized() {
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"].api.getSession({
        headers: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])()
    });
    if (!session) {
        throw new Error("No autorizado");
    }
    return session;
}
async function ensureAdminSession() {
    const session = await getSessionOrThrowUnauthorized();
    if (session.user.role !== "ADMIN") {
        throw new Error("No autorizado");
    }
    return session;
}
async function ensureLibrarySession() {
    const session = await getSessionOrThrowUnauthorized();
    if (session.user.role !== "ADMIN" && session.user.role !== "PUBLISHER") {
        throw new Error("No autorizado");
    }
    return session;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/admin-auth.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/admin-auth.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/utils/debate-domain.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEBATE_REGISTRATION_STATUSES",
    ()=>DEBATE_REGISTRATION_STATUSES,
    "DEBATE_TEAMS",
    ()=>DEBATE_TEAMS,
    "POSTURA_OPTIONS",
    ()=>POSTURA_OPTIONS,
    "POSTURA_VALUES",
    ()=>POSTURA_VALUES,
    "ROUTE_TO_TEAM",
    ()=>ROUTE_TO_TEAM,
    "STATUS_OPTIONS",
    ()=>STATUS_OPTIONS,
    "SUMMARY_BLOCK_TEAMS",
    ()=>SUMMARY_BLOCK_TEAMS,
    "SUMMARY_BLOCK_TEAM_OPTIONS",
    ()=>SUMMARY_BLOCK_TEAM_OPTIONS,
    "TEAM_OPTIONS",
    ()=>TEAM_OPTIONS,
    "getStatusLabel",
    ()=>getStatusLabel,
    "getSummaryBlockTeamLabel",
    ()=>getSummaryBlockTeamLabel,
    "getTeamLabel",
    ()=>getTeamLabel,
    "isDebateRegistrationStatus",
    ()=>isDebateRegistrationStatus,
    "isDebateTeam",
    ()=>isDebateTeam,
    "isDebateTeamRouteParam",
    ()=>isDebateTeamRouteParam,
    "isPosturaValue",
    ()=>isPosturaValue,
    "isSummaryBlockTeam",
    ()=>isSummaryBlockTeam
]);
const DEBATE_TEAMS = [
    "red",
    "blue",
    "public"
];
const DEBATE_REGISTRATION_STATUSES = [
    "participant",
    "orator",
    "reserve"
];
const POSTURA_VALUES = [
    "TEISTA",
    "ATEO",
    "AGNOSTICO",
    "DEISTA",
    "PANTEISTA",
    "OTRO"
];
const TEAM_OPTIONS = [
    {
        value: "red",
        label: "Rojo"
    },
    {
        value: "blue",
        label: "Azul"
    },
    {
        value: "public",
        label: "Publico"
    }
];
const STATUS_OPTIONS = [
    {
        value: "participant",
        label: "Participante"
    },
    {
        value: "orator",
        label: "Orador"
    },
    {
        value: "reserve",
        label: "Reserva"
    }
];
const POSTURA_OPTIONS = [
    {
        value: "TEISTA",
        label: "Teista"
    },
    {
        value: "ATEO",
        label: "Ateo"
    },
    {
        value: "AGNOSTICO",
        label: "Agnostico"
    },
    {
        value: "DEISTA",
        label: "Deista"
    },
    {
        value: "PANTEISTA",
        label: "Panteista"
    },
    {
        value: "OTRO",
        label: "Otra / Prefiero no decir"
    }
];
const ROUTE_TO_TEAM = {
    rojo: "red",
    azul: "blue",
    publico: "public"
};
function isDebateTeam(value) {
    return typeof value === "string" && DEBATE_TEAMS.includes(value);
}
function isDebateRegistrationStatus(value) {
    return typeof value === "string" && DEBATE_REGISTRATION_STATUSES.includes(value);
}
function isPosturaValue(value) {
    return typeof value === "string" && POSTURA_VALUES.includes(value);
}
function isDebateTeamRouteParam(value) {
    return value in ROUTE_TO_TEAM;
}
function getTeamLabel(team) {
    return TEAM_OPTIONS.find((option)=>option.value === team)?.label ?? team;
}
function getStatusLabel(status) {
    return STATUS_OPTIONS.find((option)=>option.value === status)?.label ?? status;
}
const SUMMARY_BLOCK_TEAMS = [
    "RED",
    "BLUE",
    "PUBLIC"
];
const SUMMARY_BLOCK_TEAM_OPTIONS = [
    {
        value: "RED",
        label: "Equipo Rojo"
    },
    {
        value: "BLUE",
        label: "Equipo Azul"
    },
    {
        value: "PUBLIC",
        label: "Preguntas del Publico"
    }
];
function isSummaryBlockTeam(value) {
    return typeof value === "string" && SUMMARY_BLOCK_TEAMS.includes(value);
}
function getSummaryBlockTeamLabel(team) {
    return SUMMARY_BLOCK_TEAM_OPTIONS.find((o)=>o.value === team)?.label ?? team;
}
}),
"[project]/lib/debate-domain.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debate$2d$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/debate-domain.ts [app-rsc] (ecmascript)");
;
}),
"[project]/lib/utils/debates.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DEBATE_STATUS_OPTIONS",
    ()=>DEBATE_STATUS_OPTIONS,
    "getAllPastDebatesForArchive",
    ()=>getAllPastDebatesForArchive,
    "getDebateQueue",
    ()=>getDebateQueue,
    "getFinishedDebateById",
    ()=>getFinishedDebateById,
    "getFinishedDebates",
    ()=>getFinishedDebates,
    "getHighlightedDebate",
    ()=>getHighlightedDebate,
    "getPublicDebatesData",
    ()=>getPublicDebatesData,
    "getUserRegistrationForHighlightedDebate",
    ()=>getUserRegistrationForHighlightedDebate,
    "runDebateScheduleTransition",
    ()=>runDebateScheduleTransition,
    "syncDebateScheduleIfNeeded",
    ()=>syncDebateScheduleIfNeeded,
    "toDateTimeLocalValue",
    ()=>toDateTimeLocalValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debate$2d$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/debate-domain.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debate$2d$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/debate-domain.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short"
});
async function getHighlightedDebateRecord() {
    const [liveDebate, scheduledDebate] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findFirst({
            where: {
                status: "LIVE"
            },
            orderBy: {
                startAt: "asc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findFirst({
            where: {
                status: "SCHEDULED"
            },
            orderBy: {
                startAt: "asc"
            }
        })
    ]);
    return liveDebate ?? scheduledDebate;
}
function formatDebateRange(startAt, endAt) {
    return `${DATE_FORMATTER.format(startAt)} - ${DATE_FORMATTER.format(endAt)}`;
}
function toDateTimeLocalValue(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
async function getDebateQueue() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_noStore"])();
    await syncDebateScheduleIfNeeded();
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findMany({
        where: {
            status: {
                in: [
                    "LIVE",
                    "SCHEDULED"
                ]
            }
        },
        include: {
            bibliography: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        },
        orderBy: {
            startAt: "asc"
        }
    });
}
async function syncDebateScheduleIfNeeded(now = new Date()) {
    const pendingTransition = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findFirst({
        where: {
            OR: [
                {
                    status: {
                        in: [
                            "LIVE",
                            "SCHEDULED"
                        ]
                    },
                    endAt: {
                        lte: now
                    }
                },
                {
                    status: "SCHEDULED",
                    startAt: {
                        lte: now
                    },
                    endAt: {
                        gt: now
                    }
                }
            ]
        },
        select: {
            id: true
        }
    });
    if (!pendingTransition) {
        return {
            now: now.toISOString(),
            finishedCount: 0,
            promotedId: null,
            skipped: true
        };
    }
    const result = await runDebateScheduleTransition(now);
    return {
        ...result,
        skipped: false
    };
}
async function getPublicDebatesData() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_noStore"])();
    await syncDebateScheduleIfNeeded();
    const [highlightedDebate, pastDebates] = await Promise.all([
        getHighlightedDebateRecord(),
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findMany({
            where: {
                status: "FINISHED"
            },
            orderBy: {
                endAt: "desc"
            },
            take: 6
        })
    ]);
    return {
        highlightedDebate: highlightedDebate ? {
            id: highlightedDebate.id,
            title: highlightedDebate.title,
            subtitle: highlightedDebate.subtitle,
            question: highlightedDebate.question,
            thesis: highlightedDebate.thesis,
            dateLabel: formatDebateRange(highlightedDebate.startAt, highlightedDebate.endAt)
        } : null,
        pastDebates: pastDebates.map((debate)=>({
                id: debate.id,
                title: debate.title,
                subtitle: debate.subtitle,
                question: debate.question,
                quote: debate.thesis,
                dateLabel: DATE_FORMATTER.format(debate.endAt)
            }))
    };
}
async function getHighlightedDebate() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_noStore"])();
    await syncDebateScheduleIfNeeded();
    return getHighlightedDebateRecord();
}
async function getUserRegistrationForHighlightedDebate(userId) {
    const highlightedDebate = await getHighlightedDebate();
    if (!highlightedDebate) {
        return null;
    }
    const registration = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debateRegistration.findUnique({
        where: {
            userId_debateId: {
                userId,
                debateId: highlightedDebate.id
            }
        }
    });
    if (!registration) {
        return null;
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debate$2d$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isDebateTeam"])(registration.team)) {
        return null;
    }
    return {
        debateId: highlightedDebate.id,
        debateTitle: highlightedDebate.subtitle,
        team: registration.team,
        status: registration.status
    };
}
async function runDebateScheduleTransition(now = new Date()) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].$transaction(async (tx)=>{
        const finished = await tx.debate.updateMany({
            where: {
                status: {
                    in: [
                        "LIVE",
                        "SCHEDULED"
                    ]
                },
                endAt: {
                    lte: now
                }
            },
            data: {
                status: "FINISHED"
            }
        });
        await tx.debate.updateMany({
            where: {
                status: "LIVE"
            },
            data: {
                status: "SCHEDULED"
            }
        });
        const toPromote = await tx.debate.findFirst({
            where: {
                status: "SCHEDULED",
                startAt: {
                    lte: now
                },
                endAt: {
                    gt: now
                }
            },
            orderBy: {
                startAt: "asc"
            }
        });
        let promotedId = null;
        if (toPromote) {
            await tx.debate.update({
                where: {
                    id: toPromote.id
                },
                data: {
                    status: "LIVE"
                }
            });
            promotedId = toPromote.id;
        }
        return {
            now: now.toISOString(),
            finishedCount: finished.count,
            promotedId
        };
    });
}
const DEBATE_STATUS_OPTIONS = [
    {
        value: "DRAFT",
        label: "Borrador"
    },
    {
        value: "SCHEDULED",
        label: "Programado"
    },
    {
        value: "LIVE",
        label: "En vivo"
    },
    {
        value: "FINISHED",
        label: "Finalizado"
    }
];
async function getFinishedDebates() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_noStore"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findMany({
        where: {
            status: "FINISHED"
        },
        include: {
            _count: {
                select: {
                    summaryBlocks: true,
                    bibliographyDocs: true,
                    bibliography: true
                }
            }
        },
        orderBy: {
            endAt: "desc"
        }
    });
}
async function getFinishedDebateById(id) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_noStore"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findFirst({
        where: {
            id,
            status: "FINISHED"
        },
        include: {
            summaryBlocks: {
                orderBy: {
                    order: "asc"
                }
            },
            bibliography: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            bibliographyDocs: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });
}
async function getAllPastDebatesForArchive() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_noStore"])();
    await syncDebateScheduleIfNeeded();
    const debates = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findMany({
        where: {
            status: "FINISHED"
        },
        orderBy: {
            endAt: "desc"
        }
    });
    return debates.map((debate)=>({
            id: debate.id,
            title: debate.title,
            subtitle: debate.subtitle,
            question: debate.question,
            quote: debate.thesis,
            dateLabel: DATE_FORMATTER.format(debate.endAt)
        }));
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/debates.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/debates.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/utils/supabase-storage.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSignedUploadUrl",
    ()=>createSignedUploadUrl,
    "deleteChatFolder",
    ()=>deleteChatFolder,
    "deleteDebateDoc",
    ()=>deleteDebateDoc,
    "deletePdf",
    ()=>deletePdf,
    "getChatFileSignedUrl",
    ()=>getChatFileSignedUrl,
    "getDebateDocPublicUrl",
    ()=>getDebateDocPublicUrl,
    "getPublicUrl",
    ()=>getPublicUrl,
    "uploadChatFile",
    ()=>uploadChatFile,
    "uploadDebateDoc",
    ()=>uploadDebateDoc,
    "uploadPdf",
    ()=>uploadPdf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
;
const LIBRARY_BUCKET = "library-pdfs";
const DEBATE_DOCS_BUCKET = "debate-docs";
function getSupabaseAdmin() {
    const url = ("TURBOPACK compile-time value", "https://sglqywokqhghwzltaimh.supabase.co");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        throw new Error("Faltan variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key, {
        auth: {
            persistSession: false
        }
    });
}
async function uploadPdf(file, path) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(LIBRARY_BUCKET).upload(path, file, {
        contentType: "application/pdf",
        upsert: false
    });
    if (error) throw new Error(`Error al subir PDF: ${error.message}`);
    return data.path;
}
async function createSignedUploadUrl(storagePath) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(LIBRARY_BUCKET).createSignedUploadUrl(storagePath);
    if (error) throw new Error(`Error al generar URL de subida: ${error.message}`);
    return data;
}
async function deletePdf(path) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(LIBRARY_BUCKET).remove([
        path
    ]);
    if (error) throw new Error(`Error al eliminar PDF: ${error.message}`);
}
function getPublicUrl(path) {
    const supabase = getSupabaseAdmin();
    const { data } = supabase.storage.from(LIBRARY_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}
async function uploadDebateDoc(file, path) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(DEBATE_DOCS_BUCKET).upload(path, file, {
        contentType: "application/pdf",
        upsert: false
    });
    if (error) throw new Error(`Error al subir documento: ${error.message}`);
    return data.path;
}
async function deleteDebateDoc(path) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(DEBATE_DOCS_BUCKET).remove([
        path
    ]);
    if (error) throw new Error(`Error al eliminar documento: ${error.message}`);
}
function getDebateDocPublicUrl(path) {
    const supabase = getSupabaseAdmin();
    const { data } = supabase.storage.from(DEBATE_DOCS_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}
const CHAT_FILES_BUCKET = "chat-files";
async function uploadChatFile(file, debateId, team, fileId) {
    const supabase = getSupabaseAdmin();
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${debateId}/${team}/${fileId}.${ext}`;
    const { error } = await supabase.storage.from(CHAT_FILES_BUCKET).upload(path, file, {
        upsert: false,
        contentType: file.type
    });
    if (error) throw new Error(`Error al subir archivo de chat: ${error.message}`);
    return path;
}
async function getChatFileSignedUrl(path) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(CHAT_FILES_BUCKET).createSignedUrl(path, 60 * 60 * 24) // 24h
    ;
    if (error || !data) throw new Error(`Error al generar URL firmada: ${error?.message}`);
    return data.signedUrl;
}
async function deleteChatFolder(debateId) {
    const supabase = getSupabaseAdmin();
    const { data: files, error: listError } = await supabase.storage.from(CHAT_FILES_BUCKET).list(debateId, {
        limit: 1000
    });
    if (listError || !files || files.length === 0) return;
    const teams = [
        "red",
        "blue"
    ];
    for (const team of teams){
        const { data: teamFiles } = await supabase.storage.from(CHAT_FILES_BUCKET).list(`${debateId}/${team}`, {
            limit: 1000
        });
        if (teamFiles && teamFiles.length > 0) {
            const paths = teamFiles.map((f)=>`${debateId}/${team}/${f.name}`);
            await supabase.storage.from(CHAT_FILES_BUCKET).remove(paths);
        }
    }
}
}),
"[project]/lib/supabase-storage.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$supabase$2d$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/supabase-storage.ts [app-rsc] (ecmascript)");
;
}),
"[project]/lib/utils/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/lib/utils.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/utils.ts [app-rsc] (ecmascript)");
;
}),
"[project]/ui/badge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-rsc] (ecmascript) <export * as Slot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            link: "text-primary underline-offset-4 [a&]:hover:underline"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant = "default", asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__["Slot"].Root : "span";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        "data-variant": variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/ui/badge.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/admin/dashboard-header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardHeader",
    ()=>DashboardHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ui/badge.tsx [app-rsc] (ecmascript)");
;
;
function DashboardHeader({ title, description, badge, actions, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/components/admin/dashboard-header.tsx",
                                lineNumber: 16,
                                columnNumber: 21
                            }, this),
                            badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "secondary",
                                children: badge
                            }, void 0, false, {
                                fileName: "[project]/components/admin/dashboard-header.tsx",
                                lineNumber: 17,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/dashboard-header.tsx",
                        lineNumber: 15,
                        columnNumber: 17
                    }, this),
                    actions
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/dashboard-header.tsx",
                lineNumber: 14,
                columnNumber: 13
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground",
                children: description
            }, void 0, false, {
                fileName: "[project]/components/admin/dashboard-header.tsx",
                lineNumber: 22,
                columnNumber: 17
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin/dashboard-header.tsx",
        lineNumber: 13,
        columnNumber: 9
    }, this);
}
}),
"[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/past-debates-client.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PastDebatesClient",
    ()=>PastDebatesClient
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const PastDebatesClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call PastDebatesClient() from the server but PastDebatesClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/past-debates-client.tsx <module evaluation>", "PastDebatesClient");
}),
"[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/past-debates-client.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PastDebatesClient",
    ()=>PastDebatesClient
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const PastDebatesClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call PastDebatesClient() from the server but PastDebatesClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/past-debates-client.tsx", "PastDebatesClient");
}),
"[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/past-debates-client.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$past$2d$debates$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/past-debates-client.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$past$2d$debates$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/past-debates-client.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$past$2d$debates$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "$$RSC_SERVER_ACTION_0",
    ()=>$$RSC_SERVER_ACTION_0,
    "default",
    ()=>PastDebatesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"400233877e980c447e7f9f2747613194f9beebc4c3":"$$RSC_SERVER_ACTION_0"},"",""] */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/admin-auth.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/admin-auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/debates.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/debates.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/supabase-storage.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$supabase$2d$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/supabase-storage.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$dashboard$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/admin/dashboard-header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$past$2d$debates$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/past-debates-client.tsx [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
const $$RSC_SERVER_ACTION_0 = async function deleteDebateAction(formData) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureAdminSession"])();
    const debateId = formData.get("debateId");
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado");
    }
    const debate = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.findFirst({
        where: {
            id: debateId,
            status: "FINISHED"
        },
        include: {
            bibliographyDocs: {
                select: {
                    storagePath: true
                }
            }
        }
    });
    if (!debate) throw new Error("Debate no encontrado");
    for (const doc of debate.bibliographyDocs){
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$supabase$2d$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteDebateDoc"])(doc.storagePath);
        } catch  {
        // continuar aunque falle la eliminacion del archivo
        }
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].debate.delete({
        where: {
            id: debateId
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/dashboard/past-debates");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/debates");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/debates/archivo");
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_ACTION_0, "400233877e980c447e7f9f2747613194f9beebc4c3", null);
var deleteDebateAction = $$RSC_SERVER_ACTION_0;
async function PastDebatesPage() {
    const debates = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$debates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFinishedDebates"])();
    const rows = debates.map((d)=>({
            id: d.id,
            title: d.title,
            subtitle: d.subtitle,
            endAt: d.endAt.toISOString(),
            summaryBlockCount: d._count.summaryBlocks,
            bibliographyLinkCount: d._count.bibliography,
            bibliographyDocCount: d._count.bibliographyDocs
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mx-auto w-full max-w-5xl space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$dashboard$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DashboardHeader"], {
                title: "Debates Anteriores",
                description: "Gestiona el resumen y la bibliografia de los debates finalizados."
            }, void 0, false, {
                fileName: "[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx",
                lineNumber: 58,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$past$2d$debates$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PastDebatesClient"], {
                debates: rows,
                deleteAction: deleteDebateAction
            }, void 0, false, {
                fileName: "[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx",
        lineNumber: 57,
        columnNumber: 9
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/(admin)/admin/dashboard/(admin-only)/past-debates/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/(admin)/admin/dashboard/(admin-only)/past-debates/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "400233877e980c447e7f9f2747613194f9beebc4c3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["$$RSC_SERVER_ACTION_0"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(admin)/admin/dashboard/(admin-only)/past-debates/page/actions.js { ACTIONS_MODULE0 => "[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/(admin-only)/past-debates/page.tsx [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f28$admin$2d$only$292f$past$2d$debates$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=_9dc7a8b9._.js.map