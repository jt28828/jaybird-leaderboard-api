import { Document } from "mongoose";
import { StoredFile } from "./stored-file.model";
import * as mongoose from "mongoose";

export class HottestHundred {
  public songName: string;
  public position: number;

  constructor(data?: HottestHundred) {
    this.songName = data?.songName;
    this.position = data?.position;
  }
}

export interface HottestHundredModel extends HottestHundred, Document {
}

export const HottestHundredSchema = new mongoose.Schema({
  songName: String,
  position: Number,
});
