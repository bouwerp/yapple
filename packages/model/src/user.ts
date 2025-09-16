import { MongoDBRepository } from "./mongodb";
import { DeleteInput, FindInput, FindOutput, ReadRepository, SaveInput, WriteRepository } from "./repository";

export class User {
    constructor(input: User) {
        this.id = input.id;
        this.name = input.name;
        this.email = input.email;
        this.passwordHash = input.passwordHash;
        this.roles = input.roles;
    }

    id?: string;
    name?: string;
    email!: string;
    passwordHash!: string;
    roles?: string[];
}

export class MongoDBUserWriteRepository extends MongoDBRepository implements WriteRepository<User> {
    async save(input: SaveInput<User>): Promise<string> {
        const existingUser = await this.db.collection(this.collection).findOne({ email: input.entity.email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const result = await this.db.collection(this.collection).insertOne(input.entity);
        return result.insertedId.toString();
    }

    async delete(input: DeleteInput): Promise<void> {
        const existingUser = await this.db.collection(this.collection).findOne({ email: input.id });
        if (!existingUser) {
            throw new Error("User not found");
        }
        await this.db.collection(this.collection).deleteOne({ email: input.id });
    }
}
    
export class MongoDBUserReadRepository extends MongoDBRepository implements ReadRepository<User> {
    find(input: FindInput): Promise<FindOutput<User>> {
        throw new Error("Method not implemented.");
    }
}
