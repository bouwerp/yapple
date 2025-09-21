import { RoleType } from "@repo/model";
import { GroupService } from "../group";
import { UserService } from "../user";

export interface CreateTestDataDeps {
    groupService: GroupService;
    userService: UserService;
}

/**
 * Creates test data. 
 * Group structure:
 *                     [ South Africa ]
 *                            |
 *                  +---------------------------+
 *                  |                           |
 *          [ Johannesburg ]               [ Cape Town ]
 *              |                               |
 *         +----+-----------+               +----+-----------+
 *         |                |               |                |
 *    [ Northcliff ]    [ Parkview ]       [ Sea Point ]  [ Muizenberg ]
 * 
 * User structure:
 * [User 0] -> [South Africa]
 * [User 1] -> [Johannesburg]
 * [User 2] -> [Cape Town]
 * [User 3] -> [Northcliff]
 * [User 4] -> [Parkview]
 * [User 5] -> [Sea Point]
 * [User 6] -> [Muizenberg]
 * @param deps The dependencies.
 * @returns A function that creates test data.
 */
export const createTestData = (deps: CreateTestDataDeps) => async () => {
    const rootGroup = await deps.groupService.getGroupByName({ name: "root" });
    if (rootGroup.group === undefined) {
        throw new Error("root group not found");
    }

    // groups
    const southAfricaGroupOutput = await deps.groupService.addGroup({ name: "South Africa", parentId: rootGroup.group.id });
    const johannesburgGroupOutput = await deps.groupService.addGroup({ name: "Johannesburg", parentId: southAfricaGroupOutput.id });
    const capeTownGroupOutput = await deps.groupService.addGroup({ name: "Cape Town", parentId: southAfricaGroupOutput.id });
    const northcliffGroupOutput = await deps.groupService.addGroup({ name: "Northcliff", parentId: johannesburgGroupOutput.id });
    const parkviewGroupOutput = await deps.groupService.addGroup({ name: "Parkview", parentId: johannesburgGroupOutput.id });
    const seaPointGroupOutput = await deps.groupService.addGroup({ name: "Sea Point", parentId: capeTownGroupOutput.id });
    const muizenbergGroupOutput = await deps.groupService.addGroup({ name: "Muizenberg", parentId: capeTownGroupOutput.id });

    // users
    await deps.userService.addUser({ name: "User 0", email: "user0@example.com", passwordHash: "password0", roles: [{ groupId: southAfricaGroupOutput.id, type: RoleType.USER }] });
    await deps.userService.addUser({ name: "User 1", email: "user1@example.com", passwordHash: "password1", roles: [{ groupId: johannesburgGroupOutput.id, type: RoleType.USER }] });
    await deps.userService.addUser({ name: "User 2", email: "user2@example.com", passwordHash: "password2", roles: [{ groupId: capeTownGroupOutput.id, type: RoleType.USER }] });
    await deps.userService.addUser({ name: "User 3", email: "user3@example.com", passwordHash: "password3", roles: [{ groupId: northcliffGroupOutput.id, type: RoleType.USER }] });
    await deps.userService.addUser({ name: "User 4", email: "user4@example.com", passwordHash: "password4", roles: [{ groupId: parkviewGroupOutput.id, type: RoleType.USER }] });
    await deps.userService.addUser({ name: "User 5", email: "user5@example.com", passwordHash: "password5", roles: [{ groupId: seaPointGroupOutput.id, type: RoleType.USER }] });
    await deps.userService.addUser({ name: "User 6", email: "user6@example.com", passwordHash: "password6", roles: [{ groupId: muizenbergGroupOutput.id, type: RoleType.USER }] });
}