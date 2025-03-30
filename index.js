/**
 * @typedef {{[x: string]: {type: import("mssql").ISqlTypeFactoryWithNoParams | import("mssql").ISqlTypeWithLength | import("mssql").ISqlTypeWithNoParams | import("mssql").ISqlTypeWithPrecisionScale | import("mssql").ISqlTypeWithScale | import("mssql").ISqlTypeWithTvpType, value: any}}} Params
 */

const mssql = require("mssql"),
    {PreparedStatement, TYPES} = mssql;

// MARK: class Database
/**
* Defines the database class.
*/
class Database {
    /** @type {Promise} */
    static #poolQueue = Promise.resolve();

    /** @type {mssql.ConnectionPool} */
    #pool;

    /** @type {mssql.config} */
    #settings;

    // MARK: constructor
    /**
     * A constructor that creates a new database object with the necessary settings.
     * @param {mssql.config} settings The settings to use for the mssql module.
     */
    constructor(settings) {
        this.#settings = settings;
    }

    // MARK: async #getPool
    /**
     * Gets the connection pool to use.  Creates it if it doesn't exist.
     * @returns {Promise<mssql.ConnectionPool>} A promise that resolves with the retrieved connection pool.
     */
    async #getPool() {
        // Wait for the current promise in #poolQueue to resolve before proceeding.
        await Database.#poolQueue;

        // Reassign #poolQueue to a new promise to serialize the next operation and return it.
        return Database.#poolQueue = (async () => {
            // Check if a connection pool exists but is not connected, close it.
            if (this.#pool && !this.#pool.connected) {
                await mssql.close();
                this.#pool = void 0;
            }

            // If a connected pool already exists, return it.
            if (this.#pool && this.#pool.connected) {
                return this.#pool;
            }

            // Ensure the settings have been configured.
            if (!this.#settings) {
                throw new Error("Database settings are not configured. Please provide a valid config object.");
            }

            // Close any existing connections and create a new connection pool.
            try {
                await mssql.close();
            } finally {
                this.#pool = await mssql.connect(this.#settings);
            }

            return this.#pool;
        })();
    }

    // MARK: async query
    /**
     * Executes a query.
     * @param {string} sql The SQL query.
     * @param {Params} [params] The parameters of the query.
     * @returns {Promise<mssql.IProcedureResult>} A promise that returns the result of the query.
     */
    async query(sql, params) {
        // If params haven't been sent, default them.
        if (!params) {
            params = {};
        }

        // Setup a new prepared statement.
        const ps = new PreparedStatement(await this.#getPool());

        try {
            // Add each parameter as an input to the prepared statement.
            Object.keys(params).forEach((key) => {
                ps.input(key, params[key].type);
            });

            // Prepare the statement.
            await ps.prepare(sql);

            // Get the values to send to the query.
            const paramMap = Object.keys(params).map((key) => [key, params[key].value]),
                paramList = {};

            for (let index = 0, {length} = Object.keys(paramMap); index < length; index++) {
                paramList[paramMap[index][0]] = paramMap[index][1];
            }

            // Return the data.
            return await ps.execute(paramList);
        } finally {
            // Unprepare the statement.
            await ps.unprepare();
        }
    }
}

// Copy the mssql types to the Database object.
Object.entries(TYPES).forEach(([key, value]) => {
    Database[key] = value;
    Database[key.toUpperCase()] = value;
});

// Export the object.
module.exports = Database;
