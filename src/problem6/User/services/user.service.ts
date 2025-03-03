import { UserScoreRepository } from "../../UserScore/repositories/userScore.repository";
import { AlreadyExistsError, UnauthorizedError } from "../../../utilities/error";
import { UserRepository } from "../repositories/user.repository";
import { UserEntity } from "../entities/user.entity";
import jwt from "jsonwebtoken";
import { pick } from "lodash";
import Redis from "ioredis";
import bcrypt from "bcrypt";

export interface IUserService {
  login(entity: UserEntity): Promise<UserEntity & { accessToken: string }>;
  createUser(entity: UserEntity): Promise<UserEntity>;
  getTopTenUsers(): Promise<any[]>;
}

export default class UserService implements IUserService {
  repo: typeof UserRepository;
  repoUserScore: typeof UserScoreRepository;
  redisClient: Redis;

  constructor(
    repo: typeof UserRepository,
    repoUserScore: typeof UserScoreRepository
  ) {
    this.repo = repo;
    this.repoUserScore = repoUserScore;
    this.redisClient = new Redis();
  }

  async login(
    entity: UserEntity
  ): Promise<UserEntity & { accessToken: string }> {
    const user = await this.repo.findOne({ email: entity.email });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(
      entity.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Wrong Password");
    }
    const accessToken = jwt.sign({ id: user._id, role: user.role }, "KaienG", {
      expiresIn: "1d",
    });
    return {
      ...user.toObject(),
      accessToken,
    };
  }

  async createUser(entity: UserEntity): Promise<UserEntity> {
    const foundUser = await this.repo
      .findOne({ email: entity.email, destroy: false })
      .lean();
    if (foundUser) throw new AlreadyExistsError("User was existed!");
    const hashedPassword = await bcrypt.hash(entity.password, 10);
    const newUserData: UserEntity = await this.repo.create({
      ...entity,
      password: hashedPassword,
    });
    Promise.all([
      await this.repoUserScore.create({
        userId: newUserData._id,
        score: 0,
        ...pick(newUserData, ["nickName"]),
        ...pick(entity, ["destroy", "createdBy", "updatedBy"]),
      }),
      await this.redisClient.zadd(
        "leaderboard",
        0,
        `${String(newUserData._id)}:${String(entity.nickName)}`
      )
    ])
    return newUserData;
  }

  async getTopTenUsers(): Promise<
    Partial<UserEntity> & { userId: Object; score: number }[]
  > {
    const topUsers = await this.redisClient.zrevrange(
      "leaderboard",
      0,
      9,
      "WITHSCORES"
    );

    const users: Partial<UserEntity> & { userId: Object; score: number }[] = [];

    for (let i = 0; i < topUsers.length; i += 2) {
      const userId = topUsers[i].split(":")[0];
      const nickName = topUsers[i].split(":")[1];
      const score = parseInt(topUsers[i + 1], 10);

      users.push({ userId, score, nickName } as Partial<UserEntity> & {
        userId: Object;
        score: number;
      });
    }
    return users;
  }
}
