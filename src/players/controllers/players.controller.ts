import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { errorHandlers, sendSuccessReponse } from "../../utilities/helper";
import { IPlayersService } from "../services/players.service";

export default class PlayersController {
  constructor(private playersService: IPlayersService) {
    this.playersService = playersService;
  }

  getInjuryTypes = async (req: any, res: any) => {
    try {
      const { start, end } = req.query;
      let result: any = await this.playersService.getInjuryTypes(start, end);
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

  syncInjuryPlayer = async (req: any, res: any) => {
    try {
      const { playerBeId, playerTSId } = req.body;
      let result: any = await this.playersService.syncInjuryPlayer(
        playerBeId,
        playerTSId
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

//   createProduct = async (req: any, res: any) => {
//     try {
//       const productEntity = req.body;
//       productEntity.destroy = false;
//       let result: ProductEntity = await this.productService.createProduct(
//         productEntity
//       );
//       sendSuccessReponse(
//         {
//           success: true,
//           statusCodes: StatusCodes.OK,
//           message: ReasonPhrases.OK,
//           data: result,
//         },
//         res
//       );
//     } catch (err) {
//       errorHandlers(err, res)
//     }
//   };

//   getProductDetail = async (req: any, res: any) => {
//     try {
//       const { sku } = req.query;
//       let result: ProductEntity = await this.productService.getProductDetail(
//         sku
//       );
//       sendSuccessReponse(
//         {
//           success: true,
//           statusCodes: StatusCodes.OK,
//           message: ReasonPhrases.OK,
//           data: result,
//         },
//         res
//       );
//     } catch (err) {
//       errorHandlers(err, res)
//     }
//   }

//   getListProducts = async (req: any, res: any) => {
//     try {
//       const filter = req.query;
      
//       let result: ProductEntity[] = await this.productService.getListProducts(
//         filter
//       );
//       sendSuccessReponse(
//         {
//           success: true,
//           statusCodes: StatusCodes.OK,
//           message: ReasonPhrases.OK,
//           data: result,
//         },
//         res
//       );
//     } catch (err) {
//       errorHandlers(err, res)
//     }
//   }

//   updateProduct = async (req: any, res: any) => {
//     try {
//       const { id } = req.params;
//       const productEntity = req.body;
//       let result: ProductEntity = await this.productService.updateProduct(
//         id,
//         productEntity
//       );
//       sendSuccessReponse(
//         {
//           success: true,
//           statusCodes: StatusCodes.OK,
//           message: ReasonPhrases.OK,
//           data: result,
//         },
//         res
//       );
//     } catch (err) {
//       errorHandlers(err, res)
//     }
//   }

//   deleteProduct = async (req: any, res: any) => {
//     try {
//       const { _v } = req.query;
//       const { id } = req.params;

//       let result: Boolean = await this.productService.deleteProduct(
//         id,
//         _v
//       );
//       sendSuccessReponse(
//         {
//           success: true,
//           statusCodes: StatusCodes.OK,
//           message: ReasonPhrases.OK,
//           data: result,
//         },
//         res
//       );
//     } catch (err) {
//       errorHandlers(err, res)
//     }
//   }
}
