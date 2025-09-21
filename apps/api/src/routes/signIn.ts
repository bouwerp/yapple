import { User } from "@repo/model";
import { Request, Response } from "express";
import { PasswordService } from "../services/password";
import { TokenService } from "../services/token";
import { UserService } from "../services/user";

export interface SignInRouteDeps {
    userService: UserService;
    passwordService: PasswordService;
    tokenService: TokenService;
}

export type SignInRequest = Request<
    {
        email: string;
        password: string;
    }
>;

export type SignInResponse = Response<{
    token?: string;
    error?: string;
}>;

export const signIn = (deps: SignInRouteDeps) => async (
  req: SignInRequest, res: SignInResponse) => {
    const { email, password } = req.body;
    console.debug(email);

    // get user by email
    let user: User;
    try {
      const output = await deps.userService.getUserByEmail({ email });
      user = output.user!;
    } catch (e) {
      console.log(e);
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("SIGN IN USER: ", user);

    // check if password matches
    let isMatch = false;
    try {
      isMatch = (await deps.passwordService.comparePassword(
        { 
          password, hash: 
          user.passwordHash,
        }
      )).isMatch;
    } catch (e) {
      console.log(e);
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (isMatch) {
      try {
        const generateTokenOutput = await deps.tokenService.generateToken({ email });
        res.cookie("token", generateTokenOutput.token, {
          httpOnly: true,
          // secure: true, // TODO: conditionally add for deployed environment
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7,
        });
        return res.json({ token: generateTokenOutput.token });
      } catch (e) {
        console.log(e);
        return res.status(401).json({ error: "Unauthorized" });
      }
    }
    return res.status(401).json({ error: "Unauthorized" });
}