import mssql from "mssql"

// Add global connection function definitions that @types/mssql does not have.
declare module "mssql" {
    export function close(): Promise<void>
    export function connect(config: mssql.config): Promise<ConnectionPool>
}
