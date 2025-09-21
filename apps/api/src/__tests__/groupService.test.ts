import { afterAll, beforeAll, expect, test } from "@jest/globals";
import { createMongoDBConnection, MongoDBGroupReadRepository, MongoDBGroupWriteRepository } from "@repo/model";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { V1GroupService } from "../services/group/impl/v1";

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

test("group service", async () => {
  const client = await createMongoDBConnection({
      host: "localhost",
      port: "27018",
      user: "admin",
      password: "password"
  });

  const groupReadRepository = new MongoDBGroupReadRepository(client!.db("core"), "groups");
  const groupWriteRepository = new MongoDBGroupWriteRepository(client!.db("core"), "groups");
  const groupService = new V1GroupService({groupReadRepository, groupWriteRepository});

  // add group
  const addGroupOutput = await groupService.addGroup({ name: "test" });
  expect(addGroupOutput.id).toBeDefined();
  const groupsCollection = client.db("core").collection("groups");
  expect(groupsCollection.countDocuments()).resolves.toBe(1);
  expect(groupsCollection.findOne({ name: "test" })).resolves.toMatchObject({ name: "test" });

  // get group by name
  const getGroupByNameOutput = await groupService.getGroupByName({ name: "test" });
  expect(getGroupByNameOutput.group?.name).toBe("test");

  // get group by id
  const getGroupByIdOutput = await groupService.getGroupById({ id: addGroupOutput.id });
  expect(getGroupByIdOutput.group?.name).toBe("test");

  // add child groups
  const child1Output = await groupService.addGroup({ name: "child1", parentId: addGroupOutput.id });
  const child2Output = await groupService.addGroup({ name: "child2", parentId: addGroupOutput.id });
  const descendant1Output = await groupService.addGroup({ name: "descendant1", parentId: child2Output.id });
  await groupService.addGroup({ name: "descendant2", parentId: descendant1Output.id });
  await groupService.addGroup({ name: "descendant3", parentId: child1Output.id });

  // get descendants
  expect(groupsCollection.countDocuments()).resolves.toBe(6);
  const getDescendantsOutput = await groupService.getGroupDescendants({ id: addGroupOutput.id });
  expect(getDescendantsOutput.groups?.map(g => g.name)).toEqual(["child1", "child2", "descendant3", "descendant1", "descendant2"]);
});
