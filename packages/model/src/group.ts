import { Filter } from "mongodb";
import { MongoDBRepository } from "./mongodb";
import { DeleteInput, FindInput, FindOutput, ReadRepository, SaveInput, WriteRepository } from "./repository";

export class Group {
    constructor(input: Group) {
        this.id = input.id;
        this.name = input.name;
    }

    id?: string;
    name!: string;
}

export class MongoDBGroupWriteRepository extends MongoDBRepository implements WriteRepository<Group> {
    async save(input: SaveInput<Group>): Promise<string> {
        const existingGroup = await this.db.collection<Group>(this.collection).findOne({ name: input.entity.name });
        if (existingGroup) {
            throw new Error("group already exists");
        }
        const result = await this.db.collection<Group>(this.collection).insertOne(input.entity);
        return result.insertedId.toString();
    }
    
    async delete(input: DeleteInput): Promise<void> {
        const existingGroup = await this.db.collection<Group>(this.collection).findOne({ id: input.id });
        if (!existingGroup) {
            throw new Error("group not found");
        }
        await this.db.collection<Group>(this.collection).deleteOne({ id: input.id });
    }
}   

export class MongoDBGroupReadRepository extends MongoDBRepository implements ReadRepository<Group, Filter<Group>> {
    async find(input: FindInput<Filter<Group>>): Promise<FindOutput<Group>> {
        const groups = await this.db.collection<Group>(this.collection)
            .find(input.filter || {})
            .limit(input.limit || 10)
            .toArray();
        return { entities: groups };
    }
}
