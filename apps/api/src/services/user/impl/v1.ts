import { Group, KVFilter, ReadRepository, User, WriteRepository } from "@repo/model";
import { AddUserInput, AddUserOutput, GetUserByEmailInput, GetUserByEmailOutput, GetUsersInput, GetUsersOutput, UserService } from "..";

export class V1UserServiceDeps {
    userReadRepository!: ReadRepository<User, KVFilter>;
    userWriteRepository!: WriteRepository<User>;
    groupReadRepository!: ReadRepository<Group, KVFilter>;
}

export class V1UserService implements UserService {
    private readonly userReadRepository: ReadRepository<User, KVFilter>;
    private readonly userWriteRepository: WriteRepository<User>;
    private readonly groupReadRepository: ReadRepository<Group, KVFilter>;

    constructor(deps: V1UserServiceDeps) {
        this.userReadRepository = deps.userReadRepository;
        this.userWriteRepository = deps.userWriteRepository;
        this.groupReadRepository = deps.groupReadRepository;
    }   

    async addUser(input: AddUserInput): Promise<AddUserOutput> {
        // ensure that all groups in input role exist
        for (const role of input.roles) {
            const group = await this.groupReadRepository.find({ filter: { id: role.groupId } });
            if (group.entities === undefined || group.entities.length === 0) {
                throw new Error(`group with id ${role.groupId} does not exist`);
            }
        }
        return { id: await this.userWriteRepository.save({ entity: new User({ 
            name: input.name, 
            email: input.email, 
            passwordHash: 
            input.passwordHash, 
            roles: input.roles,
         }) }) };
    }
    
    async getUsers(input: GetUsersInput): Promise<GetUsersOutput> {
        const output = await this.userReadRepository.find({ filter: {"roles.groupId": input.groupId } })
        return { users: output.entities };
    }

    async getUserByEmail(input: GetUserByEmailInput): Promise<GetUserByEmailOutput> {
        const output = await this.userReadRepository.find({ filter: { email: input.email } })
        return { user: output.entities && output.entities.length > 0 ? output.entities[0] : undefined };
    }
}