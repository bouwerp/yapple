import { RoleType } from "@repo/model";
import { GroupService } from "../group";
import { PasswordService } from "../password";
import { UserService } from "../user";

export interface CreateTestDataDeps {
    groupService: GroupService;
    userService: UserService;
    passwordService: PasswordService;
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
    console.log("creating test groups");
    const southAfricaGroupID = await getOrCreateGroup(deps, "South Africa", rootGroup.group.id!);
    const johannesburgGroupID = await getOrCreateGroup(deps, "Johannesburg", southAfricaGroupID);
    const capeTownGroupID = await getOrCreateGroup(deps, "Cape Town", southAfricaGroupID);
    const northcliffGroupID = await getOrCreateGroup(deps, "Northcliff", johannesburgGroupID);
    const parkviewGroupID = await getOrCreateGroup(deps, "Parkview", johannesburgGroupID);
    const seaPointGroupID = await getOrCreateGroup(deps, "Sea Point", capeTownGroupID);
    const muizenbergGroupID = await getOrCreateGroup(deps, "Muizenberg", capeTownGroupID);

    // users
    console.log("creating test users");
    await getOrCreateUser(deps, "User 0", "user0@example.com", "password0", southAfricaGroupID);
    await getOrCreateUser(deps, "User 1", "user1@example.com", "password1", johannesburgGroupID);
    await getOrCreateUser(deps, "User 2", "user2@example.com", "password2", capeTownGroupID);
    await getOrCreateUser(deps, "User 3", "user3@example.com", "password3", northcliffGroupID);
    await getOrCreateUser(deps, "User 4", "user4@example.com", "password4", parkviewGroupID);
    await getOrCreateUser(deps, "User 5", "user5@example.com", "password5", seaPointGroupID);
    await getOrCreateUser(deps, "User 6", "user6@example.com", "password6", muizenbergGroupID);
}

const getOrCreateGroup = async (deps: CreateTestDataDeps, name: string, parentId: string): Promise<string> => {
    const output = await deps.groupService.getGroupByName({ name });
    if (output.group === undefined) {
        return (await deps.groupService.addGroup({ name, parentId })).id;
    }
    return output.group.id!;
}

const getOrCreateUser = async (deps: CreateTestDataDeps, name: string, email: string, password: string, groupId: string): Promise<void> => {
    const output = await deps.userService.getUserByEmail({ email });
    if (output.user === undefined) {
        const passwordHash = (await deps.passwordService.hashPassword({ password })).hash;
        await deps.userService.addUser({ name, email, passwordHash, roles: [{ groupId, type: RoleType.USER }] });
    }
}