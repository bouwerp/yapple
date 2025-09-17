export interface PasswordService {
    hashPassword(input: HashPasswordInput): Promise<HashPasswordOutput>;
    comparePassword(input: ComparePasswordInput): Promise<ComparePasswordOutput>;
}

export class HashPasswordInput {
    password!: string;
}

export class HashPasswordOutput {
    hash!: string;
}

export class ComparePasswordInput {
    password!: string;
    hash!: string;
}

export class ComparePasswordOutput {
    isMatch!: boolean;
}
