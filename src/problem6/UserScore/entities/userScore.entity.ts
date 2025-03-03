import { BaseEntity } from "../../../utilities/base.entity";
import { ObjectId } from "mongoose";

export class UserScoreEntity extends BaseEntity {
    userId: ObjectId;
    score: number;

    constructor(userId: ObjectId, score: number, createdBy: string, updatedBy: string) {
        super();
        this.userId = userId;
        this.score = score;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.destroy = false;
    }
}