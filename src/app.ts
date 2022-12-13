import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import "reflect-metadata";
import * as express from "express";
import { Request, Response } from "express";
import { User } from "./entity/user.entity";
import { myDataSource } from "./app-data-source";

var bodyParser = require('body-parser')
//establish db connection
myDataSource
  .initialize()
  .then(() => {
    console.log("data source initialized");
  })
  .catch((err) => {
    console.error("error during data source initialization", err);
  });

// create and setup express app
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// register routes

app.get("/users", async function (req: Request, res: Response) {
  const users = await myDataSource.getRepository(User).find();
  res.json(users);
});

app.get("/users/:id", async function (req: Request, res: Response) {
  const results = myDataSource.getRepository(User).findOneBy({
    id: req.params.id,
  });
  return res.send(results);
});

app.post("/users", async function (req: Request, res: Response) {
    console.log(req.body)
  try {
    const user = await myDataSource.getRepository(User).create(req.body);
    const results = await myDataSource.getRepository(User).save(user);
    return res.send(results);
  } catch (err) {
     res.send("Error" + err);
  }
});

app.put("/users/:id", async function (req: Request, res: Response) {
  const user = await myDataSource.getRepository(User).findOneBy({
    id: req.params.id,
  });
  myDataSource.getRepository(User).merge(user, req.body);
  const results = await myDataSource.getRepository(User).save(user);
  return res.send(results);
});

app.delete("/users/:id", async function (req: Request, res: Response) {
  const results = await myDataSource.getRepository(User).delete(req.params.id);
  return res.send(results);
});

// start express server
console.log("listening");
app.listen(3000);
