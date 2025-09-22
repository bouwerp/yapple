import { afterAll, beforeAll, test } from "@jest/globals";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoDBGroupReadRepository, MongoDBGroupWriteRepository } from "../group";
import { createMongoDBConnection } from "../mongodb";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: "core",
      port: 27018
    },
    auth: {
      enable: true,
      customRootName: "admin",
      customRootPwd: "password"
    }
  });
});

afterAll(async () => {
  await mongoServer.stop();
});

test("group read repository", async () => {
  const client = await createMongoDBConnection({
      host: "localhost",
      port: "27018",
      user: "admin",
      password: "password"
  });

  const groupReadRepository = new MongoDBGroupReadRepository(client!.db("core"), "groups");

  // test data
  await client.db("core").collection("groups").insertOne({
    name: "test1",
    description: "test1",
    parentId: undefined
  });
  await client.db("core").collection("groups").insertOne({
    name: "test2",
    description: "test2",
    parentId: undefined
  });

  // find groups
  const findOutput1 = await groupReadRepository.find({});
  expect(findOutput1.entities?.length).toBe(2);

  // get group by name
  const getOutput1 = await groupReadRepository.find({filter: { name: "test1" }});
  expect(getOutput1.entities?.length).toBe(1);
});

test("group write repository", async () => {
  const client = await createMongoDBConnection({
      host: "localhost",
      port: "27018",
      user: "admin",
      password: "password"
  });

  const db = client!.db("core");
  const groupWriteRepository = new MongoDBGroupWriteRepository(db, "groups");

  // save group
  await groupWriteRepository.save({
    entity: {
      name: "test3",
      description: "test3",
      parentId: undefined
    }
  });

  const findOutput1 = await db.collection("groups").findOne({ name: "test3" });
  expect(findOutput1).toBeDefined();
  expect(findOutput1?.name).toBe("test3");
});