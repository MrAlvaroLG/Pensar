module.exports = [
"[project]/node_modules/@better-auth/kysely-adapter/dist/bun-sqlite-dialect-C8OaCWSL.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BunSqliteDialect",
    ()=>BunSqliteDialect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/kysely/dist/esm/query-compiler/compiled-query.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$migration$2f$migrator$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/kysely/dist/esm/migration/migrator.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$query$2d$compiler$2f$default$2d$query$2d$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/kysely/dist/esm/query-compiler/default-query-compiler.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/kysely/dist/esm/raw-builder/sql.js [app-route] (ecmascript)");
;
//#region src/bun-sqlite-dialect.ts
var BunSqliteAdapter = class {
    get supportsCreateIfNotExists() {
        return true;
    }
    get supportsTransactionalDdl() {
        return false;
    }
    get supportsReturning() {
        return true;
    }
    async acquireMigrationLock() {}
    async releaseMigrationLock() {}
    get supportsOutput() {
        return true;
    }
};
var BunSqliteDriver = class {
    #config;
    #connectionMutex = new ConnectionMutex();
    #db;
    #connection;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    async init() {
        this.#db = this.#config.database;
        this.#connection = new BunSqliteConnection(this.#db);
        if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
    }
    async acquireConnection() {
        await this.#connectionMutex.lock();
        return this.#connection;
    }
    async beginTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("begin"));
    }
    async commitTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("commit"));
    }
    async rollbackTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("rollback"));
    }
    async releaseConnection() {
        this.#connectionMutex.unlock();
    }
    async destroy() {
        this.#db?.close();
    }
};
var BunSqliteConnection = class {
    #db;
    constructor(db){
        this.#db = db;
    }
    executeQuery(compiledQuery) {
        const { sql, parameters } = compiledQuery;
        const stmt = this.#db.prepare(sql);
        return Promise.resolve({
            rows: stmt.all(parameters)
        });
    }
    async *streamQuery() {
        throw new Error("Streaming query is not supported by SQLite driver.");
    }
};
var ConnectionMutex = class {
    #promise;
    #resolve;
    async lock() {
        while(this.#promise !== void 0)await this.#promise;
        this.#promise = new Promise((resolve)=>{
            this.#resolve = resolve;
        });
    }
    unlock() {
        const resolve = this.#resolve;
        this.#promise = void 0;
        this.#resolve = void 0;
        resolve?.();
    }
};
var BunSqliteIntrospector = class {
    #db;
    constructor(db){
        this.#db = db;
    }
    async getSchemas() {
        return [];
    }
    async getTables(options = {
        withInternalKyselyTables: false
    }) {
        let query = this.#db.selectFrom("sqlite_schema").where("type", "=", "table").where("name", "not like", "sqlite_%").select("name").$castTo();
        if (!options.withInternalKyselyTables) query = query.where("name", "!=", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$migration$2f$migrator$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_MIGRATION_TABLE"]).where("name", "!=", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$migration$2f$migrator$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_MIGRATION_LOCK_TABLE"]);
        const tables = await query.execute();
        return Promise.all(tables.map(({ name })=>this.#getTableMetadata(name)));
    }
    async getMetadata(options) {
        return {
            tables: await this.getTables(options)
        };
    }
    async #getTableMetadata(table) {
        const db = this.#db;
        const autoIncrementCol = (await db.selectFrom("sqlite_master").where("name", "=", table).select("sql").$castTo().execute())[0]?.sql?.split(/[\(\),]/)?.find((it)=>it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
        return {
            name: table,
            columns: (await db.selectFrom(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`pragma_table_info(${table})`.as("table_info")).select([
                "name",
                "type",
                "notnull",
                "dflt_value"
            ]).execute()).map((col)=>({
                    name: col.name,
                    dataType: col.type,
                    isNullable: !col.notnull,
                    isAutoIncrementing: col.name === autoIncrementCol,
                    hasDefaultValue: col.dflt_value != null
                })),
            isView: true
        };
    }
};
var BunSqliteQueryCompiler = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$query$2d$compiler$2f$default$2d$query$2d$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DefaultQueryCompiler"] {
    getCurrentParameterPlaceholder() {
        return "?";
    }
    getLeftIdentifierWrapper() {
        return "\"";
    }
    getRightIdentifierWrapper() {
        return "\"";
    }
    getAutoIncrement() {
        return "autoincrement";
    }
};
var BunSqliteDialect = class {
    #config;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    createDriver() {
        return new BunSqliteDriver(this.#config);
    }
    createQueryCompiler() {
        return new BunSqliteQueryCompiler();
    }
    createAdapter() {
        return new BunSqliteAdapter();
    }
    createIntrospector(db) {
        return new BunSqliteIntrospector(db);
    }
};
;
 //# sourceMappingURL=bun-sqlite-dialect-C8OaCWSL.mjs.map
}),
];

//# sourceMappingURL=a9bf9_%40better-auth_kysely-adapter_dist_bun-sqlite-dialect-C8OaCWSL_mjs_502a66c7._.js.map