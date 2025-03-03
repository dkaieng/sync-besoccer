import { UserScoreRepository } from "../repositories/userScore.repository";
import { NotFoundError, ValidationError } from "../../../utilities/error";
import { UserScoreEntity } from "../entities/userScore.entity";
import { ObjectId } from "mongodb";
import Redis from "ioredis";

export interface IUserScoreService {
  addScore(userId: string, entity: UserScoreEntity): Promise<UserScoreEntity>;
  updateAllScores(entities: UserScoreEntity[]): Promise<any[]>;
}

export default class UserScoreService implements IUserScoreService {
  repo: typeof UserScoreRepository;
  redisClient: Redis;

  constructor(repo: typeof UserScoreRepository) {
    this.repo = repo;
    this.redisClient = new Redis();
  }

  async addScore(
    userId: string,
    entity: UserScoreEntity & { nickName: string }
  ): Promise<UserScoreEntity> {
    const userScoreFound = await this.repo
      .findOne({ userId: new ObjectId(userId), destroy: false })
      .lean();
    if (!userScoreFound) throw new NotFoundError("userScore is not found!");
    const currentVersion = userScoreFound._v;
    if (Number(entity._v) !== currentVersion) {
      throw new ValidationError(
        `Version mismatch! Please refresh and try again.`
      );
    }
    const userScore: UserScoreEntity | null = await this.repo
      .findOneAndUpdate(
        { userId: new ObjectId(userId) },
        { $inc: { _v: 1 }, $set: { score: entity.score } },
        { new: true }
      )
      .lean();
    await this.redisClient.zadd(
      "leaderboard",
      Number(userScore?.score) || 0,
      `${String(userId)}:${String(entity.nickName)}`
    );
    if (!userScore)
      throw new Error("Failed to update score. Please try again.");
    return userScore;
  }

  async updateAllScores(entities: UserScoreEntity[]): Promise<any[]> {
    const updateUserScores = await Promise.all(
      entities.map(async (entity: any) => {
        try {
          const userScoreFound = await this.repo
            .findOne({ userId: new ObjectId(entity.userId), destroy: false })
            .lean();
          if (!userScoreFound)
            throw new NotFoundError("userScore is not found!");
          const currentVersion = userScoreFound._v;

          if (Number(entity._v) !== currentVersion) {
            throw new ValidationError(
              `Version userScore of ${entity.userId} mismatch! Please refresh and try again.`
            );
          }
          // Update to mongoDB
          const updatedUserScore = await this.repo
            .findOneAndUpdate(
              { userId: new ObjectId(entity.userId) },
              { $inc: { _v: 1 }, $set: { score: entity.score } },
              { new: true }
            )
            .lean();

          // Update to Redis
          await this.redisClient.zadd(
            "leaderboard",
            Number(entity.score) || 0,
            `${String(entity.userId)}:${String(entity.nickName)}`
          );

          return updatedUserScore;
        } catch (err: any) {
          throw new Error(`Failed to update user scores: ${err.message}`);
        }
      })
    );
    return updateUserScores;
  }
}
