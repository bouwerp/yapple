import { Role, User } from "@repo/model";

export interface UserService {
    addUser(input: AddUserInput): Promise<AddUserOutput>;
    getUsers(input: GetUsersInput): Promise<GetUsersOutput>;
    getUserByEmail(input: GetUserByEmailInput): Promise<GetUserByEmailOutput>;
}

export class AddUserInput {
    name!: string;
    email!: string;
    passwordHash!: string;
    roles!: Role[];
}

export class AddUserOutput {
    id!: string;
}

export class GetUsersInput {
    groupId!: string;
}

export class GetUsersOutput {
    users?: User[];
}

export class GetUserByEmailInput {
    email!: string;
}

export class GetUserByEmailOutput {
    user?: User;
}
    

    

