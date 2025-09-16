import { MongoClient } from "mongodb";

export abstract class MongoDBRepository {
    private readonly client: MongoClient;

    constructor(client: MongoClient) {
        this.client = client;
    }
}

export async function createMongoDBConnection(): Promise<MongoClient> {
    console.log("Connecting to MongoDB");
    const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
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