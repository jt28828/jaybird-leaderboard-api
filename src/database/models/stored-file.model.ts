import { Document } from "mongoose";
import { File } from "../../models/interfaces/file";
import * as mongoose from "mongoose";

export class StoredFile {
  filename: string;
  mimeType: string;
  data: Buffer;

  constructor(file?: File) {
    if (file != null) {
      this.filename = file.originalname;
      this.mimeType = file.mimetype;
      this.data = file.buffer;
    }
  }
}

export interface StoredFileModel extends StoredFile, Document {
}

export const StoredFileSchema = new mongoose.Schema({
  filename: String,
  mimeType: String,
  data: Buffer,
});
