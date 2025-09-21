import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import { authMiddleware } from "./middleware/auth";
import { addGroup } from "./routes/addGroup";
import { addUser } from "./routes/addUser";
import { getUsers } from "./routes/getUsers";
import { signIn } from "./routes/signIn";
import { GroupService } from "./services/group";
import { PasswordService } from "./services/password";
import { TokenService } from "./services/token";
import { UserService } from "./services/user";

export class CreateServerParams {
  client?: MongoClient;
  userService!: UserService;
  tokenService!: TokenService;
  passwordService!: PasswordService;
  groupService!: GroupService;
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
    }))
    .post("/groups", addGroup({
        groupService: params.groupService,
        rootGroupID: params.rootGroupID
    }))
    .get("/users", getUsers({
        userService: params.userService,
        groupService: params.groupService
    }));

  return app;
};
