import { MongoDBRepository } from "./mongodb";
import { DeleteInput, FindInput, FindOutput, ReadRepository, SaveInput, WriteRepository } from "./repository";

export class User {
    id!: string;
    name!: string;
    email!: string;
    roles!: string[];
}

export class MongoDBUserWriteRepository extends MongoDBRepository implements WriteRepository<User> {
    save(input: SaveInput<User>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(input: DeleteInput): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
    
export class MongoDBUserReadRepository extends MongoDBRepository implements ReadRepository<User> {
    find(input: FindInput): Promise<FindOutput<User>> {
        throw new Error("Method not implemented.");
    }
}
