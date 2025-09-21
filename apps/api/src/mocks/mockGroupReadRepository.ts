import { Group, KVFilter, ReadRepository } from "@repo/model";

export class MockGroupReadRepository implements ReadRepository<Group, KVFilter> {
    private readonly entities: Group[];

    constructor(entities: Group[]) {
        this.entities = entities;
    }
    
    async find({ filter }: { filter: KVFilter }): Promise<{ entities: Group[] }> {
        return { entities: this.entities };
    }
}