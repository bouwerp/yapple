import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import { generateToken, verifyToken } from "./auth";

export interface ServerParams {
    port: number;
    client?: MongoClient;
}

export function createServer(params: ServerParams): Express {
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
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", async (req, res) => {
      const token = req.headers.authorization;
      console.log(token)
      try {
        const result = await verifyToken(token!);
        console.log(result)
      } catch (error) {
        console.log(error)
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.json({ ok: true });
    })
    .post("/sign-in", async (req, res) => {
      const { email, password } = req.body;
      console.log(email, password);
      const token = await generateToken(email);
      res.cookie("token", token, {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res.json({ token });
   });

  return app;
};
