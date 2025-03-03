import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { sendSuccessReponse, errorHandlers } from "../../../utilities/helper";
import { IUserService } from "../services/user.service";
import { UserEntity } from "../entities/user.entity";


export default class UserController {
  constructor(private userService: IUserService) {
    this.userService = userService;
  }

  login = async (req: any, res: any) => {
    try {
      const userEntity = req.body;
      userEntity.destroy = false;
      let result: Partial<UserEntity & {token: string}> = await this.userService.login(
        userEntity
      );
      sendSuccessReponse(
        {
          success: true,
          statusCodes: StatusCodes.OK,
          message: ReasonPhrases.OK,
          data: result,
        },
        res
      );
    } catch (err) {
      errorHandlers(err, res)
    }
  };

  createUser = async (req: any, res: any) => {
    try {
      const userEntity = req.body;
      userEntity.destroy = false;
      let result: UserEntity = await this.userService.createUser(
        userEntity
      );
      sendSuccessReponse(
        {
          success: true,
          statusCodes: StatusCodes.OK,
          message: ReasonPhrases.OK,
          data: result,
        },
        res
      );
    } catch (err) {
      errorHandlers(err, res)
    }
  };

  getTopTenUsers = async (req: any, res: any) => {
    try {
      let result: any = await this.userService.getTopTenUsers();
      sendSuccessReponse(
        {
          success: true,
          statusCodes: StatusCodes.OK,
          message: ReasonPhrases.OK,
          data: result,
        },
        res
      );
    } catch (err) {
      errorHandlers(err, res)
    }
  };
}
