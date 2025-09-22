
export interface WriteRepository<T> {
    save(input: SaveInput<T>): Promise<string>;
}

export interface ReadRepository<T, FilterT> {
    find(input: FindInput<FilterT>): Promise<FindOutput<T>>;
}

export class DeleteInput {
    id!: string;
}

export class SaveInput<T> {
    entity!: T;
}

export class FindInput<FilterT> {
    filter?: FilterT;
    limit?: number;
}

export class FindOutput<T> {
    entities?: T[];
}

export type KVFilter = {
    [key: string]: KVFilter | string;
}