import { BaseEntity } from "../../../utilities/base.entity";

export class ConfigEntity extends BaseEntity {
    isAddScoreEnabled: boolean

    constructor(isAddScoreEnabled: boolean, createdBy: string, updatedBy: string) {
        super();
        this.isAddScoreEnabled = isAddScoreEnabled;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.destroy = false;
    }
}