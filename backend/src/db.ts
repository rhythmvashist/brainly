import mongoose, { ObjectId } from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const contentTypes = ["image", "video", "article", "audio"];

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const contentSchema = new Schema({
  link: String,
  title: String,
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
    validate: async (value: ObjectId) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error("User do not exist");
      }
    },
  },
  tags:[ { type: [ObjectId], ref: "Tag" }],
  type: { type: String, required: true, enum: contentTypes },
});

const tagsSchema = new Schema({
  title: { type: String, required: true },
});

const linkSchema = new Schema({
  hash: { type: String, required: true },
  userId: { type: ObjectId, ref: "User", required: true,unique:true },
});

export const User = mongoose.model("User", userSchema);
export const Content = mongoose.model("Content", contentSchema);
export const Tag = mongoose.model("Tag", tagsSchema);
export const Link = mongoose.model("Link", linkSchema);
