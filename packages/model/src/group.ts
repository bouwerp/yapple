import { MongoClient } from "mongodb";
import { DeleteInput, FindInput, FindOutput, ReadRepository, SaveInput, WriteRepository } from "./repository";

export class Group {
  id!: string;
  name!: string;
}

export class MongoDBGroupWriteRepository implements WriteRepository<Group> {
    private readonly client: MongoClient;

    constructor(client: MongoClient) {
        this.client = client;
    }

    save(input: SaveInput<Group>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(input: DeleteInput): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export class MongoDBGroupReadRepository implements ReadRepository<Group> {
    private readonly client: MongoClient;

    constructor(client: MongoClient) {
        this.client = client;
    }

    find(input: FindInput): Promise<FindOutput<Group>> {
        throw new Error("Method not implemented.");
    }
}
        