import { createMongoDBConnection, MongoDBGroupReadRepository, MongoDBGroupWriteRepository, MongoDBUserReadRepository, MongoDBUserWriteRepository } from "@repo/model";
import * as dotenv from 'dotenv';
import "reflect-metadata";
import { createServer } from "./server";
import { V1GroupService } from "./services/group/impl/v1";
import { V1PasswordService } from "./services/password/impl/v1";
import { V1TokenService } from "./services/token/impl/v1";
import { V1UserService } from "./services/user/impl/v1";

dotenv.config();

async function main() {
    const client = await createMongoDBConnection();

    const userReadRepository = new MongoDBUserReadRepository(client!.db("core"), "users");
    const userWriteRepository = new MongoDBUserWriteRepository(client!.db("core"), "users");
    const groupReadRepository = new MongoDBGroupReadRepository(client!.db("core"), "groups");
    const groupWriteRepository = new MongoDBGroupWriteRepository(client!.db("core"), "groups");

    const groupService = new V1GroupService({groupReadRepository, groupWriteRepository});

    const userService = new V1UserService({userReadRepository, userWriteRepository});

    const tokenService = new V1TokenService({jwtSecret: process.env.JWT_SECRET!});

    const passwordService = new V1PasswordService({saltRounds: Number(process.env.PASSWORD_SALT_ROUNDS!)});
    
    // TODO: do startup tasks: 
    // TODO: create root group, if it doesn't exist;
    // TODO: create admin users, if they doesn't exist; 

    const port = Number(process.env.PORT || 5001);
    const server = createServer({ port, client, userService, tokenService, passwordService });

    server.listen(port, () => {
        console.log(`api running on ${port}`);
    });
}

main();

