import { Collection, Db, Document, MongoClient } from "mongodb";

export abstract class MongoDBRepository<T extends Document> {
    protected readonly db: Db;
    protected readonly collection: Collection<T>;

    constructor(db: Db, collectionName: string) {
        this.db = db;
        this.collection = db.collection<T>(collectionName, { ignoreUndefined: true });
    }
}

export class CreateMongoDBConnectionParams {
    constructor(params: CreateMongoDBConnectionParams) {
        if (params.host === undefined) throw new Error("host is required");
        if (params.port === undefined) throw new Error("port is required");

        this.user = params.user;
        this.password = params.password;
        this.host = params.host;
        this.port = params.port;
    }

    public readonly user?: string;
    public readonly password?: string;
    public readonly host?: string = "localhost";
    public readonly port?: string = "27017";
}

export async function createMongoDBConnection(params: CreateMongoDBConnectionParams): Promise<MongoClient> {
    console.log("Connecting to MongoDB");
    const url = `mongodb://${params.user !== undefined && params.password !== undefined ? `${params.user}:${params.password}@` : ""}${params.host}:${params.port}/admin`;
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}