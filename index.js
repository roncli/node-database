const sql = require("mssql");

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
     * @returns {Promise} A promise that resolves when the pool has been retrieved.
     */
    getPool() {
        return new Promise((resolve, reject) => {
            if (this.pool) {
                resolve(this.pool);
            } else {
                if (!this.settings) {
                    reject(new Error("You haven't setup your settings yet!"));
                    return;
                }

                sql.connect(this.settings).then((pool) => {
                    this.pool = pool;
                    resolve(this.pool);
                }).catch((err) => {
                    reject(err);
                });
            }
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
     * @param {object} params The parameters of the query.
     * @return {Promise} A promise that resolves when the query is complete.
     */
    query(sqlStr, params) {
        const db = this;

        return new Promise((resolve, reject) => {
            db.getPool().then((pool) => {
                if (!params) {
                    params = {};
                }

                const ps = new sql.PreparedStatement(pool);

                Object.keys(params).forEach((key) => {
                    ps.input(key, params[key].type);
                });
                ps.multiple = true;
                return ps.prepare(sqlStr);
            }).then((ps) => {
                const paramMap = Object.keys(params).map((key) => [key, params[key].value]),
                    paramList = {};

                for (let i = 0, {length} = Object.keys(paramMap); i < length; i++) {
                    paramList[paramMap[i][0]] = paramMap[i][1];
                }

                ps.execute(paramList).then((data) => {
                    ps.unprepare().then(() => {
                        resolve(data);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

({TYPES: Database.TYPES} = sql);

Object.keys(sql.TYPES).forEach((key) => {
    const {TYPES: {[key]: value}} = sql;

    Database[key] = value;
    Database[key.toUpperCase()] = value;
});

module.exports = Database;
