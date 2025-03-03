import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { sendSuccessReponse, errorHandlers } from "../../../utilities/helper";
import { IUserScoreService } from "../services/userScore.service";
import { UserScoreEntity } from "../entities/userScore.entity";

export default class UserScoreController {
  constructor(private userScoreService: IUserScoreService) {
    this.userScoreService = userScoreService;
  }

  addScore = async (req: any, res: any) => {
    try {
      const { id } = req.params
      const userEntity = req.body;
      userEntity.destroy = false;
      let result: UserScoreEntity = await this.userScoreService.addScore(
        id,
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

  updateAllScores = async (req: any, res: any) => {
    try {
      const userEntities = req.body;
      userEntities.destroy = false;
      let result: any = await this.userScoreService.updateAllScores(
        userEntities
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
}
