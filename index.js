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
    //               #
    //               #
    //  ###    ##   ###   #  #  ###
    // ##     # ##   #    #  #  #  #
    //   ##   ##     #    #  #  #  #
    // ###     ##     ##   ###  ###
    //                          #
    /**
     * A setup function that creates a new database object with the necessary settings.
     * @param {object} settings The settings to use for the mssql module.
     */
    static setup(settings) {
        Database.settings = settings;
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
    static query(sqlStr, params) {
        return new Promise((resolve, reject) => {
            if (!Database.settings) {
                reject(new Error("You haven't setup your settings yet!"));
                return;
            }
            
            if (!params) {
                params = {};
            }

            const conn = new sql.ConnectionPool(Database.settings, (errPool) => {

                if (errPool) {
                    reject(errPool);
                    return;
                }

                const ps = new sql.PreparedStatement(conn);

                Object.keys(params).forEach((key) => {
                    ps.input(key, params[key].type);
                });
                ps.multiple = true;
                ps.prepare(sqlStr, (errPrepare) => {
                    const paramList = {};

                    if (errPrepare) {
                        reject(errPrepare);
                        return;
                    }

                    const paramMap = Object.keys(params).map((key) => [key, params[key].value]);

                    for (let i = 0, {length} = Object.keys(paramMap); i < length; i++) {
                        paramList[paramMap[i][0]] = paramMap[i][1];
                    }

                    ps.execute(paramList, (errExecute, data) => {
                        if (errExecute) {
                            reject(errExecute);
                            return;
                        }

                        ps.unprepare((errUnprepare) => {
                            if (errUnprepare) {
                                reject(errUnprepare);
                                return;
                            }
                            resolve(data);
                        });
                    });
                });
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
