import { User } from "@repo/model";
import { Request, Response } from "express";
import { GroupService } from "../services/group";
import { UserService } from "../services/user";

export class GetUsersRouteDeps {
    userService!: UserService;
    groupService!: GroupService;
}

export type GetUsersRequest = Request<unknown, unknown, unknown, { groupId: string; }>;

export type GetUsersResponse = Response<{ users?: User[]; error?: string; }>;

export const getUsers = (deps: GetUsersRouteDeps) => async (req: GetUsersRequest, res: GetUsersResponse) => {
    if (!req.query.groupId) {
        return res.status(400).json({ error: "Missing groupId" });
    }

    const contextUser = req.data?.user;
    for (const role of contextUser?.roles ?? []) {
        if (role.groupId === req.query.groupId) {
            break;
        } else {
            const getGroupDescendantsOutput = await deps.groupService.getGroupDescendants({ id: role.groupId });
            if (getGroupDescendantsOutput?.groups?.find((group) => group.id === req.query.groupId)) {
                break;
            }
        }
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { userService } = deps;
    const output = await userService.getUsersByGroup({ groupId: req.query.groupId });
    res.json({ users: output?.users ?? [] });
};