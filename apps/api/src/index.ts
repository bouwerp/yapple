import { createMongoDBConnection, MongoDBGroupReadRepository, MongoDBGroupWriteRepository, MongoDBUserReadRepository, MongoDBUserWriteRepository, RoleType } from "@repo/model";
import * as dotenv from 'dotenv';
import "reflect-metadata";
import { createServer } from "./server";
import { V1GroupService } from "./services/group/impl/v1";
import { V1PasswordService } from "./services/password/impl/v1";
import { V1TokenService } from "./services/token/impl/v1";
import { AddUserInput } from "./services/user";
import { V1UserService } from "./services/user/impl/v1";

dotenv.config();

async function main() {
    const client = await createMongoDBConnection();

    // init repositories
    const userReadRepository = new MongoDBUserReadRepository(client!.db("core"), "users");
    const userWriteRepository = new MongoDBUserWriteRepository(client!.db("core"), "users");
    const groupReadRepository = new MongoDBGroupReadRepository(client!.db("core"), "groups");
    const groupWriteRepository = new MongoDBGroupWriteRepository(client!.db("core"), "groups");

    // init services
    const groupService = new V1GroupService({groupReadRepository, groupWriteRepository});
    const userService = new V1UserService({userReadRepository, userWriteRepository});
    const tokenService = new V1TokenService({jwtSecret: process.env.JWT_SECRET!});
    const passwordService = new V1PasswordService({saltRounds: Number(process.env.PASSWORD_SALT_ROUNDS!)});
    
    // do startup tasks: 
    // TODO: create root group, if it doesn't exist;
    let rootGroupID: string;
    try {
        const rootGroup = await groupService.getGroupByName({ name: "root" })
        if (rootGroup.group === undefined) {
            const addGroupOutput = await groupService.addGroup({ name: "root" });
            rootGroupID = addGroupOutput.id!;
        } else {
            rootGroupID = rootGroup.group.id!;
        }
    } catch (e) {
        console.error("failed to create root group: ", (e as Error).message);
    }

    // TODO: create admin users, if they don't exist; 
    const adminUsers = process.env.ADMIN_USERS?.split(/\w*,\w/)
    if (adminUsers === undefined || adminUsers.length === 0) {
        console.error("ADMIN_USERS is not set");
        process.exit();
    }

    console.info("creating admin users:", adminUsers.join(", "));
    for (const userCredentials of adminUsers) {
        try {
            const [email, password] = userCredentials.split(":");
            const user = await userService.getUserByEmail({ email: email! });
            if (user.user === undefined) {
                const hashPasswordOutput = await passwordService.hashPassword({ password: password! });
                await userService.addUser({ 
                    email: email!, 
                    passwordHash: hashPasswordOutput.hash!,
                    roles: [{
                        groupId: rootGroupID!,
                        type: RoleType.ADMIN
                    }],
                 } as AddUserInput);
            } else {
                console.info("admin user already exists: ", email);
            }
        } catch (e) {
            console.error("failed to create admin user: ", (e as Error).message);
        }
    }

    const port = Number(process.env.PORT || 5001);
    const server = createServer({ port, client, userService, tokenService, passwordService });

    server.listen(port, () => {
        console.log(`api running on ${port}`);
    });
}

main();

