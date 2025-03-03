import { BaseEntity } from "../../../utilities/base.entity";

export class UserEntity extends BaseEntity {
    email: string
    password: string
    fullName: string
    nickName: string
    yearOld: number
    role: string

    constructor(email: string, password: string, fullName: string, nickName: string, yearOld: number, role: string, createdBy: string, updatedBy: string) {
        super();
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.nickName = nickName;
        this.yearOld = yearOld;
        this.role = role;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.destroy = false;
    }
}