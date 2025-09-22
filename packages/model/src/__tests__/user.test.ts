import { afterAll, beforeAll, test } from "@jest/globals";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMongoDBConnection } from "../mongodb";
import { MongoDBUserReadRepository, MongoDBUserWriteRepository } from "../user";

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

test("user read repository", async () => {
  const client = await createMongoDBConnection({
      host: "localhost",
      port: "27018",
      user: "admin",
      password: "password"
  });

  const userReadRepository = new MongoDBUserReadRepository(client!.db("core"), "users");

  // test data
  await client.db("core").collection("users").insertOne({
    name: "test1",
    email: "test1@example.com",
    passwordHash: "test"
  });
  await client.db("core").collection("users").insertOne({
    name: "test2",
    email: "test2@example.com",
    passwordHash: "test"
  });

  // find users
  const findOutput1 = await userReadRepository.find({});
  expect(findOutput1.entities?.length).toBe(2);

  // get user by name
  const getOutput1 = await userReadRepository.find({filter: { name: "test1" }});
  expect(getOutput1.entities?.length).toBe(1);
});

test("user write repository", async () => {
  const client = await createMongoDBConnection({
      host: "localhost",
      port: "27018",
      user: "admin",
      password: "password"
  });

  const db = client!.db("core");
  const userWriteRepository = new MongoDBUserWriteRepository(db, "users");

  // save user
  await userWriteRepository.save({
    entity: {
      name: "test3",
      email: "test3@example.com",
      passwordHash: "test"
    }
  });

  const findOutput1 = await db.collection("users").findOne({ name: "test3" });
  expect(findOutput1).toBeDefined();
  expect(findOutput1?.name).toBe("test3");
});