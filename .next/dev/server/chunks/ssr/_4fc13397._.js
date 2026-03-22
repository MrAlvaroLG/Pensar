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
"[project]/app/(admin)/admin/dashboard/library/library-client.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibraryClient",
    ()=>LibraryClient
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LibraryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LibraryClient() from the server but LibraryClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(admin)/admin/dashboard/library/library-client.tsx <module evaluation>", "LibraryClient");
}),
"[project]/app/(admin)/admin/dashboard/library/library-client.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibraryClient",
    ()=>LibraryClient
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LibraryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LibraryClient() from the server but LibraryClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(admin)/admin/dashboard/library/library-client.tsx", "LibraryClient");
}),
"[project]/app/(admin)/admin/dashboard/library/library-client.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$library$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/library/library-client.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$library$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/library/library-client.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$library$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/(admin)/admin/dashboard/library/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "$$RSC_SERVER_ACTION_0",
    ()=>$$RSC_SERVER_ACTION_0,
    "$$RSC_SERVER_ACTION_1",
    ()=>$$RSC_SERVER_ACTION_1,
    "$$RSC_SERVER_ACTION_2",
    ()=>$$RSC_SERVER_ACTION_2,
    "$$RSC_SERVER_ACTION_3",
    ()=>$$RSC_SERVER_ACTION_3,
    "default",
    ()=>LibraryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40055166dec5e6bf597613e022f4a33ad55dcb487f":"$$RSC_SERVER_ACTION_1","403e7311ed3d1e878f1c37e6ed117fdc6e9fe59451":"$$RSC_SERVER_ACTION_3","4060eaf4642172bdc47ca89b3ec5934d7946f20bc5":"$$RSC_SERVER_ACTION_2","40f57e425fd26787fa622d4ea2eb17de96b54a23fb":"$$RSC_SERVER_ACTION_0"},"",""] */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/admin-auth.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/admin-auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/supabase-storage.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$supabase$2d$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/supabase-storage.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$library$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/library/library-client.tsx [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
function revalidateLibraryViews() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/dashboard/library");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/docs", "layout");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
}
const $$RSC_SERVER_ACTION_0 = async function createCategoryAction(formData) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureLibrarySession"])();
    const name = formData.get("name");
    if (typeof name !== "string" || name.trim().length === 0) {
        throw new Error("El nombre de la categoría es obligatorio");
    }
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryCategory.findUnique({
        where: {
            name: name.trim()
        }
    });
    if (existing) {
        throw new Error("Ya existe una categoría con ese nombre");
    }
    const maxOrder = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryCategory.aggregate({
        _max: {
            order: true
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryCategory.create({
        data: {
            name: name.trim(),
            order: (maxOrder._max.order ?? -1) + 1
        }
    });
    revalidateLibraryViews();
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_ACTION_0, "40f57e425fd26787fa622d4ea2eb17de96b54a23fb", null);
var createCategoryAction = $$RSC_SERVER_ACTION_0;
const $$RSC_SERVER_ACTION_1 = async function updateCategoryAction(formData) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureLibrarySession"])();
    const categoryId = formData.get("categoryId");
    const name = formData.get("name");
    if (typeof categoryId !== "string" || categoryId.length === 0) {
        throw new Error("ID de categoría inválido");
    }
    if (typeof name !== "string" || name.trim().length === 0) {
        throw new Error("El nombre de la categoría es obligatorio");
    }
    const duplicate = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryCategory.findFirst({
        where: {
            name: name.trim(),
            NOT: {
                id: categoryId
            }
        }
    });
    if (duplicate) {
        throw new Error("Ya existe otra categoría con ese nombre");
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryCategory.update({
        where: {
            id: categoryId
        },
        data: {
            name: name.trim()
        }
    });
    revalidateLibraryViews();
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_ACTION_1, "40055166dec5e6bf597613e022f4a33ad55dcb487f", null);
var updateCategoryAction = $$RSC_SERVER_ACTION_1;
const $$RSC_SERVER_ACTION_2 = async function deleteCategoryAction(formData) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureLibrarySession"])();
    const categoryId = formData.get("categoryId");
    if (typeof categoryId !== "string" || categoryId.length === 0) {
        throw new Error("ID de categoría inválido");
    }
    const docCount = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryDocument.count({
        where: {
            categoryId
        }
    });
    if (docCount > 0) {
        throw new Error("No se puede eliminar una categoría con documentos");
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryCategory.delete({
        where: {
            id: categoryId
        }
    });
    revalidateLibraryViews();
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_ACTION_2, "4060eaf4642172bdc47ca89b3ec5934d7946f20bc5", null);
var deleteCategoryAction = $$RSC_SERVER_ACTION_2;
const $$RSC_SERVER_ACTION_3 = async function deleteDocumentAction(formData) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureLibrarySession"])();
    const documentId = formData.get("documentId");
    if (typeof documentId !== "string" || documentId.length === 0) {
        throw new Error("ID de documento inválido");
    }
    const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryDocument.findUnique({
        where: {
            id: documentId
        }
    });
    if (!doc) {
        throw new Error("El documento no existe");
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$supabase$2d$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deletePdf"])(doc.storagePath);
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryDocument.delete({
        where: {
            id: documentId
        }
    });
    revalidateLibraryViews();
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_ACTION_3, "403e7311ed3d1e878f1c37e6ed117fdc6e9fe59451", null);
var deleteDocumentAction = $$RSC_SERVER_ACTION_3;
async function LibraryPage() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureLibrarySession"])();
    const categories = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryCategory.findMany({
        include: {
            _count: {
                select: {
                    documents: true
                }
            }
        },
        orderBy: {
            order: "asc"
        }
    });
    const documents = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].libraryDocument.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    const serializedCategories = categories.map((c)=>({
            id: c.id,
            name: c.name,
            icon: c.icon,
            order: c.order,
            _count: c._count
        }));
    const serializedDocuments = documents.map((d)=>({
            id: d.id,
            title: d.title,
            description: d.description,
            fileName: d.fileName,
            categoryId: d.categoryId,
            createdAt: d.createdAt.toISOString()
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$library$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LibraryClient"], {
        categories: serializedCategories,
        documents: serializedDocuments,
        createCategoryAction: createCategoryAction,
        updateCategoryAction: updateCategoryAction,
        deleteCategoryAction: deleteCategoryAction,
        deleteDocumentAction: deleteDocumentAction
    }, void 0, false, {
        fileName: "[project]/app/(admin)/admin/dashboard/library/page.tsx",
        lineNumber: 150,
        columnNumber: 9
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/(admin)/admin/dashboard/library/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(admin)/admin/dashboard/library/page.tsx [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/library/page.tsx [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/(admin)/admin/dashboard/library/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(admin)/admin/dashboard/library/page.tsx [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "40055166dec5e6bf597613e022f4a33ad55dcb487f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["$$RSC_SERVER_ACTION_1"],
    "403e7311ed3d1e878f1c37e6ed117fdc6e9fe59451",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["$$RSC_SERVER_ACTION_3"],
    "4060eaf4642172bdc47ca89b3ec5934d7946f20bc5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["$$RSC_SERVER_ACTION_2"],
    "40f57e425fd26787fa622d4ea2eb17de96b54a23fb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["$$RSC_SERVER_ACTION_0"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(admin)/admin/dashboard/library/page/actions.js { ACTIONS_MODULE0 => "[project]/app/(admin)/admin/dashboard/library/page.tsx [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin)/admin/dashboard/library/page.tsx [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$292f$admin$2f$dashboard$2f$library$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=_4fc13397._.js.map