const EventEmitter = require("events");
const mssql = require("mssql");

/**
 * Mock class for PreparedStatement to simulate the behavior of mssql.PreparedStatement.
 */
class MockPreparedStatement extends EventEmitter {
    /**
     * Creates a new instance of MockPreparedStatement.
     */
    constructor() {
        super();

        this.transaction = null;
        this.parameters = {};
        this.prepared = false;
        this.statement = null;
        this.stream = false;
    }
}

MockPreparedStatement.prototype.input = jest.fn().mockName("input");
MockPreparedStatement.prototype.output = jest.fn().mockName("output");
MockPreparedStatement.prototype.prepare = jest.fn().mockName("prepare");
MockPreparedStatement.prototype.execute = jest.fn().mockName("execute");
MockPreparedStatement.prototype.unprepare = jest.fn().mockName("unprepare");

mssql.PreparedStatement = MockPreparedStatement;

const Database = require("../index");

jest.mock("mssql");

describe("Database", () => {
    let db, mockPool;

    beforeEach(() => {
        mockPool = {
            connected: true,
            close: jest.fn()
        };
        mssql.connect = jest.fn().mockResolvedValue(mockPool);
        mssql.close = jest.fn();
        db = new Database({user: "test", password: "test", server: "localhost", database: "testdb"});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should create a connection pool if not already connected", async () => {
        await db.query("SELECT 1");
        expect(mssql.connect).toHaveBeenCalledWith({user: "test", password: "test", server: "localhost", database: "testdb"});
        expect(mockPool.connected).toBe(true);
    });

    test("should reuse an existing connection pool if already connected", async () => {
        await db.query("SELECT 1");
        await db.query("SELECT 2");
        expect(mssql.connect).toHaveBeenCalledTimes(1);
    });

    test("should close and recreate the pool if disconnected", async () => {
        mockPool.connected = false;
        await db.query("SELECT 1");
        expect(mssql.close).toHaveBeenCalled();
        expect(mssql.connect).toHaveBeenCalledTimes(1);
    });

    test("should execute a query with parameters", async () => {
        MockPreparedStatement.prototype.execute = jest.fn().mockImplementation(() => ({recordset: [{id: 1}]}));

        const result = await db.query("SELECT * FROM Users WHERE id = @id", {
            id: {type: mssql.Int, value: 1}
        });

        expect(MockPreparedStatement.prototype.input).toHaveBeenCalledWith("id", mssql.Int);
        expect(MockPreparedStatement.prototype.prepare).toHaveBeenCalledWith("SELECT * FROM Users WHERE id = @id");
        expect(MockPreparedStatement.prototype.execute).toHaveBeenCalledWith({id: 1});
        expect(MockPreparedStatement.prototype.unprepare).toHaveBeenCalled();
        expect(result).toEqual({recordset: [{id: 1}]});
    });

    test("should close and reset the pool if it exists but is not connected", async () => {
        // Call the private #getPool method indirectly via a query so that a pool is available.
        await db.query("SELECT 1");

        // Simulate a disconnected pool
        mockPool.connected = false;

        // Call the private #getPool method indirectly via a query so that the pool is closed and recreated.
        await db.query("SELECT 1");

        // Verify that the pool was closed
        expect(mssql.close).toHaveBeenCalled();

        // Verify that a new connection pool was created
        expect(mssql.connect).toHaveBeenCalledWith({user: "test", password: "test", server: "localhost", database: "testdb"});
    });

    test("should throw an error if settings are not configured", async () => {
        const dbWithoutSettings = new Database(null);
        await expect(dbWithoutSettings.query("SELECT 1")).rejects.toThrow("Database settings are not configured. Please provide a valid config object.");
    });
});
