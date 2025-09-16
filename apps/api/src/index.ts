import { log } from "@repo/logger";
import { createMongoDBConnection } from "@repo/model";
import * as dotenv from 'dotenv';
import "reflect-metadata";
import { createServer } from "./server";

dotenv.config();

async function main() {
    const client = await createMongoDBConnection();

    const port = Number(process.env.PORT || 5001);
    const server = createServer({ port, client });

    server.listen(port, () => {
        log(`api running on ${port}`);
    });
}

main();

