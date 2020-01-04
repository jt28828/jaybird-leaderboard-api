import { Document } from "mongoose";
import { StoredFile } from "./stored-file.model";
import * as mongoose from "mongoose";

export class User {
  username: string;
  name: string;
  password: string;
  paprika: string;
  guesses: string[];
  createdAt?: Date;
  icon?: StoredFile;
}

export interface UserModel extends User, Document {
}

export const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  password: String,
  paprika: String,
  guesses: [String],
  createdAt: Date,
  icon: {
    data: Buffer,
    filename: String,
    mimeType: String,
  },
});
