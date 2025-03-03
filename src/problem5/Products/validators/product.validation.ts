import Joi from "joi"

const createProduct = Joi.object({
    sku: Joi.string().required(),
    productName: Joi.string().required(),
    quantity: Joi.number().required(),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string().required(),
})

const updateProduct = Joi.object({
    sku: Joi.string(),
    productName: Joi.string(),
    quantity: Joi.number(),
    createdBy: Joi.string(),
    updatedBy: Joi.string().required(),
    _v: Joi.number().required()
})

const ProductValidation = { createProduct, updateProduct }
export default ProductValidation