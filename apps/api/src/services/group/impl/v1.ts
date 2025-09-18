import { Group, KVFilter, ReadRepository, WriteRepository } from "@repo/model";
import { AddGroupInput, AddGroupOutput, GetGroupByIdInput, GetGroupByIdOutput, GetGroupByNameInput, GetGroupByNameOutput, GroupService } from "..";

export class V1GroupServiceDeps {
    groupWriteRepository!: WriteRepository<Group>;
    groupReadRepository!: ReadRepository<Group, KVFilter>;
}

export class V1GroupService implements GroupService {
    private readonly groupWriteRepository: WriteRepository<Group>;
    private readonly groupReadRepository: ReadRepository<Group, KVFilter>;

    constructor(deps: V1GroupServiceDeps) {
        this.groupWriteRepository = deps.groupWriteRepository;
        this.groupReadRepository = deps.groupReadRepository;
    }

    async addGroup(input: AddGroupInput): Promise<AddGroupOutput> {
        const group = new Group({ name: input.name });
        return { id: await this.groupWriteRepository.save({ entity: group }) };
    }
    
    async getGroupById(input: GetGroupByIdInput): Promise<GetGroupByIdOutput> {
        const output = await this.groupReadRepository.find({ filter: { _id: input.id } })
        return { group: output.entities && output.entities.length > 0 ? output.entities[0] : undefined };
    }

    async getGroupByName(input: GetGroupByNameInput): Promise<GetGroupByNameOutput> {
        const output = await this.groupReadRepository.find({ filter: { name: input.name } })
        return { group: output.entities && output.entities.length > 0 ? output.entities[0] : undefined };
    }
}