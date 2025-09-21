import { Group, KVFilter, ReadRepository, WriteRepository } from "@repo/model";
import { AddGroupInput, AddGroupOutput, GetGroupByIdInput, GetGroupByIdOutput, GetGroupByNameInput, GetGroupByNameOutput, GetGroupDescendantsInput, GetGroupDescendantsOutput, GroupService } from "..";

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
        const group = new Group({ name: input.name, description: input.description, parentId: input.parentId });
        return { id: await this.groupWriteRepository.save({ entity: group }) };
    }
    
    async getGroupById(input: GetGroupByIdInput): Promise<GetGroupByIdOutput> {
        const output = await this.groupReadRepository.find({ filter: { id: input.id } })
        return { group: output.entities && output.entities.length > 0 ? output.entities[0] : undefined };
    }

    async getGroupByName(input: GetGroupByNameInput): Promise<GetGroupByNameOutput> {
        const output = await this.groupReadRepository.find({ filter: { name: input.name } })
        return { group: output.entities && output.entities.length > 0 ? output.entities[0] : undefined };
    }

    async getGroupDescendants(input: GetGroupDescendantsInput): Promise<GetGroupDescendantsOutput> {
        const groups = await this.doGetGroupDescendants(input.id);
        return { groups };
    }

    // doGetGroupDescendants is a recursive function that returns all descendants of a group
    async doGetGroupDescendants(groupId: string, n: number = 0): Promise<Group[]> {
        if (n > 10) {
            throw new Error("Maximum recursion depth exceeded");
        }
        const output = await this.groupReadRepository.find({ filter: { parentId: groupId } })
        const groups = [...(output.entities ?? [])];
        if (output.entities && output.entities?.length > 0) {
            for (const group of output.entities) {
                groups.push(...await this.doGetGroupDescendants(group.id!, n + 1));
            }
        }
        return groups;
    }
}