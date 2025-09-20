import { User } from "@repo/model";
import { Request, Response } from "express";
import { PasswordService } from "../services/password";
import { TokenService } from "../services/token";
import { UserService } from "../services/user";

export class SignInRouteDeps {
    userService!: UserService;
    passwordService!: PasswordService;
    tokenService!: TokenService;
}

export interface SignInRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export interface SignInResponse extends Response {
    token: string;
}

export const signIn = (deps: SignInRouteDeps) => async (req: SignInRequest, res: SignInResponse) => {
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
    console.log(user);

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
        const token = await deps.tokenService.generateToken({ email });
        res.cookie("token", token, {
          httpOnly: true,
          // secure: true, // TODO: conditionally add for deployed environment
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7,
        });
        return res.json({ token });
      } catch (e) {
        console.log(e);
        return res.status(401).json({ error: "Unauthorized" });
      }
    }
    return res.status(401).json({ error: "Unauthorized" });
}