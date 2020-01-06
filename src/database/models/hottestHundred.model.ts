import { Document } from "mongoose";
import { StoredFile } from "./stored-file.model";
import * as mongoose from "mongoose";

export class HottestHundred {
  songName: string;
  position: number;
}

export interface HottestHundredModel extends HottestHundred, Document {
}

export const HottestHundredSchema = new mongoose.Schema({
  songName: String,
  position: Number,
});
