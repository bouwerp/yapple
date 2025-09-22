import { expect, test } from "@jest/globals";
import { V1PasswordService } from "../services/password/impl/v1";

test("password service", async () => {
    const passwordService = new V1PasswordService({ saltRounds: 10 });

    // hash password
    const hashPasswordOutput = await passwordService.hashPassword({ password: "test" });
    expect(hashPasswordOutput.hash).toBeDefined();

    // verify password
    const verifyPasswordOutput = await passwordService.comparePassword({ 
        password: "test", hash: hashPasswordOutput.hash });
    expect(verifyPasswordOutput).toBe(true);
});

