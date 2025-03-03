import { NotFoundError, ValidationError } from "../../../utilities/error";
import { ConfigRepository } from "../repositories/config.repository";
import { ConfigEntity } from "../entities/config.entity";
import { ObjectId } from "mongodb";

export interface IConfigService {
  getConfigDetail(): Promise<ConfigEntity>;
  createConfig(entity: ConfigEntity): Promise<ConfigEntity>;
  updateConfig(id: string, entity: ConfigEntity): Promise<ConfigEntity>;
}

export default class ConfigService implements IConfigService {
  repo: typeof ConfigRepository;

  constructor(repo: typeof ConfigRepository) {
    this.repo = repo;
  }

  async getConfigDetail(): Promise<ConfigEntity>{
    const config = await this.repo.find().lean();
    return config[0];
  }

  async createConfig(entity: ConfigEntity): Promise<ConfigEntity> {
    const config = await this.repo.create(entity);
    return config;
  }

  async updateConfig(id: string, entity: ConfigEntity): Promise<ConfigEntity> {
    const configFound = await this.repo
      .findById({ _id: new ObjectId(id), destroy: false })
      .lean();
    if (!configFound) throw new NotFoundError("configFound is not found!");
    const currentVersion = configFound._v;
    if (Number(entity._v) !== currentVersion) {
      throw new ValidationError(
        `Version mismatch! Please refresh and try again.`
      );
    }
    const config: ConfigEntity | null = await this.repo
      .findByIdAndUpdate(
        { _id: new ObjectId(id) },
        {
          $inc: { _v: 1 },
          $set: { isAddScoreEnabled: entity.isAddScoreEnabled },
        },
        { new: true }
      )
      .lean();
    if (!config) throw new Error("Failed to update config. Please try again.");
    return config;
  }
}
