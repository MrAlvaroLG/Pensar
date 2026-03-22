module.exports = [
"[project]/node_modules/@better-auth/kysely-adapter/dist/d1-sqlite-dialect-sYHNqBte.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "D1SqliteDialect",
    ()=>D1SqliteDialect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$migration$2f$migrator$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/kysely/dist/esm/migration/migrator.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$sqlite$2f$sqlite$2d$adapter$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/kysely/dist/esm/dialect/sqlite/sqlite-adapter.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$sqlite$2f$sqlite$2d$query$2d$compiler$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/kysely/dist/esm/dialect/sqlite/sqlite-query-compiler.js [app-rsc] (ecmascript)");
;
//#region src/d1-sqlite-dialect.ts
var D1SqliteAdapter = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$sqlite$2f$sqlite$2d$adapter$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SqliteAdapter"] {
};
var D1SqliteDriver = class {
    #config;
    #connection;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    async init() {
        this.#connection = new D1SqliteConnection(this.#config.database);
        if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
    }
    async acquireConnection() {
        return this.#connection;
    }
    async beginTransaction() {
        throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
    }
    async commitTransaction() {
        throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
    }
    async rollbackTransaction() {
        throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
    }
    async releaseConnection() {}
    async destroy() {}
};
var D1SqliteConnection = class {
    #db;
    constructor(db){
        this.#db = db;
    }
    async executeQuery(compiledQuery) {
        const results = await this.#db.prepare(compiledQuery.sql).bind(...compiledQuery.parameters).all();
        const numAffectedRows = results.meta.changes != null ? BigInt(results.meta.changes) : void 0;
        return {
            insertId: results.meta.last_row_id === void 0 || results.meta.last_row_id === null ? void 0 : BigInt(results.meta.last_row_id),
            rows: results?.results || [],
            numAffectedRows,
            numUpdatedOrDeletedRows: numAffectedRows
        };
    }
    async *streamQuery() {
        throw new Error("D1 does not support streaming queries.");
    }
};
var D1SqliteIntrospector = class {
    #db;
    #d1;
    constructor(db, d1){
        this.#db = db;
        this.#d1 = d1;
    }
    async getSchemas() {
        return [];
    }
    async getTables(options = {
        withInternalKyselyTables: false
    }) {
        let query = this.#db.selectFrom("sqlite_master").where("type", "in", [
            "table",
            "view"
        ]).where("name", "not like", "sqlite_%").where("name", "not like", "_cf_%").select([
            "name",
            "type",
            "sql"
        ]).$castTo();
        if (!options.withInternalKyselyTables) query = query.where("name", "!=", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$migration$2f$migrator$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_MIGRATION_TABLE"]).where("name", "!=", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$migration$2f$migrator$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_MIGRATION_LOCK_TABLE"]);
        const tables = await query.execute();
        if (tables.length === 0) return [];
        const statements = tables.map((table)=>this.#d1.prepare("SELECT * FROM pragma_table_info(?)").bind(table.name));
        const batchResults = await this.#d1.batch(statements);
        return tables.map((table, index)=>{
            const columnInfo = batchResults[index]?.results ?? [];
            let autoIncrementCol = table.sql?.split(/[(),]/)?.find((it)=>it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.filter(Boolean)?.[0]?.replace(/["`]/g, "");
            if (!autoIncrementCol) {
                const pkCols = columnInfo.filter((r)=>r.pk > 0);
                const singlePk = pkCols.length === 1 ? pkCols[0] : void 0;
                if (singlePk && singlePk.type.toLowerCase() === "integer") autoIncrementCol = singlePk.name;
            }
            return {
                name: table.name,
                isView: table.type === "view",
                columns: columnInfo.map((col)=>({
                        name: col.name,
                        dataType: col.type,
                        isNullable: !col.notnull,
                        isAutoIncrementing: col.name === autoIncrementCol,
                        hasDefaultValue: col.dflt_value != null
                    }))
            };
        });
    }
    async getMetadata(options) {
        return {
            tables: await this.getTables(options)
        };
    }
};
var D1SqliteQueryCompiler = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$sqlite$2f$sqlite$2d$query$2d$compiler$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SqliteQueryCompiler"] {
};
var D1SqliteDialect = class {
    #config;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    createDriver() {
        return new D1SqliteDriver(this.#config);
    }
    createQueryCompiler() {
        return new D1SqliteQueryCompiler();
    }
    createAdapter() {
        return new D1SqliteAdapter();
    }
    createIntrospector(db) {
        return new D1SqliteIntrospector(db, this.#config.database);
    }
};
;
 //# sourceMappingURL=d1-sqlite-dialect-sYHNqBte.mjs.map
}),
];

//# sourceMappingURL=a9bf9_%40better-auth_kysely-adapter_dist_d1-sqlite-dialect-sYHNqBte_mjs_99cf83d3._.js.map