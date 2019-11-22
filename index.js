const mssql = require("mssql"),
    {PreparedStatement, TYPES} = mssql;

let poolQueue = Promise.resolve();

//  ####           #            #
//   #  #          #            #
//   #  #   ###   ####    ###   # ##    ###    ###    ###
//   #  #      #   #         #  ##  #      #  #      #   #
//   #  #   ####   #      ####  #   #   ####   ###   #####
//   #  #  #   #   #  #  #   #  ##  #  #   #      #  #
//  ####    ####    ##    ####  # ##    ####  ####    ###
/**
* Defines the database class.
*/
class Database {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * A constructor that creates a new database object with the necessary settings.
     * @param {object} settings The settings to use for the mssql module.
     */
    constructor(settings) {
        this.settings = settings;
    }

    //              #    ###               ##
    //              #    #  #               #
    //  ###   ##   ###   #  #   ##    ##    #
    // #  #  # ##   #    ###   #  #  #  #   #
    //  ##   ##     #    #     #  #  #  #   #
    // #      ##     ##  #      ##    ##   ###
    //  ###
    /**
     * Gets the connection pool to use.  Creates it if it doesn't exist.
     * @returns {Promise<ConnectionPool>} A promise that resolves with the retrieved connection pool.
     */
    getPool() {
        return poolQueue = poolQueue.then(() => {}).catch(() => {}).then(async () => {
            // Check to see if we already have a connection pool, if so, return it.
            if (this.pool && !this.pool.connected) {
                await mssql.close();
                delete this.pool;
            }

            if (this.pool && this.pool.connected) {
                return this.pool;
            }

            // Ensure the settings have been setup first.
            if (!this.settings) {
                throw new Error("You haven't setup your settings yet!");
            }

            // Connect to the database, close any existing connection, create a new connection pool, and return it.
            try {
                await mssql.close();
            } finally {}

            return this.pool = await mssql.connect(this.settings);
        });
    }

    //  ###  #  #   ##   ###   #  #
    // #  #  #  #  # ##  #  #  #  #
    // #  #  #  #  ##    #      # #
    //  ###   ###   ##   #       #
    //    #                     #
    /**
     * Executes a query.
     * @param {string} sqlStr The SQL query.
     * @param {object} [params] The parameters of the query.
     * @return {Promise} A promise that resolves when the query is complete.
     */
    async query(sqlStr, params) {
        // If params haven't been sent, default them.
        if (!params) {
            params = {};
        }

        // Setup a new prepared statement.
        const ps = new PreparedStatement(await this.getPool());
        ps.multiple = true;

        // Add each parameter as an input to the prepared statement.
        Object.keys(params).forEach((key) => {
            ps.input(key, params[key].type);
        });

        // Prepare the statement.
        await ps.prepare(sqlStr);

        // Get the values to send to the query.
        const paramMap = Object.keys(params).map((key) => [key, params[key].value]),
            paramList = {};

        for (let index = 0, {length} = Object.keys(paramMap); index < length; index++) {
            paramList[paramMap[index][0]] = paramMap[index][1];
        }

        // Retrieve the data.
        const data = await ps.execute(paramList);

        // Unprepare the statement.
        await ps.unprepare();

        // Return the data.
        return data;
    }
}

// Make the mssql types available.
Database.TYPES = TYPES;

Object.keys(TYPES).forEach((key) => {
    const {[key]: value} = TYPES;

    Database[key] = value;
    Database[key.toUpperCase()] = value;
});

// Export the object.
module.exports = Database;
