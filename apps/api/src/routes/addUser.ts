import { Role, RoleType } from "@repo/model";
import { Request, Response } from "express";
import { PasswordService } from "../services/password";
import { UserService } from "../services/user";

export class AddUserRouteDeps {
    userService!: UserService;
    passwordService!: PasswordService;
    rootGroupID!: string;
}

export interface AddUserRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        roles: Role[];
    };
}

export const addUser = (deps: AddUserRouteDeps) => async (req: AddUserRequest, res: Response) => {
    const contextUser = req.data?.user;
    // only users with ADMIN in the root group can add users
    if (contextUser === undefined || contextUser.roles?.find(
        (role: Role) => role.type === RoleType.ADMIN && 
            role.groupId === deps.rootGroupID) === undefined) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, email, password, roles } = req.body;
    try {
        const hashPasswordOutput = await deps.passwordService.hashPassword({ password });
        const id = await deps.userService.addUser({ name, email, passwordHash: hashPasswordOutput.hash!, roles });
        return res.json({ id });
    } catch (e) {
        return res.status(400).json({ error: (e as Error).message });
    }
}