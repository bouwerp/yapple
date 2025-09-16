import { MongoDBUserReadRepository, MongoDBUserWriteRepository, User } from "@repo/model";
import { AddUserInput, AddUserOutput, GetUserByEmailInput, GetUserByEmailOutput, GetUsersInput, GetUsersOutput, UserService } from "..";

class V1UserService implements UserService {
    private readonly userReadRepository: MongoDBUserReadRepository;
    private readonly userWriteRepository: MongoDBUserWriteRepository;

    constructor(
        userReadRepository: MongoDBUserReadRepository, 
        userWriteRepository: MongoDBUserWriteRepository,
    ) {
        this.userReadRepository = userReadRepository;
        this.userWriteRepository = userWriteRepository;
    }

    async addUser(input: AddUserInput): Promise<AddUserOutput> {
        const user = new User({ name: input.name, email: input.email, passwordHash: input.passwordHash });
        return { id: await this.userWriteRepository.save({ entity: user }) };
    }
    
    async getUsers(input: GetUsersInput): Promise<GetUsersOutput> {
        const output = await this.userReadRepository.find({ filter: {} })
        return { users: output.users };
    }

    async getUserByEmail(input: GetUserByEmailInput): Promise<GetUserByEmailOutput> {
        const output = await this.userReadRepository.find({ filter: { email: input.email } })
        return { user: output.users?.[0] };
    }
}