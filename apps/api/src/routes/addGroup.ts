import { Role, RoleType } from "@repo/model";
import { Request, Response } from "express";
import { GroupService } from "../services/group";
export class AddGroupRouteDeps {
    groupService!: GroupService;
    rootGroupID!: string;
}

export type AddGroupRequest = Request<unknown, unknown, {
    parentId?: string;
    name: string;
    description: string;
}>;

export type AddGroupResponse = Response<{
    id?: string;
    error?: string;
}>;

export const addGroup = (deps: AddGroupRouteDeps) => async (req: AddGroupRequest, res: AddGroupResponse) => {
    const contextUser = req.data?.user;
    // only users with ADMIN in the root group can add groups
    if (contextUser === undefined || contextUser.roles?.find(
        (role: Role) => role.type === RoleType.ADMIN && 
            role.groupId === deps.rootGroupID) === undefined) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, description, parentId } = req.body;
    try {
        const addGroupOutput = await deps.groupService.addGroup({ name, description, parentId });
        return res.json({ id: addGroupOutput.id });
    } catch (e) {
        return res.status(400).json({ error: (e as Error).message });
    }
}