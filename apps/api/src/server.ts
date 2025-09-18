import { User } from "@repo/model";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import { authMiddleware } from "./middleware/auth";
import { addUser } from "./routes/addUser";
import { PasswordService } from "./services/password";
import { TokenService } from "./services/token";
import { UserService } from "./services/user";

export class CreateServerParams {
  client?: MongoClient;
  userService!: UserService;
  tokenService!: TokenService;
  passwordService!: PasswordService;
  port: number = 5001;
  rootGroupID!: string;
}

export function createServer(params: CreateServerParams): Express {
  const app = express();
  app
    .disable("x-powered-by")
    .use(helmet())
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors({
      credentials: true
    }))
    /* authentication endpoint */ // TODO: move to auth service and plug in through adapter
    .post("/sign-in", async (req, res) => {
      const { email, password } = req.body;
      console.debug(email);

      // get user by email
      let user: User;
      try {
        const output = await params.userService.getUserByEmail({ email });
        user = output.user!;
      } catch (e) {
        console.log(e);
        return res.status(401).json({ error: "Unauthorized" });
      }
      console.log(user);

      // check if password matches
      let isMatch = false;
      try {
        isMatch = (await params.passwordService.comparePassword(
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
          const token = await params.tokenService.generateToken({ email });
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
   })
    .use(authMiddleware({tokenService: params.tokenService, userService: params.userService}))
    .get("/status", async (req, res) => {
      return res.json({ ok: true });
    })
    .post("/users", addUser({
        userService: params.userService,
        rootGroupID: params.rootGroupID
    }));

  return app;
};
