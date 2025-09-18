import { RoleType, User } from "@repo/model";
import { Request, Response } from "express";
import { UserService } from "../services/user";

export class UserServiceDeps {
    userService!: UserService;
    rootGroupID!: string;
}

export const addUser = (deps: UserServiceDeps) => async (req: Request<{ user: User }>, res: Response) => {
    const contextUser = req.params.user;
    // only users with ADMIN in the root group can add users
    if (contextUser.roles?.find(role => role.type === RoleType.ADMIN && 
            role.groupId === deps.rootGroupID) === undefined) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, email } = req.body;
    try {
        const id = await deps.userService.addUser({ name, email, passwordHash: "", roles: [] });
        return res.json({ id });
    } catch (e) {
        return res.status(400).json({ error: (e as Error).message });
    }
}