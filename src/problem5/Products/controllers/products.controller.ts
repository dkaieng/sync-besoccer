import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { IProductService } from "../services/products.service";
import { sendSuccessReponse, errorHandlers } from "../../../utilities/helper";
import { ProductEntity } from "../entities/products.entity";

export default class ProductController {
  constructor(private productService: IProductService) {
    this.productService = productService;
  }

  createProduct = async (req: any, res: any) => {
    try {
      const productEntity = req.body;
      productEntity.destroy = false;
      let result: ProductEntity = await this.productService.createProduct(
        productEntity
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

  getProductDetail = async (req: any, res: any) => {
    try {
      const { sku } = req.query;
      let result: ProductEntity = await this.productService.getProductDetail(
        sku
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
  }

  getListProducts = async (req: any, res: any) => {
    try {
      const filter = req.query;
      
      let result: ProductEntity[] = await this.productService.getListProducts(
        filter
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
  }

  updateProduct = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const productEntity = req.body;
      let result: ProductEntity = await this.productService.updateProduct(
        id,
        productEntity
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
  }

  deleteProduct = async (req: any, res: any) => {
    try {
      const { _v } = req.query;
      const { id } = req.params;

      let result: Boolean = await this.productService.deleteProduct(
        id,
        _v
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
  }
}
