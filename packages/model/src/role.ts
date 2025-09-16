import { MongoClient } from "mongodb";
import { DeleteInput, FindInput, FindOutput, ReadRepository, SaveInput, WriteRepository } from "./repository";

export enum RoleType {
    ADMIN = "ADMIN",
    USER = "USER",
}

export class Role {
    id!: string;
    name!: string;
    type!: RoleType;
}

export class MongoDBRoleWriteRepository implements WriteRepository<Role> {
    private readonly client: MongoClient;

    constructor(client: MongoClient) {
        this.client = client;
    }

    async save(input: SaveInput<Role>): Promise<string> {
        throw new Error("Method not implemented.");
    }
    delete(input: DeleteInput): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
    
export class MongoDBRoleReadRepository implements ReadRepository<Role> {
    private readonly client: MongoClient;

    constructor(client: MongoClient) {
        this.client = client;
    }

    find(input: FindInput): Promise<FindOutput<Role>> {
        throw new Error("Method not implemented.");
    }
}
        
