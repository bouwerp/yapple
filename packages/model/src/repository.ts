
export interface WriteRepository<T> {
    save(input: SaveInput<T>): Promise<string>;
    delete(input: DeleteInput): Promise<void>;
}

export interface ReadRepository<T> {
    find(input: FindInput): Promise<FindOutput<T>>;
}

export class DeleteInput {
    id!: string;
}

export class SaveInput<T> {
    entity!: T;
}

export class FindInput {
    id?: string;
}

export class FindOutput<T> {
    entity?: T;
}