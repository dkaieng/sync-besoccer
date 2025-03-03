import { BaseEntity } from "../../../utilities/base.entity";

export class ProductEntity extends BaseEntity{
    sku: string;
    productName: string;
    quantity: number;

    constructor(sku: string, productName: string, quantity: number, createdBy: string, updatedBy: string) {
        super();
        this.sku = sku;
        this.productName = productName;
        this.quantity = quantity;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.destroy = false;
    }
}