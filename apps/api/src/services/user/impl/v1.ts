import { MongoDBUserReadRepository, MongoDBUserWriteRepository, User } from "@repo/model";
import { AddUserInput, AddUserOutput, GetUserByEmailInput, GetUserByEmailOutput, GetUsersInput, GetUsersOutput, UserService } from "..";

export class V1UserServiceDeps {
    userReadRepository!: MongoDBUserReadRepository;
    userWriteRepository!: MongoDBUserWriteRepository;
}

export class V1UserService implements UserService {
    private readonly userReadRepository: MongoDBUserReadRepository;
    private readonly userWriteRepository: MongoDBUserWriteRepository;

    constructor(deps: V1UserServiceDeps) {
        this.userReadRepository = deps.userReadRepository;
        this.userWriteRepository = deps.userWriteRepository;
    }

    async addUser(input: AddUserInput): Promise<AddUserOutput> {
        const user = new User({ name: input.name, email: input.email, passwordHash: input.passwordHash, roles: input.roles });
        return { id: await this.userWriteRepository.save({ entity: user }) };
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