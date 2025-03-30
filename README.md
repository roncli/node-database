# node-database
A simple reusable class to query a MS SQL Server database.  This uses the [mssql](https://github.com/tediousjs/node-mssql) package to access SQL Server.

## Installing
Since this is largely used for personal projects, this is not an npm package.  Nevertheless, you may still install this by adding the following to your package.json:

```json
{
    "dependencies": {
        "@roncli/node-database": "roncli/node-database#v1.2.15"
    }
}
```

## Usage
```javascript
const Db = require("@roncli/node-database");

const db = new Db({
    server: "ms.sql.server.com",
    port: 1433,
    user: "my_user_name",
    password: "my_password",
    database: "my_database",
    pool: {
        max: 50,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true
    }
});

try {
    const data = await db.query(
        "SELECT col1, col2 FROM myTable WHERE col3 = @col3",
        {col3: {type: Db.INT, value: 123}}
    );

    if (data && data.recordsets && data.recordsets[0]) {
        data.recordsets[0].forEach((row) => {
            console.log(`Col1: ${row.col1}, Col2: ${row.col2}`);
        });
    }
} catch (err) {
    console.log("There was an error connecting to the database.");
    console.log(err);
}
```

See the [mssql](https://github.com/tediousjs/node-mssql) package for more examples of settings and how to query using the library.

## Version history

### v1.2.16 - 3/29/2025
* Add `jest` unit tests.
* Package updates.

### v1.2.15 - 9/14/2023
* Package updates.

### v1.2.14 - 8/8/2023
* Package updates.

### v1.2.13 - 5/17/2023
* Package updates.

### v1.2.12 - 10/1/2022
* Package updates.

### v1.2.11 - 8/9/2022
* Package updates.

### v1.2.10 - 5/30/2022
* Package updates.

### v1.2.9 - 5/21/2022
* Package updates.

### v1.2.8 - 5/4/2022
* Package updates.

### v1.2.7 - 2/8/2022
* Package updates.

### v1.2.6 - 11/23/2021
* Package updates.

### v1.2.5 - 8/30/2021
* Package updates.

### v1.2.4 - 2/17/2021
* Add typings.
* Use awaits in example.
* Package updates.

### v1.2.3 - 12/31/2020
* Package updates.

### v1.2.2 - 9/7/2020
* Package updates.

### v1.2.1 - 11/21/2019
* Attempt to close existing SQL connection before opening a new one, even if it may not seem necessary.

### v1.2.0 - 7/10/2019
* Improve handling of dead connections.
* Fix concurrency issues.

### v1.1.0 - 7/26/2018
* ES7 update.
* Fixed bug with errors thrown by mssql being uncaught rejections, ie: server timeouts, etc.

### v1.0.2 - 5/7/2018
* Use promises recently added to the mssql library for better exception handling.

### v1.0.1 - 5/7/2018
* Make the class more object-oriented so that we can have multiple instances connecting to multiple databases.

### v1.0.0 - 5/7/2018
* Initial release.
