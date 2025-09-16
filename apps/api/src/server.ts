import { MongoDBUserReadRepository, MongoDBUserWriteRepository, User } from "@repo/model";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import { generateToken, verifyToken } from "./auth";

export interface CreateServerParams {
    port: number;
    client?: MongoClient;
}

export function createServer(params: CreateServerParams): Express {
  const userReadRepository = new MongoDBUserReadRepository(params.client!.db("core"), "users");
  const userWriteRepository = new MongoDBUserWriteRepository(params.client!.db("core"), "users");

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
    /* authentication endpoint */
    .post("/sign-in", async (req, res) => {
      const { email, password } = req.body;
      console.log(email, password);
      // TODO: get user by email
      // TODO: check password hash
      const token = await generateToken(email);
      res.cookie("token", token, {
        httpOnly: true,
        // secure: true, // TODO: conditionally add for deployed environment
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res.json({ token });
   })
    /* auth middleware */
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
    .post("/users", async (req, res) => {
      const { name, email } = req.body;
      const user = new User({ name, email, passwordHash: "" });
      try {
        const id = await userWriteRepository.save({ entity: user });
        return res.json({ id });
      } catch (e) {
        return res.status(400).json({ error: (e as Error).message });
      }
    });

  return app;
};
