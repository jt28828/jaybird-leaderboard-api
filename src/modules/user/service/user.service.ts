import { Injectable } from "@nestjs/common";
import { modelInjectors } from "../../../database/constants/model-injectors";
import { Model } from "mongoose";
import { User, UserModel } from "../../../database/models/user.model";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(modelInjectors.userModel)
    private readonly userModel: Model<UserModel>,
  ) {
  }

  /** Creates a new user and stores in the database */
  public async create(newUserDto: User): Promise<UserModel> {
    const createdUser = new this.userModel(newUserDto);
    return await createdUser.save();
  }

  /** Returns all existing users */
  public async getAll() {
    return await this.userModel.find().exec();
  }

  /** Returns a specific user */
  public async getByUsername(username: string): Promise<UserModel> {
    return await this.userModel.findOne({ username }).exec();
  }

  /** Returns a specific user */
  public async getById(id: string): Promise<UserModel> {
    return await this.userModel.findById(id).exec();
  }

  /** Clears the table of all data */
  public async clearTable() {
    await this.userModel.remove({}).exec();
  }
}
