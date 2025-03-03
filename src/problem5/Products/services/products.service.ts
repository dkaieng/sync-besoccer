import {
  AlreadyExistsError,
  NotFoundError,
  ValidationError,
} from "../../../utilities/error";
import { ProductRepository } from "../repositories/products.repository";
import { Product } from "../entities/products.entity";
import { ObjectId } from "mongodb";
import moment from "moment";

export interface IProductService {
  createProduct(entity: Product): Promise<Product>;
  getProductDetail(sku: string): Promise<Product>;
  getListProducts(filter: {
    skus?: string;
    productName?: string;
    searchTrue?: boolean;
    page: number;
    limit: number;
    fromDate?: string;
    toDate?: string;
  }): Promise<Product[]>;
  updateProduct(id: string, entity: Partial<Product>): Promise<Product>;
  deleteProduct(id: string, _v: number): Promise<Boolean>;
}

export default class ProductService implements IProductService {
  repo: typeof ProductRepository;

  constructor(repo: typeof ProductRepository) {
    this.repo = repo;
  }

  async createProduct(entity: Product): Promise<Product> {
    const foundProduct = await this.repo
      .findOne({ sku: entity.sku, destroy: false })
      .lean();
    if (foundProduct) throw new AlreadyExistsError("Product was existed!");
    const newProductData: Product = await this.repo.create({ ...entity });
    return newProductData;
  }

  async getProductDetail(sku: string): Promise<Product> {
    const foundProduct = await this.repo
      .findOne({ sku, destroy: false })
      .lean();
    if (!foundProduct) throw new NotFoundError("Product is not found");
    return foundProduct;
  }

  async getListProducts(filter: {
    skus: string;
    productName: string;
    searchTrue: boolean;
    page: number;
    limit: number;
    fromDate: string;
    toDate: string;
  }): Promise<Product[]> {
    let condition: any = { destroy: false };
    const { skus, productName, searchTrue, page, limit, fromDate, toDate } =
      filter;
    let pageItem = page || 1;
    let limitItem = limit || 10;
    let arraySkus: string[] = [];
    if (skus) {
      const jsonString = skus.replace(/'/g, '"');
      arraySkus = JSON.parse(jsonString);
    }
    if (arraySkus.length > 0) {
      condition.sku = { $in: arraySkus };
    }
    if (productName && searchTrue) {
      condition.productName = productName;
    } else if (productName && !searchTrue) {
      condition.productName = { $regex: new RegExp(productName, "i") };
    }
    if (fromDate || toDate) {
      const startDay = moment(fromDate).startOf("date").toDate();
      const endDay = moment(toDate).endOf("date").toDate();
      condition.createdAt = { $gte: startDay, $lte: endDay };
    }
    const skip = (pageItem - 1) * limitItem;
    const productList: Product[] = await this.repo
      .find(condition)
      .skip(skip)
      .limit(limitItem)
      .sort({ createdAt: -1 })
      .lean();
    return productList;
  }

  async updateProduct(id: string, entity: Partial<Product>): Promise<Product> {
    const foundProduct = await this.repo
      .findById({ _id: new ObjectId(id), destroy: false })
      .lean();
    if (!foundProduct) throw new AlreadyExistsError("Product is not found!");
    const currentVersion = foundProduct._v;
    if (Number(entity._v) && Number(entity._v) !== currentVersion) {
      throw new ValidationError(
        "Version mismatch! Please refresh and try again."
      );
    }
    const updateProduct: Product | null = await this.repo.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: { ...entity, _v: currentVersion + 1 },
      },
      { new: true }
    );
    if (!updateProduct) {
      throw new Error("Failed to update product. Please try again.");
    }
    return updateProduct;
  }

  async deleteProduct(id: string, _v: number): Promise<Boolean> {
    const foundProduct = await this.repo
      .findById({ _id: new ObjectId(id), destroy: false })
      .lean();
    if (!foundProduct) throw new NotFoundError("Product is not found");
    const currentVersion = foundProduct._v;
    if (Number(_v) && Number(_v) !== currentVersion) {
      throw new ValidationError(
        "Version mismatch! Please refresh and try again."
      );
    }
    await this.repo.findByIdAndDelete({ _id: new ObjectId(id)})
    return true;
  }
}
