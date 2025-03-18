import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { User, Link, Tag, Content } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";
import { config } from "dotenv";

config();

if (!process.env.DB_URL) {
  throw new Error("DB_URL is not defined in the environment variables");
}
mongoose.connect(process.env.DB_URL);

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

// // zod schemas

// const userNameSchema = z.object({
//   username: z.string().min(3).max(10),
//   password: z.string().min(8).max(20),
// });

app.post("/api/v1/signup", async (req, res) => {
  console.log("signup");
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
  const title = req.body.title;
  //@ts-ignore
  const userId = req.userId;
  await Content.create({ link, type, userId, tags: [], title });

  res.json({
    message: "Content Added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  const contentData = await Content.find({ userId }).populate(
    "userId",
    "username"
  );

  res.json({
    content: contentData,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;
  //@ts-ignore
  const userId = req.userId;
  await Content.deleteMany({
    contentId,
    userId: userId,
  });

  res.json({
    message: "Content is deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
    //@ts-ignore
    await Link.create({ userId: req.userId, hash: random(10) });
  } else {
    await Link.deleteOne({
      //@ts-ignore
      userId: req.userId,
    });
  }

  res.json({
    message: "Updated Shareable link",
  });
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;
  const linkResponse = await Link.findOne({ hash });
  if (!linkResponse) {
    res.status(411).json({
      message: "Invalid link",
    });
  }

  const contentData = await Content.find({ userId: linkResponse?.userId });
  const user = await User.findOne({ _id: linkResponse?.userId });

  res.json({
    usename: user?.username,
    content: contentData,
  });
});

app.listen(PORT, () => {
  console.log(`App is listeing at ${PORT}`);
});
