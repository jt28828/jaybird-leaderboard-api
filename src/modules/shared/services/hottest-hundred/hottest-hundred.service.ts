import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelInjectors } from "../../../../database/constants/model-injectors";
import { Model } from "mongoose";
import { HottestHundred, HottestHundredModel } from "../../../../database/models/hottestHundred.model";
import { UserModel } from "../../../../database/models/user.model";

@Injectable()
export class HottestHundredService {
  constructor(
    @InjectModel(modelInjectors.hottestHundredModel)
    private readonly hottestHundredModel: Model<HottestHundredModel>,
  ) {
  }

  /** Creates a new hottest 100 entry and stores in the database */
  public async create(dto: HottestHundred): Promise<HottestHundredModel> {
    const createdEntry = new this.hottestHundredModel(dto);
    return await createdEntry.save();
  }

  /** Returns all existing hottest 100 entries */
  public async getAll(): Promise<HottestHundredModel[]> {
    return await this.hottestHundredModel.find().exec();
  }

  public async getNewest(): Promise<HottestHundredModel | null> {
    return await this.hottestHundredModel.findOne().sort({ position: "ascending" }).exec();
  }

  /** Returns a specific entry by song name */
  public async getByName(songName: string): Promise<HottestHundredModel> {
    return await this.hottestHundredModel.findOne({ songName }).exec();
  }
}
