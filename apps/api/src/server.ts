import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import { authMiddleware } from "./middleware/auth";
import { addUser } from "./routes/addUser";
import { signIn } from "./routes/signIn";
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
    .post("/sign-in", signIn({
        userService: params.userService,
        passwordService: params.passwordService,
        tokenService: params.tokenService
    }))
    .use(authMiddleware({tokenService: 
      params.tokenService, 
      userService: params.userService,
    }))
    .post("/users", addUser({
        userService: params.userService,
        passwordService: params.passwordService,
        rootGroupID: params.rootGroupID
    }));

  return app;
};
