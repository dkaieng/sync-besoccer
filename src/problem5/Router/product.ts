import express from 'express'

import { ProductRepository } from '../Products/repositories/products.repository'
import ProductController from '../Products/controllers/products.controller'
import ProductValidation from '../Products/validators/product.validation'
import ProductService from '../Products/services/products.service'
import { Validator } from '../../middlewares/validator'

const router = express.Router()
const productService = new ProductService(ProductRepository)
const productController = new ProductController(productService)
router.post("/product", Validator(ProductValidation.createProduct), productController.createProduct)
router.get("/product", productController.getProductDetail)
router.get("/products", productController.getListProducts)
router.put("/product/:id", Validator(ProductValidation.updateProduct), productController.updateProduct)
router.delete("/product/:id", productController.deleteProduct)

export default router