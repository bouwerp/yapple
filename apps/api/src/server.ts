import { User } from "@repo/model";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { type Express, Request, Response } from "express";
import helmet from "helmet";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import { PasswordService } from "./services/password";
import { TokenService } from "./services/token";
import { verifyToken } from "./services/token/auth";
import { UserService } from "./services/user";

export class CreateServerParams {
    port: number = 5001;
    client?: MongoClient;
    userService!: UserService;
    tokenService!: TokenService;
    passwordService!: PasswordService;
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
    /* auth middleware */ // TODO: move to separate middleware
    .use((req, res, next) => {
      let token = req.headers.authorization;
      if (!token) {
        token = req.cookies?.token;
      }
      if (token) {
        verifyToken(token)
          .then(({email, role}) => {
            console.log(email, role)
            console.log(req.method, req.baseUrl, req.url, req.path)
            // const requiredRole = requiredRoles[`${req.method}:${req.path}`]
            next();
          })
          .catch((error) => {
            console.log(error)
            return res.status(401).json({ error: "Unauthorized" });
          });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    })
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", async (req, res) => {
      return res.json({ ok: true });
    })
    .post("/users", async (req: Request, res: Response) => {
      const { name, email } = req.body;
      try {
        const id = await params.userService.addUser({ name, email, passwordHash: "", roles: [] });
        return res.json({ id });
      } catch (e) {
        return res.status(400).json({ error: (e as Error).message });
      }
    });

  return app;
};
