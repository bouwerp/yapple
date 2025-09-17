import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { ComparePasswordInput, ComparePasswordOutput, HashPasswordInput, HashPasswordOutput, PasswordService } from "..";

export class V1PasswordServiceDeps {
    saltRounds: number = 10;
}

export class V1PasswordService implements PasswordService {
    private readonly saltRounds: number;
    constructor(deps: V1PasswordServiceDeps) {
        this.saltRounds = deps.saltRounds;
    }

    async hashPassword(input: HashPasswordInput): Promise<HashPasswordOutput> {
        const salt = genSaltSync(this.saltRounds);
        return { hash: hashSync(input.password, salt) };
    }

    async comparePassword(input: ComparePasswordInput): Promise<ComparePasswordOutput> {
        return { isMatch: compareSync(input.password, input.hash) };
    }
}