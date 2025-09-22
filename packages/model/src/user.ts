import { convertIds } from "./helpers";
import { MongoDBRepository } from "./mongodb";
import { FindInput, FindOutput, KVFilter, ReadRepository, SaveInput, WriteRepository } from "./repository";
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

export class MongoDBUserWriteRepository extends MongoDBRepository<User> implements WriteRepository<User> {
    async save(input: SaveInput<User>): Promise<string> {
        input.entity.id = undefined;
        const existingUser = await this.collection.findOne({ email: input.entity.email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const result = await this.collection.insertOne(input.entity);
        return result.insertedId.toString();
    }
}
export class MongoDBUserReadRepository extends MongoDBRepository<User> implements ReadRepository<User, KVFilter> {
    async find(input: FindInput<KVFilter>): Promise<FindOutput<User>> {
        const filter = convertIds<User>(input.filter as KVFilter);
        const users = await this.collection.find(filter || {})
            .limit(input.limit || 10)
            .toArray();
        return { entities: users };
    }
}
