import { Filter } from "mongodb";
import { convertIds } from "./helpers";
import { MongoDBRepository } from "./mongodb";
import { FindInput, FindOutput, ReadRepository, SaveInput, WriteRepository } from "./repository";

export class Group {
    constructor(input: Group) {
        this.id = input.id;
        this.name = input.name;
        this.description = input.description;
        this.parentId = input.parentId;
    }

    id?: string;
    parentId?: string;
    name!: string;
    description?: string;
}

export class MongoDBGroupWriteRepository 
    extends MongoDBRepository<Group> 
    implements WriteRepository<Group> {
    async save(input: SaveInput<Group>): Promise<string> {
        input.entity.id = undefined;
        const existingGroup = await this.collection.findOne({ 
            name: input.entity.name, 
            description: input.entity.description,
            parentId: input.entity.parentId,
         });
        if (existingGroup) {
            throw new Error("group already exists");
        }
        const result = await this.collection.insertOne(input.entity, {});
        return result.insertedId.toString();
    }
}   

export class MongoDBGroupReadRepository 
    extends MongoDBRepository<Group> 
    implements ReadRepository<Group, Filter<Group>> {

    async find(input: FindInput<Filter<Group>>): Promise<FindOutput<Group>> {
        const filter = convertIds<Group>(input.filter as Filter<Group>);
        const groups = await this.collection.find(filter || {}, 
                {projection: {_id: 0, id: {$toString: "$_id"}, name: 1, description: 1, parentId: 1}})
            .limit(input.limit || 10)
            .toArray();
        return { entities: groups };
    }
}
