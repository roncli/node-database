import {
    config,
    ISqlTypeFactoryWithLength,
    ISqlTypeFactoryWithNoParams,
    ISqlTypeFactoryWithPrecisionScale,
    ISqlTypeFactoryWithScale,
    ISqlTypeFactoryWithTvpType,
    ISqlTypeWithLength,
    ISqlTypeWithNoParams,
    ISqlTypeWithPrecisionScale,
    ISqlTypeWithScale,
    ISqlTypeWithTvpType
} from "mssql"

/**
* Defines the database class.
*/
declare class Database {
    /**
     * A constructor that creates a new database object with the necessary settings.
     * @param {object} settings The settings to use for the mssql module.
     */
    constructor(settings: config)

    /**
     * Executes a query.
     * @param {string} sql The SQL query.
     * @param {object} [params] The parameters of the query.
     * @return {Promise} A promise that resolves when the query is complete.
     */
    query(sql: string, params?: {[x: string]: {type: ISqlTypeFactoryWithNoParams | ISqlTypeWithLength | ISqlTypeWithNoParams | ISqlTypeWithPrecisionScale | ISqlTypeWithScale | ISqlTypeWithTvpType, value: any}}): Promise<any>

    public static VarChar: ISqlTypeFactoryWithLength
    public static VARCHAR: ISqlTypeFactoryWithLength
    public static NVarChar: ISqlTypeFactoryWithLength
    public static NVARCHAR: ISqlTypeFactoryWithLength
    public static Text: ISqlTypeFactoryWithNoParams
    public static TEXT: ISqlTypeFactoryWithNoParams
    public static Int: ISqlTypeFactoryWithNoParams
    public static INT: ISqlTypeFactoryWithNoParams
    public static BigInt: ISqlTypeFactoryWithNoParams
    public static BIGINT: ISqlTypeFactoryWithNoParams
    public static TinyInt: ISqlTypeFactoryWithNoParams
    public static TINYINT: ISqlTypeFactoryWithNoParams
    public static SmallInt: ISqlTypeFactoryWithNoParams
    public static SMALLINT: ISqlTypeFactoryWithNoParams
    public static Bit: ISqlTypeFactoryWithNoParams
    public static BIT: ISqlTypeFactoryWithNoParams
    public static Float: ISqlTypeFactoryWithNoParams
    public static FLOAT: ISqlTypeFactoryWithNoParams
    public static Numeric: ISqlTypeFactoryWithPrecisionScale
    public static NUMERIC: ISqlTypeFactoryWithPrecisionScale
    public static Decimal: ISqlTypeFactoryWithPrecisionScale
    public static DECIMAL: ISqlTypeFactoryWithPrecisionScale
    public static Real: ISqlTypeFactoryWithNoParams
    public static REAL: ISqlTypeFactoryWithNoParams
    public static Date: ISqlTypeFactoryWithNoParams
    public static DATE: ISqlTypeFactoryWithNoParams
    public static DateTime: ISqlTypeFactoryWithNoParams
    public static DATETIME: ISqlTypeFactoryWithNoParams
    public static DateTime2: ISqlTypeFactoryWithScale
    public static DATETIME2: ISqlTypeFactoryWithScale
    public static DateTimeOffset: ISqlTypeFactoryWithScale
    public static DATETIMEOFFSET: ISqlTypeFactoryWithScale
    public static SmallDateTime: ISqlTypeFactoryWithNoParams
    public static SMALLDATETIME: ISqlTypeFactoryWithNoParams
    public static Time: ISqlTypeFactoryWithScale
    public static TIME: ISqlTypeFactoryWithScale
    public static UniqueIdentifier: ISqlTypeFactoryWithNoParams
    public static UNIQUEIDENTIFIER: ISqlTypeFactoryWithNoParams
    public static SmallMoney: ISqlTypeFactoryWithNoParams
    public static SMALLMONEY: ISqlTypeFactoryWithNoParams
    public static Money: ISqlTypeFactoryWithNoParams
    public static MONEY: ISqlTypeFactoryWithNoParams
    public static Binary: ISqlTypeFactoryWithNoParams
    public static BINARY: ISqlTypeFactoryWithNoParams
    public static VarBinary: ISqlTypeFactoryWithLength
    public static VARBINARY: ISqlTypeFactoryWithLength
    public static Image: ISqlTypeFactoryWithNoParams
    public static IMAGE: ISqlTypeFactoryWithNoParams
    public static Xml: ISqlTypeFactoryWithNoParams
    public static XML: ISqlTypeFactoryWithNoParams
    public static Char: ISqlTypeFactoryWithLength
    public static CHAR: ISqlTypeFactoryWithLength
    public static NChar: ISqlTypeFactoryWithLength
    public static NCHAR: ISqlTypeFactoryWithLength
    public static NText: ISqlTypeFactoryWithNoParams
    public static NTEXT: ISqlTypeFactoryWithNoParams
    public static TVP: ISqlTypeFactoryWithTvpType
    public static UDT: ISqlTypeFactoryWithNoParams
    public static Geography: ISqlTypeFactoryWithNoParams
    public static GEOGRAPHY: ISqlTypeFactoryWithNoParams
    public static Geometry: ISqlTypeFactoryWithNoParams
    public static GEOMETRY: ISqlTypeFactoryWithNoParams
    public static Variant: ISqlTypeFactoryWithNoParams
    public static VARIANT: ISqlTypeFactoryWithNoParams
}

export = Database
