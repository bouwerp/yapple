import { MongoDBRepository } from "./mongodb";
import { DeleteInput, FindInput, FindOutput, KVFilter, ReadRepository, SaveInput, WriteRepository } from "./repository";
import { Role } from "./role";

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
    roles?: Role[];
}

export class MongoDBUserWriteRepository extends MongoDBRepository implements WriteRepository<User> {
    async save(input: SaveInput<User>): Promise<string> {
        const existingUser = await this.db.collection<User>(this.collection).findOne({ email: input.entity.email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const result = await this.db.collection<User>(this.collection).insertOne(input.entity);
        return result.insertedId.toString();
    }

    async delete(input: DeleteInput): Promise<void> {
        const existingUser = await this.db.collection<User>(this.collection).findOne({ email: input.id });
        if (!existingUser) {
            throw new Error("User not found");
        }
        await this.db.collection<User>(this.collection).deleteOne({ email: input.id });
    }
}
export class MongoDBUserReadRepository extends MongoDBRepository implements ReadRepository<User, KVFilter> {
    async find(input: FindInput<KVFilter>): Promise<FindOutput<User>> {
        const users = await this.db.collection<User>(this.collection)
            .find(input.filter || {})
            .limit(input.limit || 10)
            .toArray();
        return { entities: users };
    }
}
