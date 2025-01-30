import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { User, Link, Tag, Content } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";

mongoose.connect(
  "mongodb+srv://franksedin:Testing%40123@cluster0.iduu6.mongodb.net/brainly"
);

const PORT = 3000;

const app = express();
app.use(express.json());

// // zod schemas

// const userNameSchema = z.object({
//   username: z.string().min(3).max(10),
//   password: z.string().min(8).max(20),
// });

app.post("/api/v1/signup", async (req, res) => {
  // TODO: ZOD validation
  const username = req.body.username;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 6);

  try {
    await User.create({
      username,
      password: hashedPassword,
    });

    res.json({
      message: "you are signed up",
    });
  } catch (error) {
    res.json(403).json({ message: "User already exist" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({
    username: username,
  });
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user?.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        JWT_SECRET
      );

      res.json({
        token,
      });
    } else {
      res.status(403).json({ message: "Invalid password" });
    }
  } else {
    res.status(403).json({ message: "Invalid Email/Password" });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  //@ts-ignore
  const userId = req.userId;
  await Content.create({ link, type, userId, tags: [] });

  res.json({
    message: "Content Added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  const contentData = await Content.find({ userId }).populate("userId","username");

  res.json({
    content: contentData,
  });
});

app.delete("/api/v1/content", (req, res) => {});

app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(PORT, () => {
  console.log(`App is listeing at ${PORT}`);
});
