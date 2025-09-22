import { expect, test } from "@jest/globals";
import jwt from 'jsonwebtoken';
import { V1TokenService } from "../services/token/impl/v1";

test("token service", async () => {
    const tokenService = new V1TokenService({ jwtSecret: "test" });

    // generate token
    const generateTokenOutput = await tokenService.generateToken({ email: "test@example.com" });
    expect(generateTokenOutput.token).toBeDefined();
    jwt.verify(generateTokenOutput.token, "test");

    // verify token
    const verifyTokenOutput = await tokenService.verifyToken({ token: generateTokenOutput.token });
    expect(verifyTokenOutput.email).toBe("test@example.com");
});

