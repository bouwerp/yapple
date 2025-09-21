import { Role, User } from "@repo/model";

export interface UserService {
    addUser(input: AddUserInput): Promise<AddUserOutput>;
    getUsersByGroup(input: GetUsersByGroupInput): Promise<GetUsersByGroupOutput>;
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

export class GetUsersByGroupInput {
    groupId!: string;
}

export class GetUsersByGroupOutput {
    users?: User[];
}

export class GetUserByEmailInput {
    email!: string;
}

export class GetUserByEmailOutput {
    user?: User;
}
    

    

