import { describe, jest } from "@jest/globals";

jest.spyOn(global.console, "log");

describe("user repository", () => {
  // it("prints a message", () => {
  //   log("hello");
  //   // eslint-disable-next-line no-console -- testing console
  //   expect(console.log).toBeCalledWith("LOGGER: ", "hello");
  // });
});
