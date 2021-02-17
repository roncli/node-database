# node-database
A simple reusable class to query a MS SQL Server database.  This uses the [mssql](https://github.com/tediousjs/node-mssql) package to access SQL Server.

## Installing
Since this is largely used for personal projects, this is not an npm package.  Nevertheless, you may still install this by adding the following to your package.json:

```json
{
    "dependencies": {
        "node-database": "roncli/node-database#v1.2.4"
    }
}
```

## Usage
```javascript
const Db = require("node-database");

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

### 1.2.4 - 2/17/2021
* Add typings.
* Use awaits in example.
* Package updates.

### 1.2.3 - 12/31/2020
* Package updates.

### 1.2.2 - 9/7/2020
* Package updates.

### 1.2.1 - 11/21/2019
* Attempt to close existing SQL connection before opening a new one, even if it may not seem necessary.

### 1.2 - 7/10/2019
* Improve handling of dead connections.
* Fix concurrency issues.

### 1.1 - 7/26/2018
* ES7 update.
* Fixed bug with errors thrown by mssql being uncaught rejections, ie: server timeouts, etc.

### 1.0.2 - 5/7/2018
* Use promises recently added to the mssql library for better exception handling.

### 1.0.1 - 5/7/2018
* Make the class more object-oriented so that we can have multiple instances connecting to multiple databases.

### 1.0 - 5/7/2018
* Initial release.
