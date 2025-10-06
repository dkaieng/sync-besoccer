import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { errorHandlers, sendSuccessReponse } from "../../utilities/helper";
import { ICoachesService } from "../services/coaches.service";

export default class CoachesController {
  constructor(private coachesService: ICoachesService) {
    this.coachesService = coachesService;
  }

  syncDataH2HCoaches = async (req: any, res: any) => {
    try {
      const { start, end } = req.query;
      console.log(start,"===start")
      console.log(end,"===end")
      let result: any = await this.coachesService.syncDataH2HCoaches(start, end);
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
  }
}