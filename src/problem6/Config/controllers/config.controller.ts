import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { sendSuccessReponse, errorHandlers } from "../../../utilities/helper";
import { IConfigService } from "../services/config.service";
import { ConfigEntity } from "../entities/config.entity";

export default class ConfigController {
  constructor(private configService: IConfigService) {
    this.configService = configService;
  }

  getConfigDetail = async (req: any, res: any) => {
    try {
      let result: ConfigEntity = await this.configService.getConfigDetail();
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
      errorHandlers(err, res);
    }
  };

  createConfig = async (req: any, res: any) => {
    try {
      const configEntity = req.body;
      configEntity.destroy = false;
      let result: ConfigEntity = await this.configService.createConfig(
        configEntity
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
      errorHandlers(err, res);
    }
  };

  updateConfig = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const configEntity = req.body;
      configEntity.destroy = false;
      let result: ConfigEntity = await this.configService.updateConfig(
        id,
        configEntity
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
      errorHandlers(err, res);
    }
  };
}
