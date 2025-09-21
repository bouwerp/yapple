import { afterAll, beforeAll, expect, test } from "@jest/globals";
import { createMongoDBConnection, MongoDBUserReadRepository, MongoDBUserWriteRepository, RoleType } from "@repo/model";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MockGroupReadRepository } from "../mocks/mockGroupReadRepository";
import { V1UserService } from "../services/user/impl/v1";

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

test("user service", async () => {
  const client = await createMongoDBConnection({
      host: "localhost",
      port: "27018",
      user: "admin",
      password: "password"
  });

  const userReadRepository = new MongoDBUserReadRepository(client!.db("core"), "users");
  const userWriteRepository = new MongoDBUserWriteRepository(client!.db("core"), "users");
  const groupReadRepository = new MockGroupReadRepository([
    {
      id: "abc123",
      name: "test",
    }
  ]);
  const userService = new V1UserService({userReadRepository, userWriteRepository, groupReadRepository});

  // add user
  const addUserOutput = await userService.addUser({ name: "test", email: "test@example.com", passwordHash: "test", roles: [
    { groupId: "abc123", type: RoleType.USER }
  ] });
  expect(addUserOutput.id).toBeDefined();

  // get user by email
  const getUserByEmailOutput = await userService.getUserByEmail({ email: "test@example.com" });
  expect(getUserByEmailOutput.user?.name).toBe("test");

  // get users by group
  const getUsersByGroupOutput = await userService.getUsersByGroup({ groupId: "abc123" });
  expect(getUsersByGroupOutput.users?.length).toBe(1);
});
