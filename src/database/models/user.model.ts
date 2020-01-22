import { Document } from "mongoose";
import { StoredFile } from "./stored-file.model";
import * as mongoose from "mongoose";

export interface TopTenGuess {
  songTitle: string;
  guessedPosition: number;
}

export interface CorrectGuess extends TopTenGuess {
  actualPosition: number;
}

export class User {
  username: string;
  name: string;
  password: string;
  paprika: string;
  guesses: TopTenGuess[];
  correctGuesses: CorrectGuess[];
  score: number;
  createdAt?: Date;
  icon: number;

  constructor() {
    this.score = 0;
    this.correctGuesses = [];
    this.guesses = [];
    this.icon = 1;
  }
}

export interface UserModel extends User, Document {
}

export const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  password: String,
  paprika: String,
  guesses: [{
    songTitle: String,
    guessedPosition: Number,
  }],
  correctGuesses: [{
    songTitle: String,
    guessedPosition: Number,
    actualPosition: Number,
  }],
  createdAt: Date,
  score: Number,
  icon: Number,
});
