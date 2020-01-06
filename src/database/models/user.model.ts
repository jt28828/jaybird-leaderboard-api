import { Document } from "mongoose";
import { StoredFile } from "./stored-file.model";
import * as mongoose from "mongoose";

export interface CorrectGuess {
  songTitle: string;
  guessedPosition: number;
  actualPosition: number;
}

export class User {
  username: string;
  name: string;
  password: string;
  paprika: string;
  guesses: string[];
  correctGuesses: CorrectGuess[];
  score: number;
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
  correctGuesses: [{
    songTitle: String,
    guessedPosition: Number,
    actualPosition: Number,
  }],
  createdAt: Date,
  score: Number,
  icon: {
    data: Buffer,
    filename: String,
    mimeType: String,
  },
});
