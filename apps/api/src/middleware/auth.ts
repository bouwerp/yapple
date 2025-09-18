import { User } from "@repo/model";
import { NextFunction, Request, Response } from "express";
import { TokenService } from "../services/token";
import { UserService } from "../services/user";

export class AuthMiddlewareDeps {
    tokenService!: TokenService;
    userService!: UserService;
}

export const authMiddleware = (deps: AuthMiddlewareDeps) => 
    async (req: Request<{user: User}>, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if (!token) {
      token = req.cookies?.token;
    }
    if (token) {
      try {
          const { email } = await deps.tokenService.verifyToken({ token });
          const { user } = await deps.userService.getUserByEmail({ email });
          req.params.user = user!;
          next();
      } catch (e) {
          console.log(e)
          return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }